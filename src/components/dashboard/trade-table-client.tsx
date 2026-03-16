"use client";

import { useMemo, useState } from "react";

import { TradeTable, type PlainTrade } from "@/components/dashboard/trade-table";

type TradeTableClientProps = {
  trades: PlainTrade[];
};

export function TradeTableClient({ trades }: TradeTableClientProps) {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<"ALL" | "LONG" | "SHORT">("ALL");
  const [setupCategory, setSetupCategory] = useState<"ALL" | "CONT" | "REVERSAL">("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      if (direction !== "ALL" && trade.direction !== direction) {
        return false;
      }

      if (setupCategory !== "ALL" && trade.setupCategory !== setupCategory) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const normalizedQuery = query.trim().toLowerCase();
      const haystack = [
        trade.tradeNumber.toString(),
        trade.pair,
        trade.summarizedReasons,
        trade.notes ?? "",
        trade.bias,
        trade.direction,
        trade.setupCategory,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [direction, query, setupCategory, trades]);

  const pageSize = 7;
  const totalPages = Math.max(Math.ceil(filteredTrades.length / pageSize), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleTrades = filteredTrades.slice(startIndex, startIndex + pageSize);
  const visibleStart = filteredTrades.length === 0 ? 0 : startIndex + 1;
  const visibleEnd = startIndex + visibleTrades.length;

  function escapeCsv(value: string | number | null) {
    const normalized = value == null ? "" : String(value);
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  function downloadLedgerCsv() {
    const headers = [
      "Trade No",
      "Date",
      "Pair",
      "Direction",
      "PnL",
      "Setup",
      "Bias",
      "R:R",
      "Reasons",
      "Notes",
    ];

    const rows = filteredTrades.map((trade) => [
      trade.tradeNumber,
      trade.date.slice(0, 10),
      trade.pair,
      trade.direction,
      trade.pnl.toFixed(2),
      trade.setupCategory,
      trade.bias,
      trade.rr == null ? "" : trade.rr.toFixed(2),
      trade.summarizedReasons,
      trade.notes ?? "",
    ]);

    const csv = [
      headers.map((header) => escapeCsv(header)).join(","),
      ...rows.map((row) => row.map((cell) => escapeCsv(cell)).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `master-ledger-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <TradeTable
      trades={visibleTrades}
      totalTrades={filteredTrades.length}
      visibleTradesLabel={`${visibleStart}-${visibleEnd}`}
      headerActions={
        <button
          type="button"
          onClick={downloadLedgerCsv}
          className="action-secondary inline-flex h-10 items-center px-4 text-sm font-medium"
        >
          Download CSV
        </button>
      }
      footerContent={
        totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={safeCurrentPage === 1}
              className="action-secondary px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-sm text-[var(--text-muted)]">
              Page {safeCurrentPage} of {totalPages}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
              className="action-secondary px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null
      }
      isFilterOpen={isFilterOpen}
      onToggleFilters={() => setIsFilterOpen((current) => !current)}
      filterControls={
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <label className="flex flex-col gap-2">
          <span className="field-label">Search</span>
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search trade no, reasons, notes..."
            className="field-input px-4 text-sm placeholder:text-[var(--text-subtle)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="field-label">Direction</span>
          <select
            value={direction}
            onChange={(event) => {
              setDirection(event.target.value as typeof direction);
              setCurrentPage(1);
            }}
            className="field-input px-4 text-sm"
          >
            <option value="ALL">All</option>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="field-label">Setup</span>
          <select
            value={setupCategory}
            onChange={(event) => {
              setSetupCategory(event.target.value as typeof setupCategory);
              setCurrentPage(1);
            }}
            className="field-input px-4 text-sm"
          >
            <option value="ALL">All</option>
            <option value="CONT">Cont</option>
            <option value="REVERSAL">Reversal</option>
          </select>
        </label>
        </div>
      }
    />
  );
}
