import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashish, normalizeAddr } from "@/lib/eth";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = normalizeAddr(searchParams.get("ref"));
  if (!ref) return NextResponse.json({ ok: false, error: "bad_ref" }, { status: 400 });

  const ua = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.ip || "0.0.0.0";
  const ipHash = hashish(Array.isArray(ip) ? ip.join(",") : ip);

  const created = await prisma.referralClick.create({
    data: {
      referrer: ref,
      userAgent: ua.slice(0, 255),
      ipHash,
      landingPath: searchParams.get("lp") || "/",
    },
  });

  const res = NextResponse.json({ ok: true, id: created.id });
  // httpOnly cookie—bind later when wallet connects
  res.cookies.set("st_ref", ref, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  res.cookies.set("st_click", created.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
