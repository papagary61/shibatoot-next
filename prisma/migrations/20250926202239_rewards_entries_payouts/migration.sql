-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wallet" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "referrer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WeeklySeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStart" DATETIME NOT NULL,
    "commit" TEXT NOT NULL,
    "reveal" TEXT,
    "committedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revealedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "winnerId" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "amountToken" REAL NOT NULL,
    "txHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Entry_weekStart_idx" ON "Entry"("weekStart");

-- CreateIndex
CREATE INDEX "Entry_wallet_idx" ON "Entry"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_week_wallet_source" ON "Entry"("wallet", "weekStart", "source");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySeed_weekStart_key" ON "WeeklySeed"("weekStart");
