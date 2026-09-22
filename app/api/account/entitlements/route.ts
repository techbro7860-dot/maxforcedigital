import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/middleware/requireAuth";
import { Entitlement } from "@/models";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const entitlements = await Entitlement.find({ user: user.id, isActive: true, revokedAt: null })
    .populate("product", "title slug images isActive")
    .sort({ grantedAt: -1 })
    .lean();

  return NextResponse.json(
    { entitlements },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
