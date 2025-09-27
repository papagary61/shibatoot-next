import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const winners = await prisma.winner.findMany({
    orderBy: { drawAt: "desc" },
    take: 50,
  });

  // attach payout status if exists
  const payouts = await prisma.payout.findMany({
    where: { winnerId: { in: winners.map(w => w.id) } }
  });
  const payoutMap = new Map(payouts.map(p => [p.winnerId, p]));
  const items = winners.map(w => ({ ...w, payout: payoutMap.get(w.id) ?? null }));

  return NextResponse.json({ ok: true, items });
}
