import type { Report, ReportError } from "./types";

/**
 * Prefer same-origin Next API route (Vercel).
 * Optional NEXT_PUBLIC_API_URL overrides to Railway backend.
 */
function reportUrl(): string {
  const external = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (external) return `${external}/api/report`;
  return "/api/report";
}

export async function fetchReport(sdkKey: string, agentId: string): Promise<Report> {
  const res = await fetch(reportUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sdkKey, agentId }),
  });

  const data = (await res.json()) as Report | ReportError;

  if (!res.ok) {
    const err = data as ReportError;
    throw new Error(err.error || err.reason || `Request failed (${res.status})`);
  }

  return data as Report;
}
