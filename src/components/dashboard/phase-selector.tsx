"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateSelectedPhaseAction } from "@/app/dashboard/actions";
import { LoadingOverlay } from "@/components/ui/loader";

type PhaseSelectorProps = {
  value: "PHASE_1" | "PHASE_2" | "LIVE";
};

export function PhaseSelector({ value }: PhaseSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedPhase, setSelectedPhase] = useState(value);

  useEffect(() => {
    setSelectedPhase(value);
  }, [value]);

  function handleChange(nextPhase: PhaseSelectorProps["value"]) {
    setSelectedPhase(nextPhase);

    const formData = new FormData();
    formData.set("phase", nextPhase);

    startTransition(async () => {
      await updateSelectedPhaseAction(formData);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <select
          name="phase"
          value={selectedPhase}
          onChange={(event) => handleChange(event.target.value as PhaseSelectorProps["value"])}
          disabled={isPending}
          className="field-input min-w-36 px-4 text-sm font-semibold disabled:opacity-70"
        >
          <option value="PHASE_1">Phase 1</option>
          <option value="PHASE_2">Phase 2</option>
          <option value="LIVE">Live</option>
        </select>
      </div>
      {isPending ? <LoadingOverlay /> : null}
    </>
  );
}
