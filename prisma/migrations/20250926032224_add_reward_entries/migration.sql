-- CreateTable
CREATE TABLE "RewardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wallet" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "RewardEntry_wallet_weekStart_idx" ON "RewardEntry"("wallet", "weekStart");

-- CreateIndex
CREATE INDEX "RewardEntry_weekStart_idx" ON "RewardEntry"("weekStart");
