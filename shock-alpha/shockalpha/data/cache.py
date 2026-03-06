from __future__ import annotations

from pathlib import Path

import pandas as pd


def cache_path(base: Path, symbol: str, start: str, end: str) -> Path:
    safe = symbol.replace("=", "_").replace("-", "_")
    return base / f"{safe}_{start}_{end}.parquet"


def read_cache(path: Path) -> pd.DataFrame | None:
    if path.exists():
        return pd.read_parquet(path)
    return None


def write_cache(path: Path, df: pd.DataFrame) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path, index=True)
