from dataclasses import dataclass

import numpy as np

from app.modeling.calibration import (
    TemperatureCalibration,
    apply_temperature_scaling,
    brier_1x2,
    expected_calibration_error,
    fit_temperature_scaler,
    multiclass_log_loss,
)
from app.modeling.contracts import EvaluationReport, HistoricalMatchRecord, PredictionInput
from app.modeling.predictor import MODEL_SPECS, TrainableBaselinePredictor


@dataclass
class SplitMetrics:
    split_id: int
    train_size: int
    test_size: int
    mae_home_goals: float
    mae_away_goals: float
    brier_1x2: float
    log_loss_1x2: float


@dataclass
class BacktestReport:
    splits: list[SplitMetrics]
    avg_mae_home_goals: float
    avg_mae_away_goals: float
    avg_brier_1x2: float
    avg_log_loss_1x2: float


@dataclass
class ModelComparisonRow:
    model_name: str
    static_holdout_brier_1x2: float
    static_holdout_log_loss_1x2: float
    static_holdout_mae_home: float
    static_holdout_mae_away: float
    walk_forward_holdout_brier_1x2: float
    walk_forward_holdout_log_loss_1x2: float
    backtest_avg_brier_1x2: float
    backtest_avg_log_loss_1x2: float


@dataclass
class MatchProbRecord:
    match_id: int
    truth: list[float]
    probs_raw: list[float]
    probs_calibrated: list[float] | None


@dataclass
class ProbabilisticMetrics:
    brier_1x2: float
    log_loss_1x2: float
    ece_1x2: float


def _truth_one_hot(match: HistoricalMatchRecord) -> list[float]:
    return [
        1.0 if match.home_goals > match.away_goals else 0.0,
        1.0 if match.home_goals == match.away_goals else 0.0,
        1.0 if match.home_goals < match.away_goals else 0.0,
    ]


def _compute_metrics_static_holdout(
    predictor: TrainableBaselinePredictor, train: list[HistoricalMatchRecord], test: list[HistoricalMatchRecord]
) -> SplitMetrics:
    home_errors: list[float] = []
    away_errors: list[float] = []
    brier_scores: list[float] = []
    log_losses: list[float] = []

    for match in test:
        pred = predictor.predict(PredictionInput(home_team=match.home_team, away_team=match.away_team), train)
        home_errors.append(abs(pred.expected_goals_home - match.home_goals))
        away_errors.append(abs(pred.expected_goals_away - match.away_goals))

        truth = _truth_one_hot(match)
        probs = [pred.home_win, pred.draw, pred.away_win]
        brier_scores.append(brier_1x2(truth, probs))
        log_losses.append(multiclass_log_loss(truth, probs))

    return SplitMetrics(
        split_id=0,
        train_size=len(train),
        test_size=len(test),
        mae_home_goals=round(float(np.mean(home_errors)), 4),
        mae_away_goals=round(float(np.mean(away_errors)), 4),
        brier_1x2=round(float(np.mean(brier_scores)), 4),
        log_loss_1x2=round(float(np.mean(log_losses)), 4),
    )


def _compute_metrics_walk_forward(
    predictor: TrainableBaselinePredictor, train: list[HistoricalMatchRecord], test: list[HistoricalMatchRecord]
) -> SplitMetrics:
    home_errors: list[float] = []
    away_errors: list[float] = []
    brier_scores: list[float] = []
    log_losses: list[float] = []

    for idx, match in enumerate(test):
        history_available = train + test[:idx]
        pred = predictor.predict(PredictionInput(home_team=match.home_team, away_team=match.away_team), history_available)
        home_errors.append(abs(pred.expected_goals_home - match.home_goals))
        away_errors.append(abs(pred.expected_goals_away - match.away_goals))

        truth = _truth_one_hot(match)
        probs = [pred.home_win, pred.draw, pred.away_win]
        brier_scores.append(brier_1x2(truth, probs))
        log_losses.append(multiclass_log_loss(truth, probs))

    return SplitMetrics(
        split_id=0,
        train_size=len(train),
        test_size=len(test),
        mae_home_goals=round(float(np.mean(home_errors)), 4),
        mae_away_goals=round(float(np.mean(away_errors)), 4),
        brier_1x2=round(float(np.mean(brier_scores)), 4),
        log_loss_1x2=round(float(np.mean(log_losses)), 4),
    )


def _ordered(history: list[HistoricalMatchRecord]) -> list[HistoricalMatchRecord]:
    return sorted(history, key=lambda m: (m.played_at, m.match_id))


