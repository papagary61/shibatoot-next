'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type TItem = { id?: string; rank: number; symbol: string; name: string; changePct: number };

export default function AdminTickerPage() {
  const [items, setItems] = useState<TItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/ticker', { cache: 'no-store' }).then(r => r.json());
    setItems(
      (res.items as TItem[] ?? []).length
        ? res.items
        : [
            { rank: 1, symbol: 'SHBT', name: 'ShibaToot', changePct: 9.9 },
            { rank: 2, symbol: 'LPEPE', name: 'LilPepe', changePct: 4.0 },
          ]
    );
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(i: number, k: keyof TItem, v: string) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [k]: k === 'rank' || k === 'changePct' ? Number(v) : v } : it));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = items
      .filter(x => x.symbol && x.name)
      .sort((a,b) => a.rank - b.rank)
      .slice(0, 10);
    const out = await api<{ items: TItem[] }>('/api/ticker', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: cleaned }),
    });
    setItems(out.items);
    setMsg('Saved!');
    setTimeout(() => setMsg(null), 1500);
  }

  function addRow() {
    const nextRank = (items.reduce((m, x) => Math.max(m, x.rank), 0) || 0) + 1;
    setItems(prev => [...prev, { rank: nextRank, symbol: '', name: '', changePct: 0 }]);
  }

  function delRow(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Admin · Ticker</h1>
      {loading ? <p className="mt-4 text-zinc-400">Loading…</p> : (
        <form onSubmit={save} className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-zinc-300">
                <tr className="border-b border-white/10">
                  <th className="p-2 text-left w-16">Rank</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left w-32">Symbol</th>
                  <th className="p-2 text-right w-32">Change %</th>
                  <th className="p-2 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-2">
                      <input className="w-16 rounded bg-black/30 border border-white/10 px-2 py-1"
                        type="number" value={it.rank} onChange={e => update(i, 'rank', e.target.value)} />
                    </td>
                    <td className="p-2">
                      <input className="w-full rounded bg-black/30 border border-white/10 px-2 py-1"
                        value={it.name} onChange={e => update(i, 'name', e.target.value)} />
                    </td>
                    <td className="p-2">
                      <input className="w-28 rounded bg-black/30 border border-white/10 px-2 py-1"
                        value={it.symbol} onChange={e => update(i, 'symbol', e.target.value)} />
                    </td>
                    <td className="p-2 text-right">
                      <input className="w-28 rounded bg-black/30 border border-white/10 px-2 py-1 text-right"
                        type="number" step="0.1" value={it.changePct}
                        onChange={e => update(i, 'changePct', e.target.value)} />
                    </td>
                    <td className="p-2 text-right">
                      <button type="button" className="btn ghost" onClick={() => delRow(i)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="button" className="btn ghost" onClick={addRow}>Add Row</button>
            <button className="btn primary btn-fun">Save</button>
            {msg && <span className="text-sm text-zinc-300">{msg}</span>}
          </div>
        </form>
      )}
    </main>
  );
}
