from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import asyncio
import random
from app.db.database import SessionLocal
from app.db import crud

router = APIRouter()

def _demo_payload():
    # Polished demo simulation close to thesis ranges
    def phase(pf_base):
        v = random.uniform(225, 235)
        i = random.uniform(6, 18)
        pf = max(0.2, min(0.99, random.gauss(pf_base, 0.03)))
        kw = (v * i * pf) / 1000.0
        kva = (v * i) / 1000.0
        kvar = max(0.0, (kva**2 - kw**2) ** 0.5)
        step = random.choice(["OFF","C1","C2","C1+C2","C3","C2+C3"])
        return {"voltage": round(v, 2), "current": round(i, 2), "pf": round(pf, 3), "kw": round(kw, 2), "kvar": round(kvar, 2), "kva": round(kva, 2), "cap_step": step}

    payload = {
        "phaseA": phase(0.90),
        "phaseB": phase(0.93),
        "phaseC": phase(0.91),
        "meta": {"mode": "demo", "timestamp": datetime.now(timezone.utc).isoformat()}
    }
    total_kw = round(payload["phaseA"]["kw"] + payload["phaseB"]["kw"] + payload["phaseC"]["kw"], 2)
    avg_pf = round((payload["phaseA"]["pf"] + payload["phaseB"]["pf"] + payload["phaseC"]["pf"]) / 3.0, 3)
    total_kvar = round(payload["phaseA"]["kvar"] + payload["phaseB"]["kvar"] + payload["phaseC"]["kvar"], 2)
    return {"payload": payload, "total_kw": total_kw, "total_kvar": total_kvar, "avg_pf": avg_pf}

@router.websocket("/ws/live")
async def live(websocket: WebSocket):
    await websocket.accept()
    device_id = websocket.query_params.get("device_id")
    try:
        while True:
            if device_id:
                db: Session = SessionLocal()
                try:
                    t = crud.latest_telemetry(db, int(device_id))
                    if t:
                        await websocket.send_json({
                            "device_id": t.device_id,
                            "created_at": t.created_at.isoformat(),
                            "payload": t.payload,
                            "total_kw": t.total_kw,
                            "total_kvar": t.total_kvar,
                            "avg_pf": t.avg_pf,
                        })
                    else:
                        demo = _demo_payload()
                        await websocket.send_json({"device_id": int(device_id), "created_at": datetime.now(timezone.utc).isoformat(), **demo})
                finally:
                    db.close()
            else:
                demo = _demo_payload()
                await websocket.send_json({"device_id": None, "created_at": datetime.now(timezone.utc).isoformat(), **demo})
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        return
