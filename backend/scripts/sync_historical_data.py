"""Run provider sync pipeline and persist normalized data."""

from app.db.session import SessionLocal
from app.services.ingest_service import IngestService


def main() -> None:
    db = SessionLocal()
    try:
        result = IngestService(db).ingest_historical_data()
        print({"status": "ok", **result})
    finally:
        db.close()


if __name__ == "__main__":
    main()
