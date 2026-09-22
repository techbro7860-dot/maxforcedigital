import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { requireAdmin } from "@/lib/middleware/requireAdmin";
import { getTrustedClientIp, rateLimit } from "@/lib/rate-limit";

const inputSchema = z.object({ email: z.string().trim().email().max(254) });
export async function POST(req: NextRequest) {
  const acceptsHtml = (req.headers.get("accept") || "").includes("text/html");
  if (!rateLimit(`newsletter:ip:${getTrustedClientIp(req)}`, 5, 60_000)) {
    if (acceptsHtml) return NextResponse.redirect(new URL("/?newsletter=rate-limited", req.url), 303);
    return NextResponse.json({ error: "Please try again in a minute." }, { status: 429 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());
    const parsed = inputSchema.safeParse(body);
    if (!parsed.success) {
      if (acceptsHtml) return NextResponse.redirect(new URL("/?newsletter=invalid", req.url), 303);
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    const normalizedEmail = parsed.data.email.toLowerCase();
    if (!rateLimit(`newsletter:email:${normalizedEmail}`, 3, 60 * 60_000)) {
      if (acceptsHtml) return NextResponse.redirect(new URL("/?newsletter=rate-limited", req.url), 303);
      return NextResponse.json({ error: "Please try again later." }, { status: 429 });
    }

    await connectDB();
    await NewsletterSubscriber.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: { status: "active", source: "website" } },
      { upsert: true, setDefaultsOnInsert: true }
    );
    if (acceptsHtml) return NextResponse.redirect(new URL("/?newsletter=subscribed", req.url), 303);
    return NextResponse.json({ subscribed: true }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    if (acceptsHtml) return NextResponse.redirect(new URL("/?newsletter=error", req.url), 303);
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).limit(1000).lean();
  return NextResponse.json({ subscribers });
}
