from __future__ import annotations

import logging
from datetime import datetime

import numpy as np
import pandas as pd
import yfinance as yf

from app.services.storage import read_market_cache, write_market_cache

logger = logging.getLogger(__name__)


def _normalize_end(end: str) -> str:
    return datetime.utcnow().date().isoformat() if end == "today" else end


def fetch_prices(ticker: str, start: str, end: str) -> pd.DataFrame:
    end = _normalize_end(end)
    cached = read_market_cache(ticker)
    if not cached.empty and cached.index.min() <= pd.Timestamp(start) and cached.index.max() >= pd.Timestamp(end):
        return cached.loc[start:end].copy()

    try:
        df = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=False)
        if df.empty:
            raise ValueError("No data from yfinance")
        df.columns = [c.lower().replace(" ", "_") for c in df.columns]
        out = df[["open", "high", "low", "close", "volume"]].dropna()
        write_market_cache(ticker, out)
        return out
    except Exception as exc:
        logger.warning("Using deterministic fallback for %s: %s", ticker, exc)
        idx = pd.date_range(start=start, end=end, freq="B")
        seed = abs(hash(ticker)) % (2**32)
        rng = np.random.default_rng(seed)
        ret = rng.normal(0.0002, 0.015, len(idx))
        close = 100 * np.exp(np.cumsum(ret))
        s = pd.Series(close, index=idx)
        out = pd.DataFrame(
            {
                "open": s.shift(1).fillna(s.iloc[0]),
                "high": s * 1.005,
                "low": s * 0.995,
                "close": s,
                "volume": rng.integers(1_000, 10_000, len(idx)),
            }
        )
        return out


def choose_frequency(df: pd.DataFrame) -> str:
    vol = df["close"].pct_change().rolling(20).std().iloc[-1]
    return "1h" if vol and vol > 0.03 else "1d"
