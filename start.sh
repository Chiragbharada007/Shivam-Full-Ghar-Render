#!/usr/bin/env bash
set -e

echo "=== [1/4] Initializing & seeding PostgreSQL schema ==="
cd /app/backend
python3 seed.py

echo "=== [2/4] Starting Python FastAPI on 127.0.0.1:8000 ==="
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
API_PID=$!

echo "=== [3/4] Starting Express.js Gateway on 127.0.0.1:4000 ==="
cd /app/gateway
PORT=4000 BACKEND_URL=http://127.0.0.1:8000 node dist/index.js &
GW_PID=$!

# Wait briefly for internal services
sleep 2

echo "=== [4/4] Starting Next.js Frontend on 0.0.0.0:${PORT:-10000} ==="
cd /app/frontend
export GATEWAY_URL=http://127.0.0.1:4000
export NEXT_PUBLIC_GATEWAY_URL=""
exec npx next start -H 0.0.0.0 -p "${PORT:-10000}"
