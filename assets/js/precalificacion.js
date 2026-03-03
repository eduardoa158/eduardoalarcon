document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#precalificacion-form');
  const result = document.querySelector('#resumen');
  if (!form || !result) return;

  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = params.get(key) || '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [];
    data.forEach((value, key) => {
      if (String(value).trim()) lines.push(`${key}: ${value}`);
    });

    window.__whatsappExtra = lines.join('\n');

    result.innerHTML = `
      <h3 style="margin-top:0">Resumen generado</h3>
      <pre style="white-space:pre-wrap">${lines.join('\n')}</pre>
      <a class="btn js-wa" data-interest="Precalificación / Evaluación" data-source="precalificacion-evaluacion">Enviar resumen a WhatsApp</a>
    `;

    const button = result.querySelector('.js-wa');
    if (button && window.buildWhatsAppLink) {
      button.href = window.buildWhatsAppLink('Precalificación / Evaluación', 'precalificacion-evaluacion');
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
    }
  });
});
