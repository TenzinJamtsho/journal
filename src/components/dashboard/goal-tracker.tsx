import { updateGoalAction, updateStartingBalanceAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/auth/submit-button";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

type GoalTrackerProps = {
  startingBalance: number;
  currentGoal: number;
  currentPnl: number;
};

export function GoalTracker({
  startingBalance,
  currentGoal,
  currentPnl,
}: GoalTrackerProps) {
  const requiredToReachGoal = Math.max(currentGoal - currentPnl, 0);
  const progress = currentGoal <= 0 ? 0 : Math.min((currentPnl / currentGoal) * 100, 100);

  return (
    <section className="panel p-5 md:p-6">
      <div className="eyebrow">Goal Tracking</div>
      <h2 className="mt-2 font-serif text-[2.1rem] leading-none text-[var(--text-primary)]">Phase goal</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="card-soft px-4 py-4">
          <div className="text-xs text-[var(--text-muted)]">Current PnL</div>
          <div className="mt-2 text-xl font-serif text-[var(--text-primary)]">
            {formatCurrency(currentPnl)}
          </div>
        </div>
        <div className="card-soft px-4 py-4">
          <div className="text-xs text-[var(--text-muted)]">Required to Reach Goal</div>
          <div className="mt-2 text-xl font-serif text-[var(--text-primary)]">
            {formatCurrency(requiredToReachGoal)}
          </div>
        </div>
        <div className="card-soft px-4 py-4">
          <div className="text-xs text-[var(--text-muted)]">Set Goal</div>
          <div className="mt-2 text-xl font-serif text-[var(--text-primary)]">
            {formatCurrency(currentGoal)}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-[var(--surface-raised)]">
          <div
            className="h-3 bg-[linear-gradient(90deg,var(--accent-gold),var(--accent-warm))] transition-all"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>
      </div>

      <details className="mt-5 border border-[var(--border-soft)] bg-[var(--surface-raised)]">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">
          Edit balance and goal
        </summary>
        <div className="grid gap-3 border-t border-[var(--border-soft)] px-4 py-4 lg:grid-cols-2">
          <form action={updateStartingBalanceAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-2">
              <span className="field-label">Starting balance</span>
              <input
                name="startingBalance"
                type="number"
                step="0.01"
                min="0"
                defaultValue={startingBalance}
                className="field-input px-4 text-sm"
              />
            </label>
            <SubmitButton className="rounded-none">Save Balance</SubmitButton>
          </form>

          <form action={updateGoalAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-2">
              <span className="field-label">Update goal</span>
              <input
                name="goal"
                type="number"
                step="0.01"
                defaultValue={currentGoal}
                className="field-input px-4 text-sm"
              />
            </label>
            <SubmitButton className="rounded-none">Save Goal</SubmitButton>
          </form>
        </div>
      </details>
    </section>
  );
}
