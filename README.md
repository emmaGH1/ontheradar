# OnTheRadar

The report card for your CAP agent after it launches.

Post-launch metrics from real CROO CAP order history: **order count**, **revenue**, **unique buyers**, and **completion rate**.

## Live

- **https://ontheradar.vercel.app** — landing
- **https://ontheradar.vercel.app/app** — dashboard
- CAP report API: `POST /api/report` (same-origin Next route)

Standalone Node backend remains in `backend/` (Railway-ready: `Dockerfile`, `railway.toml`). Deploy when Railway CLI auth works; then set `NEXT_PUBLIC_API_URL` on Vercel if you want traffic to hit Railway instead of the Next API route.

## Stack

| Layer | Location |
|--------|----------|
| Landing + dashboard + CAP API | `frontend/` (Next.js 15, Vercel) |
| Standalone Node API (optional) | `backend/` (Railway-ready) |

## Local

```bash
# Frontend (includes /api/report)
cd frontend
cp .env.example .env.local   # optional
npm install
npm run dev
# http://localhost:3000  → landing
# http://localhost:3000/app → dashboard
```

```bash
# Optional standalone backend
cd backend
cp .env.example .env         # CROO_SDK_KEY, CROO_AGENT_ID for smoke only
npm install
npm start                    # :3001
# Point frontend NEXT_PUBLIC_API_URL=http://localhost:3001 to use it
```

## CAP integration

- `npm install @croo-network/sdk`
- `new AgentClient(config, sellerKey)` → `X-SDK-Key`
- **Read (dashboard):** `listOrders({ agentId, role: "provider" })` → metrics
- **Write (live agent):** WebSocket provider in `backend/src/provider.ts`
  - `NegotiationCreated` → `acceptNegotiation`
  - `OrderPaid` → `deliverOrder` (JSON report card)
  - Requires `CROO_SDK_KEY` + `CROO_AGENT_ID` on the Railway process
  - Status: `GET /provider/status` / included on `GET /health`

## Design

See `DESIGN_BRIEF.md` and `LANDING_PAGE_SKILL.md`.
