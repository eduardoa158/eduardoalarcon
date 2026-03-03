from __future__ import annotations

import pandas as pd


def simple_regime(features: pd.DataFrame) -> pd.Series:
    score = (features["ret_5d"].fillna(0) - features["realized_vol_20"].fillna(0))
    q = score.quantile([0.33, 0.66]).values
    return pd.Series(pd.cut(score, [-1e9, q[0], q[1], 1e9], labels=["risk_off", "neutral", "risk_on"]), index=features.index)
