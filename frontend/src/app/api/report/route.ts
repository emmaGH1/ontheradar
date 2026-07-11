import { NextResponse } from "next/server";
import { APIError } from "@croo-network/sdk";
import { fetchAllOrders } from "@/lib/croo";
import { deriveMetrics } from "@/lib/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sdkKey?: string; agentId?: string };
    const sdkKey = String(body.sdkKey ?? "");
    const agentId = String(body.agentId ?? "");

    if (!sdkKey || !agentId) {
      return NextResponse.json(
        { error: "sdkKey and agentId are required" },
        { status: 400 },
      );
    }

    const orders = await fetchAllOrders({ sdkKey, agentId });
    return NextResponse.json({
      agentId,
      metrics: deriveMetrics(orders),
      sampleOrders: orders.slice(0, 5),
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err instanceof APIError) {
      const status =
        err.httpStatus >= 400 && err.httpStatus < 600 ? err.httpStatus : 502;
      return NextResponse.json(
        {
          error: err.message || err.reason,
          code: err.code,
          reason: err.reason,
        },
        { status },
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error("report failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
