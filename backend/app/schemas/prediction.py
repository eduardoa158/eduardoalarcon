from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class PredictMatchRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", json_schema_extra={"examples": [{"query": "Quiero predecir el partido entre FC Barcelona y Real Madrid en LaLiga"}]})

    query: str = Field(min_length=5, max_length=300)


class ExtractedContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    home_team: str
    away_team: str
    competition: str | None = None


class ProbabilityTable(BaseModel):
    model_config = ConfigDict(extra="forbid")

    home_win: float = Field(ge=0, le=1)
    draw: float = Field(ge=0, le=1)
    away_win: float = Field(ge=0, le=1)


class TopScorelineHint(BaseModel):
    model_config = ConfigDict(extra="forbid")

    home_goals: int = Field(ge=0)
    away_goals: int = Field(ge=0)
    probability: float = Field(ge=0, le=1)


class TopScorerHint(BaseModel):
    model_config = ConfigDict(extra="forbid")

    team: str
    player_alias: str
    probability_to_score: float = Field(ge=0, le=1)


class ExpectedGoals(BaseModel):
    model_config = ConfigDict(extra="forbid")

    home: float
    away: float


class ProbabilityMetadata(BaseModel):
    model_config = ConfigDict(extra="forbid")

    calibration_applied: bool
    calibration_method: str | None = None


class PredictMatchResponse(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "examples": [
                {
                    "status": "ok",
                    "context": {
                        "home_team": "FC Barcelona",
                        "away_team": "Real Madrid",
                        "competition": "LaLiga",
                    },
                    "expected_goals": {"home": 1.8, "away": 1.2},
                    "probabilities_1x2": {"home_win": 0.49, "draw": 0.24, "away_win": 0.27},
                    "top_scorelines": [
                        {"home_goals": 1, "away_goals": 1, "probability": 0.12},
                        {"home_goals": 2, "away_goals": 1, "probability": 0.1},
                    ],
                    "top_scorers": [
                        {"team": "FC Barcelona", "player_alias": "BAR_FWD_1", "probability_to_score": 0.41}
                    ],
                    "feature_summary": {"home_attack": 1.31, "away_attack": 1.05},
                    "explanatory_factors": ["Forma reciente simulada", "Ventaja local"],
                    "future_modules_ready": ["cards", "corners", "rare_events"],
                }
            ]
        },
    )

    status: Literal["ok"]
    context: ExtractedContext
    expected_goals: ExpectedGoals
    probabilities_1x2: ProbabilityTable
    top_scorelines: list[TopScorelineHint]
    top_scorers: list[TopScorerHint]
    feature_summary: dict[str, float]
    probability_metadata: ProbabilityMetadata
    explanatory_factors: list[str]
    future_modules_ready: list[str]


class IngestHistoricalDataRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    provider: Literal["mock", "real"] | None = Field(
        default=None, description="Optional override guard; must match configured provider."
    )


class HealthResponse(BaseModel):
    status: str
