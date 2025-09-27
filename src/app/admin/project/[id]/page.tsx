import React from "react";

type Project = {
  id: string;
  name: string;
  owner: string;
  description: string | null;
  website: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt: string | null;
};

async function loadProject(id: string): Promise<Project | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/projects/${id}`, {
    // When deployed on Vercel, use absolute URL through NEXT_PUBLIC_SITE_URL.
    // In dev, relative also works; Next will resolve.
    cache: "no-store",
  }).catch(() => null as any);
  if (!res || !res.ok) return null;
  const j = await res.json();
  return j?.project ?? null;
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await loadProject(params.id);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] text-white flex items-center justify-center">
        <div className="text-zinc-400">Project not found.</div>
      </div>
    );
  }

  if (project.status !== "APPROVED") {
    return (
      <div className="min-h-screen bg-[#0b0b0e] text-white flex items-center justify-center">
        <div className="text-zinc-400">
          This project is not public yet. (Status: {project.status})
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 py-12">
        <div className="text-sm text-zinc-500">Project ID: {project.id}</div>
        <h1 className="text-3xl font-extrabold mt-1">{project.name}</h1>

        <div className="mt-3 text-zinc-400 text-sm">
          Owner: <span className="text-zinc-300">{project.owner}</span>
        </div>

        {project.website ? (
          <div className="mt-1 text-sm">
            <a href={project.website} target="_blank" className="text-emerald-300 underline">
              {project.website}
            </a>
          </div>
        ) : null}

        <div className="mt-5 whitespace-pre-wrap text-zinc-200">
          {project.description || "No description provided."}
        </div>

        {/* Future: badges, trust score, KYC/audit, presale widget, buy/swap, socials, etc. */}
      </div>
    </div>
  );
}
