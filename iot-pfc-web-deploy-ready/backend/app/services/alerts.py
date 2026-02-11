from typing import Dict, Any, List, Tuple

SENSOR_KW_LIMIT = 22.0  # thesis sensor safe limit

def evaluate(payload: Dict[str, Any], total_kw: float, avg_pf: float) -> List[Tuple[str, str, str]]:
    """Return list of (severity, title, message)"""
    alerts = []

    if total_kw > SENSOR_KW_LIMIT:
        alerts.append((
            "critical",
            "Load exceeds 22 kW sensor limit",
            f"Measured total active power is {total_kw:.2f} kW which exceeds the 22 kW safe/accurate sensor capacity."
        ))

    # pf health hints
    if avg_pf < 0.60:
        alerts.append((
            "warning",
            "Low average power factor detected",
            f"Average PF is {avg_pf:.2f}. Consider enabling additional correction steps or reviewing inductive load balance."
        ))
    elif avg_pf < 0.85:
        alerts.append((
            "info",
            "Moderate power factor",
            f"Average PF is {avg_pf:.2f}. The system can further optimize toward near‑unity PF depending on load conditions."
        ))

    # capacitor switching sanity (optional hints)
    for ph in ("phaseA","phaseB","phaseC"):
        p = payload.get(ph, {})
        step = (p.get("cap_step") or "").strip()
        if step and len(step) > 25:
            alerts.append((
                "info",
                "Capacitor configuration note",
                f"{ph}: complex capacitor step name detected; consider a shorter mapping for readability."
            ))
    return alerts
