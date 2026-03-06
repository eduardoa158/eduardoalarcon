from __future__ import annotations

import numpy as np
import pandas as pd


def compute_metrics(equity: pd.Series, returns: pd.Series) -> dict[str, float]:
    dd = equity / equity.cummax() - 1
    cagr = (equity.iloc[-1] / equity.iloc[0]) ** (252 / max(len(equity), 1)) - 1
    sharpe = np.sqrt(252) * returns.mean() / (returns.std() + 1e-12)
    sortino = np.sqrt(252) * returns.mean() / (returns[returns < 0].std() + 1e-12)
    hit = float((returns > 0).mean())
    pf = float(returns[returns > 0].sum() / abs(returns[returns < 0].sum() + 1e-12))
    return {
        "cagr": float(cagr),
        "sharpe": float(sharpe),
        "sortino": float(sortino),
        "max_drawdown": float(dd.min()),
        "hit_rate": hit,
        "profit_factor": pf,
        "exposure": float((returns != 0).mean()),
        "turnover": float((returns.diff().abs() > 0).mean()),
    }
