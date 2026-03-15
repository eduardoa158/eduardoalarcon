# Pre-PR Checklist técnico

## Qué funciona hoy
- Provider real configurable por env (`mock|real`) y validación temprana de credenciales.
- ETL extract/transform/load con sync incremental y trazabilidad en `data_sync_states`.
- Persistencia normalizada de competiciones, equipos, partidos y estadísticas base.
- Entrenamiento baseline reproducible y persistencia de artefacto.
- Registro de corridas de entrenamiento en `model_training_runs`.
- Evaluación temporal estricta + backtesting walk-forward.
- API `/predict-match` conectada a parser + modelo + persistencia de predicciones.
- Frontend renderiza xG, 1X2, top scorelines y feature summary.

## Endurecimientos aplicados
- Convención única de provider: `FOOTBALL_DATA_PROVIDER`.
- Convención única de key: `FOOTBALL_DATA_API_KEY`.
- Bloqueo de auto-train en inferencia para producción (`APP_ENV=production`) o flag explícita.
- Error explícito en API cuando falta artefacto en modo endurecido.

## Qué sigue siendo baseline (no “modelo final”)
- Predictor ridge + Poisson sin calibración avanzada.
- Features pre-match simples (agregados de goles/partidos).
- Parser rule-based con diccionario fijo.

## Limitaciones abiertas
- Sin migraciones formales (Alembic).
- Tests del provider real son con monkeypatch, no smoke online.
- No hay scheduler/orquestador de sync automático.
- No hay observabilidad avanzada (SLO, tracing distribuido, alerting).

## Revisiones manuales antes de merge
1. Validar `.env` objetivo (staging/prod):
   - `FOOTBALL_DATA_PROVIDER=real`
   - `FOOTBALL_DATA_API_KEY` cargada
   - `APP_ENV=production`
   - `ALLOW_AUTO_TRAIN_ON_PREDICT=false`
2. Ejecutar sync inicial e incremental con credenciales reales.
3. Entrenar modelo y verificar artefacto en ruta esperada.
4. Comprobar `/predict-match` con artefacto presente y ausente.
5. Verificar en frontend rendering de scorelines + feature summary + errores.
