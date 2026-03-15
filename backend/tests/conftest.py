import pytest
from fastapi.testclient import TestClient
from pathlib import Path

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.main import app


@pytest.fixture(autouse=True)
def reset_db() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


@pytest.fixture(autouse=True)
def reset_artifact_file() -> None:
    artifact = Path(settings.artifact_path)
    if artifact.parent.exists():
        for path in artifact.parent.glob(f"{artifact.stem}.*.json"):
            path.unlink()
    if artifact.exists():
        artifact.unlink()


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)
