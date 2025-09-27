'use client';
import React from 'react';

export default function CommunityEntries({ value }: { value: string | number }) {
  return (
    <div className="mt-3">
      <div className="relative inline-flex items-center rounded-2xl border border-amber-400/30 bg-black/40 px-4 py-2 shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)]">
        <span className="absolute -inset-0.5 -z-10 rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(251,191,36,0.25),transparent_30%,rgba(251,191,36,0.25))] blur"></span>
        <span className="mr-2 text-amber-300 text-xl">🔥</span>
        <span className="text-amber-200 font-semibold">Community Reward Entries:</span>
        <span className="ml-2 font-extrabold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </div>
      <div className="text-zinc-400 text-sm mt-1">
        No purchase required. Extra free entries via referrals & staking tiers.
      </div>
    </div>
  );
}
