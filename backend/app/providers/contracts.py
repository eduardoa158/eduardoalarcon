from abc import ABC, abstractmethod
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProviderCompetition(BaseModel):
    model_config = ConfigDict(extra="forbid")

    provider_id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    country: str = Field(min_length=1)


class ProviderTeam(BaseModel):
    model_config = ConfigDict(extra="forbid")

    provider_id: str = Field(min_length=1)
    name: str = Field(min_length=1)


class ProviderMatchStat(BaseModel):
    model_config = ConfigDict(extra="forbid")

    team_provider_id: str = Field(min_length=1)
    is_home: bool
    possession_pct: float | None = Field(default=None, ge=0, le=100)
    shots_total: int | None = Field(default=None, ge=0)
    shots_on_target: int | None = Field(default=None, ge=0)
    corners: int | None = Field(default=None, ge=0)
    fouls: int | None = Field(default=None, ge=0)


class ProviderMatch(BaseModel):
    model_config = ConfigDict(extra="forbid")

    provider_id: str = Field(min_length=1)
    competition_provider_id: str = Field(min_length=1)
    home_team_provider_id: str = Field(min_length=1)
    away_team_provider_id: str = Field(min_length=1)
    home_goals: int = Field(ge=0)
    away_goals: int = Field(ge=0)
    played_at: datetime
    is_finished: bool = True
    stats: list[ProviderMatchStat] = Field(default_factory=list)


class ProviderDataset(BaseModel):
    model_config = ConfigDict(extra="forbid")

    competitions: list[ProviderCompetition]
    teams: list[ProviderTeam]
    matches: list[ProviderMatch]
    latest_played_at: datetime | None = None
    next_cursor: str | None = None


class FootballDataProvider(ABC):
    @abstractmethod
    def fetch_historical_data(self, since: datetime | None = None, cursor: str | None = None) -> ProviderDataset:
        raise NotImplementedError
