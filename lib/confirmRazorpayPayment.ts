import { connectDB } from "@/lib/db";
import { Order, Product, Coupon, User } from "@/models";
import { sendEmail } from "@/lib/email";
import { sendOrderEmailWithInvoice } from "@/lib/invoice/email";
import { orderConfirmationEmail } from "@/lib/emailTemplates";
import { grantPaidOrderEntitlements } from "@/lib/entitlements";

/**
 * Applies the side effects of a CONFIRMED Razorpay payment: decrements stock,
 * increments coupon usage, marks the order paid. Called from both
 * /api/payments/razorpay/verify (the browser callback) and
 * /api/payments/razorpay/webhook (the server-to-server backup path) —
 * idempotent by design, since either one might fire first, or both might fire.
 */
export async function confirmRazorpayPayment(orderId: string, razorpayPaymentId: string) {
  const db = await connectDB();

  const order = await Order.findById(orderId);
  if (!order) return { ok: false as const, error: "Order not found" };
  if (order.paymentMethod !== "razorpay") {
    return { ok: false as const, error: "Not a Razorpay order" };
  }

  // Already processed by the other path (verify vs webhook) — safe no-op.
  if (order.paymentStatus === "paid") {
    await grantPaidOrderEntitlements(order);
    return { ok: true as const, order };
  }

  const session = await db.startSession();
  let confirmed: any = null;
  try {
    await session.withTransaction(async () => {
      confirmed = null;
      const pending = await Order.findById(orderId).session(session);
      if (!pending || pending.paymentStatus === "paid" || pending.paymentStatus === "refunded") return;
      for (const item of pending.items) {
        const product = await Product.findById(item.product).session(session);
        if (!product || (product.productType ?? "physical") !== "physical") continue;
        if (item.variant && product.variants.length > 0) {
          const idx = product.variantCombinations.findIndex((c: any) =>
            product.variants.every((v: any) => c.combination.get(v.name) === (item.variant as any)?.get?.(v.name))
          );
          if (idx === -1) throw new Error(`Purchased variant is unavailable for ${product.title}`);
          const result = await Product.updateOne(
            { _id: product._id, [`variantCombinations.${idx}.stock`]: { $gte: item.quantity } },
            { $inc: { [`variantCombinations.${idx}.stock`]: -item.quantity } },
            { session }
          );
          if (result.modifiedCount !== 1) throw new Error(`Insufficient stock for ${product.title}`);
        } else {
          const result = await Product.updateOne(
            { _id: product._id, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { session }
          );
          if (result.modifiedCount !== 1) throw new Error(`Insufficient stock for ${product.title}`);
        }
      }
      if (pending.couponCode) {
        await Coupon.updateOne({ code: pending.couponCode }, { $inc: { usedCount: 1 } }, { session });
      }
      pending.paymentStatus = "paid";
      pending.razorpayPaymentId = razorpayPaymentId;
      await pending.save({ session });
      confirmed = pending;
    });
  } finally {
    await session.endSession();
  }

  if (!confirmed) {
    const current = await Order.findById(orderId);
    if (current?.paymentStatus === "paid") await grantPaidOrderEntitlements(current);
    return current ? { ok: true as const, order: current } : { ok: false as const, error: "Order not found" };
  }

  // Uses unique upserts, so the browser callback and Razorpay webhook can both
  // safely reach this point without creating duplicate access grants.
  await grantPaidOrderEntitlements(confirmed);

  // Send the order-confirmation email exactly once, on the real transition to
  // "paid". This lives here (rather than in the verify route) so it ALSO fires
  // when only the webhook confirms the payment — e.g. the shopper closed the
  // tab right after paying. The early "already paid" return above guarantees
  // the second of the two paths (verify + webhook) won't send a duplicate.
  // Awaited so it completes before the serverless function returns (an
  // un-awaited send can be dropped when the lambda freezes); sendEmail catches
  // its own errors, so this never blocks or breaks payment confirmation.
  try {
    // Account holders are looked up; guests supply an email at checkout (it's
    // optional, so it may legitimately be absent — in which case no email is
    // sent, which is correct rather than an error).
    const recipient = confirmed.user
      ? (await User.findById(confirmed.user))?.email
      : confirmed.guest?.email;

    if (recipient) {
      await sendOrderEmailWithInvoice({
        orderId: confirmed._id.toString(),
        to: recipient,
        subject: `Order Confirmed — #${confirmed._id.toString().slice(-8)}`,
        html: orderConfirmationEmail(confirmed as any),
      });
    }
  } catch (err) {
    console.error("[confirmRazorpayPayment] confirmation email failed:", err);
  }

  return { ok: true as const, order: confirmed };
}
