'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function LaunchpadPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">ShibaToot Launchpad</h1>
        <ConnectButton />
      </header>

      <section className="mt-8 neon-panel p-6">
        <h2 className="text-2xl font-semibold">Create or Browse Presales</h2>
        <p className="mt-2 text-zinc-300/80">
          Fast, transparent presales on <span className="text-indigo-300">Base</span>.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Featured Pool', 'New Projects', 'Top Rated'].map((t, i) => (
            <div key={i} className="neon-panel p-5">
              <div className="text-lg font-medium">{t}</div>
              <p className="mt-2 text-zinc-300/80">Placeholder card. Pools will appear here.</p>
              <a className="mt-4 inline-block neon-button" href="#">View</a>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a className="neon-button" href="#">+ Start a Presale (coming soon)</a>
        </div>
      </section>
    </main>
  )
}
