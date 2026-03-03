from __future__ import annotations

import pandas as pd


def combined_score(econometric_score: float, technical_score: float, shock_score: float) -> float:
    return max(0.0, min(100.0, 0.45 * econometric_score + 0.35 * technical_score + 0.2 * shock_score))


def technical_score_from_row(row: pd.Series, fib: dict[str, float]) -> float:
    score = 50.0
    score += 15 if row["ma_fast"] > row["ma_slow"] else -15
    score += 10 if row["close"] > row["bb_upper"] else -5 if row["close"] < row["bb_lower"] else 0
    near_fib = min(abs(row["close"] - v) / row["close"] for v in fib.values())
    score += 10 if near_fib < 0.01 else 0
    return max(0.0, min(100.0, score))


def make_setups(
    last_close: float,
    atr: float,
    prob_up: float,
    score: float,
    risk_capital: float,
    risk_pct: float,
    short_allowed: bool,
) -> list[dict]:
    direction = "Long" if prob_up >= 0.52 else "Short" if short_allowed and prob_up < 0.48 else "Flat"
    if direction == "Flat":
        return []
    stop = last_close - 1.5 * atr if direction == "Long" else last_close + 1.5 * atr
    tp1 = last_close + 2.0 * atr if direction == "Long" else last_close - 2.0 * atr
    tp2 = last_close + 3.0 * atr if direction == "Long" else last_close - 3.0 * atr
    risk_per_unit = abs(last_close - stop)
    amount_risk = risk_capital * risk_pct
    size = amount_risk / max(risk_per_unit, 1e-9)
    rr = abs((tp1 - last_close) / (last_close - stop))
    return [
        {
            "direction": direction,
            "entry_zone": [round(last_close * 0.998, 4), round(last_close * 1.002, 4)],
            "stop_loss": round(stop, 4),
            "take_profit_1": round(tp1, 4),
            "take_profit_2": round(tp2, 4),
            "rr": round(rr, 3),
            "position_size": round(size, 6),
            "invalidation": "Ruptura sostenida contra tendencia + shock score en contra",
            "confidence": round(score / 100, 3),
        }
    ]
