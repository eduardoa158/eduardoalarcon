from datetime import datetime, timezone

from app.core.config import settings
from app.db.session import SessionLocal
from app.domain.models import DataSyncState
from app.etl.pipeline import run_historical_sync_pipeline
from app.providers.real_provider import RealFootballDataProvider


def test_real_provider_sync_and_incremental(monkeypatch) -> None:
    monkeypatch.setattr(settings, "football_data_provider", "real")
    monkeypatch.setattr(settings, "football_data_api_key", "token")
    monkeypatch.setattr(settings, "football_data_league_ids", "39")
    monkeypatch.setattr(settings, "football_data_seasons", "2024")

    def fake_request(self: RealFootballDataProvider, path: str, params: dict):
        if path == "/fixtures":
            from_date = params.get("from")
            response_rows = []
            if not from_date or from_date <= "2024-10-01":
                response_rows = [
                    {
                        "fixture": {"id": 1001, "date": "2024-10-01T20:00:00+00:00"},
                        "league": {"id": 39, "name": "Premier League", "country": "England"},
                        "teams": {
                            "home": {"id": 50, "name": "Manchester City"},
                            "away": {"id": 42, "name": "Arsenal"},
                        },
                        "goals": {"home": 2, "away": 1},
                    }
                ]
            return {"paging": {"current": 1, "total": 1}, "response": response_rows}

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

    monkeypatch.setattr(RealFootballDataProvider, "_request", fake_request)

    with SessionLocal() as db:
        first = run_historical_sync_pipeline(db)
        state = db.query(DataSyncState).filter(DataSyncState.provider == "real").one()
        assert first["ingested_matches"] == 1
        assert state.last_synced_at == datetime(2024, 10, 1, 20, 0)

    with SessionLocal() as db:
        second = run_historical_sync_pipeline(db)
        assert second["ingested_matches"] == 0
        assert second["ingested_stats"] == 0
