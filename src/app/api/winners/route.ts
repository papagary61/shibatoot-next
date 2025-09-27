import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, readAdminAddress } from '@/lib/admin';

export async function GET() {
  const winners = await prisma.winner.findMany({
    orderBy: { drawAt: 'desc' },
    take: 50, // show most recent 50; adjust later
  });
  return NextResponse.json({ winners });
}

export async function POST(req: Request) {
  const admin = readAdminAddress(req);
  if (!isAdmin(admin)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json();
  const { wallet, amountUsd, prizePct, txHash, drawAt, weekStart, notes } = body ?? {};

  if (!wallet || amountUsd == null || prizePct == null || !drawAt || !weekStart) {
    return NextResponse.json(
      { error: 'wallet, amountUsd, prizePct, drawAt, weekStart required' },
      { status: 400 }
    );
  }

  const created = await prisma.winner.create({
    data: {
      wallet,
      amountUsd: Number(amountUsd),
      prizePct: Number(prizePct),
      txHash,
      drawAt: new Date(drawAt),
      weekStart: new Date(weekStart),
      notes,
    },
  });

  return NextResponse.json({ winner: created });
}
