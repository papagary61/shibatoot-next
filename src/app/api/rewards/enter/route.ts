import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { weekStartUtc } from "@/lib/week";

export async function POST(req: NextRequest) {
  try {
    const { wallet, referrer } = await req.json();
    if (!wallet || typeof wallet !== "string") {
      return NextResponse.json({ ok: false, error: "wallet_required" }, { status: 400 });
    }
    const ws = weekStartUtc();

    // 1) FREE entry: unique per week+wallet+source
    let awarded = false;
    try {
      await prisma.entry.create({
        data: {
          wallet: wallet.toLowerCase(),
          weekStart: ws,
          source: "FREE",
          weight: 1,
        },
      });
      awarded = true;
    } catch {
      // unique violation means already claimed
    }

    // 2) REFERRAL bonus: give referrer +1 if valid and not self
    if (referrer && typeof referrer === "string") {
      const r = referrer.toLowerCase();
      const w = wallet.toLowerCase();
      if (r && r !== w) {
        await prisma.entry.create({
          data: {
            wallet: r,         // credit goes to referrer’s wallet
            weekStart: ws,
            source: "REFERRAL",
            weight: 1,
            referrer: w,       // who they referred
          },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ ok: true, awarded });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server_error" }, { status: 500 });
  }
}
