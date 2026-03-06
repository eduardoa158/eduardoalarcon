from __future__ import annotations

import pandas as pd


def assert_no_future_columns(df: pd.DataFrame) -> None:
    forbidden = [c for c in df.columns if "lead" in c or "future" in c]
    if forbidden:
        raise AssertionError(f"Potential leakage columns: {forbidden}")


def ensure_target_shift(features: pd.DataFrame, target: pd.Series, horizon: int) -> pd.DataFrame:
    out = features.copy()
    out[f"target_{horizon}d"] = target.shift(-horizon)
    return out
