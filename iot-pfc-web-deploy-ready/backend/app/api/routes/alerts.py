from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.db import schemas, crud

router = APIRouter(prefix="/alerts")

@router.get("", response_model=list[schemas.AlertOut])
def list_alerts(device_id: int, limit: int = 200, db: Session = Depends(get_db), user=Depends(get_current_user)):
    d = crud.get_device(db, device_id, user.id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    return crud.list_alerts(db, device_id, limit=limit)

@router.post("/{alert_id}/ack", response_model=schemas.AlertOut)
def ack(alert_id: int, device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    d = crud.get_device(db, device_id, user.id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    a = crud.ack_alert(db, alert_id, device_id)
    if not a:
        raise HTTPException(status_code=404, detail="Alert not found")
    return a
