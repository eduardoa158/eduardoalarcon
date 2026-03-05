# Digital Vision Latam · Base estática para Hostinger

Proyecto 100% estático (HTML/CSS/JS sin frameworks ni build), listo para subir directamente a `public_html`.

## Despliegue en Hostinger (public_html)
1. Comprime o selecciona **todos** los archivos y carpetas del proyecto.
2. En Hostinger, abre **Administrador de archivos**.
3. Entra a `public_html`.
4. Sube el contenido y confirma que `index.html` quede en la raíz de `public_html`.
5. Verifica carga de rutas clave:
   - `/`
   - `/nosotros/`
   - `/servicios/`
   - `/precios/`
   - `/automatizaciones/`
   - `/finanzas/`
   - `/landing/visionassist-7-dias/`

## Añadir páginas nuevas sin romper rutas
1. Duplica `templates/page-template.html`.
2. Renombra el archivo como `index.html` dentro de una carpeta nueva, por ejemplo `/nueva-pagina/index.html`.
3. Copia/pega bloques marcados para mantenimiento:
   - `<!-- START HEADER --> ... <!-- END HEADER -->`
   - `<!-- START FOOTER --> ... <!-- END FOOTER -->`
4. Mantén assets con rutas absolutas (`/assets/...`) para que funcionen en cualquier subcarpeta.
5. Añade la nueva URL en `sitemap.xml`.

## Personalizar colores/tokens
Edita `assets/css/tokens.css`:
- Paleta principal: `--primary-1`, `--primary-2`
- Fondo y texto: `--bg`, `--text`, `--text-muted`
- Radios/sombras/espaciado: variables `--radius-*`, `--shadow-*`, `--space-*`
- Tipografía fluida: `--fs-*` con `clamp()`

## WhatsApp global
- Número configurado: `+593959920299`
- Usa `.js-wa` + `data-interest` + `data-source` en cualquier botón/enlace.
- `assets/js/wa.js` arma el mensaje y agrega UTMs automáticamente.
