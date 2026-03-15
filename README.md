# Football Match Predictor v1.5 (FastAPI + Next.js)

Sistema full-stack para predicción de partidos con ETL, modelado baseline reproducible, evaluación temporal/probabilística, API y frontend.

## Capacidades actuales
- ETL histórico con provider `mock` o `real` (API-Football).
- Modelos champion/challenger entrenables y comparables.
- Inferencia con artefacto validado del modelo activo.
- Salida de predicción con:
  - `expected_goals.home` / `expected_goals.away`
  - `probabilities_1x2`
  - `top_scorelines`
  - `feature_summary`
  - `probability_metadata`

## Stack
- Backend: FastAPI + SQLAlchemy
- Frontend: Next.js + TypeScript + Tailwind
- DB: PostgreSQL (docker) / SQLite (local)

## Variables de entorno (backend)
Ver `backend/.env.example`.

Convenciones clave:
- Provider: `FOOTBALL_DATA_PROVIDER=mock|real`
- API key real: `FOOTBALL_DATA_API_KEY`
- Modelo activo: `ACTIVE_MODEL_NAME`
- Challengers: `CHALLENGER_MODEL_NAMES`
- Guardrail inferencia: `ALLOW_AUTO_TRAIN_ON_PREDICT` (en producción recomendado `false`)
- Si se usa auto-train en inferencia (solo desarrollo), aplica el mismo gate de calibración antes de persistir el artefacto activo.

## Sync incremental real (sin pérdida intradía)
Estrategia aplicada:
1. se consulta `/fixtures` desde la **misma fecha calendario** del último `last_synced_at`
2. se descartan localmente fixtures con `played_at <= last_synced_at`
3. carga idempotente por `provider_id`

Esto evita omitir partidos dentro del mismo día tras el último sync.

## Entrenamiento y evaluación
```bash
cd backend
python -m scripts.seed_mock_data
python -m scripts.train_baseline_model
python -m scripts.evaluate_baseline_model
```

### Protocolos de evaluación temporal
- `strict_temporal_validation` (static holdout estricto)
- `walk_forward_holdout_evaluation`
- `run_temporal_backtest`

### Validación probabilística
- calibración post-hoc `temperature_v1` evaluada before/after
- métricas: Brier 1X2, Log-loss 1X2, ECE
- bins de confiabilidad
- activación de calibración por modelo solo si pasa gate conservador

## API
- `GET /health`
- `POST /ingest-historical-data`
- `POST /predict-match`

## Frontend
```bash
cd frontend
npm install
npm run dev
```

La vista de resultado muestra probabilidades y escenarios como **incertidumbre** (no certeza), además del estado de calibración.

## Tests
Backend:
```bash
cd backend
pytest -q
```

Frontend:
```bash
cd frontend
npm test -- --run
```

## Documentación técnica
- `docs/audit_current_state.md`
- `docs/model_upgrade_plan.md`
- `docs/model_comparison.md`
- `docs/model_evaluation.md`
- `docs/probabilistic_validation_plan.md`
- `docs/probabilistic_evaluation_report.md`
- `docs/pre_pr_final_check.md`
- `docs/provider_verification.md`

## Limitaciones abiertas
- Sin migraciones DB (Alembic)
- Validación probabilística sobre mock con muestra chica
- Provider real sin smoke online en CI
- Parser NL rule-based (no NER robusto)
