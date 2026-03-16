type SummaryCardProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  detail?: string;
};

const toneClassMap = {
  default: "text-[var(--text-primary)]",
  positive: "status-positive",
  negative: "status-negative",
} as const;

export function SummaryCard({
  label,
  value,
  tone = "default",
  detail,
}: SummaryCardProps) {
  return (
    <article className="panel p-4">
      <div className="field-label">{label}</div>
      <div className={`mt-3 font-serif text-3xl leading-none tracking-tight ${toneClassMap[tone]}`}>
        {value}
      </div>
      {detail ? <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{detail}</p> : null}
    </article>
  );
}
