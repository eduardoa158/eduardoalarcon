# Plan de validación probabilística (v1.5 pre-PR)

Fecha: 2026-03-15

## 1) Estado actual de probabilidades
- El predictor genera `probabilities_1x2` agregando una matriz Poisson de scorelines (xG home/away -> prob de marcador -> prob de resultado 1X2).
- Antes de esta iteración no había calibración post-hoc explícita; las probabilidades eran las crudas del modelo base.
- La evaluación temporal ya medía `Brier 1X2` y `Log-loss 1X2`, pero faltaba contraste sistemático antes/después de calibración y resumen de calibración (ECE / bins).

## 2) Riesgos actuales
- Riesgo de sobreconfianza en 1X2 al derivar probabilidades directamente de una parametrización baseline.
- Riesgo de claims engañosos si frontend/documentación presentan scorelines o probabilidades como certezas.
- Riesgo metodológico en muestras pequeñas (mock) para tomar decisiones de calibración demasiado optimistas.

## 3) Opciones de calibración evaluables
- **Temperature scaling** multicategoría sobre 1X2 (ligera, reproducible, post-hoc, desacoplada).
- Platt por clase (más compleja para 3 clases y con más supuestos).
- Isotonic (más flexible, mayor riesgo de sobreajuste en poco dato).

## 4) Plan elegido
Se implementa **temperature scaling v1**:
1. Generar predicciones out-of-sample walk-forward para fitting del calibrador.
2. Ajustar temperatura por grid-search determinista (`0.50..3.00`, paso `0.05`) minimizando log-loss.
3. Evaluar en **static holdout** antes vs después con:
   - Brier 1X2
   - Log-loss 1X2
   - ECE (confidence-based)
   - bins de confiabilidad.
4. Guardar metadatos de calibración en artefacto y training run.
5. Aplicar regla de activación conservadora por modelo.

## 5) Criterios de aceptación/rechazo
- **Activar calibración** solo si en static holdout no empeora simultáneamente:
  - `log_loss_1x2`
  - `brier_1x2`
- Si no cumple, la calibración queda documentada pero no activa.
- Siempre exponer metadata (`calibration_applied`, `calibration_method`) en la respuesta de inferencia.

## 6) Notas de honestidad metodológica
- En dataset mock pequeño, resultados de calibración son útiles para hardening de pipeline, no para claims fuertes de performance externa.
- Top scorelines deben interpretarse como escenarios probables, no como predicciones deterministas.
