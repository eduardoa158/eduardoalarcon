# Digital Vision Website (Next.js 14)

Sitio multi-página orientado a CRO/SEO para captación de leads hacia **Agendar Demo Estratégica**, WhatsApp y email.

## Instalación

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: entorno local
- `npm run build`: build de producción
- `npm run start`: servir build
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

## Deploy en Vercel

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
