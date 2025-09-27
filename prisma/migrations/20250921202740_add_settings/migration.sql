-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "rewardSource" TEXT NOT NULL DEFAULT 'manual',
    "manualRewardUsd" REAL NOT NULL DEFAULT 10000,
    "lpUsd" REAL NOT NULL DEFAULT 1000000,
    "lpGrowthPct" REAL NOT NULL DEFAULT 0,
    "bonusThresholdUsd" REAL NOT NULL DEFAULT 1200000,
    "bonusGrowthTriggerPct" REAL NOT NULL DEFAULT 5,
    "useLiveLp" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
