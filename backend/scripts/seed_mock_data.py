"""Convenience wrapper to seed database with mock provider data."""

from app.core.config import settings
from app.db.session import SessionLocal
from app.services.ingest_service import IngestService


def main() -> None:
    if settings.football_data_provider != "mock":
        raise RuntimeError(
            "seed_mock_data requires FOOTBALL_DATA_PROVIDER=mock. "
            "Change backend/.env or use sync scripts for real provider."
        )

    db = SessionLocal()
    try:
        result = IngestService(db).ingest_historical_data()
        print({"status": "ok", "mode": "seed", **result})
    finally:
        db.close()


if __name__ == "__main__":
    main()
