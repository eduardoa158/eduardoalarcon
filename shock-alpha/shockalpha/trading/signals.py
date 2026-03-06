from __future__ import annotations

import pandas as pd

from shockalpha.trading.position_sizing import size_from_risk
from shockalpha.trading.risk import combine_stop


def generate_signals(df: pd.DataFrame, cfg: dict, asset: str) -> pd.DataFrame:
    rows = []
    for ts, r in df.iterrows():
        exp_ret = float(r.get("pred_return", 0.0))
        prob = float(r.get("prob_up", 0.5))
        shock_on = int(r.get("shock_on", 0))
        regime = "SHOCK_ON" if shock_on else "NORMAL"
        th = 0.001 if not shock_on else 0.0
        signal = "LONG" if exp_ret > th and prob > 0.55 else "SHORT" if exp_ret < -th and prob < 0.45 else "FLAT"
        entry = float(r["close"])
        atr = float(r.get("atr_14", 1.0) or 1.0)
        fib_inv = entry - atr if signal == "LONG" else entry + atr
        stop = combine_stop(entry, atr, fib_inv, signal if signal != "FLAT" else "LONG", cfg["risk"]["atr_stop_k"])
        tp1 = entry + (entry - stop) if signal == "LONG" else entry - (stop - entry)
        tp2 = entry + 1.6 * (entry - stop) if signal == "LONG" else entry - 1.6 * (stop - entry)
        rr = abs((tp1 - entry) / (entry - stop)) if entry != stop else 0.0
        size = size_from_risk(float(r.get("vol_fcst", 0.02)), cfg["risk"]["risk_per_trade"], cfg["risk"]["max_position"])
        rows.append(
            {
                "timestamp": ts,
                "asset": asset,
                "regime": regime,
                "signal": signal,
                "entry_low": entry * 0.999,
                "entry_high": entry * 1.001,
                "stop": stop,
                "tp1": tp1,
                "tp2": tp2,
                "rr": rr,
                "confidence": prob,
                "rationale": f"exp_ret={exp_ret:.4f},shock={shock_on}",
                "invalidation": "close beyond fib/atr stop",
                "position_size": size,
            }
        )
    return pd.DataFrame(rows)
