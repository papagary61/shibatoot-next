'use client';
import React, { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  owner: string;
  description: string | null;
  website: string | null;
  createdAt: string;
};

function useAdminKey() {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    const k = sessionStorage.getItem("st_admin_key");
    if (k) setKey(k);
  }, []);
  const save = (k: string) => {
    sessionStorage.setItem("st_admin_key", k);
    setKey(k);
  };
  return { key, save };
}

async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(`HTTP ${res.status} ${res.statusText} — ${text.slice(0, 200)}`);
}

export default function AdminReviewPage() {
  const { key, save } = useAdminKey();
  const [items, setItems] = useState<Project[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    if (!key) return;
    setMsg(null);
    try {
      const res = await fetch("/api/admin/projects/pending", { headers: { "x-admin-key": key } });
      const j = await safeJson(res);
      if (!j.ok) throw new Error(j.error || "Failed to load");
      setItems(j.items);
    } catch (e: any) {
      setMsg(e.message || "Load error");
      setItems([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function approve(id: string) {
    if (!key) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}/approve`, {
        method: "POST",
        headers: { "x-admin-key": key, "content-type": "application/json" },
        body: JSON.stringify({ reviewer: "admin" }),
      });
      await safeJson(res);
      await load();
    } catch (e: any) {
      setMsg(e.message || "Approve failed");
    }
  }

  async function reject(id: string) {
    if (!key) return;
    const notes = prompt("Reason / notes (optional)") || "";
    try {
      const res = await fetch(`/api/admin/projects/${id}/reject`, {
        method: "POST",
        headers: { "x-admin-key": key, "content-type": "application/json" },
        body: JSON.stringify({ reviewer: "admin", notes }),
      });
      await safeJson(res);
      await load();
    } catch (e: any) {
      setMsg(e.message || "Reject failed");
    }
  }

  if (!key) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] text-white flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 w-[420px]">
          <h1 className="text-xl font-bold">Admin Sign-In</h1>
          <p className="text-zinc-400 text-sm mt-2">Enter your admin key to access the review queue.</p>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              const k = (new FormData(e.currentTarget).get("key") as string) || "";
              save(k);
            }}
          >
            <input
              name="key"
              type="password"
              placeholder="ADMIN_KEY"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
            />
            <button className="mt-3 w-full rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold px-5 py-2">
              Enter
            </button>
          </form>
          <p className="text-xs text-zinc-500 mt-3">Replace this with SIWE later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Review Queue</h1>
          <button
            onClick={() => { sessionStorage.removeItem("st_admin_key"); location.reload(); }}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-sm"
          >
            Sign out
          </button>
        </div>

        {msg ? <div className="mt-3 text-rose-300 break-all">{msg}</div> : null}

        <div className="mt-6 grid gap-4">
          {items.length === 0 ? (
            <div className="text-zinc-400">No pending items (or auth issue).</div>
          ) : items.map((p) => (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold">{p.name}</div>
                  <div className="text-zinc-400 text-sm mt-1">Owner: <span className="text-zinc-300">{p.owner}</span></div>
                  {p.website ? (
                    <div className="text-zinc-400 text-sm">
                      Website: <a className="text-emerald-300 underline" href={p.website} target="_blank">{p.website}</a>
                    </div>
                  ) : null}
                  <div className="text-zinc-400 text-sm mt-2 whitespace-pre-wrap">{p.description || "—"}</div>
                </div>
                <div className="shrink-0 flex flex-col gap-2">
                  <a
                    href={`/project/${p.id}`}
                    className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-sm text-center"
                    target="_blank"
                  >
                    Preview
                  </a>
                  <button
                    onClick={() => approve(p.id)}
                    className="rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold px-3 py-1.5 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(p.id)}
                    className="rounded-xl bg-rose-500/90 hover:bg-rose-400 text-black font-semibold px-3 py-1.5 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
