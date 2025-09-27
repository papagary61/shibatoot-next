import Link from 'next/link';

type Winner = {
  id: string;
  wallet: string;
  amountUsd: number;
  prizePct: number;
  txHash?: string | null;
  drawAt: string;
  weekStart: string;
  createdAt: string;
  notes?: string | null;
};

async function getWinners(): Promise<Winner[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/winners`, {
    cache: 'no-store',
  });
  const json = await res.json();
  return json.winners ?? [];
}

export default async function WinnersPage() {
  const winners = await getWinners();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Previous Winners</h1>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-sm">
          <thead className="text-zinc-300">
            <tr className="border-b border-white/10">
              <th className="text-left p-3">Week (UTC)</th>
              <th className="text-left p-3">Wallet</th>
              <th className="text-right p-3">Amount (USD)</th>
              <th className="text-right p-3">Prize %</th>
              <th className="text-left p-3">Tx</th>
            </tr>
          </thead>
          <tbody>
            {winners.map(w => (
              <tr key={w.id} className="border-b border-white/5 odd:bg-white/5">
                <td className="p-3">
                  {new Date(w.weekStart).toISOString().slice(0, 10)}
                </td>
                <td className="p-3">
                  <span className="font-mono text-zinc-300">
                    {w.wallet.slice(0, 6)}…{w.wallet.slice(-4)}
                  </span>
                </td>
                <td className="p-3 text-right">${w.amountUsd.toLocaleString()}</td>
                <td className="p-3 text-right">{w.prizePct}%</td>
                <td className="p-3">
                  {w.txHash ? (
                    <Link
                      href={`https://basescan.org/tx/${w.txHash}`}
                      className="text-cyan-300 hover:underline"
                      target="_blank"
                    >
                      view
                    </Link>
                  ) : (
                    <span className="text-zinc-500">—</span>
                  )}
                </td>
              </tr>
            ))}

            {winners.length === 0 && (
              <tr>
                <td className="p-6 text-center text-zinc-400" colSpan={5}>
                  No winners yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
