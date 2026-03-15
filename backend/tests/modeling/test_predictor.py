from datetime import datetime, timedelta, timezone
import json
from pathlib import Path

from app.modeling.contracts import HistoricalMatchRecord, PredictionInput
from app.modeling.predictor import TrainableBaselinePredictor


def _history() -> list[HistoricalMatchRecord]:
    base = datetime(2024, 1, 1, tzinfo=timezone.utc)
    return [
        HistoricalMatchRecord(1, base + timedelta(days=0), "A", "B", 2, 1),
        HistoricalMatchRecord(2, base + timedelta(days=1), "B", "C", 0, 1),
        HistoricalMatchRecord(3, base + timedelta(days=2), "A", "C", 1, 1),
        HistoricalMatchRecord(4, base + timedelta(days=3), "C", "A", 2, 2),
        HistoricalMatchRecord(5, base + timedelta(days=4), "B", "A", 1, 2),
    ]


def test_train_predict_and_artifact_roundtrip(tmp_path: Path) -> None:
    history = _history()
    predictor = TrainableBaselinePredictor()
    predictor.train(history)

    pred = predictor.predict(PredictionInput(home_team="A", away_team="B"), history)
    assert pred.expected_goals_home > 0
    assert pred.expected_goals_away > 0
    assert len(pred.top_scorelines) == 5
    assert "home_attack" in pred.feature_summary

    artifact = tmp_path / "model.json"
    predictor.save_artifact(artifact, history_size=len(history))

    loaded = TrainableBaselinePredictor()
    loaded.load_artifact(artifact)
    pred_loaded = loaded.predict(PredictionInput(home_team="A", away_team="B"), history)
    assert pred_loaded.home_win >= 0
    assert round(pred_loaded.home_win + pred_loaded.draw + pred_loaded.away_win, 3) == 1.0


def test_load_artifact_fails_when_feature_names_mismatch(tmp_path: Path) -> None:
    artifact = tmp_path / "invalid_model.json"
    artifact.write_text(
        json.dumps(
            {
                "model_name": "ridge_poisson_v1_1",
                "coefficients_home": [0.1] * 9,
                "coefficients_away": [0.2] * 9,
                "trained_samples": 10,
                "trained_at_utc": "2026-01-01T00:00:00+00:00",
                "ridge_alpha": 0.5,
                "feature_names": ["bad"] * 9,
                "feature_version": "v2",
                "use_recency_weights": False,
                "calibration_method": None,
                "calibration_temperature": None,
                "calibration_fitted_samples": None,
            }
        ),
        encoding="utf-8",
    )

    predictor = TrainableBaselinePredictor()
    try:
        predictor.load_artifact(artifact)
        assert False, "Expected ValueError"
    except ValueError as exc:
        assert "feature_names mismatch" in str(exc)
