import { AgentClient, type Config, type Order } from "@croo-network/sdk";

const DEFAULT_API = "https://api.croo.network";
const DEFAULT_WS = "wss://api.croo.network/ws";
const PAGE_SIZE = 100;

export type FetchOrdersInput = {
  sdkKey: string;
  agentId: string;
  baseURL?: string;
  wsURL?: string;
};

export function createClient(sdkKey: string, baseURL?: string, wsURL?: string): AgentClient {
  const config: Config = {
    baseURL: baseURL ?? process.env.CROO_API_URL ?? DEFAULT_API,
    wsURL: wsURL ?? process.env.CROO_WS_URL ?? DEFAULT_WS,
    // Quiet SDK info logs during list pagination
    logger: {
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: () => {},
    },
  };
  return new AgentClient(config, sdkKey);
}

/**
 * Paginate listOrders until a short page. Filters by agentId + provider role
 * so the seller only sees orders for their agent as seller/provider.
 */
export async function fetchAllOrders(input: FetchOrdersInput): Promise<Order[]> {
  const { sdkKey, agentId } = input;
  if (!sdkKey?.startsWith("croo_sk_")) {
    throw new Error("sdkKey must start with croo_sk_");
  }
  if (!agentId?.trim()) {
    throw new Error("agentId is required");
  }

  const client = createClient(sdkKey, input.baseURL, input.wsURL);
  const all: Order[] = [];
  let page = 1;

  for (;;) {
    const batch = await client.listOrders({
      agentId,
      role: "provider",
      page,
      pageSize: PAGE_SIZE,
    });
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    page++;
    // ponytail: hard page cap if API misbehaves; raise if a seller has >10k orders
    if (page > 100) break;
  }

  return all;
}
