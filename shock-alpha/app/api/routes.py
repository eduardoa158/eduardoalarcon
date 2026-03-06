from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.config import DEFAULT_TICKERS
from app.schemas import AssetRequest
from app.services.backtest import save_backtest_report, simple_backtest
from app.services.market import choose_frequency, fetch_prices
from app.services.models import (
    chart_payload,
    direction_classifier,
    garch_vol_proxy,
    technical_features,
    walk_forward_sarimax,
)
from app.services.shocks import add_manual_shock, fetch_gdelt_news, manual_dummy, news_proxies

router = APIRouter(prefix="/api")


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/defaults")
def defaults() -> dict[str, object]:
    return {
        "questions": [
            "Q1) ¿En Hostinger tendrás VPS/Node/Python disponible o solo hosting estático?",
            "Q2) Lista de activos/tickers a incluir por defecto.",
            "Q3) ¿Permites APIs con key (sí/no)? ¿Cuáles?",
            "Q4) ¿Permites señales Short o solo Long/Flat?",
            "Q5) ¿Moneda base del capital (USD u otra)?",
        ],
        "assumptions": {
            "hosting": "VPS con Python",
            "tickers": list(DEFAULT_TICKERS.values()),
            "api_keys": "opcionales",
            "short": False,
            "base_currency": "USD",
        },
    }


@router.post("/asset")
def asset_data(req: AssetRequest) -> dict[str, object]:
    df = fetch_prices(req.ticker, req.start, req.end)
    if df.empty:
        raise HTTPException(status_code=404, detail="No price data")
    freq = choose_frequency(df)
    out = df.reset_index().tail(500)
    return {"frequency_selected": freq, "rows": out.to_dict(orient="records")}


@router.get("/asset/chart")
def asset_chart(
    ticker: str = Query("BTC-USD"),
    start: str = Query("2018-01-01"),
    end: str = Query("today"),
) -> dict[str, object]:
    df = fetch_prices(ticker, start, end)
    if df.empty:
        raise HTTPException(status_code=404, detail="No price data")
    payload = chart_payload(df)
    payload["ticker"] = ticker
    payload["frequency_selected"] = choose_frequency(df)
    return payload


@router.get("/shocks/news")
def shocks_news() -> dict[str, object]:
    news = fetch_gdelt_news()
    return {"news": news, "proxies": news_proxies(news).to_dict(orient="records")}


@router.post("/shocks/manual")
def create_manual_shock(name: str, start: str, end: str, intensity: float = 1.0) -> dict[str, object]:
    return {"shocks": add_manual_shock(name, start, end, intensity)}


@router.post("/model/run")
def model_run(req: AssetRequest) -> dict[str, object]:
    prices = fetch_prices(req.ticker, req.start, req.end)
    feats = technical_features(prices)
    news = fetch_gdelt_news()
    proxy = news_proxies(news)
    proxy = proxy.set_index("date") if not proxy.empty else proxy
    feats = feats.join(proxy[["news_count", "avg_tone"]], how="left").fillna(0)
    feats["dummy_shock"] = manual_dummy(feats.index)
    metrics = walk_forward_sarimax(feats.dropna())
    metrics["vol_proxy"] = garch_vol_proxy(feats["ret_1d"].dropna())
    metrics["prob_up"] = direction_classifier(feats)
    return metrics


@router.get("/predictions")
def predictions(
    ticker: str = Query("BTC-USD"),
    start: str = Query("2018-01-01"),
    end: str = Query("today"),
) -> dict[str, object]:
    prices = fetch_prices(ticker, start, end)
    feats = technical_features(prices).dropna().copy()
    if feats.empty:
        raise HTTPException(status_code=400, detail="Insufficient data")
    feats["news_count"] = 0.0
    feats["avg_tone"] = 0.0
    feats["dummy_shock"] = manual_dummy(feats.index)
    econ = walk_forward_sarimax(feats)
    prob_up = direction_classifier(feats)
    chart = chart_payload(prices)
    return {
        "ticker": ticker,
        "directional_accuracy": econ["directional_acc"],
        "next_return_forecast": econ["last_pred"],
        "probability_up": prob_up,
        "projection": chart["projection"],
    }


@router.post("/backtest")
def backtest(req: AssetRequest) -> dict[str, object]:
    prices = fetch_prices(req.ticker, req.start, req.end)
    feats = technical_features(prices).dropna()
    report = simple_backtest(feats)
    path = save_backtest_report(report, req.ticker)
    return {"report": report, "saved_to": str(path)}
