import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { postSchema } from "@/lib/validations/content";
import { requireAdmin } from "@/lib/middleware/requireAdmin";
import { slugify } from "@/lib/slugify";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = postSchema.safeParse({ ...body, slug: slugify(body.slug || body.title || "") });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  await connectDB();
  const existing = await Post.findById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const publishedAt = parsed.data.isPublished ? existing.publishedAt || new Date() : undefined;
  Object.assign(existing, parsed.data, { publishedAt });
  await existing.save();
  return NextResponse.json({ post: existing });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const post = await Post.findByIdAndDelete(params.id);
  return post ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
