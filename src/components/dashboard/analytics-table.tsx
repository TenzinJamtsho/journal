import type { DirectionAnalytics } from "@/lib/analytics";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

type AnalyticsTableProps = {
  analytics: DirectionAnalytics;
};

export function AnalyticsTable({ analytics }: AnalyticsTableProps) {
  const rows = [
    ["Total Trades", analytics.totalTrades.toString()],
    ["Wins", analytics.wins.toString()],
    ["Losses", analytics.losses.toString()],
    ["Win %", formatPercent(analytics.winRate)],
    ["Average Win", formatCurrency(analytics.averageWin)],
    ["Average Loss", formatCurrency(analytics.averageLoss)],
    ["Average R:R", analytics.averageRr.toFixed(2)],
  ];

  return (
    <article className="panel p-5">
      <div className="field-label">
        {analytics.direction === "LONG" ? "Long analytics" : "Short analytics"}
      </div>
      <div className="mt-3 font-serif text-3xl leading-none tracking-tight text-[var(--text-primary)]">
        {analytics.direction === "LONG" ? "Long" : "Short"}
      </div>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={`${analytics.direction}-${label}`} className="card-soft flex items-center justify-between px-4 py-3">
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
