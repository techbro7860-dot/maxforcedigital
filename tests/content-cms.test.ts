import assert from "node:assert/strict";
import test from "node:test";
import { contactInquirySchema, postSchema, siteContentSchema } from "../lib/validations/content";
import { rateLimit } from "../lib/rate-limit";

test("default company content satisfies the CMS contract", async () => {
  process.env.MONGODB_URI ||= "mongodb://127.0.0.1:27017/maxforce-test";
  const { DEFAULT_SITE_CONTENT } = await import("../lib/site-content");
  assert.equal(siteContentSchema.safeParse(DEFAULT_SITE_CONTENT).success, true);
});

test("contact validation rejects malformed and bot submissions", () => {
  assert.equal(contactInquirySchema.safeParse({ name: "A", email: "bad", message: "short" }).success, false);
  const bot = contactInquirySchema.safeParse({ name: "Valid Name", email: "a@example.com", message: "A useful project enquiry", website: "spam" });
  assert.equal(bot.success, false);
});

test("post validation accepts safe plain-text content and strict slugs", () => {
  assert.equal(postSchema.safeParse({ title: "Useful post", slug: "useful-post", content: "Content", isPublished: true }).success, true);
  assert.equal(postSchema.safeParse({ title: "Bad", slug: "../../bad", content: "Content" }).success, false);
});

test("rate limiter closes a bucket after its allowance", () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  assert.equal(rateLimit(key, 2, 60_000), true);
  assert.equal(rateLimit(key, 2, 60_000), true);
  assert.equal(rateLimit(key, 2, 60_000), false);
});
