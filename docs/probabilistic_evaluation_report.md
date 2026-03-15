# Reporte de evaluación probabilística (v1.5 pre-PR)

Fecha: 2026-03-15
Fuente: ejecución local reproducible con dataset mock (`seed_mock_data`, `train_baseline_model`, `evaluate_baseline_model`).

## 1) Protocolo usado
- Modelo activo evaluado: `ridge_poisson_v1_5`.
- Calibración probada: `temperature_v1` (post-hoc).
- Fit del calibrador: predicciones out-of-sample walk-forward.
- Decisión de activación: gate conservador (no empeorar Brier + Log-loss en static holdout).

## 2) Métricas antes de calibración (static holdout)
- Brier 1X2: **0.5164**
- Log-loss 1X2: **2.3888**
- ECE 1X2: **0.8543**

## 3) Métricas después de calibración (static holdout)
- Brier 1X2: **0.2970**
- Log-loss 1X2: **1.3392**
- ECE 1X2: **0.5542**

## 4) Comparación antes vs después
- En este entorno de evaluación, la calibración mejora las tres métricas probabilísticas reportadas.
- Temperatura óptima encontrada: **3.0**.
- Muestras para fit de calibración: **3** (limitado).

## 5) Decisión final
- **Calibración activa = Sí**, porque cumple el gate de no empeorar Brier ni Log-loss en static holdout.
- La activación queda persistida en el artefacto del modelo y trazada en `model_training_runs`.

## 6) Resumen de confiabilidad
- Se agregan bins `[0.0,0.2]..[0.8,1.0]` con:
  - conteo,
  - confianza promedio,
  - accuracy promedio,
  para probabilidades raw y calibradas.
- Objetivo: inspección rápida de sobre/subconfianza por rangos.

## 7) Riesgos y limitaciones
- Muestra de validación pequeña en mock; no extrapolar magnitudes de mejora a producción real.
- La calibración se aplica solo sobre 1X2; no modifica xG ni top scorelines base.
- Falta todavía validación online/sombra con datos reales para claims de negocio.
