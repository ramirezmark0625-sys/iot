"""
Device simulator for quick dashboard demos.

1) Create a device in the UI (Devices page) and copy its API key.
2) Run:
   python -m app.scripts.simulate_device --key <DEVICE_KEY> --url http://localhost/api
"""

import argparse, time, random
import httpx
from datetime import datetime, timezone

def phase(pf_base):
    v = random.uniform(225, 235)
    i = random.uniform(6, 18)
    pf = max(0.2, min(0.99, random.gauss(pf_base, 0.05)))
    kw = (v * i * pf) / 1000.0
    kva = (v * i) / 1000.0
    kvar = max(0.0, (kva**2 - kw**2) ** 0.5)
    step = random.choice(["OFF","C1","C2","C1+C2","C3","C2+C3"])
    return {"voltage": round(v, 2), "current": round(i, 2), "pf": round(pf, 3), "kw": round(kw, 2), "kvar": round(kvar, 2), "kva": round(kva, 2), "cap_step": step}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--key", required=True, help="Device API key (X-DEVICE-KEY)")
    ap.add_argument("--url", default="http://localhost/api", help="API base (default http://localhost/api)")
    ap.add_argument("--interval", type=float, default=1.0, help="Seconds between samples")
    args = ap.parse_args()

    endpoint = args.url.rstrip("/") + "/telemetry/ingest"
    headers = {"X-DEVICE-KEY": args.key}

    with httpx.Client(timeout=10) as client:
        while True:
            payload = {
                "phaseA": phase(0.90),
                "phaseB": phase(0.93),
                "phaseC": phase(0.91),
                "meta": {"mode":"sim", "timestamp": datetime.now(timezone.utc).isoformat(), "firmware":"sim-1.0.0"}
            }
            r = client.post(endpoint, json=payload, headers=headers)
            print(datetime.now().isoformat(timespec="seconds"), r.status_code, r.text[:200])
            time.sleep(args.interval)

if __name__ == "__main__":
    main()
