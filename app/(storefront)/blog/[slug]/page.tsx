import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug, isPublished: true }).select("title metaTitle excerpt metaDescription").lean() as any;
  return post ? { title: post.metaTitle || `${post.title} | Maxforce Digital`, description: post.metaDescription || post.excerpt } : {};
}
export default async function PostPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug, isPublished: true }).lean() as any;
  if (!post) notFound();
  return <main className="mx-auto max-w-3xl px-5 py-16"><article><h1 className="text-4xl font-bold leading-tight">{post.title}</h1>{post.publishedAt && <time className="mt-4 block text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</time>}{post.coverImage && <img src={post.coverImage} alt="" className="mt-8 aspect-video w-full rounded-2xl object-cover" />}<div className="mt-10 whitespace-pre-line leading-8 text-gray-700">{post.content}</div></article></main>;
}
