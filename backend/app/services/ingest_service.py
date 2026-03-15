import logging

from sqlalchemy.orm import Session

from app.etl.pipeline import run_historical_sync_pipeline

logger = logging.getLogger(__name__)


class IngestService:
    def __init__(self, db: Session):
        self.db = db

    def ingest_historical_data(self) -> dict[str, int | str | None]:
        result = run_historical_sync_pipeline(self.db)
        logger.info("Historical data synchronized", extra=result)
        return result
