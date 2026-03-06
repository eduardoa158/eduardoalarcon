from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml


@dataclass
class Settings:
    default: dict[str, Any]
    tickers: dict[str, Any]
    sources: dict[str, Any]


def _read_yaml(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def load_settings(base: Path) -> Settings:
    config_dir = base / "config"
    return Settings(
        default=_read_yaml(config_dir / "default.yaml"),
        tickers=_read_yaml(config_dir / "tickers.yaml"),
        sources=_read_yaml(config_dir / "sources.yaml"),
    )
