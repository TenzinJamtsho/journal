"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createPortal } from "react-dom";

import { type ResetPhasesFormState, resetPhasesAction } from "@/app/dashboard/actions";

const initialState: ResetPhasesFormState = {};

const phaseOptions = [
  { value: "PHASE_1", label: "Phase 1" },
  { value: "PHASE_2", label: "Phase 2" },
  { value: "LIVE", label: "Live" },
] as const;

type PhaseResetControlProps = {
  selectedPhase: "PHASE_1" | "PHASE_2" | "LIVE";
};

function ResetSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-[color:color-mix(in_srgb,var(--negative)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-4 py-3 text-sm font-semibold text-[var(--negative)] transition hover:bg-[color:color-mix(in_srgb,var(--negative)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Resetting..." : "Reset Selected"}
    </button>
  );
}

export function PhaseResetControl({ selectedPhase }: PhaseResetControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(resetPhasesAction, initialState);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="border border-[color:color-mix(in_srgb,var(--negative)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-4 py-3 text-sm font-semibold text-[var(--negative)] transition hover:bg-[color:color-mix(in_srgb,var(--negative)_16%,transparent)]"
      >
        Reset
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-[color:color-mix(in_srgb,var(--shadow-strong)_54%,transparent)]">
          <div className="flex min-h-full items-start justify-center px-4 py-8 md:py-12">
            <div className="relative w-full max-w-xl panel p-4 md:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="eyebrow text-[var(--negative)]">Reset Data</div>
                  <h2 className="mt-2 font-serif text-2xl leading-none text-[var(--text-primary)]">Choose phases to clear</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="action-secondary inline-flex h-10 w-10 items-center justify-center"
                  aria-label="Close reset dialog"
                >
                  <span className="text-lg leading-none">x</span>
                </button>
              </div>

              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                This deletes all trades in the selected phases and restores their balance and goal settings to defaults.
              </p>

              <form action={formAction} className="mt-4 space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {phaseOptions.map((phase) => (
                    <label
                      key={phase.value}
                      className="card-soft flex items-center gap-3 px-4 py-4 text-sm text-[var(--text-primary)]"
                    >
                      <input
                        type="checkbox"
                        name="phases"
                        value={phase.value}
                        defaultChecked={phase.value === selectedPhase}
                        className="h-4 w-4 accent-[var(--negative)]"
                      />
                      <span>{phase.label}</span>
                    </label>
                  ))}
                </div>

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

                <div className="flex flex-wrap gap-3">
                  <ResetSubmitButton />
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="action-secondary inline-flex h-12 items-center justify-center px-5 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
          ,
          document.body,
        )
        : null}
    </>
  );
}
