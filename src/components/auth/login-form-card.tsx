"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import type { AuthFormState } from "@/app/login/actions";
import { SubmitButton } from "@/components/auth/submit-button";

type LoginFormCardProps = {
  action: (
    state: AuthFormState,
    formData: FormData,
  ) => Promise<AuthFormState>;
};

const initialState: AuthFormState = {};

export function LoginFormCard({ action }: LoginFormCardProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="flex flex-col justify-center px-8 py-8 md:px-10">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8275]">
            Journal
          </div>
          <h1 className="font-serif text-4xl leading-none text-[#1f211d] md:text-5xl">
            Sign in
          </h1>
          <p className="text-sm leading-6 text-[#7b786f]">
            Continue to your ledger, review workspace, and monthly calendar.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8275]">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="trader@example.com"
              className="h-12 border border-[#e3ddd2] bg-[#fbfaf7] px-4 text-sm text-[#1f211d] outline-none placeholder:text-[#a29a8f]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8275]">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 border border-[#e3ddd2] bg-[#fbfaf7] px-4 text-sm text-[#1f211d] outline-none placeholder:text-[#a29a8f]"
            />
          </label>

          {state.error ? (
            <p className="border border-[#efc4b9] bg-[#fff2ee] px-4 py-3 text-sm text-[#a95447]">
              {state.error}
            </p>
          ) : null}

          <div className="flex justify-end pt-2">
            <SubmitButton>Sign in</SubmitButton>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-4 text-xs text-[#9b9488]">
          <div className="h-px flex-1 bg-[#e2dbcf]" />
          <span>secure account access</span>
          <div className="h-px flex-1 bg-[#e2dbcf]" />
        </div>

        <p className="mt-6 text-sm text-[#7b786f]">
          Need an account?{" "}
          <Link href="/register" className="font-semibold text-[#b86a3b] transition hover:text-[#1f211d]">
            Create one
          </Link>
        </p>
      </section>

      <aside className="relative hidden min-h-[34rem] overflow-hidden rounded-l-[2rem] xl:block">
        <div className="absolute inset-0 bg-[#d2c8b9]" />
        <div className="absolute inset-y-0 left-0 w-10 bg-[#c0d0c2]" />
        <Image
          src="/images/chart.png"
          alt="Trading workspace"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,20,0.08),rgba(15,24,20,0.34))]" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <h2 className="max-w-xs font-serif text-4xl leading-none">
            Review every trade with a calmer frame.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/84">
            Keep the month, the setup, and the reasoning visible in one place once you return to the journal.
          </p>
        </div>
      </aside>
    </div>
  );
}
