import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sent = req.headers.get("x-admin-key") || "(none)";
  const hasEnv = !!process.env.ADMIN_KEY;
  const matches = hasEnv && sent === process.env.ADMIN_KEY;
  return NextResponse.json({
    ok: matches,
    hasEnv,
    sentHeader: sent,
    expectedSet: hasEnv ? "(set in env)" : "(missing)",
  });
}
