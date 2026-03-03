from __future__ import annotations

import logging
from datetime import timedelta

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from statsmodels.tsa.statespace.sarimax import SARIMAX

logger = logging.getLogger(__name__)


def technical_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    c = out["close"]
    out["ret_1d"] = c.pct_change()
    out["ma_20"] = c.rolling(20).mean()
    out["ma_50"] = c.rolling(50).mean()
    std = c.rolling(20).std()
    out["bb_upper"] = out["ma_20"] + 2 * std
    out["bb_lower"] = out["ma_20"] - 2 * std
    out["bb_mid"] = out["ma_20"]
    tr = pd.concat(
        [
            (out["high"] - out["low"]),
            (out["high"] - c.shift()).abs(),
            (out["low"] - c.shift()).abs(),
        ],
        axis=1,
    ).max(axis=1)
    out["atr"] = tr.rolling(14).mean()
    return out


def fibonacci_levels(df: pd.DataFrame, w: int = 34) -> dict[str, float]:
    piv_h = float(df["high"].tail(w).max())
    piv_l = float(df["low"].tail(w).min())
    r = piv_h - piv_l
    return {
        "fib_0.236": piv_h - 0.236 * r,
        "fib_0.382": piv_h - 0.382 * r,
        "fib_0.5": piv_h - 0.5 * r,
        "fib_0.618": piv_h - 0.618 * r,
        "fib_0.786": piv_h - 0.786 * r,
        "ext_1.272": piv_h + 0.272 * r,
        "ext_1.618": piv_h + 0.618 * r,
    }


def walk_forward_sarimax(df: pd.DataFrame) -> dict[str, float]:
    x = df[["news_count", "avg_tone", "dummy_shock"]].fillna(0)
    y = df["ret_1d"].fillna(0)
    split = int(len(df) * 0.8)
    train_y, test_y = y.iloc[:split], y.iloc[split:]
    train_x, test_x = x.iloc[:split], x.iloc[split:]
    model = SARIMAX(
        train_y,
        exog=train_x,
        order=(1, 0, 0),
        trend="c",
        enforce_stationarity=False,
        enforce_invertibility=False,
    )
    res = model.fit(disp=False)
    pred = res.get_forecast(steps=len(test_x), exog=test_x).predicted_mean
    mae = float((test_y - pred).abs().mean())
    rmse = float(np.sqrt(((test_y - pred) ** 2).mean()))
    acc = float(((test_y > 0) == (pred > 0)).mean())
    return {
        "mae": mae,
        "rmse": rmse,
        "directional_acc": acc,
        "last_pred": float(pred.iloc[-1] if len(pred) else 0.0),
    }


def garch_vol_proxy(ret: pd.Series) -> float:
    return float(ret.ewm(span=20).std().iloc[-1] or ret.std())


def direction_classifier(df: pd.DataFrame) -> float:
    clean = df[["ret_1d", "news_count", "avg_tone", "dummy_shock"]].dropna()
    if len(clean) < 120:
        return 0.5
    y = (clean["ret_1d"].shift(-1) > 0).astype(int).iloc[:-1]
    x = clean[["news_count", "avg_tone", "dummy_shock"]].iloc[:-1]
    clf = RandomForestClassifier(n_estimators=120, random_state=42)
    clf.fit(x, y)
    return float(clf.predict_proba(x.tail(1))[0, 1])


def future_projection(df: pd.DataFrame, steps: int = 10) -> list[dict[str, float | int]]:
    close = df["close"].dropna()
    if len(close) < 30:
        return []
    drift = float(close.pct_change().tail(20).mean())
    vol = float(close.pct_change().tail(20).std())
    last_price = float(close.iloc[-1])
    last_dt = close.index[-1]
    out = []
    for i in range(1, steps + 1):
        expected = last_price * (1 + drift * i)
        up = expected * (1 + vol)
        dn = expected * (1 - vol)
        out.append(
            {
                "time": int((last_dt + timedelta(days=i)).timestamp()),
                "expected": round(expected, 4),
                "upper": round(up, 4),
                "lower": round(dn, 4),
            }
        )
    return out


def chart_payload(df: pd.DataFrame) -> dict[str, object]:
    feat = technical_features(df).dropna().tail(300)
    fib = fibonacci_levels(feat) if not feat.empty else {}
    candles = [
        {
            "time": int(ts.timestamp()),
            "open": float(r["open"]),
            "high": float(r["high"]),
            "low": float(r["low"]),
            "close": float(r["close"]),
        }
        for ts, r in feat.iterrows()
    ]
    ma20 = [{"time": int(ts.timestamp()), "value": float(v)} for ts, v in feat["ma_20"].dropna().items()]
    ma50 = [{"time": int(ts.timestamp()), "value": float(v)} for ts, v in feat["ma_50"].dropna().items()]
    bb_u = [{"time": int(ts.timestamp()), "value": float(v)} for ts, v in feat["bb_upper"].dropna().items()]
    bb_l = [{"time": int(ts.timestamp()), "value": float(v)} for ts, v in feat["bb_lower"].dropna().items()]
    projection = future_projection(feat)
    return {
        "candles": candles,
        "ma20": ma20,
        "ma50": ma50,
        "bbUpper": bb_u,
        "bbLower": bb_l,
        "fibonacci": fib,
        "projection": projection,
    }
