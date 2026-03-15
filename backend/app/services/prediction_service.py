import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.models import Prediction, Team
from app.modeling.contracts import PredictionInput
from app.modeling.service import ModelService
from app.schemas.prediction import (
    ExtractedContext,
    PredictMatchResponse,
    ProbabilityTable,
    ProbabilityMetadata,
    TopScorelineHint,
    TopScorerHint,
)

logger = logging.getLogger(__name__)


class PredictionService:
    def __init__(self, db: Session):
        self.db = db

    def _get_or_create_team(self, name: str) -> Team:
        team = self.db.scalar(select(Team).where(Team.name == name))
        if team:
            return team
        team = Team(name=name, attack_rating=1.0, defense_rating=1.0)
        self.db.add(team)
        self.db.flush()
        return team

    def predict(self, request_text: str, context: ExtractedContext) -> PredictMatchResponse:
        home_team = self._get_or_create_team(context.home_team)
        away_team = self._get_or_create_team(context.away_team)

        model_output = ModelService(self.db).predict_with_best_available_model(
            PredictionInput(home_team=context.home_team, away_team=context.away_team)
        )

        prediction = Prediction(
            request_text=request_text,
            home_team_id=home_team.id,
            away_team_id=away_team.id,
            home_win_prob=model_output.home_win,
            draw_prob=model_output.draw,
            away_win_prob=model_output.away_win,
        )
        self.db.add(prediction)
        self.db.commit()
        logger.info("Prediction stored", extra={"home": context.home_team, "away": context.away_team})

        return PredictMatchResponse(
            status="ok",
            context=context,
            expected_goals={"home": model_output.expected_goals_home, "away": model_output.expected_goals_away},
            probabilities_1x2=ProbabilityTable(home_win=model_output.home_win, draw=model_output.draw, away_win=model_output.away_win),
            top_scorelines=[TopScorelineHint(home_goals=s.home_goals, away_goals=s.away_goals, probability=s.probability) for s in model_output.top_scorelines],
            top_scorers=[TopScorerHint(**scorer) for scorer in model_output.top_scorers],
            feature_summary=model_output.feature_summary,
            probability_metadata=ProbabilityMetadata(
                calibration_applied=model_output.calibration_applied,
                calibration_method=model_output.calibration_method,
            ),
            explanatory_factors=[
                "Modelo estadístico pre-partido (no causal): los factores son señales descriptivas",
                "Probabilidades 1X2 representan incertidumbre; no son certezas",
                "Top scorelines son escenarios probables ordenados por probabilidad",
            ],
            future_modules_ready=["cards", "corners", "rare_events"],
        )
