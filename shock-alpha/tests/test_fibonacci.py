import pandas as pd

from shockalpha.features.fibonacci import add_fibonacci_features, detect_confirmed_pivots


def test_pivots_and_levels_no_nan_columns():
    idx = pd.date_range("2022-01-01", periods=80, freq="B")
    price = pd.Series(range(80), index=idx).astype(float)
    df = pd.DataFrame({"open": price, "high": price + 1, "low": price - 1, "close": price, "volume": 1_000, "atr_14": 1.0})
    piv = detect_confirmed_pivots(df, window=3)
    out = add_fibonacci_features(piv, window=3)
    assert "fib_dist_0.618" in out.columns
    assert "fib_break" in out.columns


def test_no_future_required_for_current_row():
    idx = pd.date_range("2022-01-01", periods=40, freq="B")
    p = pd.Series([100 + (i % 7) for i in range(40)], index=idx)
    df = pd.DataFrame({"open": p, "high": p + 2, "low": p - 2, "close": p, "volume": 1000, "atr_14": 1.0})
    a = add_fibonacci_features(df.iloc[:30].copy(), window=3)
    b = add_fibonacci_features(df.iloc[:31].copy(), window=3)
    assert a.iloc[-1]["fib_break"] in (0, 1)
    assert b.iloc[-2]["fib_break"] == a.iloc[-1]["fib_break"]
