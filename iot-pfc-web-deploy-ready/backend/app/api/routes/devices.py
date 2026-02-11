from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.db import schemas, crud

router = APIRouter(prefix="/devices")

@router.get("", response_model=list[schemas.DeviceOut])
def list_devices(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return crud.get_devices_for_user(db, user.id)

@router.post("", response_model=schemas.DeviceOut)
def create_device(device_in: schemas.DeviceCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return crud.create_device(db, owner_id=user.id, name=device_in.name, location=device_in.location)

@router.get("/{device_id}", response_model=schemas.DeviceOut)
def get_device(device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    d = crud.get_device(db, device_id, user.id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    return d

@router.post("/{device_id}/rotate_key", response_model=schemas.DeviceOut)
def rotate_key(device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    d = crud.get_device(db, device_id, user.id)
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    return crud.rotate_device_key(db, d)
