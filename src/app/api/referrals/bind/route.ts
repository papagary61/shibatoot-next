import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeAddr } from "@/lib/eth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const wallet = normalizeAddr(body?.wallet);
  if (!wallet) return NextResponse.json({ ok: false, error: "bad_wallet" }, { status: 400 });

  // if already bound, return existing referrer
  const existing = await prisma.referralBind.findUnique({ where: { referred: wallet } });
  if (existing) return NextResponse.json({ ok: true, referrer: existing.referrer, already: true });

  const refCookie = req.cookies.get("st_ref")?.value || "";
  const clickCookie = req.cookies.get("st_click")?.value || "";
  const ref = normalizeAddr(refCookie);
  if (!ref || ref === wallet) {
    // no valid referrer (or self-ref)
    return NextResponse.json({ ok: true, referrer: null, already: false });
  }

  const bound = await prisma.referralBind.create({
    data: { referrer: ref, referred: wallet, sourceClickId: clickCookie || null },
  });

  // clear one-time click cookie; keep st_ref for future pages if you prefer
  const res = NextResponse.json({ ok: true, referrer: bound.referrer, already: false });
  res.cookies.delete("st_click");
  return res;
}
