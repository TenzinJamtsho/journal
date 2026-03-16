import { LogoutButton } from "@/components/auth/logout-button";
import { PhaseResetControl } from "@/components/dashboard/phase-reset-control";
import { PhaseSelector } from "@/components/dashboard/phase-selector";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

type DashboardHeaderProps = {
  email: string;
  name: string | null;
  selectedPhase: "PHASE_1" | "PHASE_2" | "LIVE";
};

export function DashboardHeader({
  email,
  name,
  selectedPhase,
}: DashboardHeaderProps) {
  return (
    <header className="panel px-4 py-4 md:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
            <h1 className="truncate font-serif text-3xl leading-none text-[var(--text-primary)] md:text-[2.35rem]">
              {name ? `${name}'s Desk` : "Review Desk"}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Signed in as <span className="font-semibold text-[var(--text-primary)]">{email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <PhaseSelector value={selectedPhase} />
          <ThemeToggle />
          <PhaseResetControl selectedPhase={selectedPhase} />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
