"use client";

import { useActionState } from "react";

import { type CreateTradeFormState, createTradeAction } from "@/app/dashboard/actions";
import {
  TradeFormFields,
  getInitialReasons,
  type TradeFormDefaults,
} from "@/components/dashboard/trade-form-fields";

type TradeEntryFormProps = {
  selectedPhase: "PHASE_1" | "PHASE_2" | "LIVE";
  preferredPair: string;
};

const initialState: CreateTradeFormState = {};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getDefaults(preferredPair: string): TradeFormDefaults {
  return {
    date: getTodayDate(),
    pair: preferredPair,
    direction: "LONG",
    pnl: "",
    rr: "",
    setupCategory: "CONT",
    bias: "BULLISH",
    notes: "",
    reasons: getInitialReasons(),
  };
}

export function TradeEntryForm({ selectedPhase, preferredPair }: TradeEntryFormProps) {
  const [state, formAction] = useActionState(createTradeAction, initialState);

  return (
    <section className="panel p-4 md:p-5">
      <div className="flex flex-col gap-3 border-b border-[var(--border-soft)] pb-4">
        <div className="eyebrow">Add Trade</div>
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="font-serif text-[2rem] leading-none text-[var(--text-primary)]">New entry</h2>
            <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
              New trades automatically save under {selectedPhase === "PHASE_1" ? "Phase 1" : selectedPhase === "PHASE_2" ? "Phase 2" : "Live"}.
            </p>
          </div>
          {state.error ? (
            <div className="border border-[color:color-mix(in_srgb,var(--negative)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-3 py-2 text-xs text-[var(--negative)]">
              {state.error}
            </div>
          ) : state.success ? (
            <div className="border border-[color:color-mix(in_srgb,var(--positive)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--positive)_12%,transparent)] px-3 py-2 text-xs text-[var(--positive)]">
              {state.success}
            </div>
          ) : null}
        </div>
      </div>

      <form key={state.successId ?? "initial"} action={formAction} className="mt-4 space-y-5">
        <TradeFormFields
          defaults={getDefaults(preferredPair)}
          submitLabel="Save Trade"
          selectedPhaseLabel={selectedPhase === "PHASE_1" ? "Phase 1" : selectedPhase === "PHASE_2" ? "Phase 2" : "Live"}
        />
      </form>
    </section>
  );
}
