import type { Report, ReportError } from "./types";

/**
 * Prefer same-origin Next API route (Vercel).
 * Optional NEXT_PUBLIC_API_URL overrides to Railway backend.
 */
function reportUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return "/api/report";

  let base = raw.replace(/\/$/, "");
  // Host-only values become relative paths in the browser and return HTML 404s.
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  return `${base}/api/report`;
}

export async function fetchReport(sdkKey: string, agentId: string): Promise<Report> {
  const url = reportUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sdkKey, agentId }),
  });

  const text = await res.text();
  let data: Report | ReportError;
  try {
    data = JSON.parse(text) as Report | ReportError;
  } catch {
    throw new Error(
      `Backend returned non-JSON from ${url} (HTTP ${res.status}). ` +
        `Set NEXT_PUBLIC_API_URL to the full origin, e.g. https://ontheradar-production.up.railway.app`,
    );
  }

  if (!res.ok) {
    const err = data as ReportError;
    throw new Error(err.error || err.reason || `Request failed (${res.status})`);
  }

  return data as Report;
}
