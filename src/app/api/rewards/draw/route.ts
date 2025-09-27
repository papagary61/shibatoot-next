import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { weekStartUtc } from "@/lib/week";
import crypto from "crypto";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const ws = weekStartUtc();

  // pull entries for the week
  const entries = await prisma.entry.findMany({
    where: { weekStart: ws },
    select: { wallet: true, weight: true }
  });

  if (entries.length === 0) {
    return NextResponse.json({ ok: false, error: "no_entries" }, { status: 400 });
  }

  // total weight
  const total = entries.reduce((a, b) => a + (b.weight || 1), 0);

  // fairness seed: use or create WeeklySeed commit/reveal
  let seed = await prisma.weeklySeed.findUnique({ where: { weekStart: ws } });
  if (!seed) {
    const secret = crypto.randomBytes(32).toString("hex");
    const commit = crypto.createHash("sha256").update(ws.toISOString() + ":" + secret).digest("hex");
    seed = await prisma.weeklySeed.create({
      data: { weekStart: ws, commit }
    });
  }

  // reveal now for MVP (commit+reveal at draw time)
  const reveal = crypto.randomBytes(32).toString("hex");
  await prisma.weeklySeed.update({
    where: { weekStart: ws },
    data: { reveal, revealedAt: new Date() }
  });

  // pseudo-random index from reveal
  const h = crypto.createHash("sha256").update(reveal).digest("hex");
  const rnd = parseInt(h.slice(0, 12), 16); // big int from hash
  const pickPoint = rnd % total;

  // select wallet by weighted walk
  let acc = 0;
  let winnerWallet = entries[0].wallet.toLowerCase();
  for (const e of entries) {
    acc += e.weight || 1;
    if (pickPoint < acc) {
      winnerWallet = e.wallet.toLowerCase();
      break;
    }
  }

  // compute prize (simple baseline for MVP)
  const settings = await prisma.settings.findUnique({ where: { id: 1 } }).catch(() => null);
  const amountUsd = Math.max(1, Math.round(settings?.manualRewardUsd ?? 100));
  const prizePct = 1; // baseline tier id/percent for your UI

  const weekEnd = new Date(ws);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const winner = await prisma.winner.create({
    data: {
      wallet: winnerWallet,
      amountUsd,
      prizePct,
      drawAt: new Date(),
      weekStart: ws,
      notes: `seed:${h}`,
    }
  });

  return NextResponse.json({ ok: true, winner, totalEntries: total });
}
