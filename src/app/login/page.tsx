import { redirect } from "next/navigation";

import { loginAction } from "@/app/login/actions";
import { LoginFormCard } from "@/components/auth/login-form-card";
import { MarketSessionStrip } from "@/components/auth/market-session-strip";
import { getCurrentSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#d8d4cb] px-4 py-6 md:px-8 md:py-10">
      <section className="flex w-full max-w-[84rem] flex-col gap-5">
        <MarketSessionStrip />

        <div className="overflow-hidden bg-[#f8f6f1] shadow-[0_30px_80px_rgba(40,34,24,0.12)]">
          <LoginFormCard action={loginAction} />
        </div>
      </section>
    </main>
  );
}
