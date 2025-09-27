import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

/**
 * POST { winnerId, wallet, chainId, tokenSymbol, amountToken, txHash?, status? }
 * Creates/updates a payout record; you can send again to attach txHash or mark SENT/FAILED.
 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { winnerId, wallet, chainId, tokenSymbol, amountToken, txHash, status } = body || {};
  if (!winnerId || !wallet || !chainId || !tokenSymbol || !amountToken) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // upsert per-winner
  const payout = await prisma.payout.upsert({
    where: { winnerId },
    update: {
      wallet,
      chainId: Number(chainId),
      tokenSymbol: String(tokenSymbol),
      amountToken: Number(amountToken),
      txHash: txHash ?? undefined,
      status: status ?? undefined,
    },
    create: {
      winnerId,
      wallet,
      chainId: Number(chainId),
      tokenSymbol: String(tokenSymbol),
      amountToken: Number(amountToken),
      txHash: txHash ?? null,
    },
  });

  return NextResponse.json({ ok: true, payout });
}
