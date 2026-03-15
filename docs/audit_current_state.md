# Auditoría técnica del estado actual

Fecha: 2026-03-15

## 1. Parser
- Rule-based en español (`query_parser.py`).
- Cubre frases comunes y aliases; limitado por diccionario estático.

## 2. ETL
- Pipeline modular (`extract/transform/load/pipeline`).
- Incremental real sin pérdida intradía:
  - consulta fixtures desde la misma fecha calendario del último sync,
  - filtra localmente `played_at <= last_synced_at`,
  - deduplica por `provider_id` en carga.

## 3. Provider real
- API-Football: fixtures finalizados + estadísticas base por fixture.
- Manejo de 429/5xx con retry/backoff y paginación.
- `next_cursor` no representa cursor opaco real (estrategia basada en timestamp).

## 4. Modelado
- Champion/challenger trazable:
  - `ridge_poisson_v1_1`
  - `ridge_poisson_v1_5`
  - `ridge_poisson_v1_5_weighted`
- Feature versioning y validación estricta de artefacto en carga.

## 5. Evaluación
- Separación explícita:
  - static holdout estricto,
  - walk-forward holdout,
  - walk-forward backtest.
- Métricas: MAE home/away, Brier 1X2, Log-loss 1X2.
- Calibración probabilística post-hoc (`temperature_v1`) evaluada before/after + ECE + bins.

## 6. Inferencia y contrato
- Respuesta incluye:
  - `expected_goals.home/away`
  - `probabilities_1x2`
  - `top_scorelines`
  - `feature_summary`
  - `probability_metadata` (calibración aplicada / método)
- Copy de backend/frontend endurecida para evitar interpretación causal o determinista.

## 7. Frontend
- Renderiza campos principales + estado de calibración.
- Muestra errores de API de forma explícita.

## 8. Brechas abiertas
1. Sin migraciones Alembic.
2. Provider real sin smoke online en CI.
3. Validación probabilística en mock con n muy bajo.
4. Cobertura frontend aún acotada (sin e2e).

## 9. Estado general
- Estado: **v1.5 técnica endurecida, pre-PR**.
- Listo para revisión técnica seria con claims acotados y trazables.
