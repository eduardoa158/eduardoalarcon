import json
import math
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

from app.modeling.contracts import (
    EvaluationReport,
    HistoricalMatchRecord,
    MatchPredictor,
    PredictionInput,
    PredictionOutput,
    TopScoreline,
)
from app.modeling.calibration import TemperatureCalibration, apply_temperature_scaling
from app.modeling.feature_pipeline import (
    build_inference_features,
    build_training_rows,
    feature_names,
    normalize_feature_version,
    summarize_feature_vector,
)


@dataclass(frozen=True)
class ModelSpec:
    model_name: str
    feature_version: str
    ridge_alpha: float
    use_recency_weights: bool


MODEL_SPECS: dict[str, ModelSpec] = {
    "ridge_poisson_v1_1": ModelSpec(
        model_name="ridge_poisson_v1_1",
        feature_version="v2",
        ridge_alpha=0.5,
        use_recency_weights=False,
    ),
    "ridge_poisson_v1_5": ModelSpec(
        model_name="ridge_poisson_v1_5",
        feature_version="v3",
        ridge_alpha=0.8,
        use_recency_weights=False,
    ),
    "ridge_poisson_v1_5_weighted": ModelSpec(
        model_name="ridge_poisson_v1_5_weighted",
        feature_version="v3",
        ridge_alpha=1.0,
        use_recency_weights=True,
    ),
}


@dataclass
class BaselineModelArtifact:
    model_name: str
    coefficients_home: list[float]
    coefficients_away: list[float]
    trained_samples: int
    trained_at_utc: str
    ridge_alpha: float
    feature_names: list[str]
    feature_version: str
    use_recency_weights: bool
    calibration_method: str | None = None
    calibration_temperature: float | None = None
    calibration_fitted_samples: int | None = None


