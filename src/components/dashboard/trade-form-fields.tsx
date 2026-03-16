"use client";

import { useMemo, useState } from "react";

const timeframeTabs = ["4H", "1H", "15M", "5M"] as const;
const biasOptions = [
  { label: "Bullish", value: "Bullish" },
  { label: "Bearish", value: "Bearish" },
  { label: "Range", value: "Range" },
] as const;
const confluenceOptions = [
  "Liquidity Sweep",
  "FVG",
  "OB",
  "BOS",
  "CHOCH",
  "Breaker",
  "Mitigation Block",
  "Premium/Discount",
  "Discount",
  "Premium",
  "Session Setup",
  "Trend Continuation",
] as const;
const pairSuggestions = ["BTCUSDT", "ETHUSDT"] as const;

type Timeframe = (typeof timeframeTabs)[number];

export type ReasonEntry = {
  bias: string;
  confluences: string[];
};

export type TradeFormDefaults = {
  date: string;
  pair: string;
  direction: "LONG" | "SHORT";
  pnl: string;
  rr: string;
  setupCategory: "CONT" | "REVERSAL";
  bias: "BULLISH" | "BEARISH" | "RANGE";
  notes: string;
  reasons: Record<Timeframe, ReasonEntry>;
};

type TradeFormFieldsProps = {
  defaults: TradeFormDefaults;
  submitLabel: string;
  selectedPhaseLabel?: string;
};

export function getInitialReasons() {
  return timeframeTabs.reduce<Record<Timeframe, ReasonEntry>>((accumulator, timeframe) => {
    accumulator[timeframe] = {
      bias: "Bullish",
      confluences: [],
    };
    return accumulator;
  }, {} as Record<Timeframe, ReasonEntry>);
}

