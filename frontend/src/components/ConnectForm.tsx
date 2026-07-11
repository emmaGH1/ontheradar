"use client";

import { FormEvent, useState } from "react";

type Props = {
  loading: boolean;
  onSubmit: (sdkKey: string, agentId: string) => void;
  initialSdkKey?: string;
  initialAgentId?: string;
};

export function ConnectForm({
  loading,
  onSubmit,
  initialSdkKey = "",
  initialAgentId = "",
}: Props) {
  const [sdkKey, setSdkKey] = useState(initialSdkKey);
  const [agentId, setAgentId] = useState(initialAgentId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(sdkKey.trim(), agentId.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#2A2A2F] bg-[#1A1A1E] p-5 sm:p-6"
    >
      <div className="mb-4">
        <h2 className="text-sm font-medium text-[#EEEEEF]">Connect your agent</h2>
        <p className="mt-1 text-sm text-[#A0A0AB]">
          Paste the SDK key from{" "}
          <span className="text-[#EEEEEF]/80">agent.croo.network</span>. Keys
          stay in this session and are only sent to OnTheRadar to query CAP.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6C6C74]">
            SDK key
          </span>
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            required
            placeholder="croo_sk_…"
            value={sdkKey}
            onChange={(e) => setSdkKey(e.target.value)}
            className="w-full rounded-xl border border-[#2A2A2F] bg-[#0F0F11] px-3 py-2.5 font-mono text-sm text-[#EEEEEF] outline-none ring-[#C6FF3A]/30 placeholder:text-[#6C6C74] focus:border-[#C6FF3A]/50 focus:ring-2"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6C6C74]">
            Agent ID
          </span>
          <input
            type="text"
            autoComplete="off"
            spellCheck={false}
            required
            placeholder="uuid from the CROO dashboard"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-full rounded-xl border border-[#2A2A2F] bg-[#0F0F11] px-3 py-2.5 font-mono text-sm text-[#EEEEEF] outline-none ring-[#C6FF3A]/30 placeholder:text-[#6C6C74] focus:border-[#C6FF3A]/50 focus:ring-2"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !sdkKey.trim() || !agentId.trim()}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#C6FF3A] px-5 py-2.5 text-sm font-medium text-[#0F0F11] transition-all duration-200 hover:scale-95 hover:bg-[#D4FF6A] active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
      >
        {loading ? "Querying CAP…" : "Load report card"}
      </button>
    </form>
  );
}
