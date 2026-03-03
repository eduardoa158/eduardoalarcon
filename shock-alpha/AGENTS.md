# AGENTS.md — estándares de trabajo

## Estilo y calidad
- Python 3.11+, type hints obligatorios en funciones públicas.
- Logging estructurado por módulo (`logging.getLogger(__name__)`).
- Formato: `black`.
- Lint: `ruff`.
- Tipado estático: `mypy` (tolerante en módulos con librerías opcionales).

## Reproducibilidad
- Configuración centralizada en `config/*.yaml`.
- Fuentes externas con fallback offline/sintético cuando no haya conectividad/API key.
- Caché local en parquet bajo `outputs/cache/`.

## Tests
- Framework: `pytest`.
- Cobertura mínima esperada en módulos core: features, leakage, shock index, backtest.
- Todo bug corregido debe incluir o ajustar test.

## Definición de “done”
1. `make setup`
2. `make test`
3. `python -m shockalpha.run --start 2016-01-01 --end today --mode daily`
4. Genera artefactos en `reports/` y `outputs/`.

## Comandos recomendados
- `make setup`
- `make fmt`
- `make lint`
- `make test`
- `python -m shockalpha.run --start 2016-01-01 --end today --mode daily`
