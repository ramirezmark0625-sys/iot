from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    is_admin: bool
    created_at: datetime
    class Config:
        from_attributes = True

class DeviceCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    location: Optional[str] = None

class DeviceOut(BaseModel):
    id: int
    name: str
    location: Optional[str] = None
    api_key: str
    created_at: datetime
    last_seen_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class PhaseData(BaseModel):
    voltage: float
    current: float
    pf: float
    kw: float
    kvar: float
    kva: float
    cap_step: Optional[str] = None

class TelemetryIn(BaseModel):
    phaseA: PhaseData
    phaseB: PhaseData
    phaseC: PhaseData
    meta: Optional[Dict[str, Any]] = None

class TelemetryOut(BaseModel):
    id: int
    device_id: int
    payload: Dict[str, Any]
    total_kw: float
    total_kvar: float
    avg_pf: float
    created_at: datetime
    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: int
    device_id: int
    severity: str
    title: str
    message: str
    is_ack: bool
    created_at: datetime
    class Config:
        from_attributes = True