export function TradeFormFields({
  defaults,
  submitLabel,
  selectedPhaseLabel,
}: TradeFormFieldsProps) {
  const [activeTab, setActiveTab] = useState<Timeframe>("4H");
  const [customInput, setCustomInput] = useState("");
  const [reasons, setReasons] = useState<Record<Timeframe, ReasonEntry>>(defaults.reasons);
  const [customOptions, setCustomOptions] = useState<string[]>(() => {
    const knownOptions = new Set<string>(confluenceOptions);
    return Object.values(defaults.reasons)
      .flatMap((entry) => entry.confluences)
      .filter((confluence, index, values) => !knownOptions.has(confluence) && values.indexOf(confluence) === index);
  });

  const allConfluenceOptions = useMemo<string[]>(
    () => [...confluenceOptions, ...customOptions],
    [customOptions],
  );

  const reasonStructure = JSON.stringify(reasons);
  const summarizedReasons = timeframeTabs
    .map((timeframe) => {
      const entry = reasons[timeframe];
      if (entry.confluences.length === 0) {
        return "";
      }

      return `${timeframe}: ${entry.bias}, ${entry.confluences.join(", ")}`;
    })
    .filter(Boolean)
    .join(" | ");

  function updateBias(timeframe: Timeframe, bias: string) {
    setReasons((current) => ({
      ...current,
      [timeframe]: {
        ...current[timeframe],
        bias,
      },
    }));
  }

  function toggleConfluence(timeframe: Timeframe, confluence: string) {
    setReasons((current) => {
      const exists = current[timeframe].confluences.includes(confluence);
      return {
        ...current,
        [timeframe]: {
          ...current[timeframe],
          confluences: exists
            ? current[timeframe].confluences.filter((item) => item !== confluence)
            : [...current[timeframe].confluences, confluence],
        },
      };
    });
  }

  function addCustomConfluence() {
    const value = customInput.trim();
    if (!value || allConfluenceOptions.includes(value)) {
      return;
    }

    setCustomOptions((current) => [...current, value]);
    setCustomInput("");
  }

  function removeCustomConfluence(confluence: string) {
    setCustomOptions((current) => current.filter((item) => item !== confluence));
    setReasons((current) => {
      const next = { ...current };
      for (const timeframe of timeframeTabs) {
        next[timeframe] = {
          ...next[timeframe],
          confluences: next[timeframe].confluences.filter((item) => item !== confluence),
        };
      }
      return next;
    });
  }

  return (
    <>
      <input type="hidden" name="reasonStructure" value={reasonStructure} />
      <input type="hidden" name="summarizedReasons" value={summarizedReasons} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="field-label">Date</span>
          <input
            name="date"
            type="date"
            defaultValue={defaults.date}
            className="field-input px-4 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="field-label">Pair</span>
          <input
            name="pair"
            type="text"
            list="trade-pair-suggestions"
            placeholder="BTCUSDT"
            defaultValue={defaults.pair}
            className="field-input px-4 text-sm uppercase placeholder:text-[var(--text-subtle)]"
          />
          <datalist id="trade-pair-suggestions">
            {pairSuggestions.map((pair) => (
              <option key={pair} value={pair} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-2">
          <span className="field-label">Direction</span>
          <select
            name="direction"
            defaultValue={defaults.direction}
            className="field-input px-4 text-sm"
          >
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="field-label">PnL</span>
          <input
            name="pnl"
            type="number"
            step="0.01"
            placeholder="125.50"
            defaultValue={defaults.pnl}
            className="field-input px-4 text-sm placeholder:text-[var(--text-subtle)]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="field-label">R:R</span>
          <input
            name="rr"
            type="number"
            step="0.01"
            placeholder="2.50"
            defaultValue={defaults.rr}
            className="field-input px-4 text-sm placeholder:text-[var(--text-subtle)]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="field-label">Setup Category</span>
          <select
            name="setupCategory"
            defaultValue={defaults.setupCategory}
            className="field-input px-4 text-sm"
          >
            <option value="CONT">Cont</option>
            <option value="REVERSAL">Reversal</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="field-label">Trade Bias</span>
          <select
            name="bias"
            defaultValue={defaults.bias}
            className="field-input px-4 text-sm"
          >
            <option value="BULLISH">Bullish</option>
            <option value="BEARISH">Bearish</option>
            <option value="RANGE">Range</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 md:col-span-2 xl:col-span-2">
          <span className="field-label">Additional Notes</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Context, execution notes, mistakes, or follow-up observations."
            defaultValue={defaults.notes}
            className="field-input px-4 py-3 text-sm placeholder:text-[var(--text-subtle)]"
          />
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="card-soft p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="font-serif text-2xl text-[var(--text-primary)]">Trade reason builder</div>
            {selectedPhaseLabel ? (
              <div className="field-label">
                {selectedPhaseLabel}
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {timeframeTabs.map((timeframe) => (
              <button
                key={timeframe}
                type="button"
                onClick={() => setActiveTab(timeframe)}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  activeTab === timeframe
                    ? "bg-[var(--accent-forest)] text-[var(--background)] shadow-[0_12px_24px_rgba(45,71,57,0.18)]"
                    : "bg-[var(--surface-panel)] text-[var(--text-muted)]"
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <div className="field-label">Bias selector</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {biasOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateBias(activeTab, option.value)}
                    className={`border px-3 py-2 text-sm font-medium ${
                      reasons[activeTab].bias === option.value
                        ? "border-[color:color-mix(in_srgb,var(--accent-warm)_36%,transparent)] bg-[color:color-mix(in_srgb,var(--accent-warm)_12%,transparent)] text-[var(--text-primary)]"
                        : "border-[var(--border-soft)] bg-[var(--surface-panel)] text-[var(--text-muted)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="field-label">Confluence checklist</div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {allConfluenceOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleConfluence(activeTab, option)}
                    className={`border px-3 py-3 text-left text-sm transition ${
                      reasons[activeTab].confluences.includes(option)
                        ? "border-[color:color-mix(in_srgb,var(--accent-gold)_38%,transparent)] bg-[color:color-mix(in_srgb,var(--accent-gold)_14%,transparent)] text-[var(--text-primary)]"
                        : "border-[var(--border-soft)] bg-[var(--surface-panel)] text-[var(--text-muted)]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="field-label">Custom confluence</div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(event) => setCustomInput(event.target.value)}
                  placeholder="Add custom reason"
                  className="field-input h-11 flex-1 px-4 text-sm placeholder:text-[var(--text-subtle)]"
                />
                <button
                  type="button"
                  onClick={addCustomConfluence}
                  className="action-secondary h-11 px-4 text-sm font-semibold"
                >
                  Add
                </button>
              </div>
              {customOptions.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {customOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => removeCustomConfluence(option)}
                      className="action-secondary px-3 py-2 text-xs font-medium"
                    >
                      Remove {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card-soft p-5">
          <div className="font-serif text-2xl text-[var(--text-primary)]">Live reason summary</div>
          <div className="mt-4 space-y-3">
            {timeframeTabs.map((timeframe) => (
              <div key={timeframe} className="border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4">
                <div className="field-label">{timeframe}</div>
                <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                  {reasons[timeframe].bias}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {reasons[timeframe].confluences.length > 0
                    ? reasons[timeframe].confluences.join(", ")
                    : "No confluences selected yet."}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4">
            <div className="field-label">Saved summary</div>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {summarizedReasons || "Pick at least one confluence to generate the trade reason summary."}
            </p>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="action-primary inline-flex h-12 items-center justify-center px-5 text-sm font-semibold"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
