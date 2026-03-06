# Shock Alpha (Node.js App para Hostinger)

Aplicación web educativa para analizar shocks externos y su impacto en BTC, Oro, WTI y acciones por ticker.

> **No es recomendación financiera. Solo educativo.**

## Stack
- Node.js + Express
- SQLite para cache/datos locales
- `yahoo-finance2` para precios históricos
- GDELT 2.1 para proxies de noticias/shocks
- `technicalindicators` para MA/Bollinger/ATR
- Frontend estático en `public/` con Chart.js (CDN)

## Estructura clave
- `server.js`
- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `src/` (data/news/models/indicators/strategy/db)
- `storage/` (cache/reportes/shocks)

## Requisitos
- Node.js 18+ (recomendado 20 en Hostinger)

## Ejecutar local
```bash
cp .env.example .env
npm install
npm start
```
Abrir: `http://localhost:3000`

## Endpoints
- `GET /api/health`
- `GET /api/market?symbol=BTC-USD&interval=1d&range=2y`
- `GET /api/news?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/shocks`
- `POST /api/shocks`
- `POST /api/train`
- `POST /api/signal`
- `POST /api/backtest`

## Hostinger Node.js App (paso a paso)
1. Sube este repo a GitHub.
2. En Hostinger hPanel crea una **Node.js App**.
3. Selecciona Node 20 (o 18+), rama y directorio del proyecto.
4. Define **Startup file**: `server.js`.
5. Ejecuta instalación: `npm install`.
6. Variables de entorno (hPanel):
   - `PORT` (Hostinger lo asigna o define uno)
   - `NODE_ENV=production`
   - `DB_PATH=./storage/shockalpha.db`
   - `TIMEZONE=America/Guayaquil`
7. Inicia app con `npm start`.

### Nota sobre estáticos en Hostinger
Express sirve frontend desde `public/` con:
```js
app.use(express.static(path.join(__dirname, 'public')))
```
Por tanto `public/index.html` y assets se publican automáticamente.

## Frecuencia automática
El backend compara 1h vs 1d (si 1h no disponible/suficiente, usa 1d). Esto se documenta y se aplica en `/api/train`.

## Disclaimer
Todas las señales/setups y proyecciones son educativas.
