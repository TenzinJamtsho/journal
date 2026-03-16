"use client";

import { useFormStatus } from "react-dom";

import { deleteUserAction } from "@/app/dashboard/actions";

type DeleteUserButtonProps = {
  userId: string;
};

function DeleteUserButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-[color:color-mix(in_srgb,var(--negative)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--negative)] transition hover:bg-[color:color-mix(in_srgb,var(--negative)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting" : "Delete"}
    </button>
  );
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  return (
    <form action={deleteUserAction}>
      <input type="hidden" name="userId" value={userId} />
      <DeleteUserButtonInner />
    </form>
  );
}
