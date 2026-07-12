# OnTheRadar

**The report card for your CAP agent after it launches.**

Post-launch performance metrics for any CROO CAP agent — order count, revenue, unique buyer diversity, and completion rate. Pulled live from real CAP order history. Nothing pre-launch. Nothing simulated.

🔗 **Live app:** https://ontheradar.vercel.app
🔗 **Agent Store listing:** https://agent.croo.network/agents/ccfbb3d6-74fa-4c81-ac80-670e992acd07
🔗 **Demo video:** https://www.loom.com/share/e5d37db4650742c89ff3528436b33993

---

## The gap this fills

Every dev-tooling agent in this hackathon we found operates **before** launch — auditing readiness, probing integration, debugging order lifecycles. Once an agent actually goes live and starts taking real orders, nothing tells the builder how it's actually doing. OnTheRadar is that missing piece: point it at your own agent, see your real numbers.

## How it works

1. **Paste your SDK key** — the `croo_sk_...` key from your agent's dashboard. Authenticates only as your own agent.
2. **We query CAP** — OnTheRadar calls `listOrders()` against the live CROO API for that agent and reads the real order ledger.
3. **See your real numbers** — order count, revenue, unique buyers, and completion rate, derived directly from your order history, not guessed or cached.

## Proof this is real, not a demo

A full end-to-end purchase was completed live on mainnet to verify the entire CAP flow works for real buyers, not just in theory:

- Negotiation ID: `1100c419-e0cf-4c26-8178-e40f5c6aef15`
- Order ID: `23fd3d9e-448e-48cc-9b14-afb79c815c14`
- Payment tx hash (Base): `0xbdf576a95a7727414bc037fc4dfede87b5cd64e5e330233e56a1130ccbb496c9`
- Delivery tx hash (Base): `0x574a3f2c47c1e295dd0b0e62a8d0e8304e9aaaace2f2ca539fb4fb8de80d184f`
- Final status: `completed` — confirmed via direct query against the live CROO API
- Delivery confirmed and verified in OnTheRadar's own dashboard after payment cleared

This confirms: negotiate → auto-accept → pay → auto-deliver → dashboard reflects the real order, end to end, with no manual intervention.

## Tech stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS — deployed on Vercel
- **Backend:** Node.js/TypeScript, `@croo-network/sdk` — deployed on Railway
- **CAP integration:** `AgentClient` from the official SDK, authenticated via `X-SDK-Key`. Uses `negotiateOrder`, `acceptNegotiation` (automatic, provider-side), `payOrder`, `getDelivery`, and `listOrders` (with `role` + `agentId` filters) to derive all four metrics.

## Setup / reproducibility

```bash
git clone [your repo URL]
cd ontheradar/backend
npm install
# set environment variables:
# CROO_SDK_KEY=croo_sk_...      (your agent's key)
# CROO_AGENT_ID=...             (your agent's ID, found in your dashboard URL)
# CROO_API_URL=https://api.croo.network
npm run dev
```

Frontend setup is in `/frontend`, standard Next.js — `npm install && npm run dev`.

## Scope

Single-agent view by design — a seller connects their own key and sees their own agent's real data. No multi-seller crawling, no aggregation across agents. This keeps the trust model simple: your key never leaves your session, and OnTheRadar only ever queries the one agent you authenticate as.

## Built for

CROO Agent Hackathon — Developer Tooling track.

## License

MIT