from __future__ import annotations

import pandas as pd


def shift_signals_next_bar(signals: pd.Series) -> pd.Series:
    return signals.shift(1).fillna("FLAT")
