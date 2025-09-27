'use client';
import { useEffect, useRef } from "react";

// Call once per session when ?ref= is present; and bind after wallet connects
export function useReferral({ wallet }: { wallet: string | null }) {
  const clickedRef = useRef(false);

  // 1) record click if URL has ?ref=
  useEffect(() => {
    if (clickedRef.current) return;
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref");
    if (ref) {
      clickedRef.current = true;
      fetch(`/api/referrals/click?ref=${encodeURIComponent(ref)}&lp=${encodeURIComponent(url.pathname)}`, {
        method: "POST",
      }).catch(() => {});
    }
  }, []);

  // 2) bind once wallet connects
  useEffect(() => {
    if (!wallet) return;
    fetch(`/api/referrals/bind`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ wallet }),
    }).catch(() => {});
  }, [wallet]);
}
