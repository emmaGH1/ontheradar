export function EmptyState({ agentId }: { agentId: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#2A2A2F] bg-[#1A1A1E]/40 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2A2F] bg-[#0F0F11] text-[#A0A0AB]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" opacity="0.55" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <h2 className="mt-4 font-[family-name:var(--font-syne)] text-lg font-extrabold text-[#EEEEEF]">
        No orders yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#A0A0AB]">
        CAP connected successfully for this agent, but there is no order history
        to score. Once buyers complete, reject, or expire orders, metrics will
        fill in here.
      </p>
      <p className="mt-4 break-all font-mono text-xs text-[#6C6C74]">
        agent · {agentId}
      </p>
    </div>
  );
}
