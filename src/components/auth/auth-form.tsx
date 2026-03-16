"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { AuthFormState } from "@/app/login/actions";
import { SubmitButton } from "@/components/auth/submit-button";

type Field = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder: string;
};

type AuthFormProps = {
  title: string;
  description?: string;
  fields: Field[];
  submitLabel: string;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
  className?: string;
  action: (
    state: AuthFormState,
    formData: FormData,
  ) => Promise<AuthFormState>;
};

const initialState: AuthFormState = {};

export function AuthForm({
  title,
  description,
  fields,
  submitLabel,
  footerText,
  footerHref,
  footerLinkLabel,
  className,
  action,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <div className={`panel flex w-full max-w-xl flex-col justify-center px-7 py-8 md:px-9 md:py-10 ${className ?? ""}`}>
      {title || description ? (
        <div className="space-y-4">
          {title ? <h2 className="section-title text-[var(--text-primary)] md:text-[3.5rem]">{title}</h2> : null}
          {description ? <p className="body-copy max-w-lg">{description}</p> : null}
        </div>
      ) : null}

      <form action={formAction} className={`${title || description ? "mt-8" : ""} space-y-4`}>
        {fields.map((field) => (
          <label key={field.name} className="flex flex-col gap-2">
            <span className="field-label">{field.label}</span>
            <input
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className="field-input rounded-[1.25rem] px-4 text-sm placeholder:text-[var(--text-subtle)]"
            />
          </label>
        ))}

        {state.error ? (
          <p className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--negative)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--negative)_10%,transparent)] px-4 py-3 text-sm text-[var(--negative)]">
            {state.error}
          </p>
        ) : null}

        <SubmitButton>{submitLabel}</SubmitButton>
      </form>

      <p className="mt-6 text-sm text-[var(--text-muted)]">
        {footerText}{" "}
        <Link href={footerHref} className="font-semibold text-[var(--accent-warm)] transition hover:text-[var(--text-primary)]">
          {footerLinkLabel}
        </Link>
      </p>
    </div>
  );
}
