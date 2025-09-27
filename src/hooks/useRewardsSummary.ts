'use client';
import { useEffect, useState } from "react";

type Summary = {
  ok: boolean;
  prizeUSD: number;
  bonusBaselinePct: number;
  nextDrawAt: number;
  weekStart: number;
  entries: number;
};

export function useRewardsSummary(refreshMs = 15000) {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const r = await fetch("/api/rewards/summary", { cache: "no-store" });
      const j = await r.json();
      setData(j);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (refreshMs > 0) {
      const t = setInterval(load, refreshMs);
      return () => clearInterval(t);
    }
  }, [refreshMs]);

  return { data, loading, refresh: load };
}
