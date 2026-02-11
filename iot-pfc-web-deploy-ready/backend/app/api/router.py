from fastapi import APIRouter
from app.api.routes import auth, devices, telemetry, alerts

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(devices.router, tags=["devices"])
api_router.include_router(telemetry.router, tags=["telemetry"])
api_router.include_router(alerts.router, tags=["alerts"])
