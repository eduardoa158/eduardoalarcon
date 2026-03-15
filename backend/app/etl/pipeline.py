from sqlalchemy.orm import Session

from app.core.config import settings
from app.etl.extract import extract_historical_dataset
from app.etl.load import load_dataset
from app.etl.sync_state import get_or_create_sync_state, mark_sync_failure, mark_sync_success
from app.etl.transform import normalize_dataset


def run_historical_sync_pipeline(db: Session) -> dict[str, int | str | None]:
    state = get_or_create_sync_state(db, provider=settings.football_data_provider)
    since = state.last_synced_at
    cursor = state.last_cursor

    try:
        extracted = extract_historical_dataset(since=since, cursor=cursor)
        normalized = normalize_dataset(extracted)
        load_result = load_dataset(db, normalized)

        updated_state = mark_sync_success(
            db,
            provider=settings.football_data_provider,
            last_synced_at=extracted.latest_played_at,
            last_cursor=extracted.next_cursor,
        )
        db.commit()
    except Exception as exc:
        mark_sync_failure(db, provider=settings.football_data_provider, error=str(exc))
        db.commit()
        raise

    return {
        **load_result,
        "last_synced_at": updated_state.last_synced_at.isoformat() if updated_state.last_synced_at else None,
        "last_success_at": updated_state.last_success_at.isoformat() if updated_state.last_success_at else None,
        "sync_error": updated_state.last_error,
    }
