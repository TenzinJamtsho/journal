"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { MonthCalendar } from "@/lib/calendar";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

type CalendarViewProps = {
  calendar: MonthCalendar;
  monthWinRate: number;
  monthProfitFactor: number;
};

export function CalendarView({
  calendar,
  monthWinRate,
  monthProfitFactor,
}: CalendarViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = calendar.weeks.flatMap((week) => week.days);
  const weeklySummaries = calendar.weeks.map((week, index) => ({
    id: `${calendar.previousMonth}-${index}-${week.weeklyTradeCount}-${week.weeklyPnl}`,
    label: `Week ${index + 1}`,
    weeklyPnl: week.weeklyPnl,
    weeklyTradeCount: week.weeklyTradeCount,
  }));
  const monthStart = new Date(calendar.monthStartIso);
  const selectedMonth = `${monthStart.getUTCFullYear()}-${String(
    monthStart.getUTCMonth() + 1,
  ).padStart(2, "0")}`;

  function updateMonth(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    params.set("tab", "calendar");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function buildMonthHref(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    params.set("tab", "calendar");
    return `${pathname}?${params.toString()}`;
  }

  return (
    <section className="panel p-5 md:p-6">
      <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">Calendar</div>
          <h2 className="mt-2 font-serif text-[2.2rem] leading-none text-[var(--text-primary)]">
            {calendar.monthLabel}
          </h2>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
            <span>Month P/L {formatCurrency(calendar.monthPnl)}</span>
            <span>Trades {calendar.monthTradeCount}</span>
            <span>Win Rate {monthWinRate.toFixed(1)}%</span>
            <span>Profit Factor {monthProfitFactor.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="month" className="field-label">
              Select Month
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="month"
                name="month"
                type="month"
                defaultValue={selectedMonth}
                onChange={(event) => updateMonth(event.target.value)}
                className="field-input h-10 px-4 text-sm"
              />
              <Link
                href={buildMonthHref(calendar.previousMonth)}
                className="action-secondary inline-flex h-10 items-center px-4 text-sm font-medium"
              >
                Previous
              </Link>
              <Link
                href={buildMonthHref(calendar.nextMonth)}
                className="action-secondary inline-flex h-10 items-center px-4 text-sm font-medium"
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 card-soft p-4">
        <div className="field-label">Month Grid</div>
        <h3 className="mt-2 font-serif text-[1.8rem] leading-none text-[var(--text-primary)]">
          Trading calendar
        </h3>
        <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
          Positive days settle into green, negative days shift red, and quiet sessions stay neutral.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {weeklySummaries.map((week) => (
            <article key={week.id} className="border border-[var(--border-soft)] bg-[var(--surface-strong)] p-3">
              <div className="field-label">{week.label}</div>
              <div
                className={`mt-2 text-lg font-semibold ${
                  week.weeklyPnl > 0
                    ? "status-positive"
                    : week.weeklyPnl < 0
                      ? "status-negative"
                      : "status-neutral"
                }`}
              >
                {formatCurrency(week.weeklyPnl)}
              </div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                {week.weeklyTradeCount} {week.weeklyTradeCount === 1 ? "trade" : "trades"}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 hidden grid-cols-7 gap-px border border-[var(--border-soft)] bg-[var(--border-soft)] md:grid">
          {weekdays.map((weekday) => (
            <div
              key={weekday}
              className="bg-[var(--surface-strong)] px-3 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]"
            >
              {weekday}
            </div>
          ))}

          {days.map((day) => {
            const toneClass = !day.inCurrentMonth
              ? "bg-[var(--background)] text-[var(--text-subtle)] opacity-50"
              : day.dailyPnl > 0
                ? "bg-[color:color-mix(in_srgb,var(--positive)_18%,var(--surface-raised))]"
                : day.dailyPnl < 0
                  ? "bg-[color:color-mix(in_srgb,var(--negative)_16%,var(--surface-raised))]"
                  : "bg-[var(--surface-raised)]";

            return (
              <article key={day.isoDate} className={`min-h-[7.4rem] p-3 ${toneClass}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{day.dayOfMonth}</span>
                  <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                    {day.tradeCount} {day.tradeCount === 1 ? "trade" : "trades"}
                  </span>
                </div>
                <div className="mt-7 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                  Daily PnL
                </div>
                <div
                  className={`mt-2 text-sm font-semibold ${
                    day.dailyPnl > 0
                      ? "status-positive"
                      : day.dailyPnl < 0
                        ? "status-negative"
                        : "status-neutral"
                  }`}
                >
                  {formatCurrency(day.dailyPnl)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
