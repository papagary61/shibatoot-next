import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, owner, description, website } = body ?? {};
  if (!name || !owner) {
    return NextResponse.json({ error: 'name & owner required' }, { status: 400 });
  }

  const p = await prisma.project.create({
    data: { name, owner, description, website },
  });

  return NextResponse.json({ project: p });
}

export async function GET() {
  const [pending, approved, rejected] = await Promise.all([
    prisma.project.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' } }),
    prisma.project.findMany({ where: { status: 'APPROVED' }, orderBy: { approvedAt: 'desc' } }),
    prisma.project.findMany({ where: { status: 'REJECTED' }, orderBy: { rejectedAt: 'desc' } }),
  ]);
  return NextResponse.json({ pending, approved, rejected });
}
