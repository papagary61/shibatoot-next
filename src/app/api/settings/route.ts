import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, readAdminAddress } from '@/lib/admin';

export async function GET() {
  const s = await prisma.settings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ settings: s });
}

export async function PUT(req: Request) {
  const admin = readAdminAddress(req);
  if (!isAdmin(admin)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json();
  // whitelist fields
  const data: any = {};
  const allow = [
    'rewardSource','manualRewardUsd','lpUsd','lpGrowthPct',
    'bonusThresholdUsd','bonusGrowthTriggerPct','useLiveLp'
  ];
  for (const k of allow) if (k in body) data[k] = body[k];

  const s = await prisma.settings.update({ where: { id: 1 }, data });
  return NextResponse.json({ settings: s });
}
