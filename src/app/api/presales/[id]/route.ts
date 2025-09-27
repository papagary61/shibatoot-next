import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin, readAdminAddress } from '@/lib/admin';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = readAdminAddress(req);
  if (!isAdmin(admin)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
