import type { Report, ReportError } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function fetchReport(sdkKey: string, agentId: string): Promise<Report> {
  const res = await fetch(`${API_URL}/api/report`, {
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
