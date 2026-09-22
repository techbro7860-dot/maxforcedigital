import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { canAccessEntitlement } from "@/lib/entitlements";
import { requireAuth } from "@/lib/middleware/requireAuth";
import { Entitlement, Order, Product } from "@/models";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const entitlement = await Entitlement.findById(params.id);
  // Return the same response for missing and foreign records so ids cannot be
  // used to discover another customer's purchases.
  if (!entitlement || !canAccessEntitlement(entitlement, user.id)) {
    return NextResponse.json({ error: "Access not found" }, { status: 404 });
  }
  const paidOrder = await Order.exists({ _id: entitlement.order, user: user.id, paymentStatus: "paid" });
  if (!paidOrder) {
    return NextResponse.json({ error: "This purchase is no longer eligible for access" }, { status: 410 });
  }

  const product = await Product.findById(entitlement.product).select(
    "title isActive productType deliveryMode +deliveryMetadata"
  );
  if (!product?.isActive || product.deliveryMode !== entitlement.deliveryMode) {
    return NextResponse.json({ error: "This content is currently unavailable" }, { status: 410 });
  }

  let target: string | undefined;
  if (entitlement.deliveryMode === "external_link") {
    target = product.deliveryMetadata?.externalUrl;
  } else if (entitlement.deliveryMode === "secure_download") {
    const key = product.deliveryMetadata?.secureAssetKey;
    if (key) {
      target = cloudinary.utils.private_download_url(key, "", {
        resource_type: "raw",
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 300,
        attachment: true,
      });
    }
  }

  if (!target) {
    return NextResponse.json({ error: "Delivery has not been configured" }, { status: 503 });
  }

  await Entitlement.updateOne(
    { _id: entitlement._id, user: user.id },
    { $set: { lastAccessedAt: new Date() }, $inc: { accessCount: 1 } }
  );
  const response = NextResponse.redirect(target, 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
