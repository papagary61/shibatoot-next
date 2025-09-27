'use client';

import { useEffect, useMemo, useState } from 'react';

type Item = { rank: number; symbol: string; name: string; changePct: number };

export default function Ticker() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch('/api/ticker', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => setItems(j.items ?? []))
      .catch(() => setItems([]));
  }, []);

  // Render one strip of items
  const Row = useMemo(() => function Row() {
    return (
      <div className="flex items-center gap-6 pr-6">
        {(items.length ? items : [
          { rank: 1, symbol: 'SHBT', name: 'ShibaToot', changePct: 9.9 },
          { rank: 2, symbol: 'LPEPE', name: 'LilPepe', changePct: 4.0 },
        ]).map((it, idx) => {
          const up = it.changePct >= 0;
          return (
            <div key={`${it.symbol}-${idx}`} className="text-xs md:text-[13px] text-zinc-200 whitespace-nowrap">
              <span className="text-zinc-300">{it.name}</span>
              <span className="mx-1 text-zinc-400">·</span>
              <span className="text-zinc-400">{it.symbol}</span>
              <span className="mx-1">{up ? '↑' : '↓'}</span>
              <span className={up ? 'text-emerald-400' : 'text-rose-400'}>
                {Math.abs(it.changePct).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    );
  }, [items]);

  return (
    <div className="fixed top-14 left-0 right-0 z-[60] group">
      <div className="h-7 border-b border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
        <div className="marquee">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
