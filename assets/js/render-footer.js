async function renderGlobalFooter() {
  const rawPageKey = document.body.dataset.page || 'home';
  const pageMap = {
    precalificacion: 'precalificacion-evaluacion',
    visionassist: 'visionassist-7dias',
    post: 'blog'
  };
  const pageKey = pageMap[rawPageKey] || rawPageKey;
  const [testimonials, partners, faqs] = await Promise.all([
    fetch('/data/testimonials.json').then((r) => r.json()),
    fetch('/data/partners.json').then((r) => r.json()),
    fetch('/data/faqs.json').then((r) => r.json())
  ]);

  const testimonialsWrap = document.getElementById('testimonials-list');
  const partnersWrap = document.getElementById('partners-list');
  const partnersInline = document.querySelector('[data-partners-list]');
  const faqWrap = document.getElementById('faq-list');
  const footer = document.querySelector('footer .container');

  if (testimonialsWrap) {
    testimonialsWrap.classList.add('cards-grid');
    testimonialsWrap.innerHTML = testimonials
      .map((t) => `
        <article class="card glass reveal">
          <h3>${t.name}</h3>
          <small>${t.role}</small>
          <p>${t.text}</p>
        </article>
      `)
      .join('');
  }

  const partnerHTML = partners
      .map((p) => `<span class="badge" title="${p.description}">${p.name} · recomendado</span>`)
      .join(' ');
  if (partnersWrap) partnersWrap.innerHTML = partnerHTML;
  if (partnersInline) partnersInline.innerHTML = partnerHTML;

  if (faqWrap && !faqWrap.innerHTML.trim()) {
    const items = faqs[pageKey] || faqs.home || [];
    faqWrap.classList.add('accordion');
    faqWrap.innerHTML = items
      .map(([q, a]) => `
        <article class="faq-item">
          <button class="faq-q" aria-expanded="false">${q}</button>
          <div class="faq-a">${a}</div>
        </article>
      `)
      .join('');

    faqWrap.querySelectorAll('.faq-q').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        item.classList.toggle('open');
        button.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      });
    });
  }

  if (footer && !footer.querySelector('.footer-final-cta')) {
    const cta = document.createElement('p');
    cta.className = 'footer-final-cta';
    cta.innerHTML = `<a class="btn cta-primary js-wa" data-interest="Footer / ${pageKey}" data-source="footer-${pageKey}" href="#">Solicitar diagnóstico por WhatsApp</a>`;
    footer.appendChild(cta);
  }
}

document.addEventListener('DOMContentLoaded', renderGlobalFooter);
