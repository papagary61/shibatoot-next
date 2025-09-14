export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0b0f] text-zinc-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_70%_-10%,rgba(168,85,247,.25),transparent),radial-gradient(800px_400px_at_20%_10%,rgba(59,130,246,.18),transparent)]" />
        <div className="absolute inset-0 opacity-[.06] bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Nav */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-blue-500" />
            <span className="text-lg font-bold tracking-wide">ShibaToot</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm text-zinc-300">
            <a href="/howitworks.html" className="hover:text-white">How it works</a>
            <a href="/features.html" className="hover:text-white">Features</a>
            <a href="/lilpepe.html" className="hover:text-white">LilPepe</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/builder.html" className="rounded-xl px-5 py-3 font-semibold bg-white text-black hover:bg-zinc-200 transition">
              Get started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-16">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
          <div className="w-full lg:w-[58%]">
            <div className="flex items-center gap-2 mb-5 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-800/70 px-3 py-1 text-zinc-300">Transparent fees</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-800/70 px-3 py-1 text-zinc-300">Auto-LP</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-800/70 px-3 py-1 text-zinc-300">SAFU</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
              Launch presales in minutes —<br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                with ShibaToot.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-zinc-300">
              Create, run, and finalize token presales with auto-liquidity, locks, KYC/audit badges, and social buzz tools — all in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/builder.html" className="rounded-xl px-5 py-3 font-semibold bg-white text-black hover:bg-zinc-200 transition">
                Create a presale
              </a>
              <a href="/presales.html" className="rounded-xl px-5 py-3 font-semibold border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 transition">
                Explore presales
              </a>
              <a href="/audit.html" className="rounded-xl px-5 py-3 font-semibold border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 transition">
                KYC & Audit
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-zinc-400">
              <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5 text-center">
                <div className="text-xl font-bold text-white">ETH</div><div>Mainnet</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5 text-center">
                <div className="text-xl font-bold text-white">BASE</div><div>Sepolia / Main</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5 text-center">
                <div className="text-xl font-bold text-white">BNB</div><div>Smart Chain</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5 text-center">
                <div className="text-xl font-bold text-white">POLY</div><div>Polygon</div>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="w-full lg:w-[42%] grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5">
              <div className="text-sm text-zinc-400 mb-1">Tier 1</div>
              <div className="font-semibold mb-2">Featured Project</div>
              <div className="h-2 rounded bg-zinc-800">
                <div className="h-2 w-2/3 rounded bg-gradient-to-r from-fuchsia-500 to-blue-500" />
              </div>
              <a href="/presales.html" className="mt-4 inline-block text-sm text-zinc-300 hover:text-white">View presales →</a>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5">
              <div className="text-sm text-zinc-400 mb-1">Security</div>
              <div className="font-semibold mb-2">Multi-sig • Timelocks</div>
              <p className="text-sm text-zinc-400">Best-practice deploys with locks & badges.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5">
              <div className="text-sm text-zinc-400 mb-1">Fees</div>
              <div className="font-semibold mb-2">Lower than most</div>
              <p className="text-sm text-zinc-400">Transparent pricing, no surprises.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 border border-zinc-800 p-5">
              <div className="text-sm text-zinc-400 mb-1">Marketing</div>
              <div className="font-semibold mb-2">Buzz tools</div>
              <p className="text-sm text-zinc-400">Auto-badges, share cards, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-zinc-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} ShibaToot • All rights reserved</div>
          <div className="flex gap-5">
            <a className="hover:text-white" href="/terms.html">Terms</a>
            <a className="hover:text-white" href="/privacy.html">Privacy</a>
            <a className="hover:text-white" href="https://x.com/ShibaToot" target="_blank">X</a>
            <a className="hover:text-white" href="/discord.html">Discord</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
