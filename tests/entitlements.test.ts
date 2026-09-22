import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEntitlementGrants,
  canAccessEntitlement,
  entitlementGrantKey,
} from "../lib/entitlements";
import Entitlement from "../models/Entitlement";

const order = {
  _id: "order-1",
  user: "user-1",
  paymentStatus: "paid",
  items: [
    { product: "product-course", title: "SEO Course" },
    { product: "product-book", title: "SEO eBook" },
    { product: "product-shirt", title: "T-shirt" },
  ],
};

test("paid account orders produce stable, idempotent digital entitlement grants", () => {
  const products = [
    { _id: "product-course", productType: "course", deliveryMode: "external_link" },
    { _id: "product-book", productType: "ebook", deliveryMode: "secure_download" },
    { _id: "product-shirt", productType: "physical", deliveryMode: "none" },
  ] as const;

  const first = buildEntitlementGrants(order, products);
  const second = buildEntitlementGrants(order, products);
  assert.equal(first.length, 2);
  assert.deepEqual(first, second);

  const stored = new Map<string, unknown>();
  for (const grant of [...first, ...second]) {
    const key = entitlementGrantKey(grant);
    if (!stored.has(key)) stored.set(key, grant);
  }
  assert.equal(stored.size, 2);
});

test("guest, unpaid and physical-only orders do not produce entitlements", () => {
  const digital = [{ _id: "product-course", productType: "course", deliveryMode: "external_link" }] as const;
  assert.deepEqual(buildEntitlementGrants({ ...order, user: undefined }, digital), []);
  assert.deepEqual(buildEntitlementGrants({ ...order, paymentStatus: "pending" }, digital), []);
  assert.deepEqual(
    buildEntitlementGrants(order, [{ _id: "product-course", productType: "physical", deliveryMode: "none" }]),
    []
  );
});

test("entitlement access is limited to its owner and rejects revoked access", () => {
  const entitlement = { user: "user-1", isActive: true, revokedAt: null };
  assert.equal(canAccessEntitlement(entitlement, "user-1"), true);
  assert.equal(canAccessEntitlement(entitlement, "user-2"), false);
  assert.equal(canAccessEntitlement({ ...entitlement, isActive: false }, "user-1"), false);
  assert.equal(canAccessEntitlement({ ...entitlement, revokedAt: new Date() }, "user-1"), false);
});

test("database uniqueness enforces one grant per user, order and product", () => {
  const compound = Entitlement.schema.indexes().find(([fields]) =>
    fields.user === 1 && fields.order === 1 && fields.product === 1
  );
  assert.equal(compound?.[1]?.unique, true);
});
