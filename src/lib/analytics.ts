import { type Direction, type Trade } from "@/generated/prisma";

export type DirectionAnalytics = {
  direction: Direction;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  averageRr: number;
};

function toNumber(value: { toString(): string } | number | null | undefined) {
  if (value == null) {
    return 0;
  }

  return typeof value === "number" ? value : Number(value);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildDirectionAnalytics(
  trades: Trade[],
  direction: Direction,
): DirectionAnalytics {
  const filteredTrades = trades.filter((trade) => trade.direction === direction);
  const wins = filteredTrades.filter((trade) => toNumber(trade.pnl) > 0);
  const losses = filteredTrades.filter((trade) => toNumber(trade.pnl) < 0);

  return {
    direction,
    totalTrades: filteredTrades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: filteredTrades.length === 0 ? 0 : (wins.length / filteredTrades.length) * 100,
    averageWin: average(wins.map((trade) => toNumber(trade.pnl))),
    averageLoss: average(losses.map((trade) => toNumber(trade.pnl))),
    averageRr: average(
      filteredTrades
        .map((trade) => toNumber(trade.rr))
        .filter((value) => value !== 0),
    ),
  };
}

export function buildProfitFactor(trades: Trade[]) {
  const grossProfit = trades
    .filter((trade) => toNumber(trade.pnl) > 0)
    .reduce((sum, trade) => sum + toNumber(trade.pnl), 0);
  const grossLoss = Math.abs(
    trades
      .filter((trade) => toNumber(trade.pnl) < 0)
      .reduce((sum, trade) => sum + toNumber(trade.pnl), 0),
  );

  if (grossLoss === 0) {
    return grossProfit > 0 ? grossProfit : 0;
  }

  return grossProfit / grossLoss;
}
