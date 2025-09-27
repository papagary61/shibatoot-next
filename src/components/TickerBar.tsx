'use client'

import TopTicker from '@/components/TopTicker'

export default function TickerBar() {
  const top10 = [
    { name:'NovaCats',  symbol:'NOVA',  change: 12.4 },
    { name:'OrbWeaver', symbol:'WEB',   change: -3.2 },
    { name:'IonDrive',  symbol:'ION',   change: 5.8 },
    { name:'SkyForge',  symbol:'SKY',   change: 2.1 },
    { name:'DeltaRun',  symbol:'DLT',   change: -1.5 },
    { name:'ShibaToot', symbol:'SHBT',  change: 9.9 },
    { name:'LilPepe',   symbol:'LPEPE', change: 4.0 },
    { name:'AstroMint', symbol:'AST',   change: 0.8 },
    { name:'NeonFlux',  symbol:'NFLX',  change: -0.6 },
    { name:'BaseZen',   symbol:'BZEN',  change: 3.0 },
  ]

  return (
    <div className="fixed top-16 left-[3rem] right-0 z-[38] h-10 flex items-center bg-black/25 backdrop-blur-sm border-b border-white/10 px-4">
      <TopTicker items={top10} />
    </div>
  )
}
