import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdminRequest(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const reviewer = (body?.reviewer || "admin").toString().slice(0, 120);

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { status: "APPROVED", approvedAt: new Date(), reviewer },
  });

  return NextResponse.json({ ok: true, project: updated });
}
