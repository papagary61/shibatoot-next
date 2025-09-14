// src/components/Connect.tsx
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Connect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    const injected = connectors[0]; // MetaMask/Brave
    return (
      <button
        onClick={() => connect({ connector: injected })}
        className="px-4 py-2 rounded-xl bg-black text-white"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">
        {address!.slice(0, 6)}…{address!.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="px-3 py-1 rounded-xl border"
      >
        Disconnect
      </button>
    </div>
  );
}