class TrainableBaselinePredictor(MatchPredictor):
    def __init__(
        self,
        model_name: str = "ridge_poisson_v1_1",
        feature_version: str = "v2",
        ridge_alpha: float = 0.5,
        use_recency_weights: bool = False,
    ):
        self.model_name = model_name
        self.feature_version = normalize_feature_version(feature_version)
        self.ridge_alpha = ridge_alpha
        self.use_recency_weights = use_recency_weights
        self.coefficients_home: np.ndarray | None = None
        self.coefficients_away: np.ndarray | None = None
        self.calibration: TemperatureCalibration | None = None

    @classmethod
    def from_model_spec(cls, model_name: str) -> "TrainableBaselinePredictor":
        if model_name not in MODEL_SPECS:
            allowed = ", ".join(sorted(MODEL_SPECS))
            raise ValueError(f"Unsupported model_name '{model_name}'. Allowed: {allowed}")
        spec = MODEL_SPECS[model_name]
        return cls(
            model_name=spec.model_name,
            feature_version=spec.feature_version,
            ridge_alpha=spec.ridge_alpha,
            use_recency_weights=spec.use_recency_weights,
        )

    def train(self, history: list[HistoricalMatchRecord]) -> None:
        rows = build_training_rows(history, feature_version=self.feature_version)
        if len(rows) < 4:
            raise ValueError("Not enough historical matches to train baseline model")

        X = np.vstack([r.features for r in rows])
        y_home = np.array([r.target_home_goals for r in rows], dtype=float)
        y_away = np.array([r.target_away_goals for r in rows], dtype=float)
        weights = self._training_weights(len(rows))

        self.coefficients_home = self._fit_ridge(X, y_home, weights)
        self.coefficients_away = self._fit_ridge(X, y_away, weights)

    def predict(self, inference_input: PredictionInput, history: list[HistoricalMatchRecord]) -> PredictionOutput:
        if self.coefficients_home is None or self.coefficients_away is None:
            raise RuntimeError("Predictor is not trained")

        feature_vector = build_inference_features(
            inference_input.home_team,
            inference_input.away_team,
            history,
            feature_version=self.feature_version,
        )
        expected_home = max(0.2, float(np.dot(feature_vector, self.coefficients_home)))
        expected_away = max(0.2, float(np.dot(feature_vector, self.coefficients_away)))

        matrix = self._score_matrix(expected_home, expected_away, max_goals=8)
        total_mass = sum(matrix.values()) or 1.0
        normalized = {k: v / total_mass for k, v in matrix.items()}

        home_win = sum(p for (h, a), p in normalized.items() if h > a)
        draw = sum(p for (h, a), p in normalized.items() if h == a)
        away_win = sum(p for (h, a), p in normalized.items() if h < a)

        probs_1x2 = [home_win, draw, away_win]
        if self.calibration is not None:
            probs_1x2 = apply_temperature_scaling(probs_1x2, self.calibration.temperature)
            home_win, draw, away_win = probs_1x2

        top_scorelines = sorted(normalized.items(), key=lambda item: item[1], reverse=True)[:5]

        return PredictionOutput(
            expected_goals_home=round(expected_home, 3),
            expected_goals_away=round(expected_away, 3),
            home_win=round(home_win, 4),
            draw=round(draw, 4),
            away_win=round(away_win, 4),
            top_scorelines=[
                TopScoreline(home_goals=h, away_goals=a, probability=round(prob, 4)) for (h, a), prob in top_scorelines
            ],
            top_scorers=[
                {
                    "team": inference_input.home_team,
                    "player_alias": f"{inference_input.home_team[:3].upper()}_FWD_1",
                    "probability_to_score": round(min(0.8, expected_home / 3.8), 2),
                },
                {
                    "team": inference_input.away_team,
                    "player_alias": f"{inference_input.away_team[:3].upper()}_FWD_1",
                    "probability_to_score": round(min(0.8, expected_away / 3.8), 2),
                },
            ],
            feature_summary=summarize_feature_vector(feature_vector, feature_version=self.feature_version),
            calibration_applied=self.calibration is not None,
            calibration_method=self.calibration.method if self.calibration else None,
        )

    def set_temperature_calibration(self, calibration: TemperatureCalibration | None) -> None:
        self.calibration = calibration

    def evaluate(self, history: list[HistoricalMatchRecord]) -> EvaluationReport:
        from app.modeling.evaluation import strict_temporal_validation

        return strict_temporal_validation(history, model_name=self.model_name)

    def save_artifact(self, artifact_path: Path, history_size: int) -> None:
        if self.coefficients_home is None or self.coefficients_away is None:
            raise RuntimeError("Predictor is not trained")

        artifact = BaselineModelArtifact(
            model_name=self.model_name,
            coefficients_home=self.coefficients_home.tolist(),
            coefficients_away=self.coefficients_away.tolist(),
            trained_samples=history_size,
            trained_at_utc=datetime.now(timezone.utc).isoformat(),
            ridge_alpha=self.ridge_alpha,
            feature_names=feature_names(self.feature_version),
            feature_version=self.feature_version,
            use_recency_weights=self.use_recency_weights,
            calibration_method=self.calibration.method if self.calibration else None,
            calibration_temperature=self.calibration.temperature if self.calibration else None,
            calibration_fitted_samples=self.calibration.fitted_samples if self.calibration else None,
        )
        artifact_path.parent.mkdir(parents=True, exist_ok=True)
        artifact_path.write_text(json.dumps(asdict(artifact), indent=2), encoding="utf-8")

    def load_artifact(self, artifact_path: Path) -> None:
        payload = json.loads(artifact_path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("Invalid artifact format: expected JSON object")

        required_keys = {
            "model_name",
            "coefficients_home",
            "coefficients_away",
            "trained_samples",
            "trained_at_utc",
            "ridge_alpha",
            "feature_names",
            "feature_version",
            "use_recency_weights",
            "calibration_method",
            "calibration_temperature",
            "calibration_fitted_samples",
        }
        missing = sorted(required_keys.difference(payload.keys()))
        if missing:
            raise ValueError(f"Invalid artifact: missing required keys: {', '.join(missing)}")

        artifact = BaselineModelArtifact(**payload)
        expected_feature_version = normalize_feature_version(self.feature_version)
        if artifact.feature_version != expected_feature_version:
            raise ValueError(
                f"Invalid artifact: feature_version='{artifact.feature_version}' is not compatible with '{expected_feature_version}'"
            )
        expected_feature_names = feature_names(expected_feature_version)
        if artifact.feature_names != expected_feature_names:
            raise ValueError("Invalid artifact: feature_names mismatch with current model feature pipeline")
        if len(artifact.coefficients_home) != len(expected_feature_names):
            raise ValueError("Invalid artifact: coefficients_home length does not match feature_names")
        if len(artifact.coefficients_away) != len(expected_feature_names):
            raise ValueError("Invalid artifact: coefficients_away length does not match feature_names")
        if artifact.model_name != self.model_name:
            raise ValueError(
                f"Invalid artifact: model_name='{artifact.model_name}' is not compatible with '{self.model_name}'"
            )

        self.coefficients_home = np.array(artifact.coefficients_home, dtype=float)
        self.coefficients_away = np.array(artifact.coefficients_away, dtype=float)
        self.ridge_alpha = artifact.ridge_alpha
        self.use_recency_weights = artifact.use_recency_weights
        if artifact.calibration_method is not None:
            if artifact.calibration_method != "temperature_v1":
                raise ValueError(f"Invalid artifact: unsupported calibration_method '{artifact.calibration_method}'")
            if artifact.calibration_temperature is None or artifact.calibration_fitted_samples is None:
                raise ValueError("Invalid artifact: incomplete calibration fields")
            self.calibration = TemperatureCalibration(
                method=artifact.calibration_method,
                temperature=artifact.calibration_temperature,
                fitted_samples=artifact.calibration_fitted_samples,
            )
        else:
            self.calibration = None

    def _training_weights(self, sample_size: int) -> np.ndarray | None:
        if not self.use_recency_weights:
            return None
        positions = np.arange(sample_size, dtype=float)
        scaled = positions / max(1.0, sample_size - 1)
        weights = 0.35 + 0.65 * scaled
        return weights

    def _fit_ridge(self, X: np.ndarray, y: np.ndarray, sample_weights: np.ndarray | None) -> np.ndarray:
        if sample_weights is None:
            xtx = X.T @ X
            ridge = self.ridge_alpha * np.eye(X.shape[1])
            return np.linalg.pinv(xtx + ridge) @ X.T @ y

        W = np.diag(sample_weights)
        xtwx = X.T @ W @ X
        ridge = self.ridge_alpha * np.eye(X.shape[1])
        return np.linalg.pinv(xtwx + ridge) @ X.T @ W @ y

    def _poisson(self, goals: int, lam: float) -> float:
        return math.exp(-lam) * (lam**goals) / math.factorial(goals)

    def _score_matrix(self, lam_home: float, lam_away: float, max_goals: int) -> dict[tuple[int, int], float]:
        return {
            (h, a): self._poisson(h, lam_home) * self._poisson(a, lam_away)
            for h in range(max_goals + 1)
            for a in range(max_goals + 1)
        }
