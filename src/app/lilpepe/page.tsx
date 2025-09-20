'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function LilPepeLanding() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">LilPepe — Official Landing</h1>
        <ConnectButton />
      </header>

      <section className="mt-8 neon-panel p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="mt-2 text-zinc-300/80">
              LilPepe is a community-first meme token with transparent LP and weekly updates.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <div><span className="text-zinc-400">Ticker:</span> LILPEPE</div>
              <div><span className="text-zinc-400">Network:</span> Base</div>
              <div><span className="text-zinc-400">Token:</span> <code>0x…</code></div>
              <div><span className="text-zinc-400">LP:</span> <code>0x…</code></div>
              <div><a className="neon-button" href="/lilpepe/whitepaper">LilPepe Whitepaper</a></div>
            </div>
          </div>

          <div className="neon-panel p-5">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-3 list-disc pl-5 text-zinc-300/80">
              <li>BaseScan (insert link)</li>
              <li>DexScreener (insert link)</li>
              <li>Twitter / Telegram / Discord</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
