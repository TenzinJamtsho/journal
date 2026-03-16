"use client";

import { useActionState, useState } from "react";

import { type UpdateTradeFormState, updateTradeAction } from "@/app/dashboard/actions";
import { TradeFormFields, type TradeFormDefaults } from "@/components/dashboard/trade-form-fields";

const initialState: UpdateTradeFormState = {};

export type EditableTrade = {
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
  reasonStructure: Record<"4H" | "1H" | "15M" | "5M", { bias: string; confluences: string[] }>;
};

type EditTradeFormProps = {
  trade: EditableTrade;
};

export function EditTradeForm({ trade }: EditTradeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(updateTradeAction, initialState);

  const defaults: TradeFormDefaults = {
    date: trade.date,
    pair: trade.pair,
    direction: trade.direction,
    pnl: String(trade.pnl),
    rr: trade.rr == null ? "" : String(trade.rr),
    setupCategory: trade.setupCategory,
    bias: trade.bias,
    notes: trade.notes ?? "",
    reasons: trade.reasonStructure,
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="action-secondary px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em]"
      >
        {isOpen ? "Close" : "Edit"}
      </button>

      {isOpen ? (
        <div className="panel w-[24rem] max-w-[80vw] rounded-[1.5rem] p-4">
          <div className="field-label">Edit trade #{trade.tradeNumber}</div>

          <form action={formAction} className="mt-4 space-y-3">
            <input type="hidden" name="tradeId" value={trade.id} />
            <TradeFormFields defaults={defaults} submitLabel="Save Edit" />

            {state.error ? (
              <p className="rounded-[0.9rem] border border-[color:color-mix(in_srgb,var(--negative)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-3 py-2 text-sm text-[var(--negative)]">
                {state.error}
              </p>
            ) : null}
            {state.success ? (
              <p className="rounded-[0.9rem] border border-[color:color-mix(in_srgb,var(--positive)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--positive)_12%,transparent)] px-3 py-2 text-sm text-[var(--positive)]">
                {state.success}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}
    </div>
  );
}
