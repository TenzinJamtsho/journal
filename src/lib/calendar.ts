import { type Trade } from "@/generated/prisma";

type CalendarDay = {
  isoDate: string;
  dayOfMonth: number;
  inCurrentMonth: boolean;
  tradeCount: number;
  dailyPnl: number;
};

type CalendarWeek = {
  days: CalendarDay[];
  weeklyTradeCount: number;
  weeklyPnl: number;
};

export type MonthCalendar = {
  monthLabel: string;
  monthStart: Date;
  monthEnd: Date;
  previousMonth: string;
  nextMonth: string;
  monthTradeCount: number;
  monthPnl: number;
  weeks: CalendarWeek[];
};

function toMonthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function resolveMonth(monthParam?: string) {
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [year, month] = monthParam.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, 1));
  }

  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function buildMonthCalendar(trades: Trade[], monthStart: Date): MonthCalendar {
  const currentMonthStart = new Date(
    Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), 1),
  );
  const currentMonthEnd = new Date(
    Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0),
  );
  const gridStart = new Date(currentMonthStart);
  gridStart.setUTCDate(currentMonthStart.getUTCDate() - currentMonthStart.getUTCDay());
  const gridEnd = new Date(currentMonthEnd);
  gridEnd.setUTCDate(currentMonthEnd.getUTCDate() + (6 - currentMonthEnd.getUTCDay()));

  const tradeMap = new Map<string, { tradeCount: number; dailyPnl: number }>();
  for (const trade of trades) {
    const day = startOfUtcDay(trade.date).toISOString().slice(0, 10);
    const existing = tradeMap.get(day) ?? { tradeCount: 0, dailyPnl: 0 };
    existing.tradeCount += 1;
    existing.dailyPnl += Number(trade.pnl);
    tradeMap.set(day, existing);
  }

  const weeks: CalendarWeek[] = [];
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const days: CalendarDay[] = [];
    let weeklyTradeCount = 0;
    let weeklyPnl = 0;

    for (let index = 0; index < 7; index += 1) {
      const isoDate = cursor.toISOString().slice(0, 10);
      const tradeDay = tradeMap.get(isoDate) ?? { tradeCount: 0, dailyPnl: 0 };
      weeklyTradeCount += tradeDay.tradeCount;
      weeklyPnl += tradeDay.dailyPnl;

      days.push({
        isoDate,
        dayOfMonth: cursor.getUTCDate(),
        inCurrentMonth: cursor.getUTCMonth() === currentMonthStart.getUTCMonth(),
        tradeCount: tradeDay.tradeCount,
        dailyPnl: tradeDay.dailyPnl,
      });

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    weeks.push({ days, weeklyTradeCount, weeklyPnl });
  }

  const monthTradeCount = trades.length;
  const monthPnl = trades.reduce((sum, trade) => sum + Number(trade.pnl), 0);

  return {
    monthLabel: new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(currentMonthStart),
    monthStart: currentMonthStart,
    monthEnd: currentMonthEnd,
    previousMonth: toMonthKey(new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() - 1, 1))),
    nextMonth: toMonthKey(new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1))),
    monthTradeCount,
    monthPnl,
    weeks,
  };
}
