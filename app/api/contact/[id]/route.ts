import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import ContactInquiry from "@/models/ContactInquiry";
import { requireAdmin } from "@/lib/middleware/requireAdmin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = z.object({ status: z.enum(["new", "contacted", "closed"]) }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  await connectDB();
  const inquiry = await ContactInquiry.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ inquiry });
}
