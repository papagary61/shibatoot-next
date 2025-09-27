import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, owner, description, website } = body || {};
    if (!name || !owner) {
      return NextResponse.json({ ok: false, error: "name_and_owner_required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name: String(name).slice(0, 120),
        owner: String(owner),
        description: description ? String(description).slice(0, 4000) : null,
        website: website ? String(website).slice(0, 256) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, project });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server_error" }, { status: 500 });
  }
}
