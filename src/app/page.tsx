'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRewardsSummary } from "../hooks/useRewardsSummary";
import { useEthereum } from "@/hooks/useEthereum";

/** Home: centered clickable prize + CTA to claim free entry; entries shown in stats */

function useCountUp({
  from = 0,
  to = 1000,
  duration = 1500,
  formatter = (n: number) => n.toLocaleString(),
}) {
  const [value, setValue] = useState(from);
  const startRef = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min(1, (ts - (startRef.current ?? 0)) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (to - from) * eased;
      setValue(next);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      startRef.current = null;
    };
  }, [from, to, duration]);
  return formatter(value as number);
}

const StatCard: React.FC<{ label: string; value: string; sub?: string }> = ({
  label,
  value,
  sub,
}) => (
  <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-xl backdrop-blur">
    <div className="text-zinc-400 text-xs uppercase tracking-widest">{label}</div>
    <div className="text-3xl md:text-4xl font-extrabold text-white mt-1">{value}</div>
    {sub ? <div className="text-zinc-400 text-sm mt-1">{sub}</div> : null}
  </div>
);

export default function ShibaTootHome() {
  // Live summary data
  const { data, refresh } = useRewardsSummary(10_000);
  const prize = data?.prizeUSD ?? 0;
  const baseline = data?.bonusBaselinePct ?? 0;
  const nextDrawAt = data?.nextDrawAt ?? Date.now();
  const entries = data?.entries ?? 0;

  // Wallet + CTA handler
  const { account, connect } = useEthereum();
  const [ctaMsg, setCtaMsg] = useState<string | null>(null);

  async function getFreeEntry() {
    if (!account) {
      await connect();
      return;
    }
    setCtaMsg(null);
    try {
      const r = await fetch("/api/rewards/enter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ wallet: account }),
      });
      const j = await r.json();
      if (j.ok) {
        setCtaMsg(j.awarded ? "You're in! Free entry counted." : "You already grabbed this week’s free entry.");
        refresh();
      } else {
        setCtaMsg("Something went wrong. Please try again.");
      }
    } catch {
      setCtaMsg("Network error. Please try again.");
    }
  }

  // Countdown
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, nextDrawAt - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const countdown = `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  // Mock stats
  const lifetimeProjects = useCountUp({ from: 0, to: 312, duration: 1600 });
  const lifetimeRaised = useCountUp({
    from: 0,
    to: 12_945_230,
    duration: 1800,
    formatter: (n: number) => `$${Math.round(n).toLocaleString()}`,
  });
  const totalTraders = useCountUp({ from: 0, to: 48_920, duration: 1700 });

  return (
    <div className="min-h-screen w-full bg-[#0b0b0e] text-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Radial glow overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.35),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-12 md:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-center"
          >
            The Swiss Army Knife of Launchpads
          </motion.h1>

          {/* Centered, clickable weekly prize */}
          <div className="mt-6 flex justify-center">
            <a
              href="/rewards"
              className="group inline-flex flex-col items-center rounded-3xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              aria-label="Go to Community Rewards"
            >
              <div className="text-zinc-400 text-sm uppercase tracking-widest">
                This Week’s Prize
              </div>

              <div className="relative mt-2 text-center leading-none">
                <span className="absolute -inset-3 rounded-[32px] blur-2xl bg-gradient-to-r from-amber-400/30 via-orange-500/25 to-pink-500/30 transition-opacity group-hover:opacity-95 opacity-70" />
                <span className="relative block text-[56px] md:text-[96px] font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.35)]">
                  ${prize.toLocaleString()}
                </span>
                <span className="relative ml-2 align-super text-4xl md:text-6xl">🔥</span>
              </div>

              <div className="mt-2 text-zinc-400 text-center">
                Baseline bonus:&nbsp;
                <span className="text-emerald-400 font-semibold">{baseline}%</span>
                &nbsp;· Next draw in&nbsp;
                <span className="text-emerald-400 font-semibold">{countdown}</span>
              </div>

              <div className="mt-3 text-emerald-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                View details & free entry →
              </div>
            </a>
          </div>

          {/* CTA: Connect & Get Free Entry */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={getFreeEntry}
              className="rounded-2xl bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold px-6 py-3"
            >
              {account ? "Get Free Entry" : "Connect & Get Free Entry"}
            </button>
          </div>
          {ctaMsg ? (
            <div className="mt-3 text-center text-emerald-300">{ctaMsg}</div>
          ) : null}

          {/* Hero blurb */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 text-lg md:text-xl text-zinc-300 max-w-2xl text-center mx-auto"
          >
            Launch • Earn • Boost — with transparent security, lifetime referrals, and a
            multi-chain DEX.
          </motion.p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Lifetime Projects" value={`${lifetimeProjects}`} />
            <StatCard label="Lifetime Raised" value={`${lifetimeRaised}`} />
            <StatCard label="Total Traders" value={`${totalTraders}`} />
            <StatCard
              label="Community Reward Entries"
              value={`${entries}`}
              sub="No purchase required — free weekly entry"
            />
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-10 border-t border-white/10 bg-[#0b0b0e]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 text-sm text-zinc-500">
          © {new Date().getFullYear()} ShibaToot. No purchase required for Community Reward Pool
          participation. See terms.
        </div>
      </footer>
    </div>
  );
}
