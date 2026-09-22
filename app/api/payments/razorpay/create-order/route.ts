import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order, Product, Coupon } from "@/models";
import {
  resolveCheckoutIdentity,
  resolveShippingAddress,
  orderOwnerFields,
  IDENTITY_REQUIRED_MESSAGE,
  type GuestContactInput,
  type ResolvedShipping,
} from "@/lib/checkoutIdentity";
import { getSiteSettings } from "@/lib/site-settings";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { z } from "zod";

const cartSchema = z.object({
  items: z.array(z.object({
    productId: z.string().regex(/^[a-f\d]{24}$/i),
    quantity: z.number().int().min(1).max(1000),
    variant: z.record(z.string(), z.string()).optional(),
  })).min(1).max(100),
  couponCode: z.string().max(100).optional(),
  addressId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  shippingAddress: z.object({
    fullName: z.string(), phone: z.string(), line1: z.string(), line2: z.string().optional(),
    city: z.string(), state: z.string(), pincode: z.string(),
  }).optional(),
  contact: z.object({ name: z.string(), phone: z.string(), email: z.string().email().optional() }).optional(),
});

export async function POST(req: NextRequest) {
  // Either a logged-in user or a guest with a verified phone. Guests are the
  // common path now — checkout no longer requires an account.
  const identity = await resolveCheckoutIdentity(req);
  if (!identity) {
    return NextResponse.json({ error: IDENTITY_REQUIRED_MESSAGE }, { status: 401 });
  }

  try {
    const parsed = cartSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check your cart and delivery details." }, { status: 400 });
    const body = parsed.data;
    const couponCode: string | undefined = body.couponCode;
    const contact: GuestContactInput | undefined = body.contact;
    // Fail fast with a readable message rather than a Razorpay stack trace when
    // the store hasn't set up online payments yet. COD is unaffected.
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Online payment is not available right now. Please try again shortly." },
        { status: 503 }
      );
    }

    await connectDB();

    const { commerce, brand } = await getSiteSettings();
    if (!commerce.razorpayEnabled) {
      return NextResponse.json({ error: "Online payment is currently disabled." }, { status: 503 });
    }
    if (commerce.currencyCode !== "INR") {
      return NextResponse.json({ error: "Online payment is unavailable for this store currency." }, { status: 503 });
    }

    // Same recomputation pattern as the COD route in /api/orders — never
    // trust client-sent prices/stock. Stock is validated here but NOT
    // decremented yet; it's only decremented once payment is confirmed
    // (in confirmRazorpayPayment), so an abandoned Razorpay checkout never
    // holds stock hostage.
    const products = await Product.find({ _id: { $in: body.items.map((item) => item.productId) } });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const merged = new Map<string, typeof body.items[number]>();
    for (const rawItem of body.items) {
      const product = productsById.get(rawItem.productId);
      if (!product || !product.isActive) {
        return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 400 });
      }
      const isPhysical = (product.productType ?? "physical") === "physical";
      const canonicalVariant = isPhysical && product.variants.length > 0
        ? Object.fromEntries(product.variants.map((variant: any) => [variant.name, rawItem.variant?.[variant.name]]))
        : undefined;
      if (canonicalVariant && Object.values(canonicalVariant).some((value) => !value)) {
        return NextResponse.json({ error: `Please select variant options for ${product.title}` }, { status: 400 });
      }
      const item = { ...rawItem, variant: canonicalVariant };
      const key = rawItem.productId + (canonicalVariant ? JSON.stringify(Object.entries(canonicalVariant).sort()) : "");
      const previous = merged.get(key);
      const quantity = rawItem.quantity + (previous?.quantity ?? 0);
      if (quantity > 1000) return NextResponse.json({ error: "Item quantity is too large." }, { status: 400 });
      merged.set(key, { ...item, quantity });
    }

    const orderItems = [];
    let subtotal = 0;
    let requiresShipping = false;
    let containsDigitalAccess = false;

    for (const item of merged.values()) {
      const product = productsById.get(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: "A product in your cart is no longer available" },
          { status: 400 }
        );
      }

      const hasVariants = product.variants.length > 0;
      let unitPrice = product.discountPrice ?? product.price;
      let availableStock = product.stock;
      const isPhysical = (product.productType ?? "physical") === "physical";
      requiresShipping ||= isPhysical;
      containsDigitalAccess ||= product.productType === "course" || product.productType === "ebook";
      if (!isPhysical && item.quantity !== 1) {
        return NextResponse.json({ error: `${product.title} can only be purchased once per order` }, { status: 400 });
      }

      if (isPhysical && hasVariants) {
        if (!item.variant) {
          return NextResponse.json(
            { error: `Please select variant options for ${product.title}` },
            { status: 400 }
          );
        }
        const combo = product.variantCombinations.find((c: any) =>
          product.variants.every((v: any) => c.combination.get(v.name) === item.variant?.[v.name])
        );
        if (!combo) {
          return NextResponse.json(
            { error: `Selected options for ${product.title} are no longer available` },
            { status: 400 }
          );
        }
        unitPrice = combo.price ?? unitPrice;
        availableStock = combo.stock;
      }

      if (isPhysical && (item.quantity < 1 || item.quantity > availableStock)) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.title} (only ${availableStock} left)` },
          { status: 400 }
        );
      }

      subtotal += unitPrice * item.quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: unitPrice,
        quantity: item.quantity,
        image: product.images?.[0],
        variant: item.variant,
      });
    }

    if (containsDigitalAccess && identity.kind !== "user") {
      return NextResponse.json(
        { error: "Please sign in before purchasing courses or eBooks so access can be added to your library." },
        { status: 401 }
      );
    }

    let address: ResolvedShipping | undefined;
    if (requiresShipping) {
      const resolved = await resolveShippingAddress(identity, body);
      if ("error" in resolved) {
        return NextResponse.json({ error: resolved.error }, { status: resolved.status });
      }
      address = resolved.address;
    }

    // Coupon validated here but usedCount only incremented once payment is
    // confirmed (see confirmRazorpayPayment) — a coupon shouldn't be "spent"
    // on a checkout the shopper never completes.
    let discount = 0;
    let appliedCouponCode: string | undefined;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
      if (
        coupon &&
        coupon.isActive &&
        coupon.expiresAt >= new Date() &&
        (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit) &&
        subtotal >= coupon.minOrderValue
      ) {
        discount =
          coupon.discountType === "percent"
            ? Math.round((subtotal * coupon.value) / 100)
            : Math.min(coupon.value, subtotal);
        appliedCouponCode = coupon.code;
      }
    }

    const shippingFee = !requiresShipping || subtotal - discount >= commerce.freeShippingThreshold
      ? 0
      : commerce.shippingFee;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const order = await Order.create({
      ...orderOwnerFields(identity, address, contact),
      items: orderItems,
      ...(address ? { shippingAddress: address } : {}),
      subtotal,
      discount,
      couponCode: appliedCouponCode,
      shippingFee,
      total,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      storeName: brand.storeName,
      prefill: {
        name: address?.fullName ?? contact?.name ?? "",
        // Razorpay uses these to pre-fill its modal. For guests the email is
        // whatever they typed (optional), so it may legitimately be absent.
        email: identity.kind === "user" ? identity.user.email : contact?.email ?? "",
        contact: identity.kind === "guest" ? identity.phone ?? contact?.phone ?? "" : address?.phone ?? "",
      },
    });
  } catch (err: any) {
    console.error("Razorpay create-order error:", err);

    // Razorpay's SDK throws an object shaped like { statusCode, error: { description } }
    // on auth failures — surface that instead of a generic message so it's obvious
    // this is a credentials problem, not a bug.
    if (err?.statusCode === 401) {
      return NextResponse.json(
        {
          error:
            "Payment gateway authentication failed — check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local, and restart the dev server after editing them.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
