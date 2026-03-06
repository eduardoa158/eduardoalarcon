from __future__ import annotations

import pandas as pd

from shockalpha.backtest.metrics import compute_metrics
from shockalpha.models.arimax_garch import fit_arimax_forecast, forecast_volatility
from shockalpha.models.calibration import calibrate_confidence
from shockalpha.models.ml_baseline import fit_predict_prob
from shockalpha.trading.execution_rules import shift_signals_next_bar


def run_walk_forward(df: pd.DataFrame, exog_cols: list[str], cfg: dict) -> tuple[pd.DataFrame, dict[str, float]]:
    train = cfg["walk_forward"]["train_days"]
    test = cfg["walk_forward"]["test_days"]
    out = df.copy()
    out["pred_return"] = 0.0
    out["prob_up"] = 0.5
    out["vol_fcst"] = 0.02
    y = out["ret_1d"].fillna(0)
    x = out[exog_cols].fillna(0)
    for start in range(train, len(out), test):
        tr = slice(start - train, start)
        te = slice(start, min(start + test, len(out)))
        if te.stop - te.start <= 0:
            continue
        pred = fit_arimax_forecast(y.iloc[tr], x.iloc[tr], x.iloc[te])
        prob = fit_predict_prob(x.iloc[tr], y.iloc[tr], x.iloc[te])
        out.iloc[te, out.columns.get_loc("pred_return")] = pred.values
        out.iloc[te, out.columns.get_loc("prob_up")] = prob.values
        out.iloc[te, out.columns.get_loc("vol_fcst")] = forecast_volatility(y.iloc[tr], 1)
    out["prob_up"] = calibrate_confidence(out["prob_up"], out.get("shock_on", pd.Series(0, index=out.index)))
    out["trade_signal"] = shift_signals_next_bar(pd.Series(["FLAT"] * len(out), index=out.index))
    strat_ret = out["pred_return"].shift(1).fillna(0) * y
    equity = (1 + strat_ret).cumprod()
    metrics = compute_metrics(equity, strat_ret)
    return out, metrics
