from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class AppConfig:
    app_env: str = os.getenv("APP_ENV", "dev")
    host: str = os.getenv("APP_HOST", "0.0.0.0")
    port: int = int(os.getenv("APP_PORT", "8000"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///storage/cache.db")
    timezone: str = "America/Guayaquil"


DEFAULT_TICKERS: dict[str, str] = {
    "BTC": "BTC-USD",
    "GOLD": "GC=F",
    "WTI": "CL=F",
    "XOM": "XOM",
    "CVX": "CVX",
    "SLB": "SLB",
    "LMT": "LMT",
    "NOC": "NOC",
    "RTX": "RTX",
    "DAL": "DAL",
    "UAL": "UAL",
    "NVDA": "NVDA",
    "JPM": "JPM",
}
