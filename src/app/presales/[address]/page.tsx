// src/app/presale/[address]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { publicClient } from '@/lib/viem';
import presaleAbi from '@/abi/Presale.json';

type Info = {
  token: string;
  owner: string;
  softCap: string;
  hardCap: string;
  totalRaised: string;
  startTime: number;
  endTime: number;
  minContribution: string;
  maxContribution: string;
  listingPercent: number;
  lpLockDuration: number;
  acceptToken: string;
};

export default function PresaleDetail() {
  const params = useParams<{ address: string }>();
  const address = (params?.address || '').toLowerCase() as `0x${string}`;
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !address.startsWith('0x')) return;
    (async () => {
      try {
        const read = (fn: string) =>
          publicClient.readContract({ address, abi: presaleAbi as any, functionName: fn });

        const [
          token, owner, softCap, hardCap, totalRaised,
          startTime, endTime, minContribution, maxContribution,
          listingPercent, lpLockDuration, acceptToken,
        ] = await Promise.all([
          read('token'), read('owner'), read('softCap'), read('hardCap'),
          read('totalRaised'), read('startTime'), read('endTime'),
          read('minContribution'), read('maxContribution'),
          read('listingPercent'), read('lpLockDuration'), read('acceptToken'),
        ]);

        setInfo({
          token: token as string,
          owner: owner as string,
          softCap: (softCap as bigint).toString(),
          hardCap: (hardCap as bigint).toString(),
          totalRaised: (totalRaised as bigint).toString(),
          startTime: Number(startTime),
          endTime: Number(endTime),
          minContribution: (minContribution as bigint).toString(),
          maxContribution: (maxContribution as bigint).toString(),
          listingPercent: Number(listingPercent),
          lpLockDuration: Number(lpLockDuration),
          acceptToken: acceptToken as string,
        });
      } catch (e: any) {
        setError(e?.message ?? 'Failed to read presale');
      }
    })();
  }, [address]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Presale Detail</h1>
      <div className="text-sm opacity-70 mb-6 break-all">Address: {address}</div>

      {!info && !error && <div className="opacity-70">Loading…</div>}
      {error && (
        <div className="text-red-600 whitespace-pre-wrap break-words">{error}</div>
      )}

      {info && (
        <div className="space-y-3">
          <Row k="Token" v={info.token} />
          <Row k="Owner" v={info.owner} />
          <Row k="Accept Token" v={info.acceptToken} />
          <Row k="Soft Cap (wei)" v={info.softCap} />
          <Row k="Hard Cap (wei)" v={info.hardCap} />
          <Row k="Total Raised (wei)" v={info.totalRaised} />
          <Row k="Min Contribution (wei)" v={info.minContribution} />
          <Row k="Max Contribution (wei)" v={info.maxContribution} />
          <Row k="Listing %" v={String(info.listingPercent)} />
          <Row k="LP Lock (sec)" v={String(info.lpLockDuration)} />
          <Row k="Start" v={new Date(info.startTime * 1000).toLocaleString()} />
          <Row k="End" v={new Date(info.endTime * 1000).toLocaleString()} />
        </div>
      )}
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-44 font-semibold">{k}</div>
      <div className="flex-1 break-all">{v}</div>
    </div>
  );
}
