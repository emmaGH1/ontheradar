import type { Order } from "@croo-network/sdk";
import { OrderStatus } from "@croo-network/sdk";

export type AgentMetrics = {
  orderCount: number;
  /** Sum of order.price as returned by CAP (typically USDC base units, 6 decimals). */
  revenueRaw: string;
  /** revenueRaw / 1e6 for display as USDC. */
  revenueUsdc: number;
  uniqueBuyerCount: number;
  /**
   * completed / (completed + rejected + expired).
   * null when there are no terminal orders yet.
   */
  completionRate: number | null;
  breakdown: {
    completed: number;
    rejected: number;
    expired: number;
    other: number;
  };
};

/** Parse CAP price string → number (base units). Empty/invalid → 0. */
export function parsePrice(price: string | undefined | null): number {
  if (price == null || price === "") return 0;
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

export function deriveMetrics(orders: Order[]): AgentMetrics {
  let revenue = 0;
  const buyers = new Set<string>();
  let completed = 0;
  let rejected = 0;
  let expired = 0;
  let other = 0;

  for (const o of orders) {
    revenue += parsePrice(o.price);
    if (o.buyerUserId) buyers.add(o.buyerUserId);

    switch (o.status) {
      case OrderStatus.Completed:
        completed++;
        break;
      case OrderStatus.Rejected:
        rejected++;
        break;
      case OrderStatus.Expired:
        expired++;
        break;
      default:
        other++;
    }
  }

  const terminal = completed + rejected + expired;

  return {
    orderCount: orders.length,
    revenueRaw: String(revenue),
    revenueUsdc: revenue / 1e6,
    uniqueBuyerCount: buyers.size,
    completionRate: terminal === 0 ? null : completed / terminal,
    breakdown: { completed, rejected, expired, other },
  };
}
