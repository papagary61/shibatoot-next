'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <header className="flex items-center justify-between">
        <div className="text-2xl font-semibold tracking-wide">ShibaToot 🚀</div>
        <ConnectButton />
      </header>

      <section className="mt-16 neon-panel p-8">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Launch in <span className="text-cyan-300">Space Mode</span> on <span className="text-indigo-300">Base</span>
        </h1>
        <p className="mt-4 text-zinc-300 max-w-2xl">
          Sleek, fast, and verified. Connect your wallet to explore presales, staking, and tools.
        </p>

        <div className="mt-8 flex gap-4">
          <a className="neon-button" href="/launchpad">Launchpad</a>
          <a className="neon-button" href="/whitepaper">Whitepaper</a>
          <a className="neon-button" href="/lilpepe">LilPepe</a>
        </div>
      </section>
    </main>
  )
}
