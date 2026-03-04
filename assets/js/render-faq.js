window.renderFaqSection = async function renderFaqSection() {
  const rawPageKey = document.body.dataset.page || 'home';
  const pageMap = {
    precalificacion: 'precalificacion-evaluacion',
    visionassist: 'visionassist-7dias',
    post: 'blog'
  };
  const pageKey = pageMap[rawPageKey] || rawPageKey;
  const container = document.getElementById('faq-list');
  if (!container) return;

  const allFaqs = await fetch('/data/faqs.json').then((r) => r.json());
  const items = allFaqs[pageKey] || allFaqs.home || [];

  container.classList.add('accordion');
  container.innerHTML = items
    .map(([q, a]) => `
      <article class="faq-item">
        <button class="faq-q" aria-expanded="false">${q}</button>
        <div class="faq-a">${a}</div>
      </article>
    `)
    .join('');

  container.querySelectorAll('.faq-q').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      item.classList.toggle('open');
      button.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  window.renderFaqSection();
});
