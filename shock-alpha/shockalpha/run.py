from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path

import pandas as pd

from shockalpha.cli import build_parser
from shockalpha.data.align import align_assets
from shockalpha.data.cache import cache_path, read_cache, write_cache
from shockalpha.data.fetchers import fetch_ohlcv
from shockalpha.features.build import build_feature_matrix
from shockalpha.features.leakage_checks import assert_no_future_columns
from shockalpha.reporting.charts import plot_price_signal
from shockalpha.reporting.report_md import write_report
from shockalpha.settings import load_settings
from shockalpha.shocks.event_table import write_events_table
from shockalpha.shocks.gdelt import fetch_gdelt_daily
from shockalpha.shocks.rss import fetch_rss_events
from shockalpha.shocks.shock_index import build_shock_index
from shockalpha.trading.signals import generate_signals
from shockalpha.backtest.walk_forward import run_walk_forward

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)


def _resolve_end(end: str) -> str:
    return datetime.utcnow().date().isoformat() if end == "today" else end


def main() -> None:
    args = build_parser().parse_args()
    root = Path(__file__).resolve().parents[1]
    settings = load_settings(root)
    cfg = settings.default
    end = _resolve_end(args.end)

    cache_dir = root / "outputs" / "cache"
    frames: dict[str, pd.DataFrame] = {}
    assets = settings.tickers["assets"]
    for asset, ticker in assets.items():
        cpath = cache_path(cache_dir, ticker, args.start, end)
        cached = read_cache(cpath)
        if cached is None:
            df = fetch_ohlcv(ticker, args.start, end)
            write_cache(cpath, df)
        else:
            df = cached
        frames[asset] = df
    aligned = align_assets(frames)

    rss_cfg = settings.sources
    events = fetch_rss_events(
        rss_cfg.get("rss_feeds", []),
        rss_cfg.get("keywords", {}).get("escalation", []),
        rss_cfg.get("keywords", {}).get("deescalation", []),
    )
    gdelt = fetch_gdelt_daily(args.start, end)
    shock = build_shock_index(gdelt, events, on_percentile=cfg["shock"]["on_percentile"])
    write_events_table(events, root / "outputs" / "events_table.csv")

    all_signals = []
    metrics_all = {}
    shock_status = {}

    for asset, raw in frames.items():
        feat = build_feature_matrix(raw, cfg)
        feat = feat.join(shock[["shock_index", "shock_on", "dummy_shock"]], how="left").fillna(0)
        assert_no_future_columns(feat)
        exog_cols = [c for c in feat.columns if c not in {"open", "high", "low", "close", "volume"}]
        wf, metrics = run_walk_forward(feat, exog_cols[:15], cfg)
        sig = generate_signals(wf, cfg, asset)
        all_signals.append(sig)
        metrics_all[asset] = metrics
        shock_status[asset] = "SHOCK_ON" if int(feat["shock_on"].tail(1).iloc[0]) == 1 else "NORMAL"
        plot_price_signal(raw, asset, root / "outputs" / "figures" / f"{asset.lower()}_price.png")

    signals_df = pd.concat(all_signals, ignore_index=True)
    signals_df.to_csv(root / "outputs" / "signals_latest.csv", index=False)

    flat_metrics = {f"{asset}_{k}": v for asset, d in metrics_all.items() for k, v in d.items()}
    with (root / "outputs" / "backtest_summary.json").open("w", encoding="utf-8") as f:
        json.dump(flat_metrics, f, indent=2)

    write_report(root / "reports" / "latest.md", shock_status, signals_df, flat_metrics, events)
    logger.info("Run complete")


if __name__ == "__main__":
    main()
