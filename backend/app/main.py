from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import admin, analytics, auth, catalog, health, orders

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Shivam Full Ghar API",
    description="Python FastAPI backend for Shivam Full Ghar (3-Tier Render Architecture)",
    version="2.0.0",
)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()] or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(catalog.router)
app.include_router(orders.router)
app.include_router(analytics.router)
app.include_router(admin.router)
