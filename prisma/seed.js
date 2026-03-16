const bcrypt = require("bcryptjs");
const {
  PrismaClient,
  Phase,
  Direction,
  SetupCategory,
  Bias,
  Prisma,
} = require("@prisma/client");

const prisma = new PrismaClient();

const demoEmail = "tnznjamtsho@gmail.com";
const demoPassword = "password123";

function decimal(value) {
  return new Prisma.Decimal(value);
}

function reasonStructure(data) {
  return data;
}

async function main() {
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Tnzin Jamtsho",
      passwordHash,
      selectedPhase: Phase.PHASE_1,
    },
    create: {
      email: demoEmail,
      name: "Tnzin Jamtsho",
      passwordHash,
      selectedPhase: Phase.PHASE_1,
    },
  });

  const settings = [
    {
      phase: Phase.PHASE_1,
      startingBalance: decimal("10000"),
      goal: decimal("800"),
      phaseTargetPercent: decimal("8"),
    },
    {
      phase: Phase.PHASE_2,
      startingBalance: decimal("10000"),
      goal: decimal("500"),
      phaseTargetPercent: decimal("5"),
    },
    {
      phase: Phase.LIVE,
      startingBalance: decimal("10000"),
      goal: decimal("1000"),
      phaseTargetPercent: decimal("10"),
    },
  ];

  for (const setting of settings) {
    await prisma.phaseSettings.upsert({
      where: {
        userId_phase: {
          userId: user.id,
          phase: setting.phase,
        },
      },
      update: setting,
      create: {
        ...setting,
        userId: user.id,
      },
    });
  }

  await prisma.trade.deleteMany({
    where: {
      userId: user.id,
    },
  });

  const trades = [
    {
      tradeNumber: 1,
      date: new Date("2026-02-02T10:15:00.000Z"),
      pair: "BTCUSDT",
      direction: Direction.LONG,
      pnl: decimal("125.50"),
      setupCategory: SetupCategory.CONT,
      bias: Bias.BULLISH,
      rr: decimal("2.50"),
      notes: "London continuation after a liquidity sweep and 1H BOS.",
      phase: Phase.PHASE_1,
      summarizedReasons:
        "4H: Bullish, FVG, Discount | 1H: Bullish, BOS, FVG | 15M: Bullish, Mitigation Block | 5M: BOS, FVG",
      reasonStructure: reasonStructure({
        "4H": { bias: "Bullish", confluences: ["FVG", "Discount"] },
        "1H": { bias: "Bullish", confluences: ["BOS", "FVG"] },
        "15M": { bias: "Bullish", confluences: ["Mitigation Block"] },
        "5M": { bias: "Bullish", confluences: ["BOS", "FVG"] },
      }),
    },
    {
      tradeNumber: 2,
      date: new Date("2026-02-04T09:30:00.000Z"),
      pair: "GBPUSD",
      direction: Direction.SHORT,
      pnl: decimal("-62.00"),
      setupCategory: SetupCategory.REVERSAL,
      bias: Bias.BEARISH,
      rr: decimal("1.20"),
      notes: "Counter move faded too early after session open.",
      phase: Phase.PHASE_1,
      summarizedReasons:
        "4H: Bearish, Premium | 1H: Bearish, CHOCH | 15M: Bearish, OB | 5M: Bearish, Session Setup",
      reasonStructure: reasonStructure({
        "4H": { bias: "Bearish", confluences: ["Premium"] },
        "1H": { bias: "Bearish", confluences: ["CHOCH"] },
        "15M": { bias: "Bearish", confluences: ["OB"] },
        "5M": { bias: "Bearish", confluences: ["Session Setup"] },
      }),
    },
    {
      tradeNumber: 1,
      date: new Date("2026-02-10T12:45:00.000Z"),
      pair: "XAUUSD",
      direction: Direction.LONG,
      pnl: decimal("210.00"),
      setupCategory: SetupCategory.CONT,
      bias: Bias.BULLISH,
      rr: decimal("3.10"),
      notes: "Phase 2 breakout continuation with aligned higher timeframe bias.",
      phase: Phase.PHASE_2,
      summarizedReasons:
        "4H: Bullish, Trend Continuation | 1H: Bullish, BOS | 15M: Bullish, OB, Discount | 5M: Bullish, FVG",
      reasonStructure: reasonStructure({
        "4H": { bias: "Bullish", confluences: ["Trend Continuation"] },
        "1H": { bias: "Bullish", confluences: ["BOS"] },
        "15M": { bias: "Bullish", confluences: ["OB", "Discount"] },
        "5M": { bias: "Bullish", confluences: ["FVG"] },
      }),
    },
    {
      tradeNumber: 2,
      date: new Date("2026-02-18T14:10:00.000Z"),
      pair: "NAS100",
      direction: Direction.SHORT,
      pnl: decimal("88.75"),
      setupCategory: SetupCategory.REVERSAL,
      bias: Bias.BEARISH,
      rr: decimal("1.80"),
      notes: "Clean reversal from premium after multiple failed highs.",
      phase: Phase.PHASE_2,
      summarizedReasons:
        "4H: Bearish, Premium | 1H: Bearish, Liquidity Sweep | 15M: Bearish, Breaker | 5M: Bearish, BOS",
      reasonStructure: reasonStructure({
        "4H": { bias: "Bearish", confluences: ["Premium"] },
        "1H": { bias: "Bearish", confluences: ["Liquidity Sweep"] },
        "15M": { bias: "Bearish", confluences: ["Breaker"] },
        "5M": { bias: "Bearish", confluences: ["BOS"] },
      }),
    },
    {
      tradeNumber: 1,
      date: new Date("2026-03-03T08:20:00.000Z"),
      pair: "US30",
      direction: Direction.LONG,
      pnl: decimal("340.00"),
      setupCategory: SetupCategory.CONT,
      bias: Bias.BULLISH,
      rr: decimal("2.90"),
      notes: "Live account trend continuation during New York session.",
      phase: Phase.LIVE,
      summarizedReasons:
        "4H: Bullish, Discount | 1H: Bullish, FVG, BOS | 15M: Bullish, Session Setup | 5M: Bullish, Trend Continuation",
      reasonStructure: reasonStructure({
        "4H": { bias: "Bullish", confluences: ["Discount"] },
        "1H": { bias: "Bullish", confluences: ["FVG", "BOS"] },
        "15M": { bias: "Bullish", confluences: ["Session Setup"] },
        "5M": { bias: "Bullish", confluences: ["Trend Continuation"] },
      }),
    },
    {
      tradeNumber: 2,
      date: new Date("2026-03-06T15:35:00.000Z"),
      pair: "USDJPY",
      direction: Direction.SHORT,
      pnl: decimal("-95.25"),
      setupCategory: SetupCategory.REVERSAL,
      bias: Bias.RANGE,
      rr: decimal("0.90"),
      notes: "Live short taken inside range without full confirmation.",
      phase: Phase.LIVE,
      summarizedReasons:
        "4H: Range, Premium | 1H: Bearish, CHOCH | 15M: Range, OB | 5M: Bearish, Breaker",
      reasonStructure: reasonStructure({
        "4H": { bias: "Range", confluences: ["Premium"] },
        "1H": { bias: "Bearish", confluences: ["CHOCH"] },
        "15M": { bias: "Range", confluences: ["OB"] },
        "5M": { bias: "Bearish", confluences: ["Breaker"] },
      }),
    },
  ];

  await prisma.trade.createMany({
    data: trades.map((trade) => ({
      ...trade,
      userId: user.id,
    })),
  });

  console.log("Seeded demo user:", demoEmail);
  console.log("Password:", demoPassword);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
