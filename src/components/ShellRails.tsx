'use client'

import dynamic from 'next/dynamic'

const Sidebar   = dynamic(() => import('@/components/Sidebar'),   { ssr: false })
const Topbar    = dynamic(() => import('@/components/Topbar'),    { ssr: false })
const TickerBar = dynamic(() => import('@/components/TickerBar'), { ssr: false })

export default function ShellRails() {
  return (
    <>
      <Sidebar />
      <Topbar />
      <TickerBar />
    </>
  )
}
