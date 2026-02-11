from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone
import secrets
from app.db import models
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email.lower()).first()

def create_user(db: Session, email: str, password: str, full_name: str | None = None, is_admin: bool = False):
    user = models.User(
        email=email.lower(),
        full_name=full_name,
        hashed_password=get_password_hash(password),
        is_admin=is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def _new_device_key() -> str:
    return secrets.token_urlsafe(32)

def create_device(db: Session, owner_id: int, name: str, location: str | None = None):
    device = models.Device(name=name, location=location, owner_id=owner_id, api_key=_new_device_key())
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

def rotate_device_key(db: Session, device: models.Device):
    device.api_key = _new_device_key()
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

def get_devices_for_user(db: Session, user_id: int):
    return db.query(models.Device).filter(models.Device.owner_id == user_id).order_by(models.Device.created_at.desc()).all()

def get_device(db: Session, device_id: int, user_id: int):
    return db.query(models.Device).filter(models.Device.id == device_id, models.Device.owner_id == user_id).first()

def get_device_by_key(db: Session, api_key: str):
    return db.query(models.Device).filter(models.Device.api_key == api_key).first()

def create_telemetry(db: Session, device_id: int, payload: dict, total_kw: float, total_kvar: float, avg_pf: float):
    t = models.Telemetry(device_id=device_id, payload=payload, total_kw=total_kw, total_kvar=total_kvar, avg_pf=avg_pf)
    db.add(t)
    # update last seen
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if device:
        device.last_seen_at = datetime.now(timezone.utc)
        db.add(device)
    db.commit()
    db.refresh(t)
    return t

def latest_telemetry(db: Session, device_id: int):
    return db.query(models.Telemetry).filter(models.Telemetry.device_id == device_id).order_by(desc(models.Telemetry.created_at)).first()

def telemetry_range(db: Session, device_id: int, since_dt):
    return (
        db.query(models.Telemetry)
        .filter(models.Telemetry.device_id == device_id, models.Telemetry.created_at >= since_dt)
        .order_by(models.Telemetry.created_at.asc())
        .all()
    )

def create_alert(db: Session, device_id: int, severity: str, title: str, message: str):
    a = models.Alert(device_id=device_id, severity=severity, title=title, message=message)
    db.add(a)
    db.commit()
    db.refresh(a)
    return a

def list_alerts(db: Session, device_id: int, limit: int = 200):
    return (
        db.query(models.Alert)
        .filter(models.Alert.device_id == device_id)
        .order_by(models.Alert.created_at.desc())
        .limit(limit)
        .all()
    )

def ack_alert(db: Session, alert_id: int, device_id: int):
    a = db.query(models.Alert).filter(models.Alert.id == alert_id, models.Alert.device_id == device_id).first()
    if not a:
        return None
    a.is_ack = True
    db.add(a)
    db.commit()
    db.refresh(a)
    return a
