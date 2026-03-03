from __future__ import annotations

import pandas as pd


def calibrate_confidence(prob_up: pd.Series, shock_on: pd.Series) -> pd.Series:
    adj = prob_up.copy()
    adj[shock_on == 1] = (adj[shock_on == 1] * 1.1).clip(0, 1)
    return adj
