import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";
export default async function BlogPage() {
  await connectDB();
  const posts = await Post.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
  return <main className="mx-auto max-w-6xl px-5 py-16"><h1 className="text-4xl font-bold">Insights</h1><p className="mt-4 text-gray-600">Useful ideas for digital growth, technology, and learning.</p><div className="mt-10 grid gap-6 md:grid-cols-3">{posts.map((post: any) => <article key={String(post._id)} className="overflow-hidden rounded-2xl border bg-white">{post.coverImage && <img src={post.coverImage} alt="" className="aspect-video w-full object-cover" />}<div className="p-6"><h2 className="text-xl font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="mt-3 text-gray-600">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="mt-5 inline-block font-semibold text-primary">Read article →</Link></div></article>)}</div>{posts.length === 0 && <p className="mt-10 rounded-xl bg-gray-50 p-6">New articles are coming soon.</p>}</main>;
}
