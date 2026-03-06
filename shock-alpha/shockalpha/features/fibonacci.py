from __future__ import annotations

import pandas as pd

FIB_LEVELS = [0.236, 0.382, 0.5, 0.618, 0.786]
EXT_LEVELS = [1.272, 1.618]


def detect_confirmed_pivots(df: pd.DataFrame, window: int = 5) -> pd.DataFrame:
    out = df.copy()
    out["pivot_high"] = 0
    out["pivot_low"] = 0
    for i in range(window * 2, len(out)):
        j = i - window
        seg = out.iloc[j - window : j + window + 1]
        if out.iloc[j]["high"] == seg["high"].max():
            out.iloc[j, out.columns.get_loc("pivot_high")] = 1
        if out.iloc[j]["low"] == seg["low"].min():
            out.iloc[j, out.columns.get_loc("pivot_low")] = 1
    return out


def _latest_swing(out: pd.DataFrame, i: int) -> tuple[float, float] | None:
    past = out.iloc[: i + 1]
    highs = past[past["pivot_high"] == 1]
    lows = past[past["pivot_low"] == 1]
    if highs.empty or lows.empty:
        return None
    h = highs.index[-1]
    l = lows.index[-1]
    if h > l:
        return float(past.loc[l, "low"]), float(past.loc[h, "high"])
    return float(past.loc[h, "high"]), float(past.loc[l, "low"])


def add_fibonacci_features(df: pd.DataFrame, window: int = 5) -> pd.DataFrame:
    out = detect_confirmed_pivots(df, window=window)
    for lv in FIB_LEVELS:
        out[f"fib_dist_{lv}"] = pd.NA
        out[f"fib_dist_atr_{lv}"] = pd.NA
    out["fib_break"] = 0
    out["fib_retest"] = 0
    out["fib_rejection"] = 0
    for i in range(len(out)):
        swing = _latest_swing(out, i)
        if swing is None:
            continue
        a, b = swing
        lo, hi = min(a, b), max(a, b)
        r = hi - lo
        close = float(out.iloc[i]["close"])
        atr = float(out.iloc[i].get("atr_14", 1.0) or 1.0)
        for lv in FIB_LEVELS:
            level = hi - lv * r
            d = (close / level - 1.0) * 100
            out.iloc[i, out.columns.get_loc(f"fib_dist_{lv}")] = d
            out.iloc[i, out.columns.get_loc(f"fib_dist_atr_{lv}")] = (close - level) / max(atr, 1e-9)
        prev_close = float(out.iloc[i - 1]["close"]) if i > 0 else close
        mid = hi - 0.5 * r
        out.iloc[i, out.columns.get_loc("fib_break")] = int((prev_close <= mid and close > mid) or (prev_close >= mid and close < mid))
        out.iloc[i, out.columns.get_loc("fib_retest")] = int(abs(close - mid) / max(mid, 1e-9) < 0.002)
        out.iloc[i, out.columns.get_loc("fib_rejection")] = int(out.iloc[i]["fib_retest"] and ((close - prev_close) * (close - mid) > 0))
    return out
