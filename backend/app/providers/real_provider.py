import logging
import time
from datetime import datetime, timezone

import httpx

from app.core.config import settings
from app.providers.contracts import (
    FootballDataProvider,
    ProviderCompetition,
    ProviderDataset,
    ProviderMatch,
    ProviderMatchStat,
    ProviderTeam,
)

logger = logging.getLogger(__name__)


def _normalize_datetime(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is not None:
        return value.astimezone(timezone.utc).replace(tzinfo=None)
    return value


class RealFootballDataProvider(FootballDataProvider):
    """API-Football provider integration (api-sports)."""

    def __init__(self) -> None:
        self.base_url = settings.football_data_api_base_url.rstrip("/")
        self.timeout = settings.football_data_timeout_seconds
        self.max_retries = settings.football_data_max_retries
        self.league_ids = [token.strip() for token in settings.football_data_league_ids.split(",") if token.strip()]
        self.seasons = [token.strip() for token in settings.football_data_seasons.split(",") if token.strip()]

    def fetch_historical_data(self, since: datetime | None = None, cursor: str | None = None) -> ProviderDataset:
        if not settings.football_data_api_key:
            raise ValueError("FOOTBALL_DATA_API_KEY is required when football_data_provider=real")
        if not self.league_ids or not self.seasons:
            raise ValueError("FOOTBALL_DATA_LEAGUE_IDS and FOOTBALL_DATA_SEASONS are required for real provider")

        competitions: dict[str, ProviderCompetition] = {}
        teams: dict[str, ProviderTeam] = {}
        matches: list[ProviderMatch] = []
        normalized_since = _normalize_datetime(since)
        latest_played_at = normalized_since

        for league_id in self.league_ids:
            for season in self.seasons:
                fixtures = self._fetch_fixtures(league_id=league_id, season=season, since=normalized_since)
                for fixture in fixtures:
                    match = self._map_fixture_to_match(fixture)
                    if match is None:
                        continue

                    match_dt = _normalize_datetime(match.played_at)
                    if normalized_since is not None and (match_dt is None or match_dt <= normalized_since):
                        continue

                    stats = self._fetch_fixture_stats(fixture_id=fixture["fixture"]["id"])
                    match.stats.extend(stats)
                    matches.append(match)

                    competitions[match.competition_provider_id] = ProviderCompetition(
                        provider_id=match.competition_provider_id,
                        name=fixture["league"]["name"],
                        country=fixture["league"]["country"] or "Unknown",
                    )
                    teams[match.home_team_provider_id] = ProviderTeam(
                        provider_id=match.home_team_provider_id,
                        name=fixture["teams"]["home"]["name"],
                    )
                    teams[match.away_team_provider_id] = ProviderTeam(
                        provider_id=match.away_team_provider_id,
                        name=fixture["teams"]["away"]["name"],
                    )

                    if latest_played_at is None or (match_dt is not None and match_dt > latest_played_at):
                        latest_played_at = match_dt

        return ProviderDataset(
            competitions=list(competitions.values()),
            teams=list(teams.values()),
            matches=matches,
            latest_played_at=latest_played_at,
            next_cursor=None,
        )

    def _fetch_fixtures(self, league_id: str, season: str, since: datetime | None) -> list[dict]:
        page = 1
        all_rows: list[dict] = []

        while True:
            params: dict[str, str | int] = {
                "league": league_id,
                "season": season,
                "status": "FT-AET-PEN",
                "page": page,
            }
            if since:
                normalized_since = _normalize_datetime(since)
                if normalized_since is not None:
                    # Safe incremental strategy:
                    # request starting the same calendar date and deduplicate by exact datetime afterwards.
                    params["from"] = normalized_since.date().isoformat()

            payload = self._request("/fixtures", params=params)
            response_rows = payload.get("response", [])
            all_rows.extend(response_rows)

            paging = payload.get("paging", {})
            current = int(paging.get("current", page))
            total = int(paging.get("total", current))
            if current >= total:
                break
            page += 1

        return all_rows

    def _fetch_fixture_stats(self, fixture_id: int) -> list[ProviderMatchStat]:
        payload = self._request("/fixtures/statistics", params={"fixture": fixture_id})
        stats_rows = payload.get("response", [])

        mapped: list[ProviderMatchStat] = []
        for item in stats_rows:
            team_provider_id = f"api_football_team_{item['team']['id']}"
            stats_dict = {stat["type"]: stat["value"] for stat in item.get("statistics", [])}
            mapped.append(
                ProviderMatchStat(
                    team_provider_id=team_provider_id,
                    is_home=False,  # resolved later in loader by team relation in match
                    possession_pct=self._as_percent(stats_dict.get("Ball Possession")),
                    shots_total=self._as_int(stats_dict.get("Total Shots")),
                    shots_on_target=self._as_int(stats_dict.get("Shots on Goal")),
                    corners=self._as_int(stats_dict.get("Corner Kicks")),
                    fouls=self._as_int(stats_dict.get("Fouls")),
                )
            )
        return mapped

    def _map_fixture_to_match(self, fixture: dict) -> ProviderMatch | None:
        goals = fixture.get("goals") or {}
        fixture_info = fixture.get("fixture") or {}
        league = fixture.get("league") or {}
        teams = fixture.get("teams") or {}

        home_team = teams.get("home") or {}
        away_team = teams.get("away") or {}

        home_goals = self._as_int(goals.get("home"))
        away_goals = self._as_int(goals.get("away"))
        date_str = fixture_info.get("date")
        if home_goals is None or away_goals is None or not date_str:
            return None

        played_at = datetime.fromisoformat(date_str.replace("Z", "+00:00")).astimezone(timezone.utc)

        return ProviderMatch(
            provider_id=f"api_football_fixture_{fixture_info['id']}",
            competition_provider_id=f"api_football_league_{league['id']}",
            home_team_provider_id=f"api_football_team_{home_team['id']}",
            away_team_provider_id=f"api_football_team_{away_team['id']}",
            home_goals=home_goals,
            away_goals=away_goals,
            played_at=played_at,
            is_finished=True,
            stats=[],
        )

    def _request(self, path: str, params: dict[str, str | int]) -> dict:
        headers = {
            "x-apisports-key": settings.football_data_api_key,
        }
        url = f"{self.base_url}{path}"

        for attempt in range(self.max_retries + 1):
            try:
                with httpx.Client(timeout=self.timeout) as client:
                    response = client.get(url, params=params, headers=headers)

                if response.status_code == 429:
                    retry_after = int(response.headers.get("Retry-After", "1"))
                    time.sleep(min(retry_after, settings.football_data_max_backoff_seconds))
                    continue

                if response.status_code >= 500:
                    backoff = min(2**attempt, settings.football_data_max_backoff_seconds)
                    time.sleep(backoff)
                    continue

                response.raise_for_status()
                payload = response.json()
                if not isinstance(payload, dict):
                    raise RuntimeError("Unexpected provider payload")
                return payload
            except httpx.HTTPError as exc:
                if attempt >= self.max_retries:
                    logger.exception("HTTP failure on real provider request", extra={"url": url, "params": params})
                    raise RuntimeError("Real provider request failed") from exc
                backoff = min(2**attempt, settings.football_data_max_backoff_seconds)
                time.sleep(backoff)

        raise RuntimeError("Real provider retries exhausted")

    def _as_percent(self, value: object) -> float | None:
        if value is None:
            return None
        text = str(value).replace("%", "").strip()
        try:
            return float(text)
        except ValueError:
            return None

    def _as_int(self, value: object) -> int | None:
        if value is None:
            return None
        try:
            return int(float(str(value)))
        except ValueError:
            return None
