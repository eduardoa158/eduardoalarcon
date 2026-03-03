PASOS HOSTINGER (public_html)

1) Comprime el contenido de esta carpeta `public_html/` en .zip.
2) En Hostinger > File Manager > `public_html`, elimina/respaldar archivos anteriores.
3) Sube el .zip y extrae directamente dentro de `public_html`.
4) Verifica que exista `public_html/index.html`.
5) Abre tu dominio y recarga con Ctrl+F5.

NOTAS:
- Esta versión es estática y no requiere backend para renderizar la interfaz.
- Los gráficos y paneles usan widgets públicos de TradingView.
- Si deseas integrar tu backend FastAPI, publícalo en subdominio (ej: api.tudominio.com)
  y agrega endpoints propios en `assets/js/app.js`.
