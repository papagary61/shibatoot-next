'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useMemo } from 'react'

/**
 * Tiny SVG sparkline component (no extra libs).
 * Pass an array of numbers and it renders a line chart.
 */
function Sparkline({ data, width = 260, height = 60 }: { data: number[]; width?: number; height?: number }) {
  const path = useMemo(() => {
    if (!data.length) return ''
    const max = Math.max(...data)
    const min = Math.min(...data)
    const dx = width / (data.length - 1 || 1)
    const norm = (v: number) => {
      if (max === min) return height / 2
      return height - ((v - min) / (max - min)) * height
    }
    return data
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * dx} ${norm(v)}`)
      .join(' ')
  }, [data, width, height])

  return (
    <svg width={width} height={height} className="sparkline">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(59,130,246,.9)" />
          <stop offset="100%" stopColor="rgba(236,72,153,.9)" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="url(#g1)" strokeWidth="2.5" />
    </svg>
  )
}

export default function AnalyticsPage() {
  // demo series (replace with real data later)
  const lpSeries = [1.0, 1.05, 1.02, 1.1, 1.12, 1.18, 1.25, 1.22, 1.28, 1.35]
  const holdersSeries = [1, 2, 4, 8, 12, 15, 17, 19, 23, 26]
  const referralsSeries = [0, 3, 6, 12, 20, 25, 30, 28, 35, 44]

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          Analytics <span className="badge badge-muted ml-2">Phase 4</span>
        </h1>
        <ConnectButton />
      </header>

      <section className="mt-6 neon-panel p-6">
        <p className="text-zinc-300/90">
          Dashboards for LP growth, holder distribution, referral performance, and reward proofs.
        </p>
      </section>

      {/* KPI cards */}
      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="neon-panel p-6">
          <div className="text-sm text-zinc-400">LP Growth (indexed)</div>
          <div className="text-2xl font-semibold mt-1">+35%</div>
          <div className="mt-4"><Sparkline data={lpSeries} /></div>
        </div>

        <div className="neon-panel p-6">
          <div className="text-sm text-zinc-400">Holders (index)</div>
          <div className="text-2xl font-semibold mt-1">+26</div>
          <div className="mt-4"><Sparkline data={holdersSeries} /></div>
        </div>

        <div className="neon-panel p-6">
          <div className="text-sm text-zinc-400">Referrals (index)</div>
          <div className="text-2xl font-semibold mt-1">+44</div>
          <div className="mt-4"><Sparkline data={referralsSeries} /></div>
        </div>
      </section>

      {/* tables / placeholders */}
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="neon-panel p-6">
          <div className="text-lg font-semibold">Top Referrers</div>
          <div className="mt-3 overflow-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-3 py-2">Address</th>
                  <th className="text-left px-3 py-2">Referred</th>
                  <th className="text-left px-3 py-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['0x1a…9F', 21, 4200],
                  ['0x7B…12', 16, 3150],
                  ['0xC4…AA', 14, 2800],
                  ['0x88…51', 12, 2400],
                ].map((r, i) => (
                  <tr key={i} className="odd:bg-white/0 even:bg-white/5">
                    <td className="px-3 py-2 font-mono text-xs">{r[0]}</td>
                    <td className="px-3 py-2">{r[1]}</td>
                    <td className="px-3 py-2">{r[2].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="neon-panel p-6">
          <div className="text-lg font-semibold">Recent Rewards Proofs</div>
          <ul className="mt-3 points">
            <li>Week 34 · Baseline 1% · Merkle root: <code className="font-mono text-xs">0xabc…123</code></li>
            <li>Week 35 · <strong>Bonus 2%</strong> · Merkle root: <code className="font-mono text-xs">0xdef…456</code></li>
            <li>Week 36 · Baseline 1% · Merkle root: <code className="font-mono text-xs">0x987…654</code></li>
          </ul>
          <div className="mt-4">
            <a className="btn primary" href="#" onClick={(e)=>e.preventDefault()}>Export CSV (coming soon)</a>
          </div>
        </div>
      </section>

      <footer className="mt-10 text-sm text-zinc-500">
        © {new Date().getFullYear()} ShibaToot.
      </footer>
    </main>
  )
}
