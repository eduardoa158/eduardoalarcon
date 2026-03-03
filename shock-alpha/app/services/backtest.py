from __future__ import annotations

from pathlib import Path

import pandas as pd


def simple_backtest(df: pd.DataFrame) -> dict[str, float]:
    signal = (df["ma_fast"] > df["ma_slow"]).astype(int).shift(1).fillna(0)
    ret = df["ret_1d"].fillna(0)
    strat = signal * ret
    equity = (1 + strat).cumprod()
    drawdown = equity / equity.cummax() - 1
    win = float((strat > 0).mean())
    sharpe = float((strat.mean() / (strat.std() + 1e-12)) * (252**0.5))
    pf = float(strat[strat > 0].sum() / abs(strat[strat <= 0].sum() + 1e-12))
    return {
        "return_total": float(equity.iloc[-1] - 1),
        "max_drawdown": float(drawdown.min()),
        "sharpe": sharpe,
        "win_rate": win,
        "profit_factor": pf,
    }


def save_backtest_report(report: dict[str, float], ticker: str) -> Path:
    p = Path("storage/reports")
    p.mkdir(parents=True, exist_ok=True)
    out = p / f"{ticker.replace('=','_')}_report.json"
    out.write_text(pd.Series(report).to_json(indent=2), encoding="utf-8")
    return out
