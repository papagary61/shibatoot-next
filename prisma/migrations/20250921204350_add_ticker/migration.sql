-- CreateTable
CREATE TABLE "TickerItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "changePct" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "TickerItem_symbol_idx" ON "TickerItem"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_ticker_rank" ON "TickerItem"("rank");
