from __future__ import annotations

import pandas as pd

from shockalpha.features.fibonacci import add_fibonacci_features
from shockalpha.features.macro import build_macro_proxy
from shockalpha.features.technical import add_technical_features


def build_feature_matrix(df: pd.DataFrame, cfg: dict) -> pd.DataFrame:
    out = add_technical_features(
        df,
        ma_windows=cfg["features"]["ma_windows"],
        bollinger_window=cfg["features"]["bollinger_window"],
        atr_window=cfg["features"]["atr_window"],
    )
    out = add_fibonacci_features(out, window=cfg["features"]["pivot_window"])
    out = out.join(build_macro_proxy(out.index), how="left")
    return out
