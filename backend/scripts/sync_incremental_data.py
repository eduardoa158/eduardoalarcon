"""Run incremental sync using persisted sync state cursor/timestamp."""

from app.db.session import SessionLocal
from app.services.ingest_service import IngestService


def main() -> None:
    with SessionLocal() as db:
        result = IngestService(db).ingest_historical_data()
        print({"status": "ok", "mode": "incremental_sync", **result})


if __name__ == "__main__":
    main()
