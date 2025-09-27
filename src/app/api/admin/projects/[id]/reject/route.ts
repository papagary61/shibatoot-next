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
  const notes = body?.notes ? String(body.notes).slice(0, 4000) : null;

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { status: "REJECTED", rejectedAt: new Date(), reviewer },
  });

  if (notes) {
    await prisma.project.update({
      where: { id: params.id },
      data: { description: (updated.description ? updated.description + "\n\n" : "") + `---\n[Review Notes]\n${notes}` },
    });
  }

  return NextResponse.json({ ok: true });
}
