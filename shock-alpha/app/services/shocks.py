from __future__ import annotations

import logging
from datetime import datetime

import pandas as pd
import requests

from app.services.storage import load_manual_shocks, save_manual_shocks

logger = logging.getLogger(__name__)

KEYWORDS = ["iran", "israel", "hormuz", "missile", "airstrike", "sanctions", "shipping"]


def fetch_gdelt_news(max_records: int = 50) -> list[dict]:
    query = '((Iran AND Israel) OR Hormuz OR missile OR airstrike OR sanctions OR shipping)'
    try:
        r = requests.get(
            "https://api.gdeltproject.org/api/v2/doc/doc",
            params={"query": query, "mode": "ArtList", "maxrecords": max_records, "format": "json"},
            timeout=15,
        )
        r.raise_for_status()
        arts = r.json().get("articles", [])
        out = []
        for a in arts:
            title = a.get("title", "")
            text = f"{title} {a.get('seendate','')}".lower()
            score = min(5, sum(1 for k in KEYWORDS if k in text))
            out.append(
                {
                    "datetime": a.get("seendate", datetime.utcnow().isoformat()),
                    "source": a.get("sourceCommonName", "gdelt"),
                    "title": title,
                    "url": a.get("url", ""),
                    "impact_score": score,
                }
            )
        return out
    except Exception as exc:
        logger.warning("GDELT unavailable: %s", exc)
        return []


def news_proxies(news: list[dict]) -> pd.DataFrame:
    if not news:
        return pd.DataFrame(columns=["date", "news_count", "avg_tone", "shock_score"]) 
    df = pd.DataFrame(news)
    df["date"] = pd.to_datetime(df["datetime"], errors="coerce").dt.normalize()
    g = df.groupby("date").agg(news_count=("title", "count"), avg_tone=("impact_score", "mean"))
    g["shock_score"] = (g["news_count"] * 0.6 + g["avg_tone"] * 0.4).clip(0, 5)
    return g.reset_index()


def add_manual_shock(name: str, start: str, end: str, intensity: float) -> list[dict]:
    shocks = load_manual_shocks()
    shocks.append({"name": name, "start": start, "end": end, "intensity": intensity})
    save_manual_shocks(shocks)
    return shocks


def manual_dummy(index: pd.DatetimeIndex) -> pd.Series:
    dummy = pd.Series(0, index=index, dtype=float)
    for s in load_manual_shocks():
        mask = (index >= pd.Timestamp(s["start"])) & (index <= pd.Timestamp(s["end"]))
        dummy.loc[mask] = max(dummy.loc[mask], float(s.get("intensity", 1.0)))
    return dummy
