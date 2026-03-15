from datetime import datetime

from app.providers.contracts import ProviderDataset
from app.providers.factory import get_football_data_provider


def extract_historical_dataset(since: datetime | None = None, cursor: str | None = None) -> ProviderDataset:
    provider = get_football_data_provider()
    return provider.fetch_historical_data(since=since, cursor=cursor)
