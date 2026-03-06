from __future__ import annotations


def combine_stop(entry: float, atr: float, fib_invalidation: float, side: str, k: float) -> float:
    if side == "LONG":
        stop_atr = entry - k * atr
        return min(stop_atr, fib_invalidation)
    stop_atr = entry + k * atr
    return max(stop_atr, fib_invalidation)
