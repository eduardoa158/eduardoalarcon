from app.core.config import settings
from app.providers.contracts import FootballDataProvider
from app.providers.mock_provider import MockFootballDataProvider
from app.providers.real_provider import RealFootballDataProvider


def get_football_data_provider() -> FootballDataProvider:
    if settings.football_data_provider == "real":
        return RealFootballDataProvider()
    return MockFootballDataProvider()
