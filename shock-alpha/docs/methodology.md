# Methodology

## Shock Index
Se combina conteo diario GDELT + intensidad RSS clasificada (escalation/de-escalation), luego se normaliza 0..100 y se activa `SHOCK_ON` sobre percentil rolling configurable.

## Features
- Técnicas: SMA/EMA, slope/distancia, Bollinger, ATR, realized vol, retornos lag.
- Fibonacci: pivotes confirmados por ventana, niveles 0.236/0.382/0.5/0.618/0.786 y eventos break/retest/rejection.

## Modelos
- ARIMAX (SARIMAX) para retorno esperado con exógenas.
- Proxy de volatilidad EWMA (sustituible por GARCH).
- Baseline ML con HistGradientBoosting para probabilidad direccional.

## Control de leakage
- Features calculadas con historia disponible a t.
- Señales ejecutadas en t+1.
- Objetivos desplazados por horizonte y tests de validación.
