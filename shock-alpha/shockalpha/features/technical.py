from __future__ import annotations

import numpy as np
import pandas as pd


def add_technical_features(df: pd.DataFrame, ma_windows: list[int], bollinger_window: int, atr_window: int) -> pd.DataFrame:
    out = df.copy()
    c = out["close"]
    for w in ma_windows:
        out[f"sma_{w}"] = c.rolling(w).mean()
        out[f"ema_{w}"] = c.ewm(span=w, adjust=False).mean()
        out[f"sma_dist_{w}"] = (c / out[f"sma_{w}"] - 1).replace([np.inf, -np.inf], np.nan)
        out[f"sma_slope_{w}"] = out[f"sma_{w}"].diff()
    out["ret_1d"] = c.pct_change()
    out["ret_5d"] = c.pct_change(5)
    std = c.rolling(bollinger_window).std()
    basis = c.rolling(bollinger_window).mean()
    out["bb_basis"] = basis
    out["bb_upper"] = basis + 2 * std
    out["bb_lower"] = basis - 2 * std
    out["bb_z"] = (c - basis) / std.replace(0, np.nan)
    out["bb_bandwidth"] = (out["bb_upper"] - out["bb_lower"]) / basis.replace(0, np.nan)
    out["bb_squeeze"] = (out["bb_bandwidth"] < out["bb_bandwidth"].rolling(60, min_periods=20).quantile(0.2)).astype(int)
    tr = pd.concat([(out["high"] - out["low"]), (out["high"] - c.shift(1)).abs(), (out["low"] - c.shift(1)).abs()], axis=1).max(axis=1)
    out["atr_14"] = tr.rolling(atr_window).mean()
    out["realized_vol_20"] = out["ret_1d"].rolling(20).std() * np.sqrt(252)
    return out
