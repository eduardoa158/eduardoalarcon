from __future__ import annotations

import pandas as pd


def shock_event_study(returns: pd.Series, shock_on: pd.Series, window: int = 7) -> dict[str, float]:
    idx = shock_on[shock_on == 1].index
    vals = []
    for d in idx:
        seg = returns.loc[d - pd.Timedelta(days=window) : d + pd.Timedelta(days=window)]
        if not seg.empty:
            vals.append(seg.mean())
    return {f"event_mean_pm_{window}": float(pd.Series(vals).mean() if vals else 0.0)}
