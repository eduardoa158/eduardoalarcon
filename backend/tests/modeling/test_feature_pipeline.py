from datetime import datetime, timezone

from app.modeling.contracts import HistoricalMatchRecord
from app.modeling.feature_pipeline import build_training_rows, feature_names


def test_feature_pipeline_uses_only_past_data() -> None:
    history = [
        HistoricalMatchRecord(1, datetime(2024, 1, 1, tzinfo=timezone.utc), "A", "B", 2, 0),
        HistoricalMatchRecord(2, datetime(2024, 1, 2, tzinfo=timezone.utc), "A", "C", 1, 1),
    ]

    rows = build_training_rows(history)

    # first match has no history -> safe baseline prior (not full-dataset average)
    assert rows[0].features[7] == 1.2
    assert rows[0].features[5] == 0
    assert rows[0].features[6] == 0

    # second match should use only first match as past signal
    assert rows[1].features[5] == 1
    assert rows[1].features[7] == 1.0


def test_feature_pipeline_v3_has_expected_dimensions() -> None:
    history = [
        HistoricalMatchRecord(1, datetime(2024, 1, 1, tzinfo=timezone.utc), "A", "B", 2, 0),
        HistoricalMatchRecord(2, datetime(2024, 1, 2, tzinfo=timezone.utc), "A", "C", 1, 1),
        HistoricalMatchRecord(3, datetime(2024, 1, 3, tzinfo=timezone.utc), "B", "A", 0, 2),
    ]

    rows = build_training_rows(history, feature_version="v3")
    assert len(rows) == 3
    assert rows[0].features.shape[0] == len(feature_names("v3"))
    # cold start flags for very early history should be active
    assert rows[0].features[18] in {0.0, 1.0}
