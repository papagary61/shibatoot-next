import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShibaToot — Launch presales in minutes",
  description:
    "Create, run, and finalize token presales with auto-liquidity, locks, KYC/audit badges, and social buzz tools — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
