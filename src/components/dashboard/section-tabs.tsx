"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const tabs = [
  {
    id: "ledger",
    label: "Ledger",
    description: "Trades, summaries, and the ledger.",
  },
  {
    id: "journal",
    label: "Journal",
    description: "Create a new journal entry.",
  },
  {
    id: "review",
    label: "Review",
    description: "Analytics and target tracking.",
  },
  {
    id: "calendar",
    label: "Calendar",
    description: "Monthly flow and day-by-day performance.",
  },
] as const;

const adminTab = {
  id: "admin",
  label: "Admin",
  description: "Users, totals, and account controls.",
} as const;

type SectionTabsProps = {
  ledgerContent: ReactNode;
  reviewContent: ReactNode;
  calendarContent: ReactNode;
  journalContent: ReactNode;
  adminContent?: ReactNode;
};

export function SectionTabs({
  ledgerContent,
  reviewContent,
  calendarContent,
  journalContent,
  adminContent,
}: SectionTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const availableTabs = adminContent ? [...tabs, adminTab] : tabs;
  const tabParam = searchParams.get("tab");
  const initialTab = availableTabs.some((tab) => tab.id === tabParam)
    ? (tabParam as (typeof availableTabs)[number]["id"])
    : "ledger";
  const [activeTab, setActiveTab] = useState<(typeof availableTabs)[number]["id"]>(initialTab);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  function handleSelect(tabId: (typeof availableTabs)[number]["id"]) {
    setActiveTab(tabId);
    setIsMenuOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="flex flex-col gap-3 xl:sticky xl:top-5 xl:self-start">
        <div className="panel p-3">
          <div className="flex items-center justify-between xl:hidden">
            <div>
              <div className="field-label">Navigation</div>
              <div className="mt-1 font-serif text-2xl text-[var(--text-primary)]">Menu</div>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="action-secondary inline-flex h-10 w-10 items-center justify-center"
              aria-label="Toggle dashboard menu"
              aria-expanded={isMenuOpen}
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
              </span>
            </button>
          </div>

          <div className={`${isMenuOpen ? "mt-3 flex" : "hidden"} flex-col gap-2 xl:mt-0 xl:flex`}>
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelect(tab.id)}
                  className={`px-4 py-3 text-left ${
                    isActive ? "bg-[var(--accent-forest)] text-[var(--tab-active-text)]" : "card-soft"
                  }`}
                >
                  <div className={`text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${isActive ? "text-[var(--tab-active-subtle)]" : "text-[var(--text-subtle)]"}`}>
                    Workspace
                  </div>
                  <div className="mt-1 font-serif text-2xl leading-none">{tab.label}</div>
                  <p className={`mt-2 text-xs leading-5 ${isActive ? "text-[var(--tab-active-subtle)]" : "text-[var(--text-muted)]"}`}>
                    {tab.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {activeTab === "ledger"
          ? ledgerContent
          : activeTab === "journal"
            ? journalContent
          : activeTab === "review"
            ? reviewContent
            : activeTab === "calendar"
              ? calendarContent
              : adminContent}
      </div>
    </section>
  );
}
