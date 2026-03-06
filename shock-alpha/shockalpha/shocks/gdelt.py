from __future__ import annotations

import logging
from datetime import datetime

import pandas as pd
import requests

logger = logging.getLogger(__name__)

QUERY = '((Iran AND Israel) OR Hormuz OR missile OR airstrike OR sanctions OR shipping)'


def fetch_gdelt_daily(start: str, end: str) -> pd.DataFrame:
    # Lightweight placeholder endpoint call with robust fallback.
    url = "https://api.gdeltproject.org/api/v2/doc/doc"
    params = {
        "query": QUERY,
        "mode": "TimelineVolRaw",
        "format": "json",
        "maxrecords": 250,
        "startdatetime": start.replace("-", "") + "000000",
        "enddatetime": (datetime.utcnow().strftime("%Y%m%d") if end == "today" else end.replace("-", "")) + "000000",
    }
    try:
        r = requests.get(url, params=params, timeout=20)
        r.raise_for_status()
        data = r.json().get("timeline", [])
        rows = []
        for x in data:
            rows.append({"date": pd.to_datetime(x["date"]), "count": float(x.get("value", 0.0)), "tone": 0.0})
        if not rows:
            raise ValueError("No GDELT timeline rows")
        return pd.DataFrame(rows).set_index("date").sort_index()
    except Exception as exc:
        logger.warning("GDELT unavailable (%s), fallback to empty", exc)
        return pd.DataFrame(columns=["count", "tone"], dtype=float)
