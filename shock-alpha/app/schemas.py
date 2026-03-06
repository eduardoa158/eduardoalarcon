from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class AssetRequest(BaseModel):
    ticker: str = Field(..., examples=["BTC-USD"])
    start: str = "2018-01-01"
    end: str = "today"
    horizon: Literal["days", "weeks"] = "days"


class UserRiskInput(BaseModel):
    capital: float = Field(gt=0)
    risk_pct: float = Field(gt=0, le=1)
    leverage_enabled: bool = False
    leverage_factor: float = Field(default=1.0, ge=1.0)
    short_allowed: bool = False
    stop_preference: Literal["atr", "structure", "mixed"] = "mixed"
    base_currency: str = "USD"


class SetupResponse(BaseModel):
    direction: str
    entry_zone: tuple[float, float]
    stop_loss: float
    take_profit_1: float
    take_profit_2: float
    rr: float
    position_size: float
    invalidation: str
    confidence: float
