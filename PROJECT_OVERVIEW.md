# Estado del proyecto y guía rápida

## ¿Qué es este proyecto?
Este repositorio contiene una **landing/ecommerce estática** para la marca **Healthy Leben** construida con **React + TypeScript + Vite + Tailwind**.

La aplicación muestra:
- Página principal con secciones de marketing (hero, beneficios, testimonios, CTA).
- Catálogo de productos tipo gummies (10 fórmulas).
- Página de detalle por producto (`/product/:slug`).
- Blog con listado y detalle por slug (`/blog` y `/blog/:slug`).
- Botones de contacto directo por WhatsApp en puntos clave del recorrido.

## Stack técnico
- React 19 + React Router 7 (en `HashRouter`).
- Vite 7 para desarrollo y build.
- TypeScript y ESLint.
- Tailwind CSS + componentes UI basados en Radix/shadcn.

## Comprobación local rápida
```bash
npm ci
npm run build
npm run lint
npm run dev -- --host 0.0.0.0 --port 4173
```

### Resultado de verificación (última ejecución)
- `npm run build`: ✅ compila correctamente y genera `dist/`.
- `npm run lint`: ⚠️ falla por reglas de `react-refresh/only-export-components` y una regla de pureza en `sidebar.tsx` (issues preexistentes).

## Estructura clave
- `src/App.tsx`: define las rutas principales.
- `src/pages/`: páginas Home, Product, Blog y BlogPost.
- `src/data/products.ts`: catálogo y metadatos de productos.
- `src/data/blog.ts`: entradas del blog.
- `src/sections/`: bloques visuales reutilizados en Home.
