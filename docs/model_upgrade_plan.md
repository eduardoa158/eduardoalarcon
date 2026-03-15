# Model upgrade plan (v1 -> v1.5)

Fecha: 2026-03-15

## 1. Baseline actual real
- Modelo: `ridge_poisson_v1_1`.
- Entrenamiento: ridge separado para goles home/away.
- Inferencia: expected goals + matriz Poisson para 1X2 y scorelines.
- Artefacto: JSON por modelo, validado al cargar.

## 2. Features actuales (antes del upgrade)
- `v2`: bias, ataque/defensa agregados por equipo, volumen de partidos, tasa global de gol pre-match, home bias.

## 3. Debilidades detectadas
- Señal limitada de forma reciente.
- Sin separación explícita home/away reciente.
- Cold-start poco explícito.
- Sin challenger formal reproducible ni tabla comparativa.

## 4. Propuestas de mejora implementadas
1. **Feature set v3**:
   - rolling form últimos 5
   - métricas home/away recientes
   - diferencias de fuerza recientes
   - cold-start flags
2. **Champion/Challenger reproducible**:
   - champion: `ridge_poisson_v1_1`
   - challengers: `ridge_poisson_v1_5`, `ridge_poisson_v1_5_weighted`
3. **Evaluación más útil**:
   - static holdout
   - walk-forward holdout
   - walk-forward backtest
   - MAE, Brier y log-loss 1X2
4. **Activación explícita de modelo**:
   - `ACTIVE_MODEL_NAME` define el modelo activo
   - artefacto por modelo con validación estricta

## 5. Plan de implementación ejecutado
1. Versionado de features (`v2`, `v3`) y `feature_summary` trazable.
2. Catálogo de modelos (`MODEL_SPECS`) con champion/challenger.
3. Servicio de entrenamiento comparativo y registro de corridas con `is_active`.
4. Evaluación comparativa temporal reproducible.
5. Documentación y tests alineados.

## 6. Decisión final v1.5
- Champion activo: `ridge_poisson_v1_5`.
- Referencia preservada: `ridge_poisson_v1_1`.
- Challenger alternativo mantenido para pruebas: `ridge_poisson_v1_5_weighted`.
