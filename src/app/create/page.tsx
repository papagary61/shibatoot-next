'use client';
import React, { useState } from "react";
import { useEthereum } from "@/hooks/useEthereum";

export default function CreateProjectPage() {
  const { account, connect } = useEthereum();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!account) {
      await connect();
      if (!account) return;
    }
    if (!name.trim()) {
      setMsg("Please enter a project name.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          owner: account,
          description: description.trim() || null,
          website: website.trim() || null,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to create");
      setCreatedId(j.project.id);
      setMsg("Submitted! Our team will review shortly.");
      setName(""); setWebsite(""); setDescription("");
    } catch (err: any) {
      setMsg(err?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 py-10">
        <h1 className="text-3xl font-extrabold">Create a Project</h1>
        <p className="text-zinc-400 mt-2">
          Submit your token/presale details for review. Once approved, your project gets a public page and can join our launchpad programs.
        </p>

        <form onSubmit={submitForm} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Project Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
              placeholder="ShibaToot Rockets"
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Website (optional)</label>
            <input
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
              placeholder="https://example.com"
              maxLength={256}
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm min-h-[120px]"
              placeholder="What are you building? Tokenomics? Roadmap?"
              maxLength={4000}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold px-5 py-2 disabled:opacity-60"
            >
              {busy ? "Submitting..." : account ? "Submit for Review" : "Connect & Submit"}
            </button>
            {createdId ? (
              <a
                href={`/project/${createdId}`}
                className="text-emerald-300 underline underline-offset-4"
              >
                View your project page →
              </a>
            ) : null}
          </div>

          {msg ? <div className="text-emerald-300">{msg}</div> : null}
        </form>
      </div>
    </div>
  );
}
