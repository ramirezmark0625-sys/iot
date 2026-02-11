from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import Base, engine, SessionLocal
from app.db import crud
from app.api.router import api_router
from app.api.routes.websocket import router as websocket_router

app = FastAPI(title="IoT Adaptive 3‑Phase PFC API", version="1.0.0")

# CORS (dev convenience; in prod the nginx single-origin makes this mostly unnecessary)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on boot (lightweight thesis/demo setup)
Base.metadata.create_all(bind=engine)

# Optional seed admin
def seed_admin():
    if not settings.SEED_ADMIN:
        return
    db = SessionLocal()
    try:
        existing = crud.get_user_by_email(db, settings.SEED_ADMIN_EMAIL)
        if not existing:
            crud.create_user(db, settings.SEED_ADMIN_EMAIL, settings.SEED_ADMIN_PASSWORD, full_name="Administrator", is_admin=True)
    finally:
        db.close()

seed_admin()

@app.get("/api/health")
def health():
    return {"ok": True}

app.include_router(api_router)
app.include_router(websocket_router)

@app.get("/api")
def api_root():
    return {"message": "IoT PFC Backend Running"}
