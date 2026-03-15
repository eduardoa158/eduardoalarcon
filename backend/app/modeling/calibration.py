from dataclasses import dataclass
import math


@dataclass
class TemperatureCalibration:
    method: str
    temperature: float
    fitted_samples: int


def _normalize(probs: list[float]) -> list[float]:
    total = sum(probs) or 1.0
    return [p / total for p in probs]


def apply_temperature_scaling(probs: list[float], temperature: float) -> list[float]:
    if temperature <= 0:
        raise ValueError("temperature must be > 0")
    if len(probs) != 3:
        raise ValueError("temperature scaling expects 3-class probabilities")

    eps = 1e-12
    logits = [math.log(max(min(p, 1 - eps), eps)) for p in _normalize(probs)]
    scaled = [math.exp(l / temperature) for l in logits]
    return _normalize(scaled)


def multiclass_log_loss(truth_one_hot: list[float], probs: list[float], eps: float = 1e-12) -> float:
    clipped = [min(max(p, eps), 1 - eps) for p in probs]
    return -sum(y * math.log(p) for y, p in zip(truth_one_hot, clipped))


def brier_1x2(truth_one_hot: list[float], probs: list[float]) -> float:
    return sum((p - y) ** 2 for p, y in zip(probs, truth_one_hot)) / 3


def expected_calibration_error(records: list[tuple[list[float], list[float]]], bins: int = 10) -> float:
    # One-vs-confidence ECE on predicted class confidence.
    if not records:
        return 0.0

    bin_totals = [0] * bins
    bin_conf_sum = [0.0] * bins
    bin_acc_sum = [0.0] * bins

    for truth, probs in records:
        pred_idx = max(range(3), key=lambda i: probs[i])
        conf = probs[pred_idx]
        acc = 1.0 if truth[pred_idx] == 1.0 else 0.0
        idx = min(int(conf * bins), bins - 1)
        bin_totals[idx] += 1
        bin_conf_sum[idx] += conf
        bin_acc_sum[idx] += acc

    n = len(records)
    ece = 0.0
    for i in range(bins):
        if bin_totals[i] == 0:
            continue
        avg_conf = bin_conf_sum[i] / bin_totals[i]
        avg_acc = bin_acc_sum[i] / bin_totals[i]
        ece += (bin_totals[i] / n) * abs(avg_acc - avg_conf)
    return ece


def fit_temperature_scaler(records: list[tuple[list[float], list[float]]]) -> TemperatureCalibration | None:
    # records: (truth_one_hot, probs)
    if len(records) < 3:
        return None

    best_t = 1.0
    best_loss = float("inf")
    # deterministic grid-search (reproducible)
    for t in [round(x * 0.05, 2) for x in range(10, 61)]:  # 0.50 .. 3.00
        losses = []
        for truth, probs in records:
            scaled = apply_temperature_scaling(probs, t)
            losses.append(multiclass_log_loss(truth, scaled))
        avg = sum(losses) / len(losses)
        if avg < best_loss:
            best_loss = avg
            best_t = t

    return TemperatureCalibration(method="temperature_v1", temperature=best_t, fitted_samples=len(records))
