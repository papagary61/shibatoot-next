-- CreateTable
CREATE TABLE "Winner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wallet" TEXT NOT NULL,
    "amountUsd" REAL NOT NULL,
    "prizePct" REAL NOT NULL,
    "txHash" TEXT,
    "drawAt" DATETIME NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT
);

-- CreateIndex
CREATE INDEX "idx_winner_drawAt" ON "Winner"("drawAt");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_week_wallet" ON "Winner"("weekStart", "wallet");
