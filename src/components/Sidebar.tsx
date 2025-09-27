'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string; emoji: string; newTab?: boolean };

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: 'Launchpad',
    items: [
      { href: '/',            label: 'Home',             emoji: '🏠' },
      { href: '/launchpad',   label: 'Launchpad',        emoji: '🚀' },
      { href: '/create',      label: 'Create Project',   emoji: '🛠️' },
      { href: '/rewards',     label: 'Community Reward', emoji: '🎁' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { href: '/#trade',       label: 'Trade',           emoji: '💱' },
      { href: '/#list',        label: 'List Token',      emoji: '🧾' },
      { href: '/indexing',     label: 'Indexing Concierge', emoji: '📇' },
      { href: '/referrals',    label: 'Referrals',       emoji: '🤝' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { href: '/admin/review',  label: 'Review Queue',  emoji: '🛡️' },
      { href: '/admin/rewards', label: 'Rewards',       emoji: '🏆' },
    ],
  },
];

function NavLink({ href, label, emoji, active, newTab }: Item & { active: boolean }) {
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      className={[
        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors',
        active ? 'bg-white/10 text-white' : 'text-zinc-300 hover:text-white hover:bg-white/5',
      ].join(' ')}
    >
      <span className="text-lg">{emoji}</span>
      <span className="truncate">{label}</span>
    </a>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-3 top-[88px] z-50 inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white md:hidden"
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <aside
        className={[
          'fixed z-40 md:hidden',
          'top-[120px]',
          'h-[calc(100vh-120px)] w-64',
          'border-r border-white/10 bg-[#0b0b0e]/95 backdrop-blur',
          'transition-transform',
          open ? 'translate-x-0' : '-translate-x-[110%]',
        ].join(' ')}
      >
        <nav className="h-full overflow-y-auto px-3 py-4">
          {SECTIONS.map((s) => (
            <div key={s.title} className="mt-4 first:mt-0">
              <div className="px-2 text-[11px] uppercase tracking-widest text-zinc-500">{s.title}</div>
              <div className="mt-2 space-y-1">
                {s.items.map((it) => (
                  <NavLink key={it.href} {...it} active={isActive(it.href)} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <aside
        className={[
          'hidden md:block',
          'fixed left-0',
          'top-[120px]',
          'h-[calc(100vh-120px)] w-64 overflow-y-auto',
          'border-r border-white/10 bg-[#0b0b0e]',
        ].join(' ')}
      >
        <nav className="px-3 py-4">
          {SECTIONS.map((s) => (
            <div key={s.title} className="mt-4 first:mt-0">
              <div className="px-2 text-[11px] uppercase tracking-widest text-zinc-500">{s.title}</div>
              <div className="mt-2 space-y-1">
                {s.items.map((it) => (
                  <NavLink key={it.href} {...it} active={isActive(it.href)} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
