import type { AgentMetrics } from "@/lib/types";

const ROWS: {
  key: keyof AgentMetrics["breakdown"];
  label: string;
  color: string;
}[] = [
  { key: "completed", label: "Completed", color: "bg-[#C6FF3A]" },
  { key: "rejected", label: "Rejected", color: "bg-rose-500" },
  { key: "expired", label: "Expired", color: "bg-[#FF9F1C]" },
  { key: "other", label: "In progress", color: "bg-sky-500" },
];

export function StatusBreakdown({
  breakdown,
  empty,
}: {
  breakdown: AgentMetrics["breakdown"];
  empty: boolean;
}) {
  const total =
    breakdown.completed + breakdown.rejected + breakdown.expired + breakdown.other;

  return (
    <div className="rounded-2xl border border-[#2A2A2F] bg-[#1A1A1E] p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-[#EEEEEF]">Order status mix</h3>
        <span className="text-xs text-[#6C6C74]">
          {empty ? "waiting for data" : `${total} total`}
        </span>
      </div>

      {empty ? (
        <div className="mt-5 flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-[#2A2A2F] bg-[#0F0F11]/60 text-center">
          <p className="text-sm font-medium text-[#A0A0AB]">No orders yet</p>
          <p className="mt-1 text-xs text-[#6C6C74]">
            Status bars appear after the first order
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <div className="flex h-3 overflow-hidden rounded-full bg-[#0F0F11]">
            {ROWS.map(({ key, color }) => {
              const n = breakdown[key];
              if (!n || !total) return null;
              return (
                <div
                  key={key}
                  className={color}
                  style={{ width: `${(n / total) * 100}%` }}
                  title={`${key}: ${n}`}
                />
              );
            })}
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ROWS.map(({ key, label, color }) => (
              <li
                key={key}
                className="flex items-center gap-2 rounded-lg bg-[#0F0F11]/50 px-3 py-2 text-sm"
              >
                <span className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-[#A0A0AB]">{label}</span>
                <span className="ml-auto tabular-nums text-[#EEEEEF]">
                  {breakdown[key]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
