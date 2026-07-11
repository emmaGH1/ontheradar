export type AgentMetrics = {
  orderCount: number;
  revenueRaw: string;
  revenueUsdc: number;
  uniqueBuyerCount: number;
  completionRate: number | null;
  breakdown: {
    completed: number;
    rejected: number;
    expired: number;
    other: number;
  };
};

export type Report = {
  agentId: string;
  metrics: AgentMetrics;
  sampleOrders: unknown[];
  fetchedAt: string;
};

export type ReportError = {
  error: string;
  code?: number | string;
  reason?: string;
};
