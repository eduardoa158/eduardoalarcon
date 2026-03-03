# Digital Vision Website (Next.js 14)

Sitio multi-página orientado a CRO/SEO para captación de leads hacia **Agendar Demo Estratégica**, WhatsApp y email.

## Instalación local

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: entorno local
- `npm run build`: build de producción
- `npm run export`: genera versión estática para hosting tradicional (carpeta `out/`)
- `npm run start`: servir build (modo servidor Node)
- `npm run lint`: linting con Next.js

## Estructura

- `app/`: rutas y páginas (App Router)
- `components/`: componentes reutilizables UI/SEO/layout
- `lib/site-data.ts`: datos editables (testimonios, contactos, combos)

## Dónde editar el copy

- Home: `app/page.tsx`
- Servicios: `app/servicios/page.tsx`
- Precios: `app/precios/page.tsx`
- Consultoría: `app/consultoria/page.tsx`
- Herramientas IA: `app/herramientas-ia/page.tsx`
- Nosotros: `app/nosotros/page.tsx`
- Contacto: `app/contacto/page.tsx`
- Landing de prueba gratis: `app/prueba-gratis/page.tsx`

## SEO implementado

- Metadata por página
- OpenGraph/Twitter global
- JSON-LD (`Organization`, `Service`, `FAQPage`)
- `sitemap.xml` y `robots.txt` vía App Router

---

## Despliegue en Hostinger (public_html) ✅

Este proyecto quedó configurado para **exportación estática** (`output: 'export'`), ideal para subir archivos a `public_html` en Hostinger.

### 1) Generar archivos finales

En su computadora (donde tenga Node.js):

```bash
npm install
npm run export
```

Al terminar, se crea una carpeta llamada `out/`.

### 2) Subir a `public_html`

1. Abra Hostinger → Administrador de archivos.
2. Entre a la carpeta `public_html`.
3. **Elimine archivos anteriores** (si existieran), excepto lo que usted desee conservar.
4. Suba **todo el contenido interno** de `out/` (no solo la carpeta, sino sus archivos y subcarpetas) dentro de `public_html`.

Debe quedar algo así:

- `public_html/index.html`
- `public_html/servicios/index.html`
- `public_html/precios/index.html`
- `public_html/contacto/index.html`
- etc.

### 3) Validar

- Abra su dominio principal (debe cargar Home).
- Pruebe rutas internas:
  - `/servicios/`
  - `/precios/`
  - `/consultoria/`
  - `/herramientas-ia/`
  - `/nosotros/`
  - `/contacto/`
  - `/prueba-gratis/`

> Nota: el proyecto usa `trailingSlash: true` para que cada página se exporte como carpeta con `index.html`, lo cual es compatible con hosting compartido tipo Hostinger.

### 4) Si el sitio no abre

- Revise que `index.html` esté directamente dentro de `public_html`.
- Revise que no se haya subido `out` como subcarpeta (`public_html/out/index.html` sería incorrecto).
- Limpie caché del navegador o abra en incógnito.

---

## Deploy alternativo en Vercel

1. Suba el repositorio a GitHub.
2. Importe el proyecto en Vercel.
3. Configure dominio final (reemplazar `https://digitalvision.lat` en metadata/sitemap).
4. Deploy automático en cada push.

## Placeholders pendientes (recomendado completar antes de producción)

1. Logo oficial y favicon de marca.
2. Paleta final (colores hex oficiales) y tipografía corporativa.
3. Copy exacto de la landing `/prueba-gratis`.
4. URLs reales de Whop para cada combo.
5. Testimonios con nombre/empresa autorizados para publicar.
6. Integración real del formulario de contacto (API/CRM/email).
7. Código de analytics (GA4, Meta Pixel, LinkedIn Insight).
8. URL canónica final y assets OpenGraph definitivos.
