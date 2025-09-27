import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, readAdminAddress } from '@/lib/admin';

export async function GET() {
  const items = await prisma.tickerItem.findMany({
    orderBy: { rank: 'asc' },
    take: 10,
  });
  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  const admin = readAdminAddress(req);
  if (!isAdmin(admin)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json();
  const items = (body?.items ?? []) as Array<{ rank: number; symbol: string; name: string; changePct: number }>;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'items required' }, { status: 400 });
  }

  // Replace the whole set in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.tickerItem.deleteMany({});
    for (const it of items.slice(0, 10)) {
      await tx.tickerItem.create({
        data: {
          rank: Number(it.rank),
          symbol: String(it.symbol),
          name: String(it.name),
          changePct: Number(it.changePct),
        },
      });
    }
  });

  const out = await prisma.tickerItem.findMany({ orderBy: { rank: 'asc' }, take: 10 });
  return NextResponse.json({ items: out });
}
