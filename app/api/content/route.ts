import { NextRequest, NextResponse } from "next/server";
import SiteContent from "@/models/SiteContent";
import { getSiteContent } from "@/lib/site-content";
import { siteContentSchema } from "@/lib/validations/content";
import { requireAdmin } from "@/lib/middleware/requireAdmin";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    return NextResponse.json({ content: await getSiteContent() });
  } catch (error) {
    console.error("Read site content error:", error);
    return NextResponse.json({ error: "Unable to load content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const parsed = siteContentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    await connectDB();
    const content = await SiteContent.findOneAndUpdate(
      { singletonKey: "main" },
      { $set: parsed.data, $setOnInsert: { singletonKey: "main" } },
      { upsert: true, new: true, runValidators: true }
    ).lean();
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Update site content error:", error);
    return NextResponse.json({ error: "Unable to save content" }, { status: 500 });
  }
}
