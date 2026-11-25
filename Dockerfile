FROM node:22-bookworm-slim

# Install Python 3 & build tools for FastAPI + psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Install Python FastAPI backend
COPY backend/requirements.txt ./backend/requirements.txt
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir -r backend/requirements.txt

# 2. Build Express.js Gateway
COPY gateway/package*.json ./gateway/
RUN cd gateway && npm install --no-audit --no-fund
COPY gateway ./gateway
RUN cd gateway && npm run build

# 3. Build Next.js Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --no-audit --no-fund
COPY frontend ./frontend
RUN cd frontend && npm run build

# 4. Copy Python backend source & entrypoint
COPY backend ./backend
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

ENV PATH="/opt/venv/bin:$PATH"
ENV NODE_ENV=production

EXPOSE 10000

CMD ["./start.sh"]
