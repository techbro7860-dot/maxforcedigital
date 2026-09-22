import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Product, Category } from "@/models";
import Post from "@/models/Post";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicPaths = ["", "/shop", "/about-us", "/contact-us", "/services", "/industries", "/blog", "/privacy-policy", "/refund-policy", "/shipping-policy", "/terms-and-conditions"];
  const staticRoutes: MetadataRoute.Sitemap = publicPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));
  try {
    await connectDB();
    const [products, categories, posts] = await Promise.all([
      Product.find({ isActive: true }).select("slug updatedAt").lean(),
      Category.find({ isActive: true }).select("slug updatedAt").lean(),
      Post.find({ isPublished: true }).select("slug updatedAt").lean(),
    ]);
    return [
      ...staticRoutes,
      ...products.map((item: any) => ({ url: `${BASE_URL}/product/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...categories.map((item: any) => ({ url: `${BASE_URL}/category/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
      ...posts.map((item: any) => ({ url: `${BASE_URL}/blog/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
