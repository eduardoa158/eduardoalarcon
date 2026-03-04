document.documentElement.classList.add('js');
async function loadSiteData() {
  try {
    const response = await fetch('/data/site.json');
    return await response.json();
  } catch {
    return {
      brandName: 'Digital Vision Latam',
      whatsappNumber: '593959920299'
    };
  }
}

function parseUTMs() {
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utms = {};
  keys.forEach((k) => { utms[k] = params.get(k) || 'N/A'; });
  return utms;
}

function formatUTMLine(utms) {
  return `source=${utms.utm_source}, medium=${utms.utm_medium}, campaign=${utms.utm_campaign}, content=${utms.utm_content}, term=${utms.utm_term}`;
}

window.buildWhatsAppLink = async function buildWhatsAppLink(interest, sourcePage) {
  const site = await loadSiteData();
  const utms = parseUTMs();
  const message = [
    'Hola, vengo desde la web de Digital Vision Latam.',
    `Interés: ${interest}`,
    `Página: ${sourcePage}`,
    `UTM: ${formatUTMLine(utms)}`,
    'Industria: [Escriba su industria]',
    'Volumen aprox: [Mensajes/leads al mes]',
    '¿Me ayudan con el diagnóstico?'
  ].join('\n');

  return `https://wa.me/${site.whatsappNumber || site.whatsapp || '593959920299'}?text=${encodeURIComponent(message)}`;
};

async function bindWhatsAppButtons() {
  const links = document.querySelectorAll('.js-wa');
  for (const link of links) {
    const interest = link.dataset.interest || 'General';
    const sourcePage = link.dataset.source || window.location.pathname;
    const href = await window.buildWhatsAppLink(interest, sourcePage);
    link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  }
}

function setupMobileStickyCTA() {
  const bar = document.querySelector('.mobile-cta-bar');
  if (!bar) return;

  const toggle = () => {
    if (window.scrollY > 200) {
      bar.classList.add('is-visible');
    } else {
      bar.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

function setupRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

function applyWrapFixForLongText() {
  const candidates = document.querySelectorAll('h1, h2, h3, p, li, .btn');
  candidates.forEach((el) => {
    const content = (el.textContent || '').trim();
    if (content.length > 110) el.classList.add('wrap-safe');
  });
}

window.bindWhatsAppButtons = bindWhatsAppButtons;

document.addEventListener('DOMContentLoaded', () => {
  bindWhatsAppButtons();
  setupMobileStickyCTA();
  setupRevealOnScroll();
  applyWrapFixForLongText();
});
