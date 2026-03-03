from __future__ import annotations


def size_from_risk(vol_forecast: float, risk_per_trade: float, max_position: float) -> float:
    if vol_forecast <= 0:
        return 0.0
    return float(min(max_position, risk_per_trade / vol_forecast))
