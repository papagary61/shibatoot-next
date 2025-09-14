// src/components/Connect.tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Connect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: injected() });
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
      >
        Disconnect ({address?.slice(0, 6)}…{address?.slice(-4)})
      </button>
    );
  }

  return (
    <button
      onClick={() => connect()}
      className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
    >
      Connect Wallet
    </button>
  );
}
