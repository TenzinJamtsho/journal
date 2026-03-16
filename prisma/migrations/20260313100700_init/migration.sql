-- CreateEnum
CREATE TYPE "public"."Phase" AS ENUM ('PHASE_1', 'PHASE_2', 'LIVE');

-- CreateEnum
CREATE TYPE "public"."Direction" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "public"."SetupCategory" AS ENUM ('CONT', 'REVERSAL');

-- CreateEnum
CREATE TYPE "public"."Bias" AS ENUM ('BULLISH', 'BEARISH', 'RANGE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "selectedPhase" "public"."Phase" NOT NULL DEFAULT 'PHASE_1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trade" (
    "id" TEXT NOT NULL,
    "tradeNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "direction" "public"."Direction" NOT NULL,
    "pnl" DECIMAL(12,2) NOT NULL,
    "setupCategory" "public"."SetupCategory" NOT NULL,
    "bias" "public"."Bias" NOT NULL,
    "rr" DECIMAL(6,2),
    "notes" TEXT,
    "phase" "public"."Phase" NOT NULL,
    "summarizedReasons" TEXT NOT NULL,
    "reasonStructure" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhaseSettings" (
    "id" TEXT NOT NULL,
    "phase" "public"."Phase" NOT NULL,
    "startingBalance" DECIMAL(12,2) NOT NULL,
    "goal" DECIMAL(12,2) NOT NULL,
    "phaseTargetPercent" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PhaseSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Trade_userId_phase_date_idx" ON "public"."Trade"("userId", "phase", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Trade_userId_phase_tradeNumber_key" ON "public"."Trade"("userId", "phase", "tradeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PhaseSettings_userId_phase_key" ON "public"."PhaseSettings"("userId", "phase");

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhaseSettings" ADD CONSTRAINT "PhaseSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
