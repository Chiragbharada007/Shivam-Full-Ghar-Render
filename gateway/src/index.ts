import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { gatewayCache } from "./cache";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 30000);

const CACHEABLE_PREFIXES = [
  "/api/categories",
  "/api/products",
  "/api/packages",
  "/api/banners",
  "/api/pages",
  "/api/site-settings",
  "/api/delivery-areas",
  "/api/reviews",
];

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    credentials: true,
  })
);

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 60 * 1000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", async (_req: Request, res: Response) => {
  let backendOk = false;
  try {
    const r = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(4000) });
    backendOk = r.ok;
  } catch {
    backendOk = false;
  }
  res.json({
    status: "ok",
    service: "shivam-full-ghar-gateway",
    backendConnected: backendOk,
    cacheEntries: gatewayCache.size(),
  });
});

// Express raw body capture so multipart uploads and JSON both forward cleanly
app.use(express.raw({ type: "*/*", limit: "15mb" }));

app.all("/api/*", async (req: Request, res: Response) => {
  const isCacheableGet =
    req.method === "GET" && CACHEABLE_PREFIXES.some((prefix) => req.path.startsWith(prefix));
  const cacheKey = req.originalUrl;

  if (isCacheableGet) {
    const hit = gatewayCache.get(cacheKey);
    if (hit) {
      res.setHeader("X-Gateway-Cache", "HIT");
      res.setHeader("Content-Type", hit.contentType);
      res.status(hit.status).send(hit.body);
      return;
    }
  }

  // Invalidate cache when admin mutates data
  if (req.method !== "GET" && req.path.startsWith("/api/admin")) {
    gatewayCache.clearAll();
  }

  const targetUrl = `${BACKEND_URL}${req.originalUrl}`;
  const forwardHeaders: Record<string, string> = {};

  for (const [key, val] of Object.entries(req.headers)) {
    if (!val || key === "host" || key === "content-length") continue;
    forwardHeaders[key] = Array.isArray(val) ? val.join(", ") : val;
  }

  // Forward client IP for Python geolocation telemetry
  const clientIp = req.headers["x-forwarded-for"] || req.ip || "";
  if (clientIp) {
    forwardHeaders["x-forwarded-for"] = Array.isArray(clientIp) ? clientIp[0] : String(clientIp);
  }

  try {
    const hasBody = !["GET", "HEAD"].includes(req.method) && Buffer.isBuffer(req.body) && req.body.length > 0;
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: hasBody ? req.body : undefined,
      signal: AbortSignal.timeout(25000),
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const buf = Buffer.from(await upstream.arrayBuffer());

    // Forward Set-Cookie and Content-Disposition headers
    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    const disposition = upstream.headers.get("content-disposition");
    if (disposition) res.setHeader("Content-Disposition", disposition);

    if (isCacheableGet && upstream.ok) {
      gatewayCache.set(cacheKey, { status: upstream.status, contentType, body: buf }, CACHE_TTL_MS);
      res.setHeader("X-Gateway-Cache", "MISS");
    }

    res.setHeader("Content-Type", contentType);
    res.status(upstream.status).send(buf);
  } catch (err: any) {
    res.status(502).json({
      success: false,
      message: "API Gateway could not reach Python FastAPI backend",
      error: err?.message || "Bad Gateway",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Shivam Full Ghar Express Gateway listening on port ${PORT} -> ${BACKEND_URL}`);
});
