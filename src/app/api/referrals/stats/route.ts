import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeAddr } from "@/lib/eth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = normalizeAddr(searchParams.get("wallet"));
  if (!wallet) return NextResponse.json({ ok: false, error: "bad_wallet" }, { status: 400 });

  const clicks = await prisma.referralClick.count({ where: { referrer: wallet } });
  const binds = await prisma.referralBind.count({ where: { referrer: wallet } });

  // In future: add L2 / earnings aggregation.
  return NextResponse.json({
    ok: true,
    wallet,
    clicks,
    l1Referrals: binds,
    l2Referrals: 0,
    estEarningsUSD: 0,
  });
}
