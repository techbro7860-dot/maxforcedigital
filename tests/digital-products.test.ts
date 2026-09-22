import test from "node:test";
import assert from "node:assert/strict";
import { productSchema } from "../lib/validations/product";
import Product from "../models/Product";

const baseProduct = {
  title: "Practical SEO Course",
  description: "A complete practical course for growing search traffic.",
  category: "507f1f77bcf86cd799439011",
  price: 1499,
  images: [],
  tags: [],
  variants: [],
  variantCombinations: [],
  stock: 0,
};

test("active digital products require matching private delivery metadata", () => {
  assert.equal(productSchema.safeParse({ ...baseProduct, productType: "course" }).success, false);
  assert.equal(
    productSchema.safeParse({
      ...baseProduct,
      productType: "ebook",
      deliveryMode: "secure_download",
      deliveryMetadata: { secureAssetKey: "maxforce/ebooks/seo-guide" },
    }).success,
    true
  );
  assert.equal(
    productSchema.safeParse({
      ...baseProduct,
      productType: "course",
      deliveryMode: "external_link",
      deliveryMetadata: { externalUrl: "https://learn.maxforcedigital.com/courses/seo" },
    }).success,
    true
  );
});

test("delivery metadata cannot be attached to incompatible product modes", () => {
  assert.equal(
    productSchema.safeParse({
      ...baseProduct,
      productType: "physical",
      deliveryMode: "external_link",
      deliveryMetadata: { externalUrl: "https://example.com/leak" },
    }).success,
    false
  );
  assert.equal(
    productSchema.safeParse({
      ...baseProduct,
      productType: "service",
      deliveryMode: "none",
      deliveryMetadata: { secureAssetKey: "should-not-be-kept" },
    }).success,
    false
  );
});

test("inactive digital drafts may be saved before delivery is configured", () => {
  const parsed = productSchema.safeParse({
    ...baseProduct,
    productType: "course",
    deliveryMode: "none",
    isActive: false,
  });
  assert.equal(parsed.success, true);
});

test("active digital products may use manual admin fulfilment", () => {
  const parsed = productSchema.safeParse({
    ...baseProduct,
    productType: "course",
    deliveryMode: "manual",
    isActive: true,
  });
  assert.equal(parsed.success, true);
});

test("private delivery metadata is excluded from product queries by default", () => {
  assert.equal(Product.schema.path("deliveryMetadata").options.select, false);
});
