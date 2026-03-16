import type { ReactNode } from "react";

import { type ReasonEntry } from "@/components/dashboard/trade-form-fields";
import { DeleteTradeButton } from "@/components/dashboard/delete-trade-button";
import { EditTradeForm, type EditableTrade } from "@/components/dashboard/edit-trade-form";

export type PlainTrade = {
  id: string;
  tradeNumber: number;
  date: string;
  pair: string;
  direction: "LONG" | "SHORT";
  pnl: number;
  setupCategory: "CONT" | "REVERSAL";
  bias: "BULLISH" | "BEARISH" | "RANGE";
  rr: number | null;
  notes: string | null;
  summarizedReasons: string;
  reasonStructure: Record<"4H" | "1H" | "15M" | "5M", ReasonEntry>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

type TradeTableProps = {
  trades: PlainTrade[];
  totalTrades?: number;
  visibleTradesLabel?: string;
  filterControls?: ReactNode;
  isFilterOpen?: boolean;
  onToggleFilters?: () => void;
  footerContent?: ReactNode;
  headerActions?: ReactNode;
};

export function TradeTable({
  trades,
  totalTrades,
  visibleTradesLabel,
  filterControls,
  isFilterOpen = false,
  onToggleFilters,
  footerContent,
  headerActions,
}: TradeTableProps) {
  const editableTrades = new Map<string, EditableTrade>(
    trades.map((trade) => [
        trade.id,
      {
        id: trade.id,
        tradeNumber: trade.tradeNumber,
        date: trade.date.slice(0, 10),
        pair: trade.pair,
        direction: trade.direction,
        pnl: trade.pnl,
        setupCategory: trade.setupCategory,
        bias: trade.bias,
        rr: trade.rr,
        notes: trade.notes,
        summarizedReasons: trade.summarizedReasons,
        reasonStructure: trade.reasonStructure as EditableTrade["reasonStructure"],
      },
    ]),
  );

  return (
    <section className="panel p-5">
      <div className="flex items-end justify-between gap-4 border-b border-[var(--border-soft)] pb-5">
        <div>
          <div className="eyebrow">Trade Log</div>
          <h2 className="mt-2 font-serif text-[2.1rem] leading-none text-[var(--text-primary)]">Master trades ledger</h2>
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
          <div className="text-sm text-[var(--text-muted)]">
            Showing {visibleTradesLabel ?? `${trades.length}`} of {totalTrades ?? trades.length}
          </div>
          {onToggleFilters ? (
            <button
              type="button"
              onClick={onToggleFilters}
              className="action-secondary inline-flex h-10 w-10 items-center justify-center"
              aria-label="Toggle trade log filters"
              aria-expanded={isFilterOpen}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {filterControls ? (
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isFilterOpen ? "mt-5 max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="panel border-[var(--border-soft)] p-4">
            {filterControls}
          </div>
        </div>
      ) : null}

      {trades.length === 0 ? (
        <div className="mt-6 border border-dashed border-[var(--border-soft)] bg-[var(--surface-raised)] px-5 py-12 text-center text-sm text-[var(--text-muted)]">
          No trades in this phase yet. Save the first trade from the form above.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                <th className="px-3">Trade No</th>
                <th className="px-3">Date</th>
                <th className="px-3">Pair</th>
                <th className="px-3">Direction</th>
                <th className="px-3">PnL</th>
                <th className="px-3">Setup</th>
                <th className="px-3">Bias</th>
                <th className="px-3">R:R</th>
                <th className="px-3">Reasons</th>
                <th className="px-3">Notes</th>
                <th className="px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="bg-[var(--surface-raised)] text-sm text-[var(--text-primary)]">
                  <td className="px-3 py-4 font-semibold">{trade.tradeNumber}</td>
                  <td className="px-3 py-4 text-[var(--text-muted)]">{formatDate(trade.date)}</td>
                  <td className="px-3 py-4 font-medium text-[var(--text-primary)]">{trade.pair}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        trade.direction === "LONG"
                          ? "bg-[color:color-mix(in_srgb,var(--positive)_16%,transparent)] text-[var(--positive)]"
                          : "bg-[color:color-mix(in_srgb,var(--negative)_16%,transparent)] text-[var(--negative)]"
                      }`}
                    >
                      {trade.direction === "LONG" ? "Long" : "Short"}
                    </span>
                  </td>
                  <td className={`px-3 py-4 font-semibold ${trade.pnl >= 0 ? "status-positive" : "status-negative"}`}>
                    {formatCurrency(trade.pnl)}
                  </td>
                  <td className="px-3 py-4 text-[var(--text-muted)]">
                    {trade.setupCategory === "CONT" ? "Cont" : "Reversal"}
                  </td>
                  <td className="px-3 py-4 text-[var(--text-muted)]">
                    {trade.bias.charAt(0) + trade.bias.slice(1).toLowerCase()}
                  </td>
                  <td className="px-3 py-4 text-[var(--text-muted)]">
                    {trade.rr ? trade.rr.toFixed(2) : "-"}
                  </td>
                  <td className="max-w-sm px-3 py-4 text-[var(--text-muted)]">{trade.summarizedReasons}</td>
                  <td className="px-3 py-4 text-[var(--text-muted)]">
                    {trade.notes || "-"}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <EditTradeForm trade={editableTrades.get(trade.id)!} />
                      <DeleteTradeButton tradeId={trade.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {footerContent}
    </section>
  );
}
