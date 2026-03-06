from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

import pandas as pd

STORAGE_DIR = Path("storage")
STORAGE_DIR.mkdir(exist_ok=True)
CACHE_DB = STORAGE_DIR / "cache.db"
SHOCKS_JSON = STORAGE_DIR / "shocks.json"


def init_db() -> None:
    with sqlite3.connect(CACHE_DB) as con:
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS market_cache (
                ticker TEXT NOT NULL,
                date TEXT NOT NULL,
                open REAL,
                high REAL,
                low REAL,
                close REAL,
                volume REAL,
                PRIMARY KEY (ticker, date)
            )
            """
        )


def read_market_cache(ticker: str) -> pd.DataFrame:
    with sqlite3.connect(CACHE_DB) as con:
        df = pd.read_sql_query(
            "SELECT date, open, high, low, close, volume FROM market_cache WHERE ticker=? ORDER BY date",
            con,
            params=[ticker],
        )
    if df.empty:
        return df
    df["date"] = pd.to_datetime(df["date"])
    return df.set_index("date")


def write_market_cache(ticker: str, df: pd.DataFrame) -> None:
    rows = df.reset_index().rename(columns={"index": "date"})
    rows["date"] = pd.to_datetime(rows["date"]).dt.strftime("%Y-%m-%d")
    rows["ticker"] = ticker
    with sqlite3.connect(CACHE_DB) as con:
        rows[["ticker", "date", "open", "high", "low", "close", "volume"]].to_sql(
            "market_cache", con, if_exists="append", index=False
        )
        con.execute(
            "DELETE FROM market_cache WHERE rowid NOT IN (SELECT MIN(rowid) FROM market_cache GROUP BY ticker, date)"
        )


def load_manual_shocks() -> list[dict[str, Any]]:
    if not SHOCKS_JSON.exists():
        return []
    return json.loads(SHOCKS_JSON.read_text(encoding="utf-8"))


def save_manual_shocks(shocks: list[dict[str, Any]]) -> None:
    SHOCKS_JSON.write_text(json.dumps(shocks, indent=2), encoding="utf-8")
