'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'

type Row = { address: string; amount: string }

export default function AirdropPage() {
  const [rows, setRows] = useState<Row[]>([])

  // basic CSV parser (address,amount) – client-side placeholder
  function handleCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const parsed = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [address = '', amount = ''] = l.split(',').map(s => s.trim())
          return { address, amount }
        })
        .filter(r => r.address && r.amount)
      setRows(parsed)
    }
    reader.readAsText(f)
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          Airdrop Engine <span className="badge badge-muted ml-2">Phase 2</span>
        </h1>
        <ConnectButton />
      </header>

      <section className="mt-6 neon-panel p-6">
        <p className="text-zinc-300/90">
          Merkle claim lists, on-chain proofs, and optional auto-drop to holders. Integrates with referrals and social
          actions.
        </p>
      </section>

      <section className="mt-4 neon-panel p-6">
        <div className="text-lg font-semibold">Planned</div>
        <ul className="points mt-3">
          <li>CSV → Merkle tree generator</li>
          <li>Claim UI &amp; proof verification</li>
          <li>Anti-sybil throttling</li>
          <li>Audit/KYC gating (optional)</li>
        </ul>
      </section>

      {/* lightweight CSV preview to mirror your old flow */}
      <section className="mt-4 neon-panel p-6">
        <div className="text-lg font-semibold">CSV Preview (address,amount)</div>
        <div className="mt-3 flex items-center gap-3">
          <label className="btn ghost cursor-pointer">
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsv} />
            Upload CSV
          </label>
          <a className="btn primary" href="#" onClick={(e)=>e.preventDefault()}>Generate Merkle (coming soon)</a>
        </div>

        {rows.length > 0 ? (
          <div className="mt-4 max-h-64 overflow-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-3 py-2">Address</th>
                  <th className="text-left px-3 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="odd:bg-white/0 even:bg-white/5">
                    <td className="px-3 py-2 font-mono text-xs">{r.address}</td>
                    <td className="px-3 py-2">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-zinc-400 text-sm">No file uploaded yet.</p>
        )}
      </section>

      <footer className="mt-10 text-sm text-zinc-500">
        © {new Date().getFullYear()} ShibaToot. Always DYOR.
      </footer>
    </main>
  )
}
