from datetime import datetime, timezone

from app.providers.contracts import (
    FootballDataProvider,
    ProviderCompetition,
    ProviderDataset,
    ProviderMatch,
    ProviderMatchStat,
    ProviderTeam,
)




def _normalize_datetime(value):
    if value is None:
        return None
    if value.tzinfo is not None:
        return value.astimezone(timezone.utc).replace(tzinfo=None)
    return value

class MockFootballDataProvider(FootballDataProvider):
    def fetch_historical_data(self, since=None, cursor=None) -> ProviderDataset:
        competitions = [
            ProviderCompetition(provider_id="comp_laliga", name="LaLiga", country="Spain"),
        ]
        teams = [
            ProviderTeam(provider_id="team_barcelona", name="FC Barcelona"),
            ProviderTeam(provider_id="team_real_madrid", name="Real Madrid"),
            ProviderTeam(provider_id="team_atletico", name="Atletico Madrid"),
            ProviderTeam(provider_id="team_sevilla", name="Sevilla"),
        ]
        matches = [
            self._match("match_1", "team_barcelona", "team_real_madrid", 2, 1, datetime(2024, 8, 18, 19, 0, tzinfo=timezone.utc), 58, 42, 14, 10),
            self._match("match_2", "team_real_madrid", "team_atletico", 1, 0, datetime(2024, 8, 25, 20, 0, tzinfo=timezone.utc), 55, 45, 12, 8),
            self._match("match_3", "team_atletico", "team_barcelona", 1, 3, datetime(2024, 9, 2, 20, 0, tzinfo=timezone.utc), 48, 52, 11, 15),
            self._match("match_4", "team_sevilla", "team_real_madrid", 0, 2, datetime(2024, 9, 10, 18, 30, tzinfo=timezone.utc), 44, 56, 9, 16),
            self._match("match_5", "team_barcelona", "team_sevilla", 2, 0, datetime(2024, 9, 17, 19, 30, tzinfo=timezone.utc), 61, 39, 15, 7),
            self._match("match_6", "team_atletico", "team_sevilla", 2, 2, datetime(2024, 9, 24, 18, 30, tzinfo=timezone.utc), 50, 50, 10, 10),
            self._match("match_7", "team_real_madrid", "team_barcelona", 2, 2, datetime(2024, 10, 1, 20, 0, tzinfo=timezone.utc), 53, 47, 13, 12),
            self._match("match_8", "team_sevilla", "team_atletico", 1, 1, datetime(2024, 10, 8, 18, 30, tzinfo=timezone.utc), 49, 51, 10, 11),
        ]
        since_norm = _normalize_datetime(since)
        filtered = [m for m in matches if since_norm is None or _normalize_datetime(m.played_at) > since_norm]
        latest_played_at = max((m.played_at for m in filtered), default=since)
        return ProviderDataset(competitions=competitions, teams=teams, matches=filtered, latest_played_at=latest_played_at, next_cursor=None)

    def _match(
        self,
        provider_id: str,
        home_team_provider_id: str,
        away_team_provider_id: str,
        home_goals: int,
        away_goals: int,
        played_at: datetime,
        home_possession: float,
        away_possession: float,
        home_shots: int,
        away_shots: int,
    ) -> ProviderMatch:
        return ProviderMatch(
            provider_id=provider_id,
            competition_provider_id="comp_laliga",
            home_team_provider_id=home_team_provider_id,
            away_team_provider_id=away_team_provider_id,
            home_goals=home_goals,
            away_goals=away_goals,
            played_at=played_at,
            stats=[
                ProviderMatchStat(
                    team_provider_id=home_team_provider_id,
                    is_home=True,
                    possession_pct=home_possession,
                    shots_total=home_shots,
                    shots_on_target=max(1, home_shots // 2),
                    corners=max(1, home_shots // 3),
                    fouls=10,
                ),
                ProviderMatchStat(
                    team_provider_id=away_team_provider_id,
                    is_home=False,
                    possession_pct=away_possession,
                    shots_total=away_shots,
                    shots_on_target=max(1, away_shots // 2),
                    corners=max(1, away_shots // 3),
                    fouls=11,
                ),
            ],
        )