def run_temporal_backtest(
    history: list[HistoricalMatchRecord],
    model_name: str = "ridge_poisson_v1_1",
    initial_train_size: int = 5,
    test_window: int = 2,
) -> BacktestReport:
    ordered = _ordered(history)
    if len(ordered) < initial_train_size + test_window:
        raise ValueError("Not enough matches for temporal backtest")

    split_results: list[SplitMetrics] = []
    split_id = 1
    split_start = initial_train_size

    while split_start < len(ordered):
        train = ordered[:split_start]
        test = ordered[split_start : split_start + test_window]
        if len(test) == 0:
            break

        predictor = TrainableBaselinePredictor.from_model_spec(model_name)
        predictor.train(train)
        metrics = _compute_metrics_walk_forward(predictor, train, test)
        metrics.split_id = split_id
        split_results.append(metrics)

        split_id += 1
        split_start += test_window

    if not split_results:
        raise ValueError("Backtest produced no splits")

    return BacktestReport(
        splits=split_results,
        avg_mae_home_goals=round(float(np.mean([m.mae_home_goals for m in split_results])), 4),
        avg_mae_away_goals=round(float(np.mean([m.mae_away_goals for m in split_results])), 4),
        avg_brier_1x2=round(float(np.mean([m.brier_1x2 for m in split_results])), 4),
        avg_log_loss_1x2=round(float(np.mean([m.log_loss_1x2 for m in split_results])), 4),
    )


def strict_temporal_validation(
    history: list[HistoricalMatchRecord],
    model_name: str = "ridge_poisson_v1_1",
    holdout_size: int = 2,
) -> EvaluationReport:
    ordered = _ordered(history)
    if len(ordered) < holdout_size + 3:
        raise ValueError("Not enough data for strict temporal validation")

    train = ordered[:-holdout_size]
    test = ordered[-holdout_size:]

    predictor = TrainableBaselinePredictor.from_model_spec(model_name)
    predictor.train(train)
    metrics = _compute_metrics_static_holdout(predictor, train, test)

    return EvaluationReport(
        matches_evaluated=metrics.test_size,
        mae_home_goals=metrics.mae_home_goals,
        mae_away_goals=metrics.mae_away_goals,
        brier_1x2=metrics.brier_1x2,
        log_loss_1x2=metrics.log_loss_1x2,
    )


def walk_forward_holdout_evaluation(
    history: list[HistoricalMatchRecord],
    model_name: str = "ridge_poisson_v1_1",
    holdout_size: int = 2,
) -> EvaluationReport:
    ordered = _ordered(history)
    if len(ordered) < holdout_size + 3:
        raise ValueError("Not enough data for walk-forward holdout evaluation")

    train = ordered[:-holdout_size]
    test = ordered[-holdout_size:]

    predictor = TrainableBaselinePredictor.from_model_spec(model_name)
    predictor.train(train)
    metrics = _compute_metrics_walk_forward(predictor, train, test)

    return EvaluationReport(
        matches_evaluated=metrics.test_size,
        mae_home_goals=metrics.mae_home_goals,
        mae_away_goals=metrics.mae_away_goals,
        brier_1x2=metrics.brier_1x2,
        log_loss_1x2=metrics.log_loss_1x2,
    )


def compare_model_specs(history: list[HistoricalMatchRecord], model_names: list[str]) -> list[ModelComparisonRow]:
    rows: list[ModelComparisonRow] = []
    for model_name in model_names:
        if model_name not in MODEL_SPECS:
            raise ValueError(f"Unsupported model_name '{model_name}'")

        static_report = strict_temporal_validation(history, model_name=model_name)
        wf_report = walk_forward_holdout_evaluation(history, model_name=model_name)
        backtest_report = run_temporal_backtest(history, model_name=model_name)
        rows.append(
            ModelComparisonRow(
                model_name=model_name,
                static_holdout_brier_1x2=static_report.brier_1x2,
                static_holdout_log_loss_1x2=static_report.log_loss_1x2,
                static_holdout_mae_home=static_report.mae_home_goals,
                static_holdout_mae_away=static_report.mae_away_goals,
                walk_forward_holdout_brier_1x2=wf_report.brier_1x2,
                walk_forward_holdout_log_loss_1x2=wf_report.log_loss_1x2,
                backtest_avg_brier_1x2=backtest_report.avg_brier_1x2,
                backtest_avg_log_loss_1x2=backtest_report.avg_log_loss_1x2,
            )
        )

    rows.sort(key=lambda x: (x.static_holdout_log_loss_1x2, x.static_holdout_brier_1x2))
    return rows


def _predict_static_holdout_records(
    history: list[HistoricalMatchRecord], model_name: str, holdout_size: int = 2
) -> list[MatchProbRecord]:
    ordered = _ordered(history)
    if len(ordered) < holdout_size + 3:
        raise ValueError("Not enough data for static holdout prediction records")

    train = ordered[:-holdout_size]
    test = ordered[-holdout_size:]
    predictor = TrainableBaselinePredictor.from_model_spec(model_name)
    predictor.train(train)

    records: list[MatchProbRecord] = []
    for match in test:
        pred = predictor.predict(PredictionInput(home_team=match.home_team, away_team=match.away_team), train)
        records.append(
            MatchProbRecord(
                match_id=match.match_id,
                truth=_truth_one_hot(match),
                probs_raw=[pred.home_win, pred.draw, pred.away_win],
                probs_calibrated=None,
            )
        )
    return records


