import pandas as pd

from shockalpha.backtest.walk_forward import run_walk_forward


def test_walk_forward_outputs_metrics():
    idx = pd.date_range("2018-01-01", periods=900, freq="B")
    close = pd.Series(range(900), index=idx).astype(float) + 100
    df = pd.DataFrame({
        "open": close,
        "high": close + 1,
        "low": close - 1,
        "close": close,
        "volume": 1000,
        "ret_1d": close.pct_change().fillna(0),
        "ret_5d": close.pct_change(5).fillna(0),
        "realized_vol_20": close.pct_change().rolling(20).std().fillna(0.01),
        "atr_14": 1.0,
        "shock_on": 0,
        "dummy_shock": 0,
    }, index=idx)
    cfg = {"walk_forward": {"train_days": 252, "test_days": 63}}
    out, m = run_walk_forward(df, ["ret_5d", "realized_vol_20", "shock_on", "dummy_shock"], cfg)
    assert "pred_return" in out.columns
    assert "sharpe" in m
