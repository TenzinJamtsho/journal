import { DeleteUserButton } from "@/components/dashboard/delete-user-button";
import { SummaryCard } from "@/components/dashboard/summary-card";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  tradeCount: number;
  phaseSettingsCount: number;
};

type AdminPanelProps = {
  currentUserId: string;
  totalUsers: number;
  totalTrades: number;
  totalPhaseSettings: number;
  users: AdminUser[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function AdminPanel({
  currentUserId,
  totalUsers,
  totalTrades,
  totalPhaseSettings,
  users,
}: AdminPanelProps) {
  return (
    <section className="flex flex-col gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Total Users"
          value={String(totalUsers)}
          detail="Accounts in the database"
        />
        <SummaryCard
          label="Total Trades"
          value={String(totalTrades)}
          detail="All trades across users"
        />
        <SummaryCard
          label="Phase Settings"
          value={String(totalPhaseSettings)}
          detail="Saved phase configuration rows"
        />
      </section>

      <section className="panel p-5 md:p-6">
        <div className="eyebrow">Admin</div>
        <h2 className="mt-2 font-serif text-[2rem] leading-none text-[var(--text-primary)]">User management</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Review registered accounts, account age, stored phase settings, and remove users from the database when needed.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border-soft)] text-xs uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                <th className="px-3 py-3 font-semibold">User</th>
                <th className="px-3 py-3 font-semibold">Created</th>
                <th className="px-3 py-3 font-semibold">Trades</th>
                <th className="px-3 py-3 font-semibold">Settings</th>
                <th className="px-3 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border-soft)] align-top">
                  <td className="px-3 py-4">
                    <div className="font-medium text-[var(--text-primary)]">{user.name || "Unnamed user"}</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">{user.email}</div>
                    {user.id === currentUserId ? (
                      <div className="mt-2 inline-flex border border-[var(--border-soft)] px-2 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                        Current admin
                      </div>
                    ) : null}
                  </td>
                  <td className="px-3 py-4 text-sm text-[var(--text-primary)]">{formatDate(user.createdAt)}</td>
                  <td className="px-3 py-4 text-sm text-[var(--text-primary)]">{user.tradeCount}</td>
                  <td className="px-3 py-4 text-sm text-[var(--text-primary)]">{user.phaseSettingsCount}</td>
                  <td className="px-3 py-4">
                    {user.id === currentUserId ? (
                      <span className="text-sm text-[var(--text-muted)]">Protected</span>
                    ) : (
                      <DeleteUserButton userId={user.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
