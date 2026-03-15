from pathlib import Path

from sqlalchemy import update
from sqlalchemy.orm import Session

from app.core.config import settings
from app.domain.models import ModelTrainingRun
from app.modeling.contracts import PredictionInput, PredictionOutput
from app.modeling.evaluation import (
    BacktestReport,
    compare_model_specs,
    evaluate_probability_calibration,
    run_temporal_backtest,
    strict_temporal_validation,
    walk_forward_holdout_evaluation,
)
from app.modeling.predictor import MODEL_SPECS, TrainableBaselinePredictor
from app.modeling.calibration import TemperatureCalibration
from app.modeling.repository import fetch_historical_matches


class ModelService:
    def __init__(self, db: Session):
        self.db = db
        self.base_artifact_path = Path(settings.artifact_path)

    @property
    def artifact_path(self) -> Path:
        return self._artifact_path_for(settings.active_model_name)

    def _artifact_path_for(self, model_name: str) -> Path:
        suffix = f".{model_name}.json"
        if self.base_artifact_path.suffix == ".json":
            return self.base_artifact_path.with_name(f"{self.base_artifact_path.stem}{suffix}")
        return self.base_artifact_path / f"model{suffix}"

    def _target_models(self) -> list[str]:
        challengers = [token.strip() for token in settings.challenger_model_names.split(",") if token.strip()]
        model_names = ["ridge_poisson_v1_1", settings.active_model_name, *challengers]
        deduped: list[str] = []
        for name in model_names:
            if name in MODEL_SPECS and name not in deduped:
                deduped.append(name)
        if not deduped:
            raise RuntimeError("No valid model names configured for training")
        return deduped

    def train_and_store(self) -> dict[str, object]:
        history = fetch_historical_matches(self.db)
        model_names = self._target_models()

        comparison = compare_model_specs(history, model_names)
        comparison_by_model = {row.model_name: row for row in comparison}

        self.db.execute(update(ModelTrainingRun).values(is_active=False))

        run_ids_by_model: dict[str, int] = {}
        calibration_by_model: dict[str, dict[str, object]] = {}
        for model_name in model_names:
            predictor = TrainableBaselinePredictor.from_model_spec(model_name)
            predictor.train(history)
            artifact_path = self._artifact_path_for(model_name)
            predictor.save_artifact(artifact_path, history_size=len(history))

            static_eval = strict_temporal_validation(history, model_name=model_name)
            wf_eval = walk_forward_holdout_evaluation(history, model_name=model_name)
            backtest = run_temporal_backtest(history, model_name=model_name)
            calibration_eval = evaluate_probability_calibration(history, model_name=model_name)
            calibration_by_model[model_name] = calibration_eval

            if calibration_eval.get("fitted") and calibration_eval.get("activate"):
                predictor.set_temperature_calibration(
                    TemperatureCalibration(
                        method=str(calibration_eval["calibration_method"]),
                        temperature=float(calibration_eval["temperature"]),
                        fitted_samples=int(calibration_eval["fit_samples"]),
                    )
                )
                predictor.save_artifact(artifact_path, history_size=len(history))

            run = ModelTrainingRun(
                model_name=model_name,
                artifact_path=str(artifact_path),
                trained_samples=len(history),
                validation_mae_home=static_eval.mae_home_goals,
                validation_mae_away=static_eval.mae_away_goals,
                validation_brier_1x2=static_eval.brier_1x2,
                validation_log_loss_1x2=static_eval.log_loss_1x2,
                walk_forward_brier_1x2=wf_eval.brier_1x2,
                walk_forward_log_loss_1x2=wf_eval.log_loss_1x2,
                calibration_method=str(calibration_eval["calibration_method"]) if calibration_eval.get("fitted") else None,
                calibration_temperature=float(calibration_eval["temperature"]) if calibration_eval.get("fitted") else None,
                calibration_fit_samples=int(calibration_eval["fit_samples"]) if calibration_eval.get("fitted") else None,
                calibration_improved=bool(calibration_eval.get("activate", False)),
                evaluation_holdout_size=2,
                backtest_splits=len(backtest.splits),
                dataset_provider=settings.football_data_provider,
                feature_version=MODEL_SPECS[model_name].feature_version,
                is_active=(model_name == settings.active_model_name),
            )
            self.db.add(run)
            self.db.flush()
            run_ids_by_model[model_name] = run.id

        self.db.commit()

        if settings.active_model_name not in model_names:
            raise RuntimeError(
                f"ACTIVE_MODEL_NAME '{settings.active_model_name}' is not in trained model set: {', '.join(model_names)}"
            )

        active_row = comparison_by_model[settings.active_model_name]
        return {
            "status": "ok",
            "active_model": settings.active_model_name,
            "active_artifact_path": str(self._artifact_path_for(settings.active_model_name)),
            "trained_matches": len(history),
            "trained_models": model_names,
            "training_runs": {
                model_name: {
                    "run_id": run_ids_by_model[model_name],
                    "artifact_path": str(self._artifact_path_for(model_name)),
                    "calibration": calibration_by_model[model_name],
                }
                for model_name in model_names
            },
            "active_metrics": {
                "static_holdout": {
                    "mae_home_goals": active_row.static_holdout_mae_home,
                    "mae_away_goals": active_row.static_holdout_mae_away,
                    "brier_1x2": active_row.static_holdout_brier_1x2,
                    "log_loss_1x2": active_row.static_holdout_log_loss_1x2,
                },
                "walk_forward_holdout": {
                    "brier_1x2": active_row.walk_forward_holdout_brier_1x2,
                    "log_loss_1x2": active_row.walk_forward_holdout_log_loss_1x2,
                },
            },
            "comparison": [row.__dict__ for row in comparison],
        }

    def evaluate(self) -> dict[str, object]:
        history = fetch_historical_matches(self.db)
        static = strict_temporal_validation(history, model_name=settings.active_model_name)
        walk_forward = walk_forward_holdout_evaluation(history, model_name=settings.active_model_name)
        backtest = run_temporal_backtest(history, model_name=settings.active_model_name)
        calibration = evaluate_probability_calibration(history, model_name=settings.active_model_name)
        return {
            "model_name": settings.active_model_name,
            "static_holdout": static.__dict__,
            "walk_forward_holdout": walk_forward.__dict__,
            "probability_calibration": calibration,
            "backtest": {
                "splits": [split.__dict__ for split in backtest.splits],
                "avg_mae_home_goals": backtest.avg_mae_home_goals,
                "avg_mae_away_goals": backtest.avg_mae_away_goals,
                "avg_brier_1x2": backtest.avg_brier_1x2,
                "avg_log_loss_1x2": backtest.avg_log_loss_1x2,
            },
        }

    def backtest(self) -> BacktestReport:
        history = fetch_historical_matches(self.db)
        return run_temporal_backtest(history, model_name=settings.active_model_name)

    def predict_with_best_available_model(self, inference_input: PredictionInput) -> PredictionOutput:
        history = fetch_historical_matches(self.db)
        predictor = TrainableBaselinePredictor.from_model_spec(settings.active_model_name)
        artifact_path = self._artifact_path_for(settings.active_model_name)

        if artifact_path.exists():
            try:
                predictor.load_artifact(artifact_path)
            except (ValueError, TypeError) as exc:
                raise RuntimeError(
                    "Model artifact is invalid or incompatible. Retrain with 'python -m scripts.train_baseline_model'."
                ) from exc
        else:
            if settings.app_env == "production" or not settings.allow_auto_train_on_predict:
                raise RuntimeError(
                    "Model artifact not found. Train first with 'python -m scripts.train_baseline_model' and retry prediction."
                )

            predictor.train(history)
            calibration_eval = evaluate_probability_calibration(history, model_name=settings.active_model_name)
            if calibration_eval.get("fitted") and calibration_eval.get("activate"):
                predictor.set_temperature_calibration(
                    TemperatureCalibration(
                        method=str(calibration_eval["calibration_method"]),
                        temperature=float(calibration_eval["temperature"]),
                        fitted_samples=int(calibration_eval["fit_samples"]),
                    )
                )
            predictor.save_artifact(artifact_path, history_size=len(history))

        return predictor.predict(inference_input, history)
