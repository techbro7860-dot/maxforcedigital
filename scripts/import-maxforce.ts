/**
 * Safe Maxforce WordPress/WooCommerce importer.
 *
 * Dry-runs by default. Pass --write only after reviewing the printed allowlist.
 * Imported digital products stay inactive until an admin attaches a protected
 * asset or external course URL and selects the appropriate delivery mode.
 */
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { Category, Product } from "../models";
import Post from "../models/Post";

const sourceArg = process.argv.find((arg) => arg.startsWith("--source="));
const SOURCE = (sourceArg?.split("=")[1] || "https://maxforcedigital.com").replace(/\/$/, "");
const WRITE = process.argv.includes("--write");
const APPROVED_POSTS = new Set(["built-just-for-you", "future-proofing-your-business", "stop-juggling-vendors"]);
const APPROVED_PRODUCTS = new Set([
  "react-js-complete-guide-from-beginner-to-advanced", "web-developer-handbook-pdf",
  "python-programming-masterclass", "admin-dashboard-ui-template",
  "ui-ux-design-resources-mega-bundle", "seo-made-easy-guide-ebook",
  "data-science-e-book", "atomic-habbit", "the-complete-content-writing-course-for-2026",
  "complete-ui-ux-design-course-2026", "social-media-marketing-mastery-2026",
  "digital-marketing-mega-course-for-2026", "full-stack-web-development-bootcamp",
  "node-js-build-real-world-applications", "complete-ui-ux-design-course", "games-people-play",
  "following-the-call", "full-digital-marketing-with-ai-2026", "claude-code-crash-course",
  "learn-ethical-hacking-from-scratch", "complete-data-sciencemldlnlp",
  "n8n-ai-agents-ai-automations",
]);

type StoreProduct = {
  name: string; slug: string; description?: string; short_description?: string;
  images?: Array<{ src: string }>;
  categories?: Array<{ name: string; slug: string }>;
  prices?: { price?: string; regular_price?: string; sale_price?: string; currency_minor_unit?: number };
};
type WpPost = { slug: string; date: string; title: { rendered: string }; excerpt: { rendered: string }; content: { rendered: string }; yoast_head_json?: { title?: string; description?: string; og_image?: Array<{ url?: string }> } };

function decode(text = "") {
  return text.replace(/&#038;/g, "&").replace(/&#8211;|&ndash;/g, "–").replace(/&#8217;|&rsquo;/g, "’").replace(/&amp;/g, "&").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function sanitizeImportedHtml(html = "") {
  return html
    .replace(/<(script|iframe|object|embed|form)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*(javascript:|data:text\/html)[\s\S]*?\2/gi, "")
    .trim();
}

function money(value?: string, minor = 2) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed / 10 ** minor : 0;
}

function classify(categorySlug: string): "course" | "ebook" {
  return categorySlug === "courses" ? "course" : "ebook";
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { "user-agent": "Maxforce migration/1.0" } });
  if (!response.ok) throw new Error(`${response.status} while fetching ${url}`);
  return response.json() as Promise<T>;
}

async function main() {
  const sourceUrl = new URL(SOURCE);
  if (sourceUrl.protocol !== "https:" || sourceUrl.hostname !== "maxforcedigital.com") {
    throw new Error("--source must be https://maxforcedigital.com");
  }
  const [products, posts] = await Promise.all([
    fetchJson<StoreProduct[]>(`${SOURCE}/wp-json/wc/store/v1/products?per_page=100`),
    fetchJson<WpPost[]>(`${SOURCE}/wp-json/wp/v2/posts?per_page=100&_fields=slug,date,title,excerpt,content,yoast_head_json`),
  ]);
  const approvedPosts = posts.filter((post) => APPROVED_POSTS.has(post.slug));
  const rejectedPosts = posts.filter((post) => !APPROVED_POSTS.has(post.slug));
  const approvedProducts = products.filter((product) => APPROVED_PRODUCTS.has(product.slug));
  const rejectedProducts = products.filter((product) => !APPROVED_PRODUCTS.has(product.slug));
  console.log(`Found ${products.length} products and ${posts.length} posts.`);
  console.log(`Approved products: ${approvedProducts.map((product) => product.slug).join(", ") || "none"}`);
  console.log(`Excluded products: ${rejectedProducts.map((product) => product.slug).join(", ") || "none"}`);
  console.log(`Approved posts: ${approvedPosts.map((post) => post.slug).join(", ") || "none"}`);
  console.log(`Excluded posts: ${rejectedPosts.map((post) => post.slug).join(", ") || "none"}`);
  if (!WRITE) {
    console.log("Dry run only. Re-run with --write after reviewing this list.");
    return;
  }
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required with --write");
  await mongoose.connect(process.env.MONGODB_URI);

  for (const raw of approvedProducts) {
    const sourceCategory = raw.categories?.find((category) => ["courses", "digital-e-book"].includes(category.slug)) || raw.categories?.[0];
    const categorySlug = sourceCategory?.slug === "courses" ? "courses" : "digital-e-book";
    const categoryName = categorySlug === "courses" ? "Courses" : "Digital eBook";
    const category = await Category.findOneAndUpdate(
      { slug: categorySlug },
      { $set: { name: categoryName, isActive: true }, $setOnInsert: { parentCategory: null } },
      { upsert: true, new: true }
    );
    const minor = raw.prices?.currency_minor_unit ?? 2;
    const regular = money(raw.prices?.regular_price || raw.prices?.price, minor);
    const sale = money(raw.prices?.sale_price, minor);
    await Product.findOneAndUpdate(
      { slug: raw.slug },
      { $set: {
        title: decode(raw.name), slug: raw.slug,
        description: decode(raw.description || raw.short_description || raw.name),
        images: (raw.images || []).map((image) => image.src).filter((src) => {
          try { return new URL(src).hostname === sourceUrl.hostname; } catch { return false; }
        }),
        category: category._id, price: regular || sale || 1,
        discountPrice: sale > 0 && sale < regular ? sale : undefined,
        stock: 0, variants: [], variantCombinations: [], tags: [categorySlug],
        productType: classify(categorySlug), deliveryMode: "none",
        isFeatured: categorySlug === "courses", isBestseller: false,
        isActive: false,
      } },
      { upsert: true, new: true }
    );
  }

  for (const raw of approvedPosts) {
    await Post.findOneAndUpdate(
      { slug: raw.slug },
      { $set: {
        title: decode(raw.title.rendered), excerpt: decode(raw.excerpt.rendered),
        content: sanitizeImportedHtml(raw.content.rendered),
        coverImage: raw.yoast_head_json?.og_image?.[0]?.url || "",
        metaTitle: raw.yoast_head_json?.title || decode(raw.title.rendered),
        metaDescription: raw.yoast_head_json?.description || decode(raw.excerpt.rendered),
        isPublished: true, publishedAt: new Date(raw.date),
      } },
      { upsert: true }
    );
  }
  console.log(`Imported ${approvedProducts.length} approved products as inactive and ${approvedPosts.length} approved posts.`);
  console.log("Attach protected delivery details in Admin, then activate each product.");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
