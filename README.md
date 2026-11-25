# Shivam Full Ghar (શિવમ ફૂલ ઘર) — Render.com 3-Tier Architecture

High-performance 3-tier e-commerce & wedding floral boutique platform engineered for **Render.com**:

1. **`frontend/` — Next.js 16 (App Router + `next-intl` en/gu/hi)**
   - Storefront, Custom Garland Builder, Quotation Acceptance, Order Tracking, and Owner Admin Console.
   - Zero direct database connections — communicates exclusively via the Express.js API Gateway.

2. **`gateway/` — Express.js API Gateway & In-Memory Cache**
   - Security headers (`helmet`), gzip compression, rate limiting, and smart TTL in-memory caching for instant storefront loads.
   - Automatic cache invalidation on admin updates and transparent proxy to the Python FastAPI backend.

3. **`backend/` — Python 3.12 FastAPI + SQLAlchemy 2.0 + PostgreSQL**
   - Full REST API for catalog, orders, custom requests, quotations, SEO audit, visitor geolocation & email tracking, OTP via Resend/SMS, and 2-Security-Questions emergency fallback authentication.
   - Includes `seed.py` for idempotent fresh database initialization.

## Local Development

```bash
# 1. Start PostgreSQL & Python FastAPI
cd backend && pip install -r requirements.txt && python seed.py && uvicorn app.main:app --reload --port 8000

# 2. Start Express.js Gateway
cd gateway && npm install && npm run dev

# 3. Start Next.js Frontend
cd frontend && npm install && npm run dev
```

## Render.com Deployment

Use the included `render.yaml` Blueprint to provision PostgreSQL, FastAPI, Express Gateway, and Next.js Web Service together.
