const ONE_DAY = 24 * 60 * 60 * 1000;

export function nextSaturdayUtcAt(hour = 0) {
  const now = new Date();
  const day = now.getUTCDay(); // 0..6 (Sun..Sat)
  const diff = (6 - day + 7) % 7 || 7; // days until next Saturday
  const next = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff, hour, 0, 0, 0
  ));
  return next;
}

export function computeRewards(opts: {
  lpUsd: number;
  lpGrowthPct: number;
  bonusThresholdUsd: number;
  bonusGrowthTriggerPct: number;
}) {
  const baselinePct = 1;
  const bonusPct = 2;

  const baselinePrize = (opts.lpUsd * baselinePct) / 100;
  const bonusActive =
    opts.lpUsd >= opts.bonusThresholdUsd && opts.lpGrowthPct >= opts.bonusGrowthTriggerPct;

  const weeklyPrize = bonusActive ? (opts.lpUsd * bonusPct) / 100 : baselinePrize;

  return { weeklyPrize, baselinePrize, bonusActive };
}