def _backtest_oos_records(
    history: list[HistoricalMatchRecord], model_name: str, exclude_match_ids: set[int], initial_train_size: int = 5, test_window: int = 2
) -> list[MatchProbRecord]:
    ordered = _ordered(history)
    if len(ordered) < initial_train_size + test_window:
        return []

    records: list[MatchProbRecord] = []
    split_start = initial_train_size
    while split_start < len(ordered):
        train = ordered[:split_start]
        test = ordered[split_start : split_start + test_window]
        if not test:
            break
        predictor = TrainableBaselinePredictor.from_model_spec(model_name)
        predictor.train(train)

        for idx, match in enumerate(test):
            if match.match_id in exclude_match_ids:
                continue
            history_available = train + test[:idx]
            pred = predictor.predict(
                PredictionInput(home_team=match.home_team, away_team=match.away_team),
                history_available,
            )
            records.append(
                MatchProbRecord(
                    match_id=match.match_id,
                    truth=_truth_one_hot(match),
                    probs_raw=[pred.home_win, pred.draw, pred.away_win],
                    probs_calibrated=None,
                )
            )
        split_start += test_window

    return records


def _prob_metrics(records: list[MatchProbRecord], calibrated: bool) -> ProbabilisticMetrics:
    if not records:
        return ProbabilisticMetrics(brier_1x2=0.0, log_loss_1x2=0.0, ece_1x2=0.0)

    pairs: list[tuple[list[float], list[float]]] = []
    brier: list[float] = []
    logloss: list[float] = []

    for r in records:
        probs = r.probs_calibrated if calibrated and r.probs_calibrated is not None else r.probs_raw
        pairs.append((r.truth, probs))
        brier.append(brier_1x2(r.truth, probs))
        logloss.append(multiclass_log_loss(r.truth, probs))

    return ProbabilisticMetrics(
        brier_1x2=round(float(np.mean(brier)), 4),
        log_loss_1x2=round(float(np.mean(logloss)), 4),
        ece_1x2=round(expected_calibration_error(pairs), 4),
    )


def evaluate_probability_calibration(
    history: list[HistoricalMatchRecord], model_name: str, holdout_size: int = 2
) -> dict[str, object]:
    ordered = _ordered(history)
    if len(ordered) < holdout_size + 3:
        return {
            "model_name": model_name,
            "calibration_method": "temperature_v1",
            "fitted": False,
            "reason": "not_enough_history",
        }

    fit_records = _backtest_oos_records(history, model_name=model_name, exclude_match_ids=set())
    fit_pairs = [(r.truth, r.probs_raw) for r in fit_records]
    calibration = fit_temperature_scaler(fit_pairs)

    static_records = _predict_static_holdout_records(history, model_name=model_name, holdout_size=holdout_size)
    before = _prob_metrics(static_records, calibrated=False)

    if calibration is None:
        return {
            "model_name": model_name,
            "calibration_method": "temperature_v1",
            "fitted": False,
            "reason": "insufficient_oos_predictions",
            "fit_samples": len(fit_records),
            "before": before.__dict__,
        }

    for rec in static_records:
        rec.probs_calibrated = apply_temperature_scaling(rec.probs_raw, calibration.temperature)

    after = _prob_metrics(static_records, calibrated=True)

    # Conservative activation gate:
    # require non-worse log-loss and non-worse brier on static holdout.
    activate = after.log_loss_1x2 <= before.log_loss_1x2 and after.brier_1x2 <= before.brier_1x2

    # reliability bins summary by confidence bin
    bins = []
    raw_pairs = [(r.truth, r.probs_raw) for r in static_records]
    cal_pairs = [(r.truth, r.probs_calibrated or r.probs_raw) for r in static_records]
    for idx in range(5):
        low = idx * 0.2
        high = (idx + 1) * 0.2

        def _bin_summary(pairs: list[tuple[list[float], list[float]]]) -> dict[str, float]:
            selected: list[tuple[list[float], list[float]]] = []
            for truth, probs in pairs:
                pred_idx = max(range(3), key=lambda i: probs[i])
                conf = probs[pred_idx]
                if (conf >= low and conf < high) or (idx == 4 and conf <= high):
                    selected.append((truth, probs))
            if not selected:
                return {"count": 0.0, "avg_conf": 0.0, "avg_acc": 0.0}
            avg_conf = float(np.mean([max(p) for _, p in selected]))
            avg_acc = float(np.mean([1.0 if t[max(range(3), key=lambda i: p[i])] == 1.0 else 0.0 for t, p in selected]))
            return {"count": float(len(selected)), "avg_conf": round(avg_conf, 4), "avg_acc": round(avg_acc, 4)}

        bins.append(
            {
                "bin": f"[{low:.1f},{high:.1f}]",
                "raw": _bin_summary(raw_pairs),
                "calibrated": _bin_summary(cal_pairs),
            }
        )

    return {
        "model_name": model_name,
        "calibration_method": calibration.method,
        "fitted": True,
        "fit_samples": calibration.fitted_samples,
        "temperature": calibration.temperature,
        "before": before.__dict__,
        "after": after.__dict__,
        "activate": activate,
        "reliability_bins": bins,
    }
