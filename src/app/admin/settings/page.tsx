'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Settings = {
  rewardSource: 'manual' | 'lp' | 'treasury';
  manualRewardUsd: number;
  lpUsd: number;
  lpGrowthPct: number;
  bonusThresholdUsd: number;
  bonusGrowthTriggerPct: number;
  useLiveLp: boolean;
};

export default function AdminSettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const r = await fetch('/api/settings', { cache: 'no-store' }).then(r => r.json());
    setS(r.settings);
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!s) return;
    setSaving(true);
    setMsg(null);
    try {
      const out = await api<{ settings: Settings }>('/api/settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(s),
      });
      setS(out.settings);
      setMsg('Saved!');
    } catch (e: any) {
      setMsg(e?.message || 'Error');
    } finally {
      setSaving(false);
    }
  }

  function F<T extends keyof Settings>(k: T, parse: (v: string)=>Settings[T]) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setS(s => s ? { ...s, [k]: parse(e.target.value) } as Settings : s);
  }
  const FB = (k: keyof Settings) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setS(s => s ? { ...s, [k]: e.target.checked } as Settings : s);

  if (!s) return <main className="mx-auto max-w-4xl px-6 py-10">Loading…</main>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold">Admin · Settings</h1>

      <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-3">
        <label className="block">
          <div className="text-sm text-zinc-400 mb-1">Reward Source</div>
          <select value={s.rewardSource} onChange={F('rewardSource', v => v as any)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2">
            <option value="manual">Manual</option>
            <option value="lp">LP × (1% / 2%)</option>
            <option value="treasury">Treasury × (1% / 2%)</option>
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-zinc-400 mb-1">Manual Reward (USD)</div>
          <input type="number" value={s.manualRewardUsd} onChange={F('manualRewardUsd', Number)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2"/>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={s.useLiveLp} onChange={FB('useLiveLp')} />
          <span className="text-sm text-zinc-300">Use Live LP (/api/lp)</span>
        </label>

        <label className="block">
          <div className="text-sm text-zinc-400 mb-1">LP (USD)</div>
          <input type="number" value={s.lpUsd} onChange={F('lpUsd', Number)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2"/>
        </label>

        <label className="block">
          <div className="text-sm text-zinc-400 mb-1">7d LP Growth (%)</div>
          <input type="number" step="0.1" value={s.lpGrowthPct} onChange={F('lpGrowthPct', Number)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2"/>
        </label>

        <label className="block">
          <div className="text-sm text-zinc-400 mb-1">Bonus Threshold (USD)</div>
          <input type="number" value={s.bonusThresholdUsd} onChange={F('bonusThresholdUsd', Number)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2"/>
        </label>

        <label className="block">
          <div className="text-sm text-zinc-400 mb-1">Growth Trigger (%)</div>
          <input type="number" step="0.1" value={s.bonusGrowthTriggerPct} onChange={F('bonusGrowthTriggerPct', Number)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2"/>
        </label>

        <div className="md:col-span-3 flex items-center gap-3">
          <button className="btn primary btn-fun" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          {msg && <span className="text-sm text-zinc-300">{msg}</span>}
        </div>
      </form>
    </main>
  );
}
