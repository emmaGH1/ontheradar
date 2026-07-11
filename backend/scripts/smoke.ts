/**
 * Stage-1 smoke: hit CAP listOrders with a real SDK key and print metrics.
 *
 * Usage:
 *   set CROO_SDK_KEY=croo_sk_...
 *   set CROO_AGENT_ID=your-agent-id
 *   npm run smoke
 *
 * Or: npx tsx scripts/smoke.ts croo_sk_... agent-id
 */
import { buildReport } from "../src/report.js";
import { APIError } from "@croo-network/sdk";

async function main() {
  const sdkKey = process.argv[2] ?? process.env.CROO_SDK_KEY ?? "";
  const agentId = process.argv[3] ?? process.env.CROO_AGENT_ID ?? "";

  if (!sdkKey || !agentId) {
    console.error(
      "Missing credentials.\n" +
        "  CROO_SDK_KEY + CROO_AGENT_ID env vars, or:\n" +
        "  npm run smoke -- <sdkKey> <agentId>",
    );
    process.exit(1);
  }

  console.log("Fetching orders from CAP…");
  console.log(`  API: ${process.env.CROO_API_URL ?? "https://api.croo.network"}`);
  console.log(`  agentId: ${agentId}`);
  console.log(`  sdkKey: ${sdkKey.slice(0, 12)}…`);

  try {
    const report = await buildReport({ sdkKey, agentId });
    console.log("\n=== METRICS ===");
    console.log(JSON.stringify(report.metrics, null, 2));
    console.log("\n=== SAMPLE ORDERS (up to 5) ===");
    console.log(JSON.stringify(report.sampleOrders, null, 2));
    console.log(`\nfetchedAt: ${report.fetchedAt}`);
  } catch (err) {
    if (err instanceof APIError) {
      console.error("CAP APIError:", {
        status: err.httpStatus,
        code: err.code,
        reason: err.reason,
        message: err.message,
      });
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
