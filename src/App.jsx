import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Globe, Twitter, Send, Link as LinkIcon, Mail, ChevronRight, Shield, Zap, Timer, Trophy } from "lucide-react";

// ===== CONFIG =====
const SITE = {
  brand: "ShibaToot",
  tagline: "Next-gen presales. Simple. Transparent. Powerful.",
  primaryCtaUrl: "#get-started",
  contactEmail: "admin@shibatoot.com",
  socials: {
    twitter: "https://x.com/shibatoot",
    telegram: "https://t.me/lilpepeshibatoot",
    website: "https://www.shibatoot.com",
  },
};

const LILPEPE = {
  name: "LilPepeToken",
  symbol: "LILPEPE",
  chain: "Ethereum",
  address: "0xdfa9efa4a20ba5a4e1d8c8d4be4cd93adf460130",
  sector: "Cryptocurrency / Meme Token / DeFi",
  short: "Community-driven meme token integrated with the ShibaToot launchpad ecosystem.",
  icon32: "https://www.shibatoot.com/assets/LILPEPE_logo_32x32_fixed.png",
  links: {
    website: "https://www.shibatoot.com/lilpepe",
    twitter: "https://x.com/shibatoot",
    telegram: "https://t.me/lilpepeshibatoot",
    etherscan: "https://etherscan.io/token/0xdfa9efa4a20ba5a4e1d8c8d4be4cd93adf460130",
    lp: "https://etherscan.io/address/0x5f55f7eb3c59e60b420066935638ea28fef865d0",
  },
  tokenomics: [
    { label: "Max Supply", value: "100,000,000,000 (example)" },
    { label: "Initial Liquidity", value: "TBA" },
    { label: "Fees", value: "Buy 2% / Sell 5% (example)" },
  ],
  presale: { softCap: "TBA", hardCap: "TBA", rate: "TBA", startsAt: null },
};

// ===== UI HELPERS =====
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-2xl px-3 py-1 text-xs bg-black/10">
    <Shield className="w-3.5 h-3.5" /> {children}
  </span>
);

const Stat = ({ label, value }) => (
  <div className="p-4 rounded-2xl bg-white/70 text-black shadow-sm">
    <div className="text-xs opacity-70">{label}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);

const GradientBg = ({ children }) => (
  <div className="min-h-screen w-full bg-gradient-to-b from-purple-600 via-fuchsia-500 to-rose-500 text-white">
    <div className="bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_50%)]">
      {children}
    </div>
  </div>
);

// ===== COUNTDOWN =====
const useCountdown = (target) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return useMemo(() => {
    if (!target) return null;
    const diff = Math.max(0, Math.floor((target - now) / 1000));
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return { d, h, m, s };
  }, [now, target]);
};

