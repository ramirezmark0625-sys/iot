import math
from typing import Dict, Any

def safe_pf(pf: float) -> float:
    return max(0.0, min(1.0, pf))

def reactive_from_kw_pf(kw: float, pf: float) -> float:
    # Q = P * tan(arccos(pf))
    pf = max(1e-6, safe_pf(pf))
    return float(kw * math.tan(math.acos(pf)))

def aggregate(payload: Dict[str, Any]) -> tuple[float, float, float]:
    # returns (total_kw, total_kvar, avg_pf)
    phases = [payload.get("phaseA"), payload.get("phaseB"), payload.get("phaseC")]
    kw = sum(float(p.get("kw", 0.0)) for p in phases if p)
    kvar = sum(float(p.get("kvar", 0.0)) for p in phases if p)
    pf = sum(float(p.get("pf", 0.0)) for p in phases if p) / 3.0
    return float(kw), float(kvar), float(pf)
