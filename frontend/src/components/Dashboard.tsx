"use client";

import { useCallback, useState } from "react";
import { fetchReport } from "@/lib/api";
import type { Report } from "@/lib/types";
import { ConnectForm } from "./ConnectForm";
import { EmptyState } from "./EmptyState";
import { MetricCard } from "./MetricCard";
import { StatusBreakdown } from "./StatusBreakdown";

function formatRate(rate: number | null, empty: boolean): string {
  if (empty || rate == null) return "—";
  return `${(rate * 100).toFixed(1)}%`;
}

function formatRevenue(usdc: number, empty: boolean): string {
  if (empty) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(usdc);
}

export function Dashboard() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (sdkKey: string, agentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReport(sdkKey, agentId);
      setReport(data);
    } catch (e) {
      setReport(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const empty = !!report && report.metrics.orderCount === 0;
  const m = report?.metrics;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6C6C74]">
            Dashboard
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight text-[#EEEEEF]">
            CAP agent report card
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#A0A0AB]">
            Post-launch metrics from real CAP order history — order count,
            revenue, buyer diversity, and completion rate.
          </p>
        </div>
        {report ? (
          <p className="text-xs text-[#6C6C74]">
            Updated {new Date(report.fetchedAt).toLocaleString()}
          </p>
        ) : null}
      </header>

      <ConnectForm loading={loading} onSubmit={load} />

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-900/50 bg-rose-950/30 px-4 py-3 text-sm text-rose-200"
        >
          <span className="font-medium">Couldn&apos;t load report.</span> {error}
        </div>
      ) : null}

      {loading && !report ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-[#2A2A2F] bg-[#1A1A1E]"
            />
          ))}
        </div>
      ) : null}

      {report && m ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Orders"
              value={String(m.orderCount)}
              hint={empty ? "None in CAP yet" : "All provider orders"}
              empty={empty}
            />
            <MetricCard
              label="Revenue"
              value={formatRevenue(m.revenueUsdc, empty)}
              hint={empty ? "No paid volume" : "Sum of order price (USDC)"}
              empty={empty}
            />
            <MetricCard
              label="Unique buyers"
              value={String(m.uniqueBuyerCount)}
              hint={empty ? "No buyers yet" : "Distinct buyerUserId"}
              empty={empty}
            />
            <MetricCard
              label="Completion rate"
              value={formatRate(m.completionRate, empty)}
              hint={
                empty
                  ? "Needs terminal orders"
                  : m.completionRate == null
                    ? "No completed / rejected / expired yet"
                    : "Completed ÷ (completed + rejected + expired)"
              }
              empty={empty || m.completionRate == null}
            />
          </div>

          {empty ? <EmptyState agentId={report.agentId} /> : null}

          <StatusBreakdown breakdown={m.breakdown} empty={empty} />
        </>
      ) : null}

      {!report && !loading && !error ? (
        <div className="rounded-2xl border border-[#2A2A2F] bg-[#1A1A1E]/50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#EEEEEF]">
            Connect an agent to see its report card
          </p>
          <p className="mx-auto mt-2 max-w-sm text-xs text-[#6C6C74]">
            Metrics stay empty until you load a valid SDK key — and if that agent
            has no orders, you get a clear zero-state, not a blank chart.
          </p>
        </div>
      ) : null}
    </div>
  );
}
