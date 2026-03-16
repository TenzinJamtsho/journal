"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import type { AuthFormState } from "@/app/login/actions";
import { SubmitButton } from "@/components/auth/submit-button";

type RegisterFormCardProps = {
  action: (
    state: AuthFormState,
    formData: FormData,
  ) => Promise<AuthFormState>;
};

type RegisterField = {
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  placeholder: string;
};

const initialState: AuthFormState = {};

const fields: RegisterField[] = [
  {
    name: "name",
    label: "Full Name",
    autoComplete: "name",
    placeholder: "Your name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "trader@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Create a password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Repeat your password",
  },
] as const;

export function RegisterFormCard({ action }: RegisterFormCardProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
      <section className="flex flex-col justify-center px-8 py-8 md:px-10">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8275]">
            Journal
          </div>
          <h1 className="font-serif text-4xl leading-none text-[#1f211d] md:text-5xl">
            Create account
          </h1>
          <p className="text-sm leading-6 text-[#7b786f]">
            Set up your journal access and start tracking your ledger, review, and calendar in one place.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-4">
          {fields.map((field) => (
            <label key={field.name} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8275]">
                {field.label}
              </span>
              <input
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                className="h-12 border border-[#e3ddd2] bg-[#fbfaf7] px-4 text-sm text-[#1f211d] outline-none placeholder:text-[#a29a8f]"
              />
            </label>
          ))}

          {state.error ? (
            <p className="border border-[#efc4b9] bg-[#fff2ee] px-4 py-3 text-sm text-[#a95447]">
              {state.error}
            </p>
          ) : null}

          <div className="pt-2">
            <SubmitButton>Create account</SubmitButton>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-4 text-xs text-[#9b9488]">
          <div className="h-px flex-1 bg-[#e2dbcf]" />
          <span>secure account setup</span>
          <div className="h-px flex-1 bg-[#e2dbcf]" />
        </div>

        <p className="mt-6 text-sm text-[#7b786f]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#b86a3b] transition hover:text-[#1f211d]">
            Sign in
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
            Start the journal with a cleaner routine.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/84">
            Build the habit from day one with one place for entries, review notes, and the monthly trading flow.
          </p>
        </div>
      </aside>
    </div>
  );
}
