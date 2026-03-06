# Plan de implementación (Shock Alpha)

## Objetivo
Construir un sistema cuantitativo reproducible y testeado para BTC, Oro, WTI y basket accionario sensible a shocks geopolíticos, con control estricto de leakage y backtesting walk-forward.

## Milestones

### M1 — Scaffolding, datos OHLCV, cache, alineación, CLI básico
**Entregables**
- Estructura de repo completa.
- Configs YAML base.
- Fetch de OHLCV (yfinance + fallback sintético) con cache parquet.
- Alineación temporal multi-activo.
- CLI y `python -m shockalpha.run` funcional.
- Tests mínimos de wiring.

**Criterios de aceptación**
- `make setup`, `make test` ejecutan.
- Se construye un dataset de mercado alineado por fecha.

**Riesgos técnicos**
- Dependencia de red/fuente externa (mitigado con fallback y cache).

### M2 — Shock engine (GDELT/RSS), shock index y tabla de eventos
**Entregables**
- Ingesta GDELT (si disponible) + RSS fallback.
- Índice de shock 0..100 + señal SHOCK_ON.
- Persistencia de shock y `outputs/events_table.csv`.

**Criterios de aceptación**
- Test de shock index y de clasificación RSS.

**Riesgos**
- Bloqueo de endpoints/remotos (mitigado con fallback determinista).

### M3 — Features técnicos + Fibonacci + leakage checks
**Entregables**
- MAs, Bollinger, ATR, volatilidad, lags.
- Fibonacci sin fuga (pivote confirmado con ventana pasada).
- Eventos break/retest/rejection.
- Chequeos automáticos de leakage.

**Criterios de aceptación**
- `test_fibonacci.py` y `test_leakage.py` verdes.

**Riesgos**
- Implementación de pivotes robusta y sin lookahead.

### M4 — Modelos (ARIMAX + GARCH + alternativas)
**Entregables**
- Modelo base ARIMAX con exógenas.
- Forecast de volatilidad tipo GARCH (fallback EWMA si falta paquete).
- Baseline ML y régimen simple.
- Selección por métrica OOS.

**Criterios de aceptación**
- Pipeline de predicción 1D/5D/10D por activo.

**Riesgos**
- Convergencia/estabilidad en muestras pequeñas.

### M5 — Señales, gestión de riesgo, backtest walk-forward
**Entregables**
- Motor de señales NORMAL/SHOCK_ON.
- Stops/TP combinados ATR + Fibonacci.
- Position sizing y kill-switch por max drawdown.
- Backtest walk-forward con costos y métricas.

**Criterios de aceptación**
- `test_backtest.py` verde.
- `outputs/backtest_summary.json` generado.

**Riesgos**
- Alineación exacta señal en t ejecutada en t+1.

### M6 — Reporting + documentación final
**Entregables**
- `reports/latest.md`, `outputs/signals_latest.csv`, figuras PNG.
- README y docs (metodología, fuentes, disclaimer).

**Criterios de aceptación (DONE)**
- Comandos objetivo ejecutables.
- Tests pasando.

## Definición de done
- Código con type hints + logging.
- Sin data leakage en features/señales.
- Backtesting walk-forward reproducible.
- Reporte y artefactos finales generados.
