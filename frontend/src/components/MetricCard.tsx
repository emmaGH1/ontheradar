type Props = {
  label: string;
  value: string;
  hint?: string;
  empty?: boolean;
};

export function MetricCard({ label, value, hint, empty }: Props) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        empty
          ? "border-[#2A2A2F] bg-[#1A1A1E]/60"
          : "border-[#2A2A2F] bg-[#1A1A1E]"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6C6C74]">
        {label}
      </p>
      <p
        className={`mt-2 font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight tabular-nums ${
          empty ? "text-[#6C6C74]" : "text-[#C6FF3A]"
        }`}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-[#6C6C74]">{hint}</p> : null}
    </div>
  );
}
