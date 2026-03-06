from __future__ import annotations

import pandas as pd


def align_assets(frames: dict[str, pd.DataFrame]) -> pd.DataFrame:
    aligned = []
    for asset, df in frames.items():
        tmp = df.copy()
        tmp.columns = pd.MultiIndex.from_product([[asset], tmp.columns])
        aligned.append(tmp)
    out = pd.concat(aligned, axis=1).sort_index().ffill()
    return out.dropna(how="all")
