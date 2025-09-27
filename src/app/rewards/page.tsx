'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Winner = {
  id: string;
  wallet: string;
  amountUsd: number;
  prizePct: number;
  txHash?: string | null;
  drawAt: string;     // ISO
  weekStart: string;  // ISO
  notes?: string | null;
};

type Payout = {
  id: string;
  winnerId: string;
  wallet: string;
  chainId: number;
  tokenSymbol: string;
  amountToken: number;
  txHash?: string | null;
  status: 'PENDING' | 'SENT' | 'FAILED';
};

type WinnerWithPayout = Winner & { payout: Payout | null };

type Summary = {
  ok: boolean;
  entries: number;
  prizeUSD: number;
  bonusBaselinePct: number;
  nextDrawAt: number; // ms
};

function useAdminKey() {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    const k = sessionStorage.getItem('st_admin_key');
    if (k) setKey(k);
  }, []);
  const save = (k: string) => {
    sessionStorage.setItem('st_admin_key', k);
    setKey(k);
  };
  const signOut = () => {
    sessionStorage.removeItem('st_admin_key');
    location.reload();
  };
  return { key, save, signOut };
}

async function safeJson(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const text = await res.text();
  throw new Error(`HTTP ${res.status} ${res.statusText} — ${text.slice(0, 200)}`);
}

