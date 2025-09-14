// src/lib/chain.ts
import { base, baseSepolia } from 'wagmi/chains';

export const ACTIVE_CHAIN =
  process.env.NEXT_PUBLIC_CHAIN_ID === '8453' ? base : baseSepolia;

export const RPC_HTTP = process.env.NEXT_PUBLIC_RPC_HTTPS!;
