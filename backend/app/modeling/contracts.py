from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass
class HistoricalMatchRecord:
    match_id: int
    played_at: datetime
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int


@dataclass
class TeamPreMatchFeatures:
    attack: float
    defense: float
    matches: int


@dataclass
class PredictionInput:
    home_team: str
    away_team: str
    played_at: datetime | None = None


@dataclass
class TopScoreline:
    home_goals: int
    away_goals: int
    probability: float


@dataclass
class PredictionOutput:
    expected_goals_home: float
    expected_goals_away: float
    home_win: float
    draw: float
    away_win: float
    top_scorelines: list[TopScoreline]
    top_scorers: list[dict[str, float | str]]
    feature_summary: dict[str, float]
    calibration_applied: bool
    calibration_method: str | None


@dataclass
class EvaluationReport:
    matches_evaluated: int
    mae_home_goals: float
    mae_away_goals: float
    brier_1x2: float
    log_loss_1x2: float


class MatchPredictor(ABC):
    @abstractmethod
    def train(self, history: list[HistoricalMatchRecord]) -> None:
        raise NotImplementedError

    @abstractmethod
    def predict(self, inference_input: PredictionInput, history: list[HistoricalMatchRecord]) -> PredictionOutput:
        raise NotImplementedError

    @abstractmethod
    def evaluate(self, history: list[HistoricalMatchRecord]) -> EvaluationReport:
        raise NotImplementedError
