import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { postSchema } from "@/lib/validations/content";
import { requireAdmin } from "@/lib/middleware/requireAdmin";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  await connectDB();
  const wantsDrafts = req.nextUrl.searchParams.get("admin") === "1";
  if (wantsDrafts && !(await requireAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const query = Post.find(wantsDrafts ? {} : { isPublished: true });
  if (!wantsDrafts) query.select("title slug excerpt coverImage publishedAt");
  const posts = await query.sort({ publishedAt: -1, createdAt: -1 }).lean();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const parsed = postSchema.safeParse({ ...body, slug: slugify(body.slug || body.title || "") });
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    await connectDB();
    const post = await Post.create({
      ...parsed.data,
      publishedAt: parsed.data.isPublished ? new Date() : undefined,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    const message = error?.code === 11000 ? "That slug is already in use" : "Unable to create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
