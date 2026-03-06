import pandas as pd

from shockalpha.features.leakage_checks import assert_no_future_columns, ensure_target_shift


def test_detect_forbidden_columns():
    df = pd.DataFrame({"x": [1, 2], "future_ret": [0.1, 0.2]})
    try:
        assert_no_future_columns(df)
        raise AssertionError("Expected leakage detection")
    except AssertionError:
        pass


def test_target_shift():
    x = pd.DataFrame({"a": [1, 2, 3]})
    y = pd.Series([10, 20, 30])
    out = ensure_target_shift(x, y, 1)
    assert out["target_1d"].iloc[0] == 20
