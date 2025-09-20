import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'ShibaToot',
  description: 'Space-themed launchpad vibes on Base',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-space text-zinc-100 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
