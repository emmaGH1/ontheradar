/**
 * CAP provider runtime — OnTheRadar as a live seller agent.
 *
 * Flow (SDK docs):
 *   NegotiationCreated → acceptNegotiation
 *   OrderPaid          → deliverOrder (report card JSON)
 *
 * Requires CROO_SDK_KEY + CROO_AGENT_ID (this agent's credentials).
 */
import {
  AgentClient,
  DeliverableType,
  EventType,
  type Event,
} from "@croo-network/sdk";
import { buildReport } from "./report.js";

export type ProviderStatus = {
  enabled: boolean;
  running: boolean;
  startedAt: string | null;
  lastEvent: string | null;
  lastError: string | null;
  accepted: number;
  delivered: number;
  rejected: number;
};

const status: ProviderStatus = {
  enabled: false,
  running: false,
  startedAt: null,
  lastEvent: null,
  lastError: null,
  accepted: 0,
  delivered: 0,
  rejected: 0,
};

export function getProviderStatus(): ProviderStatus {
  return { ...status };
}

function log(...args: unknown[]) {
  console.log("[provider]", ...args);
}

function parseAgentIdFromRequirements(requirements: string | undefined): string | null {
  if (!requirements?.trim()) return null;
  try {
    const parsed = JSON.parse(requirements) as { agentId?: string; agent_id?: string };
    return parsed.agentId || parsed.agent_id || null;
  } catch {
    // plain string agent id
    if (requirements.startsWith("agent") || /^[0-9a-f-]{36}$/i.test(requirements.trim())) {
      return requirements.trim();
    }
    return null;
  }
}

async function buildDeliverableText(
  client: AgentClient,
  sdkKey: string,
  defaultAgentId: string,
  orderId: string,
): Promise<string> {
  let agentId = defaultAgentId;

  try {
    const order = await client.getOrder(orderId);
    // Prefer agent id from negotiation requirements when buyer asks for a specific agent
    if (order.negotiationId) {
      try {
        const neg = await client.getNegotiation(order.negotiationId);
        const fromReq = parseAgentIdFromRequirements(neg.requirements);
        if (fromReq) agentId = fromReq;
      } catch {
        // keep default
      }
    }
  } catch (err) {
    log("getOrder failed, using default agentId:", err instanceof Error ? err.message : err);
  }

  try {
    const report = await buildReport({ sdkKey, agentId });
    return JSON.stringify(
      {
        product: "OnTheRadar CAP report card",
        agentId: report.agentId,
        metrics: report.metrics,
        sampleOrders: report.sampleOrders,
        fetchedAt: report.fetchedAt,
        note:
          "Post-launch metrics derived from live CAP listOrders for the target agent.",
      },
      null,
      2,
    );
  } catch (err) {
    // Still deliver something so escrow can clear — never leave paid orders hanging
    const message = err instanceof Error ? err.message : String(err);
    log("report build failed, delivering error payload:", message);
    return JSON.stringify(
      {
        product: "OnTheRadar CAP report card",
        agentId,
        error: message,
        fetchedAt: new Date().toISOString(),
      },
      null,
      2,
    );
  }
}

/**
 * Start WebSocket provider loop. No-ops if env credentials are missing.
 * Returns immediately; events are handled async on the stream.
 */
export async function startProvider(): Promise<void> {
  const sdkKey = process.env.CROO_SDK_KEY?.trim() ?? "";
  const agentId = process.env.CROO_AGENT_ID?.trim() ?? "";

  if (!sdkKey.startsWith("croo_sk_") || !agentId) {
    status.enabled = false;
    status.running = false;
    log(
      "skipped — set CROO_SDK_KEY (croo_sk_…) and CROO_AGENT_ID to go live as a CAP provider",
    );
    return;
  }

  status.enabled = true;

  // Client with runtime logs (createClient stays quiet for listOrders pagination)
  const runtime = new AgentClient(
    {
      baseURL: process.env.CROO_API_URL ?? "https://api.croo.network",
      wsURL: process.env.CROO_WS_URL ?? "wss://api.croo.network/ws",
      logger: {
        info: (m, ...a) => console.log("[croo]", m, ...a),
        warn: (m, ...a) => console.warn("[croo]", m, ...a),
        error: (m, ...a) => console.error("[croo]", m, ...a),
        debug: () => {},
      },
    },
    sdkKey,
  );

  try {
    const stream = await runtime.connectWebSocket();
    status.running = true;
    status.startedAt = new Date().toISOString();
    status.lastError = null;
    log("WebSocket connected — listening for CAP events");
    log("agentId", agentId);

    stream.on(EventType.NegotiationCreated, async (e: Event) => {
      const negotiationId = e.negotiation_id;
      status.lastEvent = `NegotiationCreated ${negotiationId ?? ""}`.trim();
      log("NegotiationCreated", negotiationId);
      if (!negotiationId) return;

      try {
        const result = await runtime.acceptNegotiation(negotiationId);
        status.accepted += 1;
        log("accepted → order", result.order?.orderId, result.order?.status);
      } catch (err) {
        status.rejected += 1;
        status.lastError = err instanceof Error ? err.message : String(err);
        log("acceptNegotiation failed:", status.lastError);
      }
    });

    stream.on(EventType.OrderPaid, async (e: Event) => {
      const orderId = e.order_id;
      status.lastEvent = `OrderPaid ${orderId ?? ""}`.trim();
      log("OrderPaid", orderId);
      if (!orderId) return;

      try {
        const deliverableText = await buildDeliverableText(
          runtime,
          sdkKey,
          agentId,
          orderId,
        );
        const result = await runtime.deliverOrder(orderId, {
          deliverableType: DeliverableType.Text,
          deliverableText,
        });
        status.delivered += 1;
        log(
          "delivered",
          orderId,
          "tx",
          result.txHash,
          "delivery",
          result.delivery?.deliveryId,
        );
      } catch (err) {
        status.lastError = err instanceof Error ? err.message : String(err);
        log("deliverOrder failed:", status.lastError);
      }
    });

    stream.on(EventType.OrderCompleted, (e: Event) => {
      status.lastEvent = `OrderCompleted ${e.order_id ?? ""}`.trim();
      log("OrderCompleted", e.order_id);
    });

    stream.on(EventType.OrderRejected, (e: Event) => {
      status.lastEvent = `OrderRejected ${e.order_id ?? ""}`.trim();
      log("OrderRejected", e.order_id, e.reason);
    });

    stream.on(EventType.OrderExpired, (e: Event) => {
      status.lastEvent = `OrderExpired ${e.order_id ?? ""}`.trim();
      log("OrderExpired", e.order_id);
    });
  } catch (err) {
    status.running = false;
    status.lastError = err instanceof Error ? err.message : String(err);
    log("failed to start provider:", status.lastError);
  }
}
