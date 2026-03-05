# Digital Vision Latam - Landing estática para Hostinger

## Subida a Hostinger
1. Ingrese al **Administrador de archivos** de Hostinger.
2. Abra la carpeta `public_html` del dominio.
3. Copie **todo el contenido de este proyecto** dentro de `public_html`:
   - `index.html`
   - `assets/`
   - `data/`
4. Verifique que `index.html` quede en la raíz de `public_html`.

## Cómo cambiar textos fácilmente
Puede editar contenido sin tocar estructura en estos archivos:
- `data/site.json`: marca, CTA principal, nombre del producto.
- `data/testimonials.json`: testimonios del footer.
- `data/partners.json`: aliados recomendados.
- `data/faqs.json`: preguntas frecuentes (clave `home`).

## Pruebas en local vs Hostinger
- Si abre el archivo directo con `file://`, algunos navegadores bloquean `fetch` por seguridad y el footer dinámico puede no cargar.
- Para probar localmente, use una extensión tipo **Live Server** (VS Code) o cualquier servidor estático.
- En Hostinger, al servir por HTTP/HTTPS, el footer dinámico funciona normalmente.
