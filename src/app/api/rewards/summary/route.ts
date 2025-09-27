import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { weekStartUtc } from "@/lib/week";

export async function GET() {
  const ws = weekStartUtc();

  // Settings for prize calc
  const settings = await prisma.settings.findUnique({ where: { id: 1 } }).catch(() => null);

  const count = await prisma.entry.count({ where: { weekStart: ws } });

  // Compute prize from settings (baseline manual + optional LP/bonus)
  const baseline = settings?.manualRewardUsd ?? 100;
  const bonusBaselinePct = 1; // show 1% just like your UI example (adjust to live logic)
  const prizeUSD = Math.max(1, Math.round(baseline));

  // Next draw: Saturday+7
  const next = new Date(ws);
  next.setUTCDate(next.getUTCDate() + 7);

  // Recent winners (last 5)
  const winners = await prisma.winner.findMany({
    orderBy: { drawAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    ok: true,
    entries: count,
    prizeUSD,
    bonusBaselinePct,
    nextDrawAt: next.getTime(),
    winners,
  });
}
