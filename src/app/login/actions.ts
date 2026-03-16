"use server";

import { redirect } from "next/navigation";

import { setSessionCookie } from "@/lib/auth/cookies";
import { loginUser, registerUser } from "@/lib/auth/users";

export type AuthFormState = {
  error?: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    const { token } = await loginUser({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
    });

    await setSessionCookie(token);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to sign in.",
    };
  }

  redirect("/dashboard");
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    const { token } = await registerUser({
      name: getString(formData, "name") || undefined,
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      confirmPassword: getString(formData, "confirmPassword"),
    });

    await setSessionCookie(token);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create account.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  redirect("/api/auth/logout");
}
