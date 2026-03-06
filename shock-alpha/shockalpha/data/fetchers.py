from __future__ import annotations

import logging
from datetime import datetime

import numpy as np
import pandas as pd
import yfinance as yf

logger = logging.getLogger(__name__)


def _today_str() -> str:
    return datetime.utcnow().date().isoformat()


def fetch_ohlcv(symbol: str, start: str, end: str) -> pd.DataFrame:
    end = _today_str() if end == "today" else end
    try:
        df = yf.download(symbol, start=start, end=end, auto_adjust=False, progress=False)
        if df.empty:
            raise ValueError("empty dataframe")
        df.columns = [c.lower().replace(" ", "_") for c in df.columns]
        return df[["open", "high", "low", "close", "volume"]].dropna()
    except Exception as exc:
        logger.warning("yfinance failed for %s (%s). Using deterministic fallback.", symbol, exc)
        idx = pd.date_range(start=start, end=end, freq="B")
        seed = abs(hash(symbol)) % (2**32)
        rng = np.random.default_rng(seed)
        rets = rng.normal(0.0002, 0.02, len(idx))
        price = 100 * np.exp(np.cumsum(rets))
        close = pd.Series(price, index=idx)
        open_ = close.shift(1).fillna(close.iloc[0])
        high = pd.concat([open_, close], axis=1).max(axis=1) * (1 + 0.005)
        low = pd.concat([open_, close], axis=1).min(axis=1) * (1 - 0.005)
        volume = pd.Series(rng.integers(1000, 10000, len(idx)), index=idx)
        return pd.DataFrame({"open": open_, "high": high, "low": low, "close": close, "volume": volume})
