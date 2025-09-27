'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type AdminConfig = {
  lpUsd: number
  lpGrowthPct: number
  bonusThresholdUsd: number
  growthTriggerPct: number
  bonusMode: 'auto' | 'on' | 'off'
  useLiveLp: boolean

  rewardSource: 'lp' | 'manual' | 'treasury'
  manualRewardUsd: number
}

const STORAGE_KEY = 'shibatoot-admin-config-v1'

const DEFAULTS: AdminConfig = {
  lpUsd: 1_000_000,
  lpGrowthPct: 0,
  bonusThresholdUsd: 1_250_000,
  growthTriggerPct: 0,
  bonusMode: 'auto',
  useLiveLp: false,

  rewardSource: 'manual',
  manualRewardUsd: 10_000,
}

export default function AdminPage() {
  const [cfg, setCfg] = useState<AdminConfig>(DEFAULTS)
  const [loaded, setLoaded] = useState(false)
  const [treasuryUsd, setTreasuryUsd] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCfg({ ...DEFAULTS, ...(JSON.parse(raw) as AdminConfig) })
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (cfg.rewardSource === 'treasury') {
      fetch('/api/treasury')
        .then(r=>r.json())
        .then(d => setTreasuryUsd(typeof d.treasuryUsd === 'number' ? d.treasuryUsd : 0))
        .catch(()=> setTreasuryUsd(0))
    } else {
      setTreasuryUsd(null)
    }
  }, [cfg.rewardSource])

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
    alert('Saved (local). Home will use these values.')
  }
  function reset() {
    localStorage.removeItem(STORAGE_KEY)
    setCfg(DEFAULTS)
  }

  const bonusActive =
    cfg.bonusMode === 'on' ||
    (cfg.bonusMode === 'auto' &&
      cfg.lpUsd >= cfg.bonusThresholdUsd &&
      cfg.lpGrowthPct >= cfg.growthTriggerPct)

  const rate = bonusActive ? 0.02 : 0.01

  const preview =
    cfg.rewardSource === 'manual' ? cfg.manualRewardUsd
    : cfg.rewardSource === 'lp' ? Math.floor(cfg.lpUsd * rate)
    : Math.floor((treasuryUsd ?? 0) * rate)

  if (!loaded) return null

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin</h1>
        <ConnectButton />
      </header>

      {/* Reward source */}
      <section className="mt-6 neon-panel p-6">
        <div className="text-lg font-semibold">Reward Source</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Select
            label="Source"
            value={cfg.rewardSource}
            onChange={(v) => setCfg({ ...cfg, rewardSource: v as AdminConfig['rewardSource'] })}
            options={[
              { v: 'manual',   label: 'Manual Amount (USD)' },
              { v: 'lp',       label: 'LP × (1% / 2% bonus)' },
              { v: 'treasury', label: 'Treasury × (1% / 2% bonus)' },
            ]}
          />
          <Field
            label="Manual Reward (USD)"
            value={cfg.manualRewardUsd}
            step={100}
            onChange={(v) => setCfg({ ...cfg, manualRewardUsd: v })}
          />
        </div>
        {cfg.rewardSource === 'treasury' && (
          <div className="mt-3 text-sm text-zinc-300">
            Treasury (live): {treasuryUsd === null ? '—' : treasuryUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </div>
        )}
      </section>

      {/* LP settings */}
      <section className="mt-4 neon-panel p-6">
        <div className="text-lg font-semibold">LP-Based Settings</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field label="LP (USD)" value={cfg.lpUsd} step={1000} onChange={v => setCfg({ ...cfg, lpUsd: v })} />
          <Field label="7d LP Growth (%)" value={cfg.lpGrowthPct} step={0.1} onChange={v => setCfg({ ...cfg, lpGrowthPct: v })} />
          <Field label="Bonus Threshold (USD)" value={cfg.bonusThresholdUsd} step={1000} onChange={v => setCfg({ ...cfg, bonusThresholdUsd: v })} />
          <Field label="Growth Trigger (%)" value={cfg.growthTriggerPct} step={0.1} onChange={v => setCfg({ ...cfg, growthTriggerPct: v })} />
          <Select
            label="Bonus Mode"
            value={cfg.bonusMode}
            onChange={(v) => setCfg({ ...cfg, bonusMode: v as AdminConfig['bonusMode'] })}
            options={[
              { v: 'auto', label: 'Auto (threshold & growth)' },
              { v: 'on', label: 'Force On' },
              { v: 'off', label: 'Force Off' },
            ]}
          />
          <Toggle
            label="Use Live LP (/api/lp)"
            value={cfg.useLiveLp}
            onChange={(v) => setCfg({ ...cfg, useLiveLp: v })}
          />
        </div>
      </section>

      <div className="mt-4 flex gap-3">
        <button className="btn primary" onClick={save}>Save</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>

      {/* Preview */}
      <section className="mt-4 neon-panel p-6 text-center">
        <div className="uppercase text-zinc-400 tracking-widest text-sm">Preview</div>
        <div className="fire-wrap mt-3">
          <div className="fire-text-big">
            {preview.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </div>
          <div className="fire-glow"></div>
        </div>
        {cfg.rewardSource !== 'manual' && (
          <div className="mt-2">
            {rate > 0.01 ? (
              <span className="badge badge-success">Bonus 2% Active</span>
            ) : (
              <span className="badge badge-muted">Baseline 1%</span>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

function Field({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v:number)=>void; step?: number }) {
  return (
    <label className="block">
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      <input type="number" value={value} onChange={e=>onChange(Number(e.target.value))}
        step={step} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/40"/>
    </label>
  )
}
function Select({ label, value, onChange, options }:{label:string; value:string; onChange:(v:string)=>void; options:{v:string,label:string}[]}) {
  return (
    <label className="block">
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-cyan-400/40">
        {options.map(o=> <option key={o.v} value={o.v}>{o.label}</option>)}
      </select>
    </label>
  )
}
function Toggle({ label, value, onChange }:{label:string; value:boolean; onChange:(v:boolean)=>void}) {
  return (
    <label className="flex items-center gap-3">
      <input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)} />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  )
}
