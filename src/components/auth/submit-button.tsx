"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SubmitButton({ children, className = "" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`action-primary inline-flex h-12 items-center justify-center rounded-[1.25rem] px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? "Saving..." : children}
    </button>
  );
}
