"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { AuthFormState } from "@/app/login/actions";
import { SubmitButton } from "@/components/auth/submit-button";

type RegisterFormProps = {
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
    label: "Email Address",
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

export function RegisterForm({ action }: RegisterFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className="w-full max-w-[29rem] text-[#f7efe2]">
      <div className="space-y-3">
        <h1 className="font-serif text-6xl leading-none tracking-[-0.04em]">
          Create <span className="text-[var(--accent-warm)]">Account</span>
        </h1>
        <p className="text-xl text-[#d9cdbd]">Sign up to start your journal</p>
      </div>

      <form action={formAction} className="mt-10 space-y-4">
        {fields.map((field) => (
          <label key={field.name} className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#d9cdbd]">{field.label}</span>
            <input
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className="h-16 border border-white/15 bg-[rgba(20,30,26,0.38)] px-6 text-lg text-[#f7efe2] placeholder:text-[#a99d90] outline-none backdrop-blur-sm"
            />
          </label>
        ))}

        {state.error ? (
          <p className="border border-[color:color-mix(in_srgb,var(--negative)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-4 py-3 text-sm text-[var(--negative)]">
            {state.error}
          </p>
        ) : null}

        <div className="pt-2">
          <SubmitButton>Sign Up</SubmitButton>
        </div>
      </form>

      <p className="mt-8 text-lg text-[#d9cdbd]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--accent-warm)] transition hover:text-[#f7efe2]">
          Sign In
        </Link>
      </p>
    </div>
  );
}
