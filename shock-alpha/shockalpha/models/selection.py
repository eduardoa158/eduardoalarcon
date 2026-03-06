from __future__ import annotations


def pick_best(metrics: dict[str, float]) -> str:
    return max(metrics, key=metrics.get) if metrics else "arimax"
