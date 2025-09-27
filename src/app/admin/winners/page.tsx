'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Winner = {
  id: string;
  wallet: string;
  amountUsd: number;
  prizePct: number;
  txHash?: string | null;
  drawAt: string;
  weekStart: string;
  notes?: string | null;
};

export default function WinnersAdminPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const d = await api<{ winners: Winner[] }>('/api/winners', { cache: 'no-store' });
      setWinners(d.winners);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? 'error');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      wallet: String(fd.get('wallet') || ''),
      amountUsd: Number(fd.get('amountUsd') || 0),
      prizePct: Number(fd.get('prizePct') || 1),
      txHash: String(fd.get('txHash') || '') || undefined,
      drawAt: new Date(String(fd.get('drawAt') || new Date().toISOString())).toISOString(),
      weekStart: new Date(String(fd.get('weekStart') || new Date().toISOString())).toISOString(),
      notes: String(fd.get('notes') || '') || undefined,
    };
    await api('/api/winners', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    e.currentTarget.reset();
    load();
  }

  async function remove(id: string) {
    if (!confirm('Remove this winner?')) return;
    await api(`/api/winners/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold">Admin · Winners</h1>

      {/* add winner */}
      <form onSubmit={create} className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
        <input name="wallet" required placeholder="Winner wallet (0x…)" className="rounded-lg bg-black/30 px-3 py-2 outline-none border border-white/10" />
        <input name="amountUsd" required type="number" step="1" placeholder="Amount USD" className="rounded-lg bg-black/30 px-3 py-2 outline-none border border-white/10" />
        <select name="prizePct" className="rounded-lg bg-black/30 px-3 py-2 outline-none border border-white/10">
          <option value="1">1%</option>
          <option value="2">2%</option>
        </select>
        <input name="txHash" placeholder="Tx hash (optional)" className="rounded-lg bg-black/30 px-3 py-2 outline-none border border-white/10 md:col-span-1" />

        <input name="drawAt" placeholder="Draw ISO (leave blank for now)" className="rounded-lg bg-black/30 px-3 py-2 outline-none border border-white/10 md:col-span-2" />
        <input name="weekStart" placeholder="WeekStart ISO (e.g. last Sat 00:00 UTC)" className="rounded-lg bg-black/30 px-3 py-2 outline-none border border-white/10 md:col-span-2" />

        <input name="notes" placeholder="Notes (optional)" className="rounded-lg bg-black/30 px-3 py-2 outline-none border border-white/10 md:col-span-3" />
        <button className="btn primary btn-fun md:col-span-1">Add Winner</button>
      </form>

      {loading && <p className="mt-6 text-zinc-400">Loading…</p>}
      {err && <p className="mt-6 text-rose-400">{err}</p>}

      {/* list */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-sm">
          <thead className="text-zinc-300">
            <tr className="border-b border-white/10">
              <th className="p-3 text-left">Week</th>
              <th className="p-3 text-left">Wallet</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Prize %</th>
              <th className="p-3 text-left">Tx</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {winners.map(w => (
              <tr key={w.id} className="border-b border-white/5 odd:bg-white/5">
                <td className="p-3">{new Date(w.weekStart).toISOString().slice(0,10)}</td>
                <td className="p-3 font-mono text-zinc-300">{w.wallet.slice(0,6)}…{w.wallet.slice(-4)}</td>
                <td className="p-3 text-right">${w.amountUsd.toLocaleString()}</td>
                <td className="p-3 text-right">{w.prizePct}%</td>
                <td className="p-3">
                  {w.txHash ? (
                    <a className="text-cyan-300 hover:underline" href={`https://basescan.org/tx/${w.txHash}`} target="_blank">view</a>
                  ) : <span className="text-zinc-500">—</span>}
                </td>
                <td className="p-3 text-right">
                  <button className="btn ghost" onClick={() => remove(w.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {winners.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-zinc-400">No winners yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
