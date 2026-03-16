import { Prisma } from "@/generated/prisma";
import { AnalyticsTable } from "@/components/dashboard/analytics-table";
import { AdminPanel } from "@/components/dashboard/admin-panel";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GoalTracker } from "@/components/dashboard/goal-tracker";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TradeEntryForm } from "@/components/dashboard/trade-entry-form";
import { TradeTableClient } from "@/components/dashboard/trade-table-client";
import { type PlainTrade } from "@/components/dashboard/trade-table";
import { buildDirectionAnalytics, buildProfitFactor } from "@/lib/analytics";
import { isAdminEmail } from "@/lib/auth/admin";
import { requireCurrentSession } from "@/lib/auth/session";
import { buildMonthCalendar, resolveMonth } from "@/lib/calendar";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function formatCurrency(value: Prisma.Decimal | number) {
  const amount = typeof value === "number" ? value : Number(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

type DashboardPageProps = {
  searchParams?: Promise<{
    month?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requireCurrentSession();
  const isAdmin = isAdminEmail(session.email);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const monthStart = resolveMonth(resolvedSearchParams?.month);
  const monthEndExclusive = new Date(
    Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1),
  );

  const [phaseSettings, tradeAggregate, totalTrades, winningTrades, trades, monthTrades, totalUsers, totalPlatformTrades, totalPhaseSettings, users] = await Promise.all([
    prisma.phaseSettings.findUnique({
      where: {
        userId_phase: {
          userId: session.id,
          phase: session.selectedPhase,
        },
      },
    }),
    prisma.trade.aggregate({
      where: {
        userId: session.id,
        phase: session.selectedPhase,
      },
      _sum: {
        pnl: true,
      },
      _avg: {
        rr: true,
      },
    }),
    prisma.trade.count({
      where: {
        userId: session.id,
        phase: session.selectedPhase,
      },
    }),
    prisma.trade.count({
      where: {
        userId: session.id,
        phase: session.selectedPhase,
        pnl: {
          gt: 0,
        },
      },
    }),
    prisma.trade.findMany({
      where: {
        userId: session.id,
        phase: session.selectedPhase,
      },
      orderBy: [
        { date: "desc" },
        { tradeNumber: "desc" },
      ],
    }),
    prisma.trade.findMany({
      where: {
        userId: session.id,
        phase: session.selectedPhase,
        date: {
          gte: monthStart,
          lt: monthEndExclusive,
        },
      },
      orderBy: [{ date: "asc" }, { tradeNumber: "asc" }],
    }),
    isAdmin ? prisma.user.count() : Promise.resolve(0),
    isAdmin ? prisma.trade.count() : Promise.resolve(0),
    isAdmin ? prisma.phaseSettings.count() : Promise.resolve(0),
    isAdmin
      ? prisma.user.findMany({
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            _count: {
              select: {
                trades: true,
                phaseSettings: true,
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const totalPnl = Number(tradeAggregate._sum.pnl ?? 0);
  const averageRr = Number(tradeAggregate._avg.rr ?? 0);
  const startingBalance = Number(phaseSettings?.startingBalance ?? 0);
  const goal = Number(phaseSettings?.goal ?? 0);
  const phaseTargetPercent = Number(phaseSettings?.phaseTargetPercent ?? 0);
  const currentBalance = startingBalance + totalPnl;
  const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;
  const phaseTargetAmount = startingBalance * (phaseTargetPercent / 100);
  const remainingToGoal = Math.max(goal - totalPnl, 0);
  const remainingToPhaseTarget = Math.max(phaseTargetAmount - totalPnl, 0);
  const longAnalytics = buildDirectionAnalytics(trades, "LONG");
  const shortAnalytics = buildDirectionAnalytics(trades, "SHORT");
  const calendar = buildMonthCalendar(monthTrades, monthStart);
  const monthWinningTrades = monthTrades.filter((trade) => Number(trade.pnl) > 0).length;
  const monthWinRate = monthTrades.length === 0 ? 0 : (monthWinningTrades / monthTrades.length) * 100;
  const monthProfitFactor = buildProfitFactor(monthTrades);
  const preferredPair = "BTCUSDT";
  const plainTrades: PlainTrade[] = trades.map((trade) => ({
    id: trade.id,
    tradeNumber: trade.tradeNumber,
    date: trade.date.toISOString(),
    pair: trade.pair,
    direction: trade.direction,
    pnl: Number(trade.pnl),
    setupCategory: trade.setupCategory,
    bias: trade.bias,
    rr: trade.rr ? Number(trade.rr) : null,
    notes: trade.notes,
    summarizedReasons: trade.summarizedReasons,
    reasonStructure: trade.reasonStructure as PlainTrade["reasonStructure"],
  }));
  const adminUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    tradeCount: user._count.trades,
    phaseSettingsCount: user._count.phaseSettings,
  }));

  return (
    <main className="app-shell px-5 py-5 md:px-8 md:py-8">
      <section className="page-frame flex flex-col gap-6">
        <DashboardHeader
          email={session.email}
          name={session.name}
          selectedPhase={session.selectedPhase}
        />

        <SectionTabs
          ledgerContent={
            <>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <SummaryCard
                  label="Starting Balance"
                  value={formatCurrency(startingBalance)}
                  detail={`Phase target ${formatPercent(phaseTargetPercent)}`}
                />
                <SummaryCard
                  label="Current Balance"
                  value={formatCurrency(currentBalance)}
                  tone={totalPnl >= 0 ? "positive" : "negative"}
                  detail={`${totalTrades} trades in selected phase`}
                />
                <SummaryCard
                  label="Total PnL"
                  value={formatCurrency(totalPnl)}
                  tone={totalPnl >= 0 ? "positive" : "negative"}
                  detail={`Win rate ${formatPercent(winRate)}`}
                />
                <SummaryCard
                  label="Average R:R"
                  value={averageRr ? averageRr.toFixed(2) : "0.00"}
                  detail={`Goal remaining ${formatCurrency(remainingToGoal)}`}
                />
                <SummaryCard
                  label="Phase Target Left"
                  value={formatCurrency(remainingToPhaseTarget)}
                  detail={`Target amount ${formatCurrency(phaseTargetAmount)}`}
                />
              </section>

              <div className="mt-4">
                <TradeTableClient trades={plainTrades} />
              </div>
            </>
          }
          reviewContent={
            <>
              <GoalTracker
                startingBalance={startingBalance}
                currentGoal={goal}
                currentPnl={totalPnl}
                phaseTargetLeft={remainingToPhaseTarget}
              />

              <section className="mt-6 grid gap-4 xl:grid-cols-2">
                <AnalyticsTable analytics={longAnalytics} />
                <AnalyticsTable analytics={shortAnalytics} />
              </section>
            </>
          }
          calendarContent={
            <CalendarView
              calendar={calendar}
              monthWinRate={monthWinRate}
              monthProfitFactor={monthProfitFactor}
            />
          }
          journalContent={<TradeEntryForm selectedPhase={session.selectedPhase} preferredPair={preferredPair} />}
          adminContent={
            isAdmin ? (
              <AdminPanel
                currentUserId={session.id}
                totalUsers={totalUsers}
                totalTrades={totalPlatformTrades}
                totalPhaseSettings={totalPhaseSettings}
                users={adminUsers}
              />
            ) : undefined
          }
        />
      </section>
    </main>
  );
}
