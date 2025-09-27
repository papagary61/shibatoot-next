'use client';

import { useEffect, useState } from 'react';

type WindowWithEthereum = Window & {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, handler: (...args: any[]) => void) => void;
    removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  };
};

export function useEthereum() {
  const [account, setAccount] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as WindowWithEthereum;
    const eth = w.ethereum;
    setReady(!!eth);

    if (!eth) return;

    // restore existing connection (if any)
    eth.request({ method: 'eth_accounts' })
      .then((accs: string[]) => {
        if (accs?.length) setAccount(accs[0]);
      })
      .catch(() => {});

    // account change listener
    const onAccountsChanged = (accs: string[]) => {
      setAccount(accs?.[0] ?? null);
    };
    eth.on?.('accountsChanged', onAccountsChanged);

    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged);
    };
  }, []);

  const connect = async () => {
    const w = window as WindowWithEthereum;
    const eth = w.ethereum;
    if (!eth) {
      alert('No wallet found. Please install MetaMask or a compatible wallet.');
      return;
    }
    const accs = await eth.request({ method: 'eth_requestAccounts' });
    setAccount(accs?.[0] ?? null);
  };

  const short = account ? `${account.slice(0, 6)}…${account.slice(-4)}` : null;

  return { ready, account, short, connect };
}