export default function AdminRewardsPage() {
  const { key, save, signOut } = useAdminKey();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [winners, setWinners] = useState<WinnerWithPayout[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // payout editor
  const [editing, setEditing] = useState<WinnerWithPayout | null>(null);
  const [payForm, setPayForm] = useState({
    chainId: 8453,
    tokenSymbol: 'USDC',
    amountToken: 100,
    txHash: '',
    status: 'SENT' as 'PENDING' | 'SENT' | 'FAILED',
  });

  const nextDrawText = useMemo(() => {
    if (!summary?.nextDrawAt) return '—';
    const d = new Date(summary.nextDrawAt);
    return d.toUTCString();
  }, [summary]);

  async function loadAll() {
    setMsg(null);
    try {
      const s = await fetch('/api/rewards/summary', { cache: 'no-store' }).then(safeJson);
      setSummary(s);

      if (!key) return; // wait for admin key
      const w = await fetch('/api/admin/rewards/winners', {
        headers: { 'x-admin-key': key },
        cache: 'no-store',
      }).then(safeJson);
      if (!w.ok) throw new Error(w.error || 'Failed to load winners');
      setWinners(w.items);
    } catch (e: any) {
      setMsg(e.message || 'Load error');
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function drawWinner() {
    if (!key) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/rewards/draw', {
        method: 'POST',
        headers: { 'x-admin-key': key },
      }).then(safeJson);

      if (!res.ok) {
        if (res.error === 'no_entries') {
          setMsg('No entries for this week. Ask users to claim a free entry first.');
        } else {
          setMsg(res.error || 'Draw failed');
        }
      } else {
        setMsg(`Winner drawn: ${res.winner.wallet} — $${res.winner.amountUsd}`);
        await loadAll();
      }
    } catch (e: any) {
      setMsg(e.message || 'Draw error');
    } finally {
      setBusy(false);
    }
  }

  function openPayout(w: WinnerWithPayout) {
    setEditing(w);
    setPayForm({
      chainId: w.payout?.chainId ?? 8453,
      tokenSymbol: w.payout?.tokenSymbol ?? 'USDC',
      amountToken: w.payout?.amountToken ?? Math.max(1, Math.round(w.amountUsd / 1)), // 1:1 default
      txHash: w.payout?.txHash ?? '',
      status: w.payout?.status ?? 'PENDING',
    });
  }

  async function savePayout() {
    if (!key || !editing) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/rewards/payout', {
        method: 'POST',
        headers: {
          'x-admin-key': key,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          winnerId: editing.id,
          wallet: editing.wallet,
          chainId: Number(payForm.chainId),
          tokenSymbol: String(payForm.tokenSymbol),
          amountToken: Number(payForm.amountToken),
          txHash: payForm.txHash || undefined,
          status: payForm.status,
        }),
      }).then(safeJson);

      if (!res.ok) throw new Error(res.error || 'Payout save failed');
      setMsg('Payout saved');
      setEditing(null);
      await loadAll();
    } catch (e: any) {
      setMsg(e.message || 'Payout error');
    } finally {
      setBusy(false);
    }
  }

  if (!key) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] text-white flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 w-[420px]">
          <h1 className="text-xl font-bold">Admin Sign-In</h1>
          <p className="text-zinc-400 text-sm mt-2">Enter your admin key to access rewards console.</p>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              const k = (new FormData(e.currentTarget).get('key') as string) || '';
              save(k);
            }}
          >
            <input
              name="key"
              type="password"
              placeholder="ADMIN_KEY"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
            />
            <button className="mt-3 w-full rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold px-5 py-2">
              Enter
            </button>
          </form>
          <p className="text-xs text-zinc-500 mt-3">We’ll replace this with SIWE later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Rewards Console</h1>
          <button
            onClick={signOut}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-sm"
          >
            Sign out
          </button>
        </div>

        {msg ? <div className="mt-4 text-amber-300">{msg}</div> : null}

        {/* SUMMARY */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <div className="text-zinc-400 text-xs uppercase tracking-widest">This Week’s Entries</div>
            <div className="text-3xl font-extrabold mt-1">{summary?.entries ?? '—'}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <div className="text-zinc-400 text-xs uppercase tracking-widest">Prize (USD)</div>
            <div className="text-3xl font-extrabold mt-1">${summary?.prizeUSD ?? '—'}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <div className="text-zinc-400 text-xs uppercase tracking-widest">Next Draw</div>
            <div className="text-sm font-semibold mt-1">{nextDrawText}</div>
          </div>
        </div>

        {/* DRAW */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">Draw Winner</div>
              <div className="text-zinc-400 text-sm">Draws a weighted winner from this week’s entries.</div>
            </div>
            <button
              disabled={busy}
              onClick={drawWinner}
              className="rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold px-4 py-2 disabled:opacity-50"
            >
              {busy ? 'Working…' : 'Draw Now'}
            </button>
          </div>
        </div>

        {/* WINNERS */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="text-lg font-bold mb-3">Recent Winners</div>
          <div className="space-y-3">
            {winners.length === 0 ? (
              <div className="text-zinc-400 text-sm">No winners yet.</div>
            ) : winners.map((w) => (
              <div key={w.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {w.wallet.slice(0, 6)}…{w.wallet.slice(-4)}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      Drawn: {new Date(w.drawAt).toUTCString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold">${w.amountUsd}</div>
                    <div className="text-zinc-400 text-xs">week: {new Date(w.weekStart).toISOString().slice(0,10)}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {w.payout ? (
                    <span className="text-xs rounded-full border border-white/10 px-2 py-0.5">
                      Payout: {w.payout.status} {w.payout.txHash ? `• ${w.payout.tokenSymbol}` : ''}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">No payout recorded</span>
                  )}
                  <button
                    onClick={() => openPayout(w)}
                    className="ml-auto rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-sm"
                  >
                    {w.payout ? 'Edit Payout' : 'Record Payout'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYOUT EDITOR (simple drawer) */}
        {editing ? (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center">
            <div className="w-full md:w-[520px] rounded-t-2xl md:rounded-2xl border border-white/10 bg-zinc-900 p-5">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">Payout for {editing.wallet.slice(0,6)}…{editing.wallet.slice(-4)}</div>
                <button onClick={() => setEditing(null)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400">Chain ID</label>
                  <input
                    type="number"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                    value={payForm.chainId}
                    onChange={(e) => setPayForm({ ...payForm, chainId: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Token</label>
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                    value={payForm.tokenSymbol}
                    onChange={(e) => setPayForm({ ...payForm, tokenSymbol: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Amount (token)</label>
                  <input
                    type="number"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                    value={payForm.amountToken}
                    onChange={(e) => setPayForm({ ...payForm, amountToken: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Status</label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                    value={payForm.status}
                    onChange={(e) => setPayForm({ ...payForm, status: e.target.value as any })}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="SENT">SENT</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-zinc-400">Tx Hash (optional)</label>
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
                    value={payForm.txHash}
                    onChange={(e) => setPayForm({ ...payForm, txHash: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={busy}
                  onClick={savePayout}
                  className="rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold px-4 py-2 text-sm disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Save Payout'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
