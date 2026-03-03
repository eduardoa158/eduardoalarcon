# Shock Alpha Web App (Educativo)

Aplicación web educativa para análisis de mercados y shocks geopolíticos con gráficos tipo plataforma de trading y predicciones futuras.

> **Disclaimer:** este software es solo educativo y NO constituye asesoría financiera ni recomendación de inversión.

## Qué verás en la web
- Gráfico principal tipo TradingView (candles OHLC) con:
  - Media móvil 20 y 50.
  - Bandas de Bollinger.
  - Niveles de Fibonacci (retracements y extensiones).
  - Proyección futura sobre el precio esperado.
- Noticias/shocks desde GDELT (si falla, se muestra estado sin noticias y el resto sigue funcionando).
- Predicción futura (retorno esperado, probabilidad de subida y trayectoria estimada próximos días).

## Fuente de datos
- Principal: Yahoo Finance (`yfinance`) actualizado periódicamente.
- Fallback determinista si la fuente externa falla temporalmente.

## Requisitos
- Python 3.11+
- Docker + Docker Compose (opcional)

## Ejecutar en local (Docker)
```bash
cp .env.example .env
docker compose up --build
```
Abrir: `http://localhost:8000`

## Ejecutar en modo dev
```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
make dev
```
Abrir: `http://localhost:8000`

## Comandos adicionales
```bash
make run   # pipeline batch/reportes csv/json/png
make test
```

## Deploy Hostinger
- **VPS (recomendado):** correr Docker Compose o Uvicorn + reverse proxy.
- **Hosting estático:** publicar frontend estático y desplegar backend FastAPI aparte.

## Seguridad y datos
- No se guardan credenciales en repositorio.
- `.env.example` muestra variables opcionales.
- Cache de mercado en SQLite `storage/cache.db` para reducir rate limits.


## Entrega lista para Hostinger (public_html)
Se incluye carpeta lista para subir directamente:
- `hostinger/public_html/`

Contiene versión estática visual con widgets estilo TradingView, indicadores y módulo de proyección educativa.
Sigue `hostinger/public_html/README_UPLOAD.txt` para publicar en minutos.
