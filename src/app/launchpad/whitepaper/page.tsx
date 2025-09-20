'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function WhitepaperPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">ShibaToot Whitepaper</h1>
        <ConnectButton />
      </header>

      <article className="mt-8 neon-panel p-6 prose prose-invert">
        <h2>Overview</h2>
        <p>
          ShibaToot is a streamlined launchpad on the <strong>Base</strong> network with transparent fees,
          trust badges, and simple tooling for first-time projects.
        </p>

        <h2>Token & Fees</h2>
        <ul>
          <li>Dynamic fee tiers by 30-day volume.</li>
          <li>LP support, treasury growth, community rewards.</li>
        </ul>

        <h2>Roadmap</h2>
        <ol>
          <li>V1: Presale pages, trust badges, wallet connect.</li>
          <li>V2: Multi-wallet contributors, AI helper, advanced vetting.</li>
        </ol>

        <h2>Links</h2>
        <ul>
          <li>Launchpad: <a href="/launchpad">/launchpad</a></li>
          <li>GitBook/PDF: (drop link here when ready)</li>
        </ul>
      </article>
    </main>
  )
}
