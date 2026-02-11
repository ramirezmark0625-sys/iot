from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.core.deps import get_db, get_current_user
from app.db import schemas, crud
from app.services.pfc_math import aggregate
from app.services.alerts import evaluate

router = APIRouter(prefix="/telemetry")

@router.post("/ingest")
def ingest(
    telemetry_in: schemas.TelemetryIn,
    db: Session = Depends(get_db),
    x_device_key: str | None = Header(default=None, alias="X-DEVICE-KEY"),
):
    if not x_device_key:
        raise HTTPException(status_code=401, detail="Missing X-DEVICE-KEY header")
    device = crud.get_device_by_key(db, x_device_key)
    if not device:
        raise HTTPException(status_code=401, detail="Invalid device key")

    payload = telemetry_in.model_dump()
    total_kw, total_kvar, avg_pf = aggregate(payload)
    t = crud.create_telemetry(db, device_id=device.id, payload=payload, total_kw=total_kw, total_kvar=total_kvar, avg_pf=avg_pf)

    for sev, title, msg in evaluate(payload, total_kw, avg_pf):
        crud.create_alert(db, device_id=device.id, severity=sev, title=title, message=msg)

    return {"ok": True, "telemetry_id": t.id, "device_id": device.id}

@router.get("/latest", response_model=schemas.TelemetryOut)
def latest(device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    d = crud.get_device(db, device_id, user.id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    t = crud.latest_telemetry(db, device_id)
    if not t:
        raise HTTPException(status_code=404, detail="No telemetry yet")
    return t

@router.get("/range", response_model=list[schemas.TelemetryOut])
def range_data(device_id: int, hours: int = 24, db: Session = Depends(get_db), user=Depends(get_current_user)):
    d = crud.get_device(db, device_id, user.id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    since = datetime.now(timezone.utc) - timedelta(hours=max(1, min(hours, 24*30)))
    return crud.telemetry_range(db, device_id, since)
