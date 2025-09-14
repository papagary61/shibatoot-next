// src/app/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Connect from "@/components/Connect";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  const isMainnet = process.env.NEXT_PUBLIC_CHAIN_ID === "8453";
  const chainLabel = isMainnet ? "Base" : "Base Sepolia (test)";
  const explorer = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "#";

  function copyAddr() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
  }

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Card */}
      <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur p-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          ShibaToot — Dev Preview
        </h1>
        <p className="mt-2 text-sm opacity-70">Launchpad visuals are live.</p>

        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Connect Button */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-50"></div>
            <div className="relative">
              <Connect />
            </div>
          </div>

          {/* Wallet status with green dot + copy icon */}
          {isConnected && address && (
            <div className="flex items-center gap-2 text-sm opacity-90 relative">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <button
                onClick={copyAddr}
                title="Click to copy"
                className="flex items-center gap-1 underline-offset-4 hover:underline focus:outline-none"
              >
                Connected:{" "}
                <span className="font-mono">
                  {address.slice(0, 6)}…{address.slice(-4)}
                </span>
                <span role="img" aria-label="copy" className="ml-1">📋</span>
              </button>

              {/* Tooltip */}
              {copied && (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] rounded-md bg-black text-white px-2 py-1 shadow">
                  Copied!
                </span>
              )}
            </div>
          )}

          {/* Chain */}
          <div className="text-xs opacity-70">Chain: {chainLabel}</div>

          {/* Links */}
          <div className="flex gap-3 mt-2">
            <Link
              href="/presales"
              className="px-4 py-2 rounded-xl border border-black/10 hover:bg-black hover:text-white transition"
            >
              View Factory Presales
            </Link>
            <a
              href={explorer}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl border border-black/10 hover:bg-black hover:text-white transition"
            >
              Open Block Explorer
            </a>
          </div>
        </div>
      </div>

      {/* Tiny footer */}
      <div className="mt-6 text-xs opacity-60">
        {process.env.NEXT_PUBLIC_APP_NAME || "ShibaToot"}
      </div>
    </main>
  );
}
