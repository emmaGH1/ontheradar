import { AgentClient, OrderStatus, DeliverableType, APIError } from "@croo-network/sdk";
import fs from "node:fs";
import path from "node:path";

// Load .env manually to ensure environment variables are populated
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function main() {
  const requesterKey = process.env.CROO_REQUESTER_SDK_KEY;
  const providerKey = process.env.CROO_SDK_KEY;
  const serviceId = process.env.CROO_TARGET_SERVICE_ID;

  if (!requesterKey) {
    console.error("Error: CROO_REQUESTER_SDK_KEY is not set in env.");
    process.exit(1);
  }
  if (!providerKey) {
    console.error("Error: CROO_SDK_KEY is not set in env.");
    process.exit(1);
  }
  if (!serviceId) {
    console.error("Error: CROO_TARGET_SERVICE_ID is not set in env.");
    process.exit(1);
  }

  // --order-id <id>  →  resume from an existing in-flight order (skip negotiate/accept/pay)
  const resumeOrderId = (() => {
    const idx = process.argv.indexOf("--order-id");
    return idx !== -1 ? process.argv[idx + 1] : null;
  })();

  console.log("=== CAP E2E Purchase Test ===");
  console.log(`Using Buyer Key: ${requesterKey.slice(0, 12)}…`);
  console.log(`Using Seller Key: ${providerKey.slice(0, 12)}…`);
  console.log(`Target Service ID: ${serviceId}`);
  if (resumeOrderId) console.log(`RESUME mode — skipping to existing order: ${resumeOrderId}`);

  const buyer = new AgentClient(
    {
      baseURL: process.env.CROO_API_URL || "https://api.croo.network",
    },
    requesterKey
  );

  const seller = new AgentClient(
    {
      baseURL: process.env.CROO_API_URL || "https://api.croo.network",
    },
    providerKey
  );

  // In resume mode jump straight to the existing order — skip steps 1 & 2
  if (resumeOrderId) {
    console.log("\n[Step 1] SKIPPED (resume mode).");
    console.log("[Step 2] SKIPPED (resume mode).");
    let orderId: string = resumeOrderId;

    // ---- Steps 3-9 with the resumed order ----
    // 3. (noop — order is already created)
    console.log("\n[Step 3] SKIPPED (resume mode — order already created).");
    let order = await buyer.getOrder(orderId);
    console.log(`  Current order status: ${order.status}`);
    const timeoutMs = 180000;

    // 4. (noop — payment already submitted)
    console.log("\n[Step 4] SKIPPED (resume mode — payTxHash already submitted).");

    // 5. Poll for paid / delivering / completed
    console.log("\n[Step 5] Waiting for order to leave 'paying'...");
    const payStart = Date.now();
    while (order.status === "created" || order.status === "paying") {
      if (Date.now() - payStart > timeoutMs) {
        console.error(`Error: Timeout (${timeoutMs / 1000}s) waiting for order to leave '${order.status}'. payTxHash=${order.payTxHash || "none"}`);
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      order = await buyer.getOrder(orderId);
      console.log(`  Order status: ${order.status}`);
    }
    if (order.status === OrderStatus.PayFailed) {
      console.error(`Error: Payment failed on-chain. payTxHash: ${order.payTxHash}`);
      process.exit(1);
    }
    if (order.status !== "paid" && order.status !== "delivering" && order.status !== "completed") {
      console.error(`Error: Order in unexpected state: ${order.status}`);
      process.exit(1);
    }
    console.log(`Payment confirmed! Order status: ${order.status}`);
    if (order.payTxHash) console.log(`  payTxHash: ${order.payTxHash}`);

    // 6. Deliver (if not already done by live provider)
    console.log("\n[Step 6] Delivering order...");
    if (order.status === "completed") {
      console.log("Order already completed by remote provider!");
    } else {
      try {
        const result = await seller.deliverOrder(orderId, {
          deliverableType: DeliverableType.Text,
          deliverableText: JSON.stringify({ product: "OnTheRadar CAP report card (E2E Resume)", agentId: process.env.CROO_AGENT_ID, fetchedAt: new Date().toISOString() }, null, 2),
        });
        console.log(`Delivery submitted! Tx Hash: ${result.txHash}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        order = await buyer.getOrder(orderId);
        if (order.status === "completed") {
          console.log("Already delivered by live provider.");
        } else {
          console.error("Failed to deliver order:", msg);
          process.exit(1);
        }
      }
    }

    // 7. Wait for completed
    console.log("\n[Step 7] Waiting for order to be completed...");
    const completeStart = Date.now();
    order = await buyer.getOrder(orderId);
    while (order.status !== OrderStatus.Completed) {
      if (Date.now() - completeStart > timeoutMs) {
        console.error("Error: Timeout waiting for order status to become 'completed'.");
        process.exit(1);
      }
      if ([OrderStatus.DeliverFailed, OrderStatus.Rejected, OrderStatus.Expired].includes(order.status as typeof OrderStatus[keyof typeof OrderStatus])) {
        console.error(`Error: Order failed with status: ${order.status}`);
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      order = await buyer.getOrder(orderId);
      console.log(`  Order status: ${order.status}`);
    }
    console.log("Order completed successfully!");

    // 8. Get Delivery
    console.log("\n[Step 8] Getting Delivery...");
    const delivery = await buyer.getDelivery(orderId);
    console.log(`Delivery ID: ${delivery.deliveryId}`);
    console.log("--- Deliverable Text ---");
    console.log(delivery.deliverableText);
    console.log("------------------------");

    // 9. Re-check listOrders
    console.log("\n[Step 9] Re-checking listOrders...");
    const finalOrders = await buyer.listOrders({ role: "buyer" });
    const verifiedOrder = finalOrders.find((o) => o.orderId === orderId);
    if (verifiedOrder) {
      console.log(`SUCCESS: Order ${orderId} is verified in listOrders with status: ${verifiedOrder.status}`);
    } else {
      console.error(`FAILED: Order ${orderId} is missing from final listOrders!`);
      process.exit(1);
    }

    console.log("\n=== E2E TEST COMPLETED SUCCESSFULLY! ===");
    return;
  }

  // 1. Negotiate Order (Buyer)
  console.log("\n[Step 1] Buyer negotiating order...");
  let negotiation;
  try {
    negotiation = await buyer.negotiateOrder({
      serviceId,
      requirements: JSON.stringify({ task: "E2E test purchase report card" }),
    });
    console.log(`Negotiation created!`);
    console.log(`  ID: ${negotiation.negotiationId}`);
    console.log(`  Status: ${negotiation.status}`);
  } catch (err) {
    console.error("Failed to negotiate order:", err instanceof APIError ? err.message : err);
    process.exit(1);
  }

  // 2. Accept Negotiation (Seller)
  console.log("\n[Step 2] Seller accepting negotiation...");
  let orderId: string | null = null;
  try {
    const result = await seller.acceptNegotiation(negotiation.negotiationId);
    orderId = result.order.orderId;
    console.log(`Negotiation accepted! Order ID: ${orderId}`);
    console.log(`  Order Status: ${result.order.status}`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const isAlreadyAccepted = errMsg.includes("negotiation is not pending");
    
    if (isAlreadyAccepted) {
      console.log("Negotiation was already accepted (likely by the live running provider agent)!");
      
      // Poll getNegotiation until status is "accepted" or timeout
      let updatedNeg = await buyer.getNegotiation(negotiation.negotiationId);
      const pollStart = Date.now();
      while (updatedNeg.status === "pending") {
        if (Date.now() - pollStart > 30000) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        updatedNeg = await buyer.getNegotiation(negotiation.negotiationId);
      }

      if (updatedNeg.status === "accepted") {
        // Poll listOrders until the order is found
        const orderPollStart = Date.now();
        while (!orderId) {
          if (Date.now() - orderPollStart > 30000) {
            break;
          }
          const orders = await buyer.listOrders({ role: "buyer" });
          const matched = orders.find(o => o.negotiationId === negotiation.negotiationId);
          if (matched) {
            orderId = matched.orderId;
            console.log(`Found Order created by live agent! ID: ${orderId}`);
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
        
        if (!orderId) {
          console.error("Error: Negotiation status is accepted, but no matching order was found in buyer's listOrders.");
          process.exit(1);
        }
      } else {
        console.error(`Error: Negotiation is not pending, but status is: ${updatedNeg.status}`);
        process.exit(1);
      }
    } else {
      console.error("Failed to accept negotiation:", err instanceof APIError ? err.message : err);
      process.exit(1);
    }
  }

  // 3. Wait for Order to be in 'created' status (skip in resume mode — order already past this)
  if (resumeOrderId) {
    console.log("\n[Step 3] SKIPPED (resume mode — order already created).");
  } else {
    console.log("\n[Step 3] Waiting for order to be fully created on-chain...");
  }
  let order = await buyer.getOrder(orderId);
  const statusStart = Date.now();
  // 3 min for paying→paid (Base confirmation under load); other steps use same budget
  const timeoutMs = 180000;
  while (order.status === "creating") {
    if (Date.now() - statusStart > timeoutMs) {
      console.error("Error: Timeout waiting for order to move past 'creating' status.");
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    order = await buyer.getOrder(orderId);
    console.log(`  Order status: ${order.status}`);
  }

  if (!resumeOrderId && order.status !== "created") {
    console.error(`Error: Order is in an unexpected state: ${order.status}`);
    process.exit(1);
  }

  // 4. Pay Order (Buyer) — skip in resume mode (already paying/paid)
  if (resumeOrderId) {
    console.log(`\n[Step 4] SKIPPED (resume mode — payTxHash already submitted).`);
  } else {
    console.log(`\n[Step 4] Buyer paying for Order ${orderId}...`);
    try {
      const payResult = await buyer.payOrder(orderId);
      console.log(`Payment transaction submitted! Tx Hash: ${payResult.txHash}`);
    } catch (err) {
      console.error("Failed to pay order:", err instanceof APIError ? err.message : err);
      process.exit(1);
    }
  }

  // 5. Wait for Order to transition to 'paid' (also poll from 'paying' in resume mode)
  console.log("\n[Step 5] Waiting for order to transition to 'paid' status...");
  const payStart = Date.now();
  order = await buyer.getOrder(orderId);
  while (order.status === "created" || order.status === "paying") {
    if (Date.now() - payStart > timeoutMs) {
      console.error(`Error: Timeout (${timeoutMs / 1000}s) waiting for order to leave '${order.status}'. payTxHash=${order.payTxHash || "none"}`);
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    order = await buyer.getOrder(orderId);
    console.log(`  Order status: ${order.status}`);
  }

  if (order.status === OrderStatus.PayFailed) {
    console.error(`Error: Payment failed on-chain. payTxHash: ${order.payTxHash}`);
    process.exit(1);
  }
  if (order.status !== "paid" && order.status !== "delivering" && order.status !== "completed") {
    console.error(`Error: Order is in an unexpected state after paying: ${order.status}`);
    process.exit(1);
  }
  console.log(`Payment confirmed! Order status: ${order.status}`);
  if (order.payTxHash) console.log(`  payTxHash: ${order.payTxHash}`);

  // 6. Deliver Order (Seller)
  console.log("\n[Step 6] Delivering order...");
  if (order.status === "completed" || order.status === "delivering") {
    console.log(`Order already in status '${order.status}' (remote provider is handling delivery)!`);
  } else {
    try {
      const deliverableText = JSON.stringify({
        product: "OnTheRadar CAP report card (E2E Test)",
        agentId: process.env.CROO_AGENT_ID,
        metrics: {
          orderCount: 1,
          revenueRaw: "50000",
          revenueUsdc: 0.05,
          uniqueBuyerCount: 1,
          completionRate: 1,
          breakdown: {
            completed: 1,
            rejected: 0,
            expired: 0,
            other: 0,
          },
        },
        fetchedAt: new Date().toISOString(),
        note: "E2E test purchase delivery payload",
      }, null, 2);

      const result = await seller.deliverOrder(orderId, {
        deliverableType: DeliverableType.Text,
        deliverableText,
      });
      console.log(`Delivery submitted! Tx Hash: ${result.txHash}`);
    } catch (err) {
      console.log("Delivery call failed, checking if already delivered/delivering by remote agent...");
      order = await buyer.getOrder(orderId);
      if (order.status === "completed" || order.status === "delivering") {
        console.log(`Yes, order is now in status '${order.status}' (handled by remote provider).`);
      } else {
        console.error("Failed to deliver order:", err instanceof APIError ? err.message : err);
        process.exit(1);
      }
    }
  }

  // 7. Wait for Order to be completed
  console.log("\n[Step 7] Waiting for order to be completed...");
  const completeStart = Date.now();
  order = await buyer.getOrder(orderId);
  while (order.status !== OrderStatus.Completed) {
    if (Date.now() - completeStart > timeoutMs) {
      console.error("Error: Timeout waiting for order status to become 'completed'.");
      process.exit(1);
    }
    if (order.status === OrderStatus.DeliverFailed || order.status === OrderStatus.Rejected || order.status === OrderStatus.Expired) {
      console.error(`Error: Order failed with status: ${order.status}`);
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    order = await buyer.getOrder(orderId);
    console.log(`  Order status: ${order.status}`);
  }
  console.log("Order completed successfully!");

  // 8. Get Delivery (Buyer)
  console.log("\n[Step 8] Getting Delivery...");
  try {
    const delivery = await buyer.getDelivery(orderId);
    console.log(`Delivery ID: ${delivery.deliveryId}`);
    console.log("--- Deliverable Text ---");
    console.log(delivery.deliverableText);
    console.log("------------------------");
  } catch (err) {
    console.error("Failed to get delivery:", err instanceof APIError ? err.message : err);
    process.exit(1);
  }

  // 9. Re-check listOrders
  console.log("\n[Step 9] Re-checking listOrders to confirm listing...");
  try {
    const finalOrders = await buyer.listOrders({ role: "buyer" });
    const verifiedOrder = finalOrders.find((o) => o.orderId === orderId);
    if (verifiedOrder) {
      console.log(`SUCCESS: Order ${orderId} is verified in listOrders with status: ${verifiedOrder.status}`);
    } else {
      console.error(`FAILED: Order ${orderId} is missing from final listOrders!`);
      process.exit(1);
    }
  } catch (err) {
    console.error("Failed to re-check listOrders:", err);
    process.exit(1);
  }

  console.log("\n=== E2E TEST COMPLETED SUCCESSFULLY! ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
