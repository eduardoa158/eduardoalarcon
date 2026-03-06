import pandas as pd

from shockalpha.shocks.shock_index import build_shock_index


def test_shock_index_bounds():
    idx = pd.date_range("2022-01-01", periods=50, freq="D")
    gdelt = pd.DataFrame({"count": range(50), "tone": 0.0}, index=idx)
    events = pd.DataFrame({"date": idx[::5], "intensity": 1.0})
    out = build_shock_index(gdelt, events)
    assert out["shock_index"].between(0, 100).all()
    assert set(["shock_on", "dummy_shock"]).issubset(out.columns)
