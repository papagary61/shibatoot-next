// src/lib/viem.ts
'use client';

import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Pick chain by env (8453 = Base mainnet, else Base Sepolia)
export const CHAIN =
  process.env.NEXT_PUBLIC_CHAIN_ID === '8453' ? base : baseSepolia;

// Public client = read-only RPC (no wallet needed)
export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(process.env.NEXT_PUBLIC_RPC_HTTPS!),
});

// Lazy wallet client (only in browser, when MetaMask is available)
export async function getWalletClient() {
  if (typeof window === 'undefined') return null;
  const eth = (window as any).ethereum;
  if (!eth) return null;
  return createWalletClient({
    chain: CHAIN,
    transport: custom(eth),
  });
}
