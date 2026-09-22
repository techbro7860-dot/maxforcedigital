import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactInquiry from "@/models/ContactInquiry";
import { contactInquirySchema } from "@/lib/validations/content";
import { requireAdmin } from "@/lib/middleware/requireAdmin";
import { getTrustedClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const inquiries = await ContactInquiry.find().sort({ createdAt: -1 }).limit(250).lean();
  return NextResponse.json({ inquiries });
}

export async function POST(req: NextRequest) {
  const ip = getTrustedClientIp(req);
  if (!rateLimit(`contact:${ip}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  try {
    const parsed = contactInquirySchema.safeParse(await req.json());
    if (!parsed.success || parsed.data.website) {
      return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    }
    const { website: _honeypot, ...inquiry } = parsed.data;
    await connectDB();
    await ContactInquiry.create(inquiry);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Create contact inquiry error:", error);
    return NextResponse.json({ error: "Unable to send your message" }, { status: 500 });
  }
}
