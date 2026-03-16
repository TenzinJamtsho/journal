"use client";

import { useFormStatus } from "react-dom";

import { deleteTradeAction } from "@/app/dashboard/actions";

type DeleteTradeButtonProps = {
  tradeId: string;
};

function DeleteButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="border border-[color:color-mix(in_srgb,var(--negative)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--negative)] transition hover:bg-[color:color-mix(in_srgb,var(--negative)_16%,transparent)] disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Deleting" : "Delete"}
    </button>
  );
}

export function DeleteTradeButton({ tradeId }: DeleteTradeButtonProps) {
  return (
    <form action={deleteTradeAction}>
      <input type="hidden" name="tradeId" value={tradeId} />
      <DeleteButtonInner />
    </form>
  );
}
