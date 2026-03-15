from app.providers.mock_provider import MockFootballDataProvider


def test_mock_provider_contract() -> None:
    dataset = MockFootballDataProvider().fetch_historical_data()

    assert len(dataset.competitions) >= 1
    assert len(dataset.teams) >= 2
    assert len(dataset.matches) >= 1
    assert dataset.matches[0].stats
