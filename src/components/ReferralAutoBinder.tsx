'use client';
import React from "react";
import { useEthereum } from "@/hooks/useEthereum";
import { useReferral } from "@/hooks/useReferral";

export default function ReferralAutoBinder() {
  const { account } = useEthereum();
  useReferral({ wallet: account || null });
  return null;
}
