# Verificación del provider real (API-Football / API-Sports)

## Endpoint(s) consumidos actualmente
`backend/app/providers/real_provider.py`:
- `GET /fixtures` con `league`, `season`, `status=FT-AET-PEN`, `page`, y `from` en incremental.
- `GET /fixtures/statistics` con `fixture=<id>`.

## Campos mapeados realmente
### Match
- `fixture.id` -> `provider_id` (`api_football_fixture_<id>`)
- `league.id` -> `competition_provider_id`
- `teams.home.id` / `teams.away.id`
- `goals.home` / `goals.away`
- `fixture.date`
- `is_finished=True` solo para estados finales (`FT-AET-PEN`)

### Competition
- `league.name`
- `league.country`

### Team
- `teams.home.name`
- `teams.away.name`

### Match statistics (cobertura actual)
- Ball Possession -> `possession_pct`
- Total Shots -> `shots_total`
- Shots on Goal -> `shots_on_target`
- Corner Kicks -> `corners`
- Fouls -> `fouls`

## Paginación
- Implementada leyendo `paging.current` / `paging.total`.
- Bucle por páginas hasta `current >= total`.

## Incremental sync
- Usa `DataSyncState.last_synced_at`.
- En `/fixtures`, si existe `since`, envía `from=<since + 1 day>`.
- Persistencia de estado en `data_sync_states` (`last_synced_at`, `last_success_at`, `last_error`, `last_cursor`).

## Manejo de rate limits y errores
- HTTP 429: respeta `Retry-After` con tope `FOOTBALL_DATA_MAX_BACKOFF_SECONDS`.
- HTTP 5xx: retry con backoff exponencial acotado.
- `httpx.HTTPError`: retry hasta `FOOTBALL_DATA_MAX_RETRIES`, luego `RuntimeError`.
- Validación temprana:
  - `FOOTBALL_DATA_API_KEY`
  - `FOOTBALL_DATA_LEAGUE_IDS`
  - `FOOTBALL_DATA_SEASONS`

## Qué está testeado y cómo
### Tests con dobles/mocks (sin red real)
- `backend/tests/providers/test_real_provider.py`
  - Monkeypatch de `_request` para validar mapping y validaciones.
- `backend/tests/etl/test_real_sync_integration.py`
  - Monkeypatch de `_request` para validar ETL + incremental con estado persistido.

### Tests realmente online contra API externa
- No hay tests online en CI (por diseño, para evitar dependencia de red/credenciales y costo de cuota).

## Cobertura real y límites actuales
- Sí cubre: competiciones, equipos, partidos finalizados y stats base disponibles.
- No cubre todavía: eventos avanzados (alineaciones, xG oficial, tarjetas detalladas por jugador, etc.).
- `next_cursor` existe en contrato pero API-Football se resuelve hoy por fecha/paginación, no cursor opaco real.
