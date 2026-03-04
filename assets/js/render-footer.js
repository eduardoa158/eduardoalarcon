(function () {
  async function loadJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
    return res.json();
  }

  function testimonialCard(item) {
    return `<article class="card glass"><h3>${item.name}</h3><p>${item.industry}</p><p>“${item.quote}”</p><p><strong>${item.highlight}</strong></p></article>`;
  }

  function partnerBadge(item) {
    return `<span class="badge">${item.title} · ${item.subtitle}</span>`;
  }

  function faqItem(item, i) {
    const id = `faq-panel-${i}`;
    return `<div class="faq-item">
      <button class="faq-trigger" aria-expanded="false" aria-controls="${id}" id="faq-trigger-${i}" role="button">${item.q}</button>
      <div class="faq-panel" id="${id}" role="region" aria-labelledby="faq-trigger-${i}"><p>${item.a}</p></div>
    </div>`;
  }

  function initFaq() {
    const triggers = Array.from(document.querySelectorAll(".faq-trigger"));
    const toggle = (trigger) => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("open", !open);
      panel.style.maxHeight = !open ? `${panel.scrollHeight}px` : "0px";
    };

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => toggle(trigger));
      trigger.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          toggle(trigger);
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          triggers[(index + 1) % triggers.length].focus();
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          triggers[(index - 1 + triggers.length) % triggers.length].focus();
        }
      });
    });
  }

  async function renderFooter() {
    const container = document.getElementById("global-footer");
    if (!container) return;

    try {
      const [site, testimonials, partners, faqs] = await Promise.all([
        loadJson("data/site.json"),
        loadJson("data/testimonials.json"),
        loadJson("data/partners.json"),
        loadJson("data/faqs.json"),
      ]);

      container.innerHTML = `
      <footer class="footer-inner">
        <section>
          <h2>Casos referenciales</h2>
          <div class="footer-grid">${testimonials.map(testimonialCard).join("")}</div>
        </section>

        <section>
          <h2>Aliados recomendados</h2>
          <p>Recomendados, no obligatorios. Si usted usa otros, nos adaptamos.</p>
          <div class="partner-row">${partners.map(partnerBadge).join("")}</div>
        </section>

        <section id="faq">
          <h2>Preguntas frecuentes</h2>
          <div>${(faqs.home || []).map(faqItem).join("")}</div>
        </section>

        <section class="closing-panel glass">
          <h2>¿Listo para organizar su operación de forma más inteligente?</h2>
          <a href="#" class="btn btn-primary js-wa" data-interest="Footer / CTA final" data-source="home-footer-final">${site.ctaPrimaryText}</a>
        </section>
      </footer>`;

      initFaq();
      if (window.buildWhatsAppLink) {
        document.querySelectorAll("#global-footer .js-wa").forEach((el) => {
          el.href = window.buildWhatsAppLink(el.dataset.interest, el.dataset.source);
          el.target = "_blank";
          el.rel = "noopener noreferrer";
        });
      }
    } catch (error) {
      container.innerHTML = '<p class="container">No se pudo cargar el footer dinámico en este entorno. En Hostinger funcionará correctamente.</p>';
      console.warn(error);
    }
  }

  document.addEventListener("DOMContentLoaded", renderFooter);
})();
