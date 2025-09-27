import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, readAdminAddress } from '@/lib/admin';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = readAdminAddress(req);
  if (!isAdmin(admin)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const p = await prisma.project.update({
    where: { id: params.id },
    data: { status: 'APPROVED', approvedAt: new Date(), reviewer: admin ?? undefined },
  });

  return NextResponse.json({ project: p });
}
