import type { Metadata } from "next";
import "./globals.css";

import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ShibaToot",
  description: "Swiss Army Knife of Launchpads",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0e] text-white">
        {/* Sticky header (brand + nav + wallet) + ticker inside */}
        <Topbar />

        {/* Sidebar + content */}
        <Sidebar />
        <main
          className={[
            // leave space for sidebar on desktop
            "md:ml-64",
            // leave space under header+ticker so content doesn’t hide behind them
            "pt-[120px]",
            "min-h-screen",
          ].join(" ")}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
