'use client';
import React, { useEffect, useState } from "react";
import { useEthereum } from "@/hooks/useEthereum";

type Stats = {
  ok: boolean;
  wallet: string;
  clicks: number;
  l1Referrals: number;
  l2Referrals: number;
  estEarningsUSD: number;
};

export default function ReferralsPage() {
  const { account } = useEthereum();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!account) return;
    fetch(`/api/referrals/stats?wallet=${account}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, [account]);

  const myLink =
    typeof window !== "undefined" && account
      ? `${window.location.origin}/?ref=${account}`
      : "Connect wallet to get your link";

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-8 py-10">
      <h1 className="text-3xl font-extrabold">Referral Dashboard</h1>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Card label="Your Wallet" value={account ?? "Not connected"} />
        <Card label="Clicks" value={stats ? String(stats.clicks) : "—"} />
        <Card label="L1 Referrals" value={stats ? String(stats.l1Referrals) : "—"} />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
        <div className="text-zinc-400 text-sm mb-2">Your Referral Link</div>
        <div className="flex items-center gap-3">
          <input
            readOnly
            value={myLink}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
          />
          <button
            onClick={() => navigator.clipboard.writeText(myLink)}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm"
          >
            Copy
          </button>
        </div>
        <p className="text-zinc-400 text-sm mt-3">
          Share your link. When they connect a wallet, they bind to you for life.
        </p>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
      <div className="text-zinc-400 text-xs uppercase tracking-widest">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
