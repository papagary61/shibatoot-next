// src/lib/wagmi.tsx
'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { ACTIVE_CHAIN, RPC_HTTP } from './chain';

// Provide transports for both chains to satisfy TS
const transports = {
  [base.id]: http(RPC_HTTP),
  [baseSepolia.id]: http(RPC_HTTP),
} as const;

const config = createConfig({
  chains: [ACTIVE_CHAIN],
  connectors: [injected()],
  transports,
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
