'use client';

import { useEffect, useState } from 'react';

type Presale = {
  id: string;
  name: string;
  owner: string;
  website?: string | null;
  description?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
};

async function j<T>(input: RequestInfo, init?: RequestInit) {
  const r = await fetch(input, { ...init, headers: { 'content-type': 'application/json', ...(init?.headers || {}) } });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<T>;
}

export default function AdminPresales() {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [website, setWebsite] = useState('');
  const [desc, setDesc] = useState('');

  const [pending, setPending]   = useState<Presale[]>([]);
  const [approved, setApproved] = useState<Presale[]>([]);
  const [rejected, setRejected] = useState<Presale[]>([]);
  const [loading, setLoading]   = useState(true);
  const [err, setErr]           = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await j<{ pending: Presale[]; approved: Presale[]; rejected: Presale[] }>('/api/presales');
      setPending(data.pending ?? []);
      setApproved(data.approved ?? []);
      setRejected(data.rejected ?? []);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setErr(null);
    try {
      await j('/api/presales', {
        method: 'POST',
        body: JSON.stringify({ name, owner, website, description: desc }),
      });
      setName(''); setOwner(''); setWebsite(''); setDesc('');
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Create failed');
    }
  }

  async function act(id: string, action: 'approve' | 'reject' | 'delete') {
    setErr(null);
    try {
      await j(`/api/presales/${id}/${action}`, { method: 'POST' });
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Action failed');
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold">Admin · Presales</h1>

      {err && <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-rose-200">{err}</div>}

      {/* Create form */}
      <div className="mt-6 grid gap-3 md:grid-cols-12">
        <input
          className="md:col-span-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="md:col-span-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
          placeholder="Owner wallet (0x...)"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          className="md:col-span-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
          placeholder="Website (optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <div className="md:col-span-9">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <button onClick={create} className="w-full btn primary">Create</button>
        </div>
      </div>

      {/* Columns */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Column title="Pending" loading={loading}>
          {pending.length === 0 ? <Empty /> : pending.map((p) => (
            <Card key={p.id} p={p}>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button className="btn primary" onClick={() => act(p.id, 'approve')}>Approve</button>
                <button className="btn ghost" onClick={() => act(p.id, 'reject')}>Reject</button>
              </div>
            </Card>
          ))}
        </Column>

        <Column title="Approved" loading={loading}>
          {approved.length === 0 ? <Empty /> : approved.map((p) => (
            <Card key={p.id} p={p}>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button className="btn ghost" onClick={() => act(p.id, 'delete')}>Delete</button>
              </div>
            </Card>
          ))}
        </Column>

        <Column title="Rejected" loading={loading}>
          {rejected.length === 0 ? <Empty /> : rejected.map((p) => (
            <Card key={p.id} p={p}>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button className="btn ghost" onClick={() => act(p.id, 'delete')}>Delete</button>
              </div>
            </Card>
          ))}
        </Column>
      </div>
    </main>
  );
}

/* ---------- helpers ---------- */

function Column({ title, loading, children }: { title: string; loading: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-sm font-semibold text-zinc-300">{title}</h2>
      {loading ? <div className="text-zinc-400 text-sm">Loading…</div> : <div className="space-y-3">{children}</div>}
    </section>
  );
}

function Empty() {
  return <div className="text-sm text-zinc-400">None</div>;
}

function Card({ p, children }: { p: Presale; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      {/* row: text on the left (min-w-0), actions on the right (shrink-0) */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-zinc-100 truncate">{p.name}</div>
          <div className="text-[13px] text-cyan-300 truncate">{p.website || '—'}</div>
          <div className="mt-1 text-xs text-zinc-400 break-words">{p.owner}</div>
          {p.description && <div className="mt-1 text-sm text-zinc-300">{p.description}</div>}
        </div>

        <div className="shrink-0 flex flex-wrap items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}
