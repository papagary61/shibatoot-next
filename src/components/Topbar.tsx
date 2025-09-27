'use client';
import React, { useMemo } from 'react';
import WalletButton from './WalletButton';

type Pair = { pair: string; price: number; vol24h: number; change: number };

const pairsMock: Pair[] = [
  { pair: "SHBT/USDC", price: 0.000012,  vol24h: 256_900,  change: -1.15 },
  { pair: "PEPE/ETH",  price: 0.000001,  vol24h: 712_330,  change:  0.87 },
  { pair: "DOGE/ETH",  price: 0.0832,     vol24h: 1_824_501, change: -0.42 },
  { pair: "ARB/ETH",   price: 1.18,       vol24h: 512_901,  change:  2.31 },
];

function useLoopedPairs(items: Pair[]) {
  return useMemo(() => [...items, ...items, ...items], [items]);
}

function PairPill({ pair, price, vol24h, change }: Pair) {
  return (
    <div
      className={`shrink-0 mr-4 rounded-full border px-3 py-1 text-sm bg-black/40 ${
        change >= 0 ? "border-emerald-500/40 text-emerald-300" : "border-rose-500/40 text-rose-300"
      }`}
    >
      <span className="font-semibold mr-2 text-white/90">{pair}</span>
      <span className="mr-2">
        ${price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
      </span>
      <span className="mr-2 text-zinc-400">Vol 24h: ${vol24h.toLocaleString()}</span>
      <span>{change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`}</span>
    </div>
  );
}

export default function Topbar() {
  const loopPairs = useLoopedPairs(pairsMock);

  return (
    <header className="sticky top-0 z-40 bg-[#0b0b0e]">
      {/* Row 1: brand + nav + wallet */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 h-14 flex items-center justify-between">
        <a href="/" className="font-extrabold tracking-tight text-white">ShibaToot 🚀</a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <a href="/#trade" className="hover:text-white">Trade</a>
          <a href="/#create-presale" className="hover:text-white">Create Presale</a>
          <a href="/#list" className="hover:text-white">List</a>
          <a href="/rewards" className="hover:text-white">Community Rewards</a>
          {/* >>> this is the new link <<< */}
          <a href="/create" className="hover:text-white font-semibold">Create</a>
          {/* optional: admin link (keep hidden if you want) */}
          {/* <a href="/admin/review" className="hover:text-white">Admin</a> */}
        </nav>

        <WalletButton variant="solid" size="md" />
      </div>

      {/* Row 2: ticker */}
      <div className="bg-[#0b0b0e]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="text-zinc-400 uppercase tracking-widest text-2xs">Tradable Pairs</div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="overflow-hidden">
            <div className="flex animate-[scroll_30s_linear_infinite] will-change-transform">
              {loopPairs.map((p, i) => (
                <PairPill key={`${p.pair}-${i}`} {...p} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </header>
  );
}
