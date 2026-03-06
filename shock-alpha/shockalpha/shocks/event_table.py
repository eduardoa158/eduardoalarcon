from __future__ import annotations

from pathlib import Path

import pandas as pd


def write_events_table(events: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    events.sort_values("date").to_csv(path, index=False)
