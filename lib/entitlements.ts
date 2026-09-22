import { Entitlement, Product } from "@/models";
import type { ClientSession } from "mongoose";

type IdLike = { toString(): string } | string;
type OrderLike = {
  _id: IdLike;
  user?: IdLike | null;
  paymentStatus: string;
  items: Array<{ product: IdLike; title: string }>;
};
type ProductLike = {
  _id: IdLike;
  productType: string;
  deliveryMode: string;
};

export interface EntitlementGrant {
  user: string;
  order: string;
  product: string;
  productTitle: string;
  productType: "course" | "ebook";
  deliveryMode: "secure_download" | "external_link";
}

export function entitlementGrantKey(grant: Pick<EntitlementGrant, "user" | "order" | "product">) {
  return `${grant.user}:${grant.order}:${grant.product}`;
}

export function buildEntitlementGrants(
  order: OrderLike,
  products: readonly ProductLike[]
): EntitlementGrant[] {
  if (order.paymentStatus !== "paid" || !order.user) return [];
  const byId = new Map(products.map((product) => [product._id.toString(), product]));
  const grants: EntitlementGrant[] = [];
  for (const item of order.items) {
    const product = byId.get(item.product.toString());
    if (!product) continue;
    if (product.productType !== "course" && product.productType !== "ebook") continue;
    if (product.deliveryMode !== "secure_download" && product.deliveryMode !== "external_link") continue;
    grants.push({
      user: order.user.toString(),
      order: order._id.toString(),
      product: product._id.toString(),
      productTitle: item.title,
      productType: product.productType,
      deliveryMode: product.deliveryMode,
    });
  }
  return grants;
}

export function canAccessEntitlement(
  entitlement: { user: IdLike; isActive: boolean; revokedAt?: Date | null },
  userId: string
) {
  return entitlement.user.toString() === userId && entitlement.isActive && !entitlement.revokedAt;
}

export async function grantPaidOrderEntitlements(order: OrderLike, session?: ClientSession) {
  if (order.paymentStatus !== "paid" || !order.user) return [];
  const productIds = order.items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } })
    .select("productType deliveryMode")
    .session(session ?? null)
    .lean<ProductLike[]>();
  const grants = buildEntitlementGrants(order, products);
  await Promise.all(
    grants.map((grant) =>
      Entitlement.updateOne(
        { user: grant.user, order: grant.order, product: grant.product },
        {
          $set: { ...grant, isActive: true, revokedAt: null },
          $setOnInsert: { grantedAt: new Date(), accessCount: 0 },
        },
        { upsert: true, session }
      )
    )
  );
  return grants;
}

export async function revokeOrderEntitlements(orderId: string, session?: ClientSession) {
  return Entitlement.updateMany(
    { order: orderId, isActive: true },
    { $set: { isActive: false, revokedAt: new Date() } },
    { session }
  );
}
