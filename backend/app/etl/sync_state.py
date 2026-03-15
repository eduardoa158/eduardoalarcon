from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.models import DataSyncState


def get_or_create_sync_state(db: Session, provider: str) -> DataSyncState:
    state = db.scalar(select(DataSyncState).where(DataSyncState.provider == provider))
    if state:
        return state
    state = DataSyncState(provider=provider)
    db.add(state)
    db.flush()
    return state


def mark_sync_success(db: Session, provider: str, last_synced_at: datetime | None, last_cursor: str | None = None) -> DataSyncState:
    state = get_or_create_sync_state(db, provider)
    now = datetime.now(timezone.utc)
    state.last_synced_at = last_synced_at
    state.last_success_at = now
    state.last_cursor = last_cursor
    state.last_error = None
    db.flush()
    return state


def mark_sync_failure(db: Session, provider: str, error: str) -> DataSyncState:
    state = get_or_create_sync_state(db, provider)
    state.last_error = error[:500]
    db.flush()
    return state
