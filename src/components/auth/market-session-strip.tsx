"use client";

import { useMemo, useSyncExternalStore } from "react";

type SessionCard = {
  label: string;
  openHour: number;
};

const sessionCards: SessionCard[] = [
  { label: "Asia Open", openHour: 5 },
  { label: "London Open", openHour: 13 },
  { label: "New York Open", openHour: 18 },
];

function getBhutanParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Thimphu",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const second = Number(parts.find((part) => part.type === "second")?.value ?? "0");

  return {
    hour,
    minute,
    second,
    timeLabel: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")} BST`,
  };
}

function getCurrentSession(hour: number) {
  if (hour >= 18 || hour < 5) {
    return "New York Session";
  }

  if (hour >= 13) {
    return "London Session";
  }

  return "Asia Session";
}

function getSessionTone(label: string, activeSession: string) {
  if (label.startsWith("Asia")) {
    return activeSession === "Asia Session"
      ? "border-[#b86a3b] bg-[#fff5eb] text-[#7f3f14]"
      : "border-[#ddd5c8] bg-[#f7f2ea] text-[#746b5f]";
  }

  if (label.startsWith("London")) {
    return activeSession === "London Session"
      ? "border-[#7d8d76] bg-[#eef4eb] text-[#314235]"
      : "border-[#ddd5c8] bg-[#f7f2ea] text-[#746b5f]";
  }

  return activeSession === "New York Session"
    ? "border-[#8d5b4f] bg-[#f8efec] text-[#5d342a]"
    : "border-[#ddd5c8] bg-[#f7f2ea] text-[#746b5f]";
}

export function MarketSessionStrip() {
  const now = useSyncExternalStore(
    (onStoreChange) => {
      const timer = window.setInterval(onStoreChange, 1000);
      return () => window.clearInterval(timer);
    },
    () => Date.now(),
    () => 0,
  );

  const bhutanTime = useMemo(
    () =>
      now
        ? getBhutanParts(new Date(now))
        : {
            hour: 0,
            minute: 0,
            second: 0,
            timeLabel: "--:--:-- BST",
          },
    [now],
  );
  const activeSession = useMemo(
    () => getCurrentSession(bhutanTime.hour),
    [bhutanTime.hour],
  );

  return (
    <div className="hidden items-stretch gap-3 md:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)]">
      <div className="flex h-full border border-[#d6d0c6] bg-[linear-gradient(135deg,#f8f5ef,#efe8dc)] px-5 py-4 shadow-[0_10px_24px_rgba(40,34,24,0.06)]">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.2em] text-[#7f8275]">
              Current Time
            </div>
            <div className="mt-1 text-[1.65rem] font-semibold leading-none text-[#1f211d]">
              {bhutanTime.timeLabel}
            </div>
          </div>

          <div className="border border-[#d8c7ac] bg-[#f7ecdd] px-3 py-2 text-right">
            <div className="text-[0.62rem] uppercase tracking-[0.18em] text-[#8b6c45]">
              Live Session
            </div>
            <div className="mt-1 text-sm font-semibold text-[#6d4523]">
              {activeSession}
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-stretch gap-3 sm:grid-cols-3">
        {sessionCards.map((session) => (
          <div
            key={session.label}
            className={`flex h-full flex-col justify-center border px-4 py-4 shadow-[0_10px_24px_rgba(40,34,24,0.05)] transition ${getSessionTone(session.label, activeSession)}`}
          >
            <div className="text-[0.68rem] uppercase tracking-[0.18em]">
              {session.label}
            </div>
            <div className="mt-2 text-xl font-semibold leading-none">
              {String(session.openHour).padStart(2, "0")}:00 BST
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
