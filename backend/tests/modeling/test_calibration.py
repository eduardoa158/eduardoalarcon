from app.modeling.calibration import (
    apply_temperature_scaling,
    expected_calibration_error,
    fit_temperature_scaler,
    multiclass_log_loss,
)


def test_temperature_scaling_keeps_distribution() -> None:
    probs = [0.6, 0.25, 0.15]
    scaled = apply_temperature_scaling(probs, temperature=1.5)
    assert len(scaled) == 3
    assert abs(sum(scaled) - 1.0) < 1e-6
    assert all(0 <= p <= 1 for p in scaled)


def test_fit_temperature_scaler_returns_model() -> None:
    records = [
        ([1.0, 0.0, 0.0], [0.65, 0.2, 0.15]),
        ([0.0, 1.0, 0.0], [0.55, 0.25, 0.2]),
        ([0.0, 0.0, 1.0], [0.5, 0.3, 0.2]),
    ]
    calibration = fit_temperature_scaler(records)
    assert calibration is not None
    assert calibration.method == "temperature_v1"
    assert calibration.temperature > 0


def test_ece_is_non_negative() -> None:
    records = [
        ([1.0, 0.0, 0.0], [0.8, 0.1, 0.1]),
        ([0.0, 1.0, 0.0], [0.4, 0.5, 0.1]),
    ]
    assert expected_calibration_error(records) >= 0


def test_log_loss_decreases_for_better_prob() -> None:
    truth = [1.0, 0.0, 0.0]
    bad = multiclass_log_loss(truth, [0.34, 0.33, 0.33])
    good = multiclass_log_loss(truth, [0.8, 0.1, 0.1])
    assert good < bad
