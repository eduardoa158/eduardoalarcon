from __future__ import annotations

import logging
from datetime import datetime

import feedparser
import pandas as pd

logger = logging.getLogger(__name__)


def score_text(text: str, escalation: list[str], deescalation: list[str]) -> int:
    t = text.lower()
    up = sum(1 for k in escalation if k in t)
    down = sum(1 for k in deescalation if k in t)
    return up - down


def fetch_rss_events(feeds: list[str], escalation: list[str], deescalation: list[str]) -> pd.DataFrame:
    rows: list[dict[str, object]] = []
    for feed in feeds:
        try:
            parsed = feedparser.parse(feed)
            for e in parsed.entries[:100]:
                title = getattr(e, "title", "")
                summary = getattr(e, "summary", "")
                txt = f"{title} {summary}".strip()
                score = score_text(txt, escalation, deescalation)
                if score == 0:
                    continue
                dt = getattr(e, "published_parsed", None)
                ts = datetime(*dt[:6]) if dt else datetime.utcnow()
                rows.append(
                    {
                        "date": pd.Timestamp(ts).normalize(),
                        "event_name": title[:120],
                        "shock_type": "escalation" if score > 0 else "deescalation",
                        "source": feed,
                        "dummy": 1,
                        "intensity": abs(score),
                        "notes": txt[:200],
                    }
                )
        except Exception as exc:
            logger.warning("RSS feed failed: %s (%s)", feed, exc)
    if not rows:
        return pd.DataFrame(columns=["date", "event_name", "shock_type", "source", "dummy", "intensity", "notes"])
    return pd.DataFrame(rows)
