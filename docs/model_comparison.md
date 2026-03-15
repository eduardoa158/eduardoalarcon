# Model comparison (v1.5 champion/challenger)

Fecha: 2026-03-15
Dataset: históricos persistidos tras `seed_mock_data`.

## Modelos comparados
- `ridge_poisson_v1_1` (referencia)
- `ridge_poisson_v1_5` (activo)
- `ridge_poisson_v1_5_weighted` (challenger)

## Métricas temporales (sin calibración)
| Modelo | Static Brier | Static LogLoss | Static MAE Home | Static MAE Away | WF Holdout Brier | WF Holdout LogLoss | Backtest Avg Brier | Backtest Avg LogLoss |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| ridge_poisson_v1_5 | 0.5164 | **2.3888** | **1.0405** | **1.4000** | 0.5163 | **2.3881** | 0.3150 | 1.6228 |
| ridge_poisson_v1_5_weighted | **0.5003** | 2.4698 | 1.1110 | 1.7180 | **0.5002** | 2.4695 | **0.3124** | **1.5866** |
| ridge_poisson_v1_1 | 0.5141 | 2.5442 | 1.0615 | 1.9205 | 0.5140 | 2.5435 | 0.3661 | 1.7717 |

## Lectura técnica
- `ridge_poisson_v1_5` mantiene mejor log-loss estático y MAE.
- `ridge_poisson_v1_5_weighted` mejora brier y backtest promedio, pero no domina log-loss estático.
- La referencia `v1_1` queda por detrás en la mayoría de métricas relevantes.

## Probabilidades calibradas (modelo activo)
Para `ridge_poisson_v1_5`:
- before (static): brier 0.5164 / log-loss 2.3888 / ece 0.8543
- after (`temperature_v1`, T=3.0): brier 0.2970 / log-loss 1.3392 / ece 0.5542
- gate de activación: **pasa** (no empeora brier ni log-loss)

## Decisión final
- Modelo activo: **`ridge_poisson_v1_5`** (`ACTIVE_MODEL_NAME`).
- Calibración activa para el modelo: **sí** (`temperature_v1`) en artefacto activo.
- Activación sigue siendo explícita por configuración; no hay auto-promoción de challengers.
