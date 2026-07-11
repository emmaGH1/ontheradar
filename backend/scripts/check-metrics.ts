/**
 * Assert-based self-check for metric derivation (no network).
 */
import { deriveMetrics, parsePrice } from "../src/metrics.js";
import type { Order } from "@croo-network/sdk";
import { OrderStatus } from "@croo-network/sdk";

function order(partial: Partial<Order> & Pick<Order, "orderId" | "status" | "price" | "buyerUserId">): Order {
  return {
    negotiationId: "",
    chainOrderId: "",
    serviceId: "",
    requesterAgentId: "",
    providerAgentId: "agent-1",
    requesterWalletAddress: "",
    providerWalletAddress: "",
    paymentToken: "",
    deliveryWindow: 0,
    rejectReason: "",
    createTxHash: "",
    payTxHash: "",
    deliverTxHash: "",
    rejectTxHash: "",
    clearTxHash: "",
    slaDeadline: "",
    payDeadline: "",
    createdTime: "",
    updatedTime: "",
    createdAt: "",
    paidAt: "",
    deliveredAt: "",
    rejectedAt: "",
    expiredAt: "",
    ...partial,
  };
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

// parsePrice
assert(parsePrice("1000000") === 1_000_000, "parse base units");
assert(parsePrice("") === 0, "empty price");
assert(parsePrice("nope") === 0, "invalid price");

// empty
const empty = deriveMetrics([]);
assert(empty.orderCount === 0, "empty count");
assert(empty.completionRate === null, "empty rate null");
assert(empty.uniqueBuyerCount === 0, "empty buyers");

// mixed statuses
const m = deriveMetrics([
  order({ orderId: "1", status: OrderStatus.Completed, price: "1000000", buyerUserId: "b1" }),
  order({ orderId: "2", status: OrderStatus.Completed, price: "2000000", buyerUserId: "b1" }),
  order({ orderId: "3", status: OrderStatus.Rejected, price: "500000", buyerUserId: "b2" }),
  order({ orderId: "4", status: OrderStatus.Expired, price: "0", buyerUserId: "b3" }),
  order({ orderId: "5", status: OrderStatus.Paid, price: "3000000", buyerUserId: "b2" }),
]);

assert(m.orderCount === 5, "count");
assert(m.revenueRaw === "6500000", "revenue sum");
assert(m.revenueUsdc === 6.5, "usdc");
assert(m.uniqueBuyerCount === 3, "buyers");
assert(m.breakdown.completed === 2, "completed");
assert(m.breakdown.rejected === 1, "rejected");
assert(m.breakdown.expired === 1, "expired");
assert(m.breakdown.other === 1, "other/paid");
// 2 / (2+1+1) = 0.5
assert(m.completionRate === 0.5, "completion rate");

console.log("check-metrics: all passed");
