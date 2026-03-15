from app.db.session import SessionLocal
from app.etl.pipeline import run_historical_sync_pipeline


def test_pipeline_is_reproducible() -> None:
    with SessionLocal() as db:
        first = run_historical_sync_pipeline(db)
    with SessionLocal() as db:
        second = run_historical_sync_pipeline(db)

    assert first['ingested_matches'] == 8
    assert first['ingested_stats'] == 16
    assert first['last_synced_at'] is not None

    assert second['ingested_matches'] == 0
    assert second['ingested_stats'] == 0
    assert second['sync_error'] is None
