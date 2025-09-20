'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function LilPepeWhitepaper() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">LilPepe Whitepaper</h1>
        <ConnectButton />
      </header>

      <article className="mt-8 neon-panel p-6 prose prose-invert">
        <h2>Introduction</h2>
        <p>Replace this text with your final write-up or attach a PDF.</p>

        <h2>Tokenomics</h2>
        <ul>
          <li>Supply: …</li>
          <li>Fees: …</li>
          <li>LP & Treasury: …</li>
        </ul>

        <h2>Roadmap</h2>
        <ol>
          <li>Listing visibility (explorers/trackers)</li>
          <li>Community growth</li>
          <li>Utility integrations</li>
        </ol>

        <h2>Resources</h2>
        <ul>
          <li>Landing: <a href="/lilpepe">/lilpepe</a></li>
          <li>Contract: (BaseScan link)</li>
          <li>LP Pair: (Dex link)</li>
        </ul>
      </article>
    </main>
  )
}
