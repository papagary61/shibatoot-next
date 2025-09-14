// src/app/page.tsx
import Connect from "@/components/Connect";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">ShibaToot — Dev Preview</h1>
      <Connect />
      <p className="opacity-70 text-sm">
        Chain: {process.env.NEXT_PUBLIC_CHAIN_ID === '8453' ? 'Base' : 'Base Sepolia (test)'}
      </p>
    </main>
  );
}
