from dataclasses import dataclass

from app.providers.contracts import ProviderDataset


@dataclass
class NormalizedCompetition:
    provider_id: str
    name: str
    country: str


@dataclass
class NormalizedTeam:
    provider_id: str
    name: str


@dataclass
class NormalizedMatchStat:
    team_provider_id: str
    is_home: bool
    possession_pct: float | None
    shots_total: int | None
    shots_on_target: int | None
    corners: int | None
    fouls: int | None


@dataclass
class NormalizedMatch:
    provider_id: str
    competition_provider_id: str
    home_team_provider_id: str
    away_team_provider_id: str
    home_goals: int
    away_goals: int
    played_at: object
    is_finished: bool
    stats: list[NormalizedMatchStat]


@dataclass
class NormalizedDataset:
    competitions: list[NormalizedCompetition]
    teams: list[NormalizedTeam]
    matches: list[NormalizedMatch]


def normalize_dataset(dataset: ProviderDataset) -> NormalizedDataset:
    competitions = [
        NormalizedCompetition(provider_id=item.provider_id, name=item.name.strip(), country=item.country.strip())
        for item in dataset.competitions
    ]
    teams = [
        NormalizedTeam(provider_id=item.provider_id, name=item.name.strip())
        for item in dataset.teams
    ]
    matches = [
        NormalizedMatch(
            provider_id=item.provider_id,
            competition_provider_id=item.competition_provider_id,
            home_team_provider_id=item.home_team_provider_id,
            away_team_provider_id=item.away_team_provider_id,
            home_goals=item.home_goals,
            away_goals=item.away_goals,
            played_at=item.played_at,
            is_finished=item.is_finished,
            stats=[
                NormalizedMatchStat(
                    team_provider_id=stat.team_provider_id,
                    is_home=stat.is_home,
                    possession_pct=stat.possession_pct,
                    shots_total=stat.shots_total,
                    shots_on_target=stat.shots_on_target,
                    corners=stat.corners,
                    fouls=stat.fouls,
                )
                for stat in item.stats
            ],
        )
        for item in dataset.matches
    ]
    return NormalizedDataset(competitions=competitions, teams=teams, matches=matches)
