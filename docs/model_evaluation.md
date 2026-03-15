# Model Evaluation Report (v1.5)

Fecha: 2026-03-15

## Modelos evaluados
- `ridge_poisson_v1_1` (referencia)
- `ridge_poisson_v1_5` (activo)
- `ridge_poisson_v1_5_weighted` (challenger)

## Protocolos temporales (separados explícitamente)
1. **Strict static temporal holdout**
   - train fijo con histórico anterior
   - test final completo sin actualizar historia con observaciones del test
2. **Walk-forward holdout evaluation**
   - mismo corte final
   - scoring secuencial permitiendo actualización con observaciones previas del holdout
3. **Walk-forward backtest**
   - múltiples splits temporales
   - entrenamiento acumulativo + ventana de test por split

## Métricas reportadas
- MAE home goals
- MAE away goals
- Brier score 1X2
- Log-loss 1X2

## Validación probabilística adicional
Además de las métricas anteriores:
- calibración post-hoc `temperature_v1` evaluada por modelo
- comparación `before` vs `after` en static holdout
- ECE (confidence-based)
- bins de confiabilidad para inspección rápida de sobre/subconfianza

## Ejecución reproducible
```bash
cd backend
python -m scripts.seed_mock_data
python -m scripts.train_baseline_model
python -m scripts.evaluate_baseline_model
```

## Interpretación correcta
- `static holdout` es la referencia principal para decisiones de activación de calibración.
- `walk-forward` y `backtest` se usan como robustez operativa, no reemplazan el holdout estático.
- El modelo activo sigue siendo explícito por `ACTIVE_MODEL_NAME`; la calibración se activa por modelo solo si pasa el gate conservador.

## Limitaciones actuales
- Evaluación local en dataset mock pequeño (muestras limitadas para calibración).
- Sin benchmark externo online en CI con provider real.
