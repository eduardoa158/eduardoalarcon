# Pre-PR final check (v1.5)

Fecha: 2026-03-15

## 1) Qué queda listo para PR
- Pipeline champion/challenger reproducible con modelo activo explícito.
- Evaluación temporal separada (static holdout, walk-forward holdout, backtest).
- Hardening de artefacto + validación estricta de compatibilidad.
- Calibración probabilística post-hoc evaluada y trazada.
- API/frontend con metadata de calibración y copy más honesto.

## 2) Limitaciones abiertas
- Dataset mock pequeño para validación probabilística fuerte.
- Sin smoke CI contra provider real online.
- Sin migraciones DB (Alembic).
- Parser NL sigue rule-based (no NER robusto).

## 3) Claims que sí pueden hacerse
- Sistema end-to-end funcional para demo técnica reproducible.
- Métricas temporales y probabilísticas disponibles de forma explícita.
- Inferencia usa artefacto validado del modelo activo.
- Top scorelines/feature summary se presentan como señales probabilísticas, no certezas.

## 4) Claims que NO deben hacerse
- No claim de precisión de producción en ligas reales sin validación externa.
- No claim de causalidad en `feature_summary`.
- No claim de robustez operativa global sin cobertura CI online real provider.

## 5) Checklist manual antes de merge
- [ ] `pytest -q` backend verde.
- [ ] `npm test -- --run` frontend verde.
- [ ] `python -m scripts.seed_mock_data` ejecutado.
- [ ] `python -m scripts.train_baseline_model` ejecutado.
- [ ] `python -m scripts.evaluate_baseline_model` ejecutado.
- [ ] `ACTIVE_MODEL_NAME` y artefacto activo alineados.
- [ ] docs (`README`, `model_evaluation`, `model_comparison`, probabilistic docs) actualizadas.
- [ ] revisar que respuestas UI no usen lenguaje determinista.
