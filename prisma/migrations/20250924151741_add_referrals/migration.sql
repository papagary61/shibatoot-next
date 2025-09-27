-- CreateTable
CREATE TABLE "ReferralClick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "landingPath" TEXT
);

-- CreateTable
CREATE TABLE "ReferralBind" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT NOT NULL,
    "referred" TEXT NOT NULL,
    "sourceClickId" TEXT
);

-- CreateIndex
CREATE INDEX "idx_refclick_referrer" ON "ReferralClick"("referrer");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralBind_referred_key" ON "ReferralBind"("referred");

-- CreateIndex
CREATE INDEX "idx_refbind_referrer" ON "ReferralBind"("referrer");
