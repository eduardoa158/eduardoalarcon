(function () {
  const ROOT = window.SITE_ROOT || '/';
  const PAGE_KEY = window.PAGE_KEY || 'home';

  function getUTMs() {
    const params = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const out = {};
    keys.forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
    return out;
  }

  window.buildWhatsAppLink = function buildWhatsAppLink(interest, sourcePage) {
    const utms = getUTMs();
    const utmText = Object.keys(utms).length
      ? Object.entries(utms).map(([k, v]) => `- ${k}: ${v}`).join('\n')
      : '- Sin UTM detectadas';
    const extra = window.__whatsappExtra ? `\n\nResumen:\n${window.__whatsappExtra}` : '';

    const message = [
      'Hola, equipo de Digital Vision Latam.',
      `Me interesa: ${interest}.`,
      `Página origen: ${sourcePage}.`,
      '',
      'UTM detectadas:',
      utmText,
      extra,
      '',
      'Preguntas rápidas:',
      '1) ¿Cuál es su industria?',
      '2) ¿Cuál es su volumen aproximado de mensajes/leads al mes?'
    ].join('\n');

    return `https://wa.me/593959920299?text=${encodeURIComponent(message)}`;
  };

  function autoLinkWhatsAppButtons() {
    document.querySelectorAll('.js-wa').forEach((el) => {
      const interest = el.dataset.interest || 'Información general';
      const sourcePage = el.dataset.source || PAGE_KEY;
      el.setAttribute('href', window.buildWhatsAppLink(interest, sourcePage));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }

  async function loadJSON(file) {
    const res = await fetch(`${ROOT}data/${file}`);
    if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
    return res.json();
  }

  async function renderGlobalFooter() {
    const mount = document.querySelector('[data-global-footer]');
    if (!mount) return;

    const [site, partners, testimonials, faqs] = await Promise.all([
      loadJSON('site.json'),
      loadJSON('partners.json'),
      loadJSON('testimonials.json'),
      loadJSON('faqs.json')
    ]);

    const footerHtml = await fetch(`${ROOT}partials/footer.html`).then((r) => r.text());
    mount.innerHTML = footerHtml;

    const listTestimonials = mount.querySelector('[data-footer-testimonials]');
    const listPartners = mount.querySelector('[data-footer-partners]');
    const listFaqs = mount.querySelector('[data-footer-faqs]');
    const footerCopy = mount.querySelector('#footer-copy');

    if (footerCopy) {
      footerCopy.textContent = site.baseCopy || site.description || 'Converse con nosotros para evaluar su caso en minutos.';
    }

    if (listTestimonials) {
      listTestimonials.innerHTML = testimonials.slice(0, 6).map((item) => `
        <article class="card reveal">
          <small style="color:#ffdca9">Casos referenciales</small>
          <h4 style="margin:8px 0 4px">${item.name}</h4>
          <p style="margin:0 0 8px">${item.quote}</p>
          <small style="color:#cdd5eb">${item.role}</small>
        </article>
      `).join('');
    }

    if (listPartners) {
      listPartners.innerHTML = partners.map((item) => `
        <span class="badge" title="${item.description}">${item.name} · recomendado</span>
      `).join('');
    }

    const pageFaqs = faqs[PAGE_KEY] || (PAGE_KEY.startsWith('blog') ? faqs.blog : null) || faqs.home || [];
    if (listFaqs) {
      listFaqs.innerHTML = pageFaqs.map((item) => `
        <div class="faq-item">
          <button class="faq-question" type="button">${item.q}</button>
          <div class="faq-answer"><p>${item.a}</p></div>
        </div>
      `).join('');

      listFaqs.querySelectorAll('.faq-question').forEach((btn) => {
        btn.addEventListener('click', () => btn.closest('.faq-item').classList.toggle('open'));
      });
    }

    autoLinkWhatsAppButtons();
    setupScrollReveal();
  }

  function addFloatingButtons() {
    const waBtn = document.createElement('a');
    waBtn.className = 'whatsapp-float js-wa';
    waBtn.dataset.interest = 'Duda general';
    waBtn.dataset.source = PAGE_KEY;
    waBtn.setAttribute('aria-label', 'Hablar por WhatsApp');
    waBtn.textContent = '💬';

    const topBtn = document.createElement('button');
    topBtn.className = 'to-top';
    topBtn.type = 'button';
    topBtn.setAttribute('aria-label', 'Volver arriba');
    topBtn.textContent = '↑';
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    document.body.appendChild(waBtn);
    document.body.appendChild(topBtn);
    autoLinkWhatsAppButtons();
  }

  function setupScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach((el) => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await renderGlobalFooter();
    addFloatingButtons();
    autoLinkWhatsAppButtons();
    setupScrollReveal();
  });
})();