// ===== PAGES =====
function Home({ onOpenLilPepe }) {
  return (
    <GradientBg>
      {/* NAVBAR */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Rocket className="w-6 h-6" /> {SITE.brand}
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="opacity-90 hover:opacity-100">Features</a>
          <a href="#how" className="opacity-90 hover:opacity-100">How it works</a>
          <button onClick={onOpenLilPepe} className="opacity-90 hover:opacity-100 inline-flex items-center gap-2">
            LilPepe <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
        <a
          href={SITE.socials.twitter}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm bg-white text-black px-4 py-2 rounded-2xl shadow"
        >
          <Twitter className="w-4 h-4" /> Follow
        </a>
      </div>

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-3"><Badge>Transparent fees • Auto-LP • SAFU</Badge></div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Launch presales in minutes —
              <span className="block">with <span className="underline decoration-white/50">ShibaToot</span>.</span>
            </h1>
            <p className="mt-4 text-white/85 text-lg">
              Create, run, and finalize token presales with auto liquidity, locks, KYC/audit badges, and social buzz tools — all in one place.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#get-started" className="inline-flex items-center gap-2 bg-black/90 hover:bg-black px-5 py-3 rounded-2xl font-semibold">
                <Zap className="w-4 h-4" /> Get started
              </a>
              <button onClick={onOpenLilPepe} className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-5 py-3 rounded-2xl">
                <Trophy className="w-4 h-4" /> View LilPepe example
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl p-6 bg-white/10 backdrop-blur border border-white/20 shadow-2xl"
          >
            <div className="text-sm mb-4 opacity-90">Featured Projects</div>
            <div className="grid grid-cols-2 gap-4 text-black">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl p-4 bg-white/90">
                  <div className="text-xs font-semibold text-gray-600">Tier {i}</div>
                  <div className="text-lg font-bold">Project {i}</div>
                  <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-black rounded-full" style={{ width: `${15 + i * 18}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 text-sm flex items-center gap-2 opacity-90">
              <Shield className="w-4 h-4" /> Auto-LP • Locks • Audit badges
            </div>
          </motion.div>
        </div>
      </div>

      {/* FEATURE STRIP */}
      <div id="features" className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-4">
        <Stat label="Chains" value="Base • ETH • BNB • more" />
        <Stat label="Fee" value="≥ 1% lower than peers" />
        <Stat label="Security" value="Multisig • Timelocks" />
      </div>

      {/* HOW IT WORKS */}
      <div id="how" className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Globe className="w-5 h-5" />, title: "Create", text: "Fill a single form. Set caps, rates, whitelist, and auto-LP share." },
            { icon: <Zap className="w-5 h-5" />, title: "Promote", text: "One-click social buzz, progress bars, and referral badges." },
            { icon: <Shield className="w-5 h-5" />, title: "Finalize", text: "Permissionless finalization, LP lock, audit/SAFU badges." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-6 bg-white/10 border border-white/20">
              <div className="mb-2 opacity-90">{f.icon}</div>
              <div className="font-semibold">{f.title}</div>
              <div className="text-white/85 text-sm mt-1">{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EMAIL CAPTURE / CTA */}
      <div id="get-started" className="max-w-3xl mx-auto px-4 pb-20">
        <div className="rounded-3xl p-6 md:p-8 bg-white/10 border border-white/20">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Mail className="w-5 h-5" /> Get early access & launch updates
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex flex-col sm:flex-row gap-3">
            <input className="w-full rounded-2xl px-4 py-3 text-black" placeholder="you@example.com" />
            <button className="inline-flex items-center gap-2 bg-black px-5 py-3 rounded-2xl">
              <Send className="w-4 h-4" /> Subscribe
            </button>
          </form>
          <div className="text-xs mt-2 opacity-80">We’ll only email important stuff. Unsubscribe anytime.</div>
        </div>
      </div>
    </GradientBg>
  );
}

function LilPepePage() {
  const countdown = useCountdown(LILPEPE.presale.startsAt);
  return (
    <GradientBg>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <a href="#home" className="inline-flex items-center gap-2 text-sm bg-white/15 px-3 py-2 rounded-2xl">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back
          </a>
          <div className="inline-flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4" /> SAFU • Auto-LP • Locks
          </div>
        </div>

        <div className="mt-6 rounded-3xl p-6 bg-white/10 border border-white/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <img src={LILPEPE.icon32} alt="LilPepe icon" className="w-12 h-12 rounded" />
            <div>
              <h2 className="text-3xl font-extrabold">
                {LILPEPE.name} <span className="opacity-80">({LILPEPE.symbol})</span>
              </h2>
              <div className="text-white/85 text-sm mt-1">{LILPEPE.short}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>{LILPEPE.chain}</Badge>
                <Badge>{LILPEPE.sector}</Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a className="inline-flex items-center gap-2 bg-black/90 px-4 py-2 rounded-2xl" href={LILPEPE.links.website} target="_blank" rel="noreferrer">
              <Globe className="w-4 h-4" /> Website
            </a>
            <a className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl" href={LILPEPE.links.twitter} target="_blank" rel="noreferrer">
              <Twitter className="w-4 h-4" /> Twitter
            </a>
            <a className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl" href={LILPEPE.links.telegram} target="_blank" rel="noreferrer">
              <Send className="w-4 h-4" /> Telegram
            </a>
            <a className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl" href={LILPEPE.links.etherscan} target="_blank" rel="noreferrer">
              <LinkIcon className="w-4 h-4" /> Etherscan
            </a>
            <a className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl" href={LILPEPE.links.lp} target="_blank" rel="noreferrer">
              <LinkIcon className="w-4 h-4" /> LP Address
            </a>
          </div>

          {/* Presale block (placeholder) */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="md:col-span-2 rounded-3xl p-6 bg-white/10 border border-white/20">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Timer className="w-4 h-4" /> Presale
              </div>
              {countdown ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[{ k: "Days", v: countdown.d }, { k: "Hours", v: countdown.h }, { k: "Minutes", v: countdown.m }, { k: "Seconds", v: countdown.s }].map((c) => (
                    <div key={c.k} className="rounded-2xl p-4 text-center bg-white/10">
                      <div className="text-3xl font-extrabold">{c.v}</div>
                      <div className="text-xs opacity-80">{c.k}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm opacity-90">
                  Presale start: <span className="font-semibold">TBA</span>
                </div>
              )}

              <div className="mt-6">
                <div className="text-xs opacity-90">Progress</div>
                <div className="mt-1 h-3 w-full bg-white/20 rounded-full">
                  <div className="h-3 bg-black rounded-full" style={{ width: `18%` }} />
                </div>
                <div className="text-xs mt-1 opacity-80">Raised 18% of soft cap (demo)</div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Soft Cap" value={LILPEPE.presale.softCap} />
                <Stat label="Hard Cap" value={LILPEPE.presale.hardCap} />
                <Stat label="Rate" value={LILPEPE.presale.rate} />
                <Stat label="Chain" value={LILPEPE.chain} />
              </div>
            </div>

            <div className="rounded-3xl p-6 bg-white/10 border border-white/20">
              <div className="text-sm font-semibold">Tokenomics</div>
              <div className="mt-3 space-y-3">
                {LILPEPE.tokenomics.map((t) => (
                  <div key={t.label} className="flex items-center justify-between gap-3 text-sm">
                    <span className="opacity-80">{t.label}</span>
                    <span className="font-semibold">{t.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-xs break-all opacity-80">
                Contract: <span className="font-mono">{LILPEPE.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GradientBg>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "lilpepe") setPage("lilpepe");
  }, []);
  useEffect(() => {
    window.location.hash = page === "home" ? "home" : "lilpepe";
  }, [page]);

  return (
    <div className="font-sans">
      {page === "home" ? <Home onOpenLilPepe={() => setPage("lilpepe")} /> : <LilPepePage />}
    </div>
  );
}
