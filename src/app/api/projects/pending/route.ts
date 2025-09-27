import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdminRequest(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const items = await prisma.project.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ ok: true, items });
}
