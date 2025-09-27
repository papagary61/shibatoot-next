'use client'

import { useEffect, useRef, useState } from 'react'

type Item = { name: string; symbol?: string; change?: number }

export default function TopTicker({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let x = 0
    let id = 0
    const speed = 0.5
    function tick() {
      if (!paused) {
        x -= speed
        if (Math.abs(x) > el.scrollWidth / 2) x = 0
        el.style.transform = `translateX(${x}px)`
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [paused])

  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={ref} className="flex gap-6 whitespace-nowrap will-change-transform">
        {doubled.map((p, i) => (
          <span
            key={`${p.name}-${i}`}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-sm text-zinc-200 hover:scale-[1.03] hover:bg-white/8 transition"
            title={p.name}
          >
            <strong className="text-white">{p.name}</strong>
            {p.symbol ? <span className="text-zinc-400"> · {p.symbol}</span> : null}
            {typeof p.change === 'number' && (
              <span className={p.change >= 0 ? 'text-emerald-400 ml-2' : 'text-rose-400 ml-2'}>
                {p.change >= 0 ? '↑' : '↓'} {Math.abs(p.change).toFixed(1)}%
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
