from datetime import datetime, timezone

from app.core.config import settings
from app.providers.real_provider import RealFootballDataProvider


def test_real_provider_maps_api_football_payload(monkeypatch) -> None:
    monkeypatch.setattr(settings, "football_data_api_key", "token")
    monkeypatch.setattr(settings, "football_data_league_ids", "39")
    monkeypatch.setattr(settings, "football_data_seasons", "2024")

    provider = RealFootballDataProvider()

    def fake_request(path: str, params: dict):
        if path == "/fixtures":
            return {
                "paging": {"current": 1, "total": 1},
                "response": [
                    {
                        "fixture": {"id": 1001, "date": "2024-10-01T20:00:00+00:00"},
                        "league": {"id": 39, "name": "Premier League", "country": "England"},
                        "teams": {
                            "home": {"id": 50, "name": "Manchester City"},
                            "away": {"id": 42, "name": "Arsenal"},
                        },
                        "goals": {"home": 2, "away": 1},
                    }
                ],
            }
        if path == "/fixtures/statistics":
            return {
                "response": [
                    {
                        "team": {"id": 50},
                        "statistics": [
                            {"type": "Ball Possession", "value": "58%"},
                            {"type": "Total Shots", "value": 14},
                            {"type": "Shots on Goal", "value": 6},
                            {"type": "Corner Kicks", "value": 5},
                            {"type": "Fouls", "value": 10},
                        ],
                    },
                    {
                        "team": {"id": 42},
                        "statistics": [
                            {"type": "Ball Possession", "value": "42%"},
                            {"type": "Total Shots", "value": 10},
                            {"type": "Shots on Goal", "value": 4},
                            {"type": "Corner Kicks", "value": 3},
                            {"type": "Fouls", "value": 12},
                        ],
                    },
                ]
            }
        raise AssertionError("Unexpected path")

    monkeypatch.setattr(provider, "_request", fake_request)

    dataset = provider.fetch_historical_data(since=datetime(2024, 1, 1, tzinfo=timezone.utc))

    assert len(dataset.matches) == 1
    assert dataset.matches[0].provider_id == "api_football_fixture_1001"
    assert dataset.matches[0].home_goals == 2
    assert len(dataset.matches[0].stats) == 2
    assert dataset.latest_played_at is not None


def test_real_provider_requires_key(monkeypatch) -> None:
    monkeypatch.setattr(settings, "football_data_api_key", "")
    monkeypatch.setattr(settings, "football_data_league_ids", "39")
    monkeypatch.setattr(settings, "football_data_seasons", "2024")

    provider = RealFootballDataProvider()

    try:
        provider.fetch_historical_data()
        assert False, "Expected ValueError"
    except ValueError as exc:
        assert "FOOTBALL_DATA_API_KEY" in str(exc)


def test_real_provider_incremental_keeps_same_day_fixtures(monkeypatch) -> None:
    monkeypatch.setattr(settings, "football_data_api_key", "token")
    monkeypatch.setattr(settings, "football_data_league_ids", "39")
    monkeypatch.setattr(settings, "football_data_seasons", "2024")

    provider = RealFootballDataProvider()

    def fake_request(path: str, params: dict):
        if path == "/fixtures":
            assert params.get("from") == "2024-10-01"
            return {
                "paging": {"current": 1, "total": 1},
                "response": [
                    {
                        "fixture": {"id": 1001, "date": "2024-10-01T19:00:00+00:00"},
                        "league": {"id": 39, "name": "Premier League", "country": "England"},
                        "teams": {"home": {"id": 1, "name": "A"}, "away": {"id": 2, "name": "B"}},
                        "goals": {"home": 1, "away": 0},
                    },
                    {
                        "fixture": {"id": 1002, "date": "2024-10-01T22:00:00+00:00"},
                        "league": {"id": 39, "name": "Premier League", "country": "England"},
                        "teams": {"home": {"id": 3, "name": "C"}, "away": {"id": 4, "name": "D"}},
                        "goals": {"home": 2, "away": 2},
                    },
                ],
            }
        if path == "/fixtures/statistics":
            fixture_id = params["fixture"]
            if fixture_id == 1001:
                return {"response": []}
            if fixture_id == 1002:
                return {"response": []}
        raise AssertionError("Unexpected path")

    monkeypatch.setattr(provider, "_request", fake_request)

    dataset = provider.fetch_historical_data(since=datetime(2024, 10, 1, 20, 0, tzinfo=timezone.utc))
    assert len(dataset.matches) == 1
    assert dataset.matches[0].provider_id == "api_football_fixture_1002"
    assert dataset.latest_played_at == datetime(2024, 10, 1, 22, 0)
