from __future__ import annotations

import pandas as pd


def build_shock_index(gdelt: pd.DataFrame, rss_events: pd.DataFrame, on_percentile: float = 0.85) -> pd.DataFrame:
    idx = pd.Index(sorted(set(gdelt.index.tolist()) | set(pd.to_datetime(rss_events.get("date", pd.Series([], dtype="datetime64[ns]"))))))
    if len(idx) == 0:
        return pd.DataFrame(columns=["shock_raw", "shock_index", "shock_on", "dummy_shock"])
    g = gdelt.reindex(idx).fillna(0.0)
    rss_daily = rss_events.groupby("date")["intensity"].sum().reindex(idx).fillna(0.0) if not rss_events.empty else pd.Series(0.0, index=idx)
    raw = g.get("count", pd.Series(0.0, index=idx)).astype(float) + rss_daily.astype(float)
    z = (raw - raw.rolling(30, min_periods=5).mean()) / raw.rolling(30, min_periods=5).std().replace(0, 1)
    norm = ((z - z.min()) / (z.max() - z.min() + 1e-9) * 100).fillna(0.0)
    thr = norm.rolling(180, min_periods=20).quantile(on_percentile).fillna(norm.quantile(on_percentile))
    on = (norm > thr).astype(int)
    return pd.DataFrame({"shock_raw": raw, "shock_index": norm, "shock_on": on, "dummy_shock": on}, index=idx)
