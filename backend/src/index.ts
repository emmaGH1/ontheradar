import http from "node:http";
import { buildReport } from "./report.js";
import { APIError } from "@croo-network/sdk";

const PORT = Number(process.env.PORT ?? 3001);

function json(res: http.ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(payload);
}

async function readBody(req: http.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return json(res, 204, null);
  }

  if (req.method === "GET" && req.url === "/health") {
    return json(res, 200, { ok: true });
  }

  // POST /api/report  { sdkKey, agentId }
  if (req.method === "POST" && req.url === "/api/report") {
    try {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const sdkKey = String(body.sdkKey ?? "");
      const agentId = String(body.agentId ?? "");

      if (!sdkKey || !agentId) {
        return json(res, 400, { error: "sdkKey and agentId are required" });
      }

      const report = await buildReport({ sdkKey, agentId });
      return json(res, 200, report);
    } catch (err) {
      if (err instanceof APIError) {
        const status =
          err.httpStatus >= 400 && err.httpStatus < 600 ? err.httpStatus : 502;
        return json(res, status, {
          error: err.message || err.reason,
          code: err.code,
          reason: err.reason,
        });
      }
      const message = err instanceof Error ? err.message : String(err);
      console.error("report failed:", message);
      return json(res, 500, { error: message });
    }
  }

  json(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(`ontheradar backend listening on :${PORT}`);
});
