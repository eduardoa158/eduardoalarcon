from __future__ import annotations

import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX


def fit_arimax_forecast(train_y: pd.Series, train_x: pd.DataFrame, test_x: pd.DataFrame) -> pd.Series:
    model = SARIMAX(train_y, exog=train_x, order=(1, 0, 0), trend="c", enforce_stationarity=False, enforce_invertibility=False)
    res = model.fit(disp=False)
    pred = res.get_forecast(steps=len(test_x), exog=test_x).predicted_mean
    return pd.Series(pred.values, index=test_x.index)


def forecast_volatility(returns: pd.Series, horizon: int) -> float:
    vol = returns.ewm(span=20).std().iloc[-1]
    return float((vol or returns.std()) * np.sqrt(horizon))
