from datetime import datetime, timedelta, timezone

from app.modeling.contracts import HistoricalMatchRecord
from app.modeling.evaluation import (
    evaluate_probability_calibration,
    run_temporal_backtest,
    strict_temporal_validation,
    walk_forward_holdout_evaluation,
)


def _history(size: int = 12) -> list[HistoricalMatchRecord]:
    teams = ["A", "B", "C", "D"]
    base = datetime(2024, 1, 1, tzinfo=timezone.utc)
    rows: list[HistoricalMatchRecord] = []
    for i in range(size):
        home = teams[i % len(teams)]
        away = teams[(i + 1) % len(teams)]
        rows.append(
            HistoricalMatchRecord(
                match_id=i + 1,
                played_at=base + timedelta(days=i),
                home_team=home,
                away_team=away,
                home_goals=(i + 2) % 3,
                away_goals=i % 2,
            )
        )
    return rows


def test_strict_temporal_validation_metrics() -> None:
    report = strict_temporal_validation(_history(12), holdout_size=2)

    assert report.matches_evaluated == 2
    assert report.mae_home_goals >= 0
    assert report.brier_1x2 >= 0
    assert report.log_loss_1x2 >= 0


def test_temporal_backtest_has_split_metrics() -> None:
    report = run_temporal_backtest(_history(15), initial_train_size=5, test_window=2)
    assert len(report.splits) >= 1
    assert report.splits[0].split_id == 1
    assert report.avg_brier_1x2 >= 0
    assert report.avg_log_loss_1x2 >= 0


def test_walk_forward_holdout_metrics() -> None:
    report = walk_forward_holdout_evaluation(_history(12), holdout_size=2)
    assert report.matches_evaluated == 2
    assert report.mae_away_goals >= 0
    assert report.brier_1x2 >= 0
    assert report.log_loss_1x2 >= 0


def test_probability_calibration_evaluation_payload() -> None:
    result = evaluate_probability_calibration(_history(15), model_name="ridge_poisson_v1_1", holdout_size=2)
    assert result["model_name"] == "ridge_poisson_v1_1"
    assert "calibration_method" in result
    if result.get("fitted"):
        assert "before" in result
        assert "after" in result
