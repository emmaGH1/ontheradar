import { fetchAllOrders, type FetchOrdersInput } from "./croo.js";
import { deriveMetrics, type AgentMetrics } from "./metrics.js";
import type { Order } from "@croo-network/sdk";

export type Report = {
  agentId: string;
  metrics: AgentMetrics;
  /** Sample of raw orders for verification (first 5). */
  sampleOrders: Order[];
  fetchedAt: string;
};

export async function buildReport(input: FetchOrdersInput): Promise<Report> {
  const orders = await fetchAllOrders(input);
  return {
    agentId: input.agentId,
    metrics: deriveMetrics(orders),
    sampleOrders: orders.slice(0, 5),
    fetchedAt: new Date().toISOString(),
  };
}
