from app.db.session import SessionLocal
from app.core.config import settings
from app.domain.models import ModelTrainingRun
from app.modeling.contracts import PredictionInput
from app.modeling.service import ModelService
from app.services.ingest_service import IngestService


def test_model_service_train_persists_training_run() -> None:
    with SessionLocal() as db:
        IngestService(db).ingest_historical_data()
        result = ModelService(db).train_and_store()

        assert result["trained_matches"] >= 4
        assert len(result["comparison"]) >= 1
        assert "active_model" in result

        run = db.query(ModelTrainingRun).order_by(ModelTrainingRun.id.desc()).first()
        assert run is not None
        assert run.model_name in {"ridge_poisson_v1_1", "ridge_poisson_v1_5", "ridge_poisson_v1_5_weighted"}
        assert run.feature_version in {"v2", "v3"}
        assert run.dataset_provider in {"mock", "real"}
        assert run.validation_log_loss_1x2 >= 0


def test_predict_requires_artifact_when_fallback_disabled(monkeypatch) -> None:
    with SessionLocal() as db:
        IngestService(db).ingest_historical_data()

        monkeypatch.setattr(settings, "allow_auto_train_on_predict", False)
        monkeypatch.setattr(settings, "app_env", "production")

        service = ModelService(db)
        if service.artifact_path.exists():
            service.artifact_path.unlink()

        try:
            service.predict_with_best_available_model(
                inference_input=PredictionInput(home_team="FC Barcelona", away_team="Real Madrid")
            )
            assert False, "Expected RuntimeError when artifact is missing"
        except RuntimeError as exc:
            assert "Model artifact not found" in str(exc)


def test_predict_fails_fast_on_invalid_artifact(monkeypatch) -> None:
    with SessionLocal() as db:
        IngestService(db).ingest_historical_data()

        monkeypatch.setattr(settings, "allow_auto_train_on_predict", False)
        monkeypatch.setattr(settings, "app_env", "production")

        service = ModelService(db)
        service.artifact_path.parent.mkdir(parents=True, exist_ok=True)
        service.artifact_path.write_text('{"bad":"artifact"}', encoding="utf-8")

        try:
            service.predict_with_best_available_model(
                inference_input=PredictionInput(home_team="FC Barcelona", away_team="Real Madrid")
            )
            assert False, "Expected RuntimeError when artifact is invalid"
        except RuntimeError as exc:
            assert "invalid or incompatible" in str(exc)


def test_train_uses_configured_active_model(monkeypatch) -> None:
    with SessionLocal() as db:
        IngestService(db).ingest_historical_data()
        monkeypatch.setattr(settings, "active_model_name", "ridge_poisson_v1_5")
        monkeypatch.setattr(settings, "challenger_model_names", "ridge_poisson_v1_5_weighted")

        result = ModelService(db).train_and_store()
        assert result["active_model"] == "ridge_poisson_v1_5"

        active_runs = db.query(ModelTrainingRun).filter(ModelTrainingRun.is_active.is_(True)).all()
        assert len(active_runs) == 1
        assert active_runs[0].model_name == "ridge_poisson_v1_5"


def test_predict_autotrain_persists_calibrated_artifact_when_gate_passes(monkeypatch) -> None:
    with SessionLocal() as db:
        IngestService(db).ingest_historical_data()

        monkeypatch.setattr(settings, "allow_auto_train_on_predict", True)
        monkeypatch.setattr(settings, "app_env", "development")

        service = ModelService(db)
        if service.artifact_path.exists():
            service.artifact_path.unlink()

        monkeypatch.setattr(
            "app.modeling.service.evaluate_probability_calibration",
            lambda history, model_name: {
                "model_name": model_name,
                "calibration_method": "temperature_v1",
                "fitted": True,
                "fit_samples": 12,
                "temperature": 1.8,
                "activate": True,
            },
        )

        output = service.predict_with_best_available_model(
            inference_input=PredictionInput(home_team="FC Barcelona", away_team="Real Madrid")
        )

        assert output.calibration_applied is True
        assert output.calibration_method == "temperature_v1"
        assert service.artifact_path.exists()
        artifact_json = service.artifact_path.read_text(encoding="utf-8")
        assert '"calibration_method": "temperature_v1"' in artifact_json
