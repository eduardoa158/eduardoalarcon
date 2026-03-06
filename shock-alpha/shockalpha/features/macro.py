from __future__ import annotations

import pandas as pd


def build_macro_proxy(index: pd.Index) -> pd.DataFrame:
    # Offline-friendly proxies; extensible to FRED/EIA.
    n = len(index)
    return pd.DataFrame(
        {
            "dxy_proxy": pd.Series(range(n), index=index).pct_change().fillna(0.0),
            "vix_proxy": 0.2,
            "rates_10y_proxy": 0.03,
        },
        index=index,
    )
