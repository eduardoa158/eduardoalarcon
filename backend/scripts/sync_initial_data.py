"""Run a full initial sync by resetting provider sync cursor state."""

from sqlalchemy import delete

from app.core.config import settings
from app.db.session import SessionLocal
from app.domain.models import DataSyncState
from app.services.ingest_service import IngestService


def main() -> None:
    with SessionLocal() as db:
        db.execute(delete(DataSyncState).where(DataSyncState.provider == settings.football_data_provider))
        db.commit()

        result = IngestService(db).ingest_historical_data()
        print({"status": "ok", "mode": "initial_sync", **result})


if __name__ == "__main__":
    main()
