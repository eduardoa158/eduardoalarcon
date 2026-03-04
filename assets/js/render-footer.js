(function () {
  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function loadJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${path}`);
    }
    return response.json();
  }

  function renderFaqItem(item, index) {
    const panelId = `faq-panel-${index}`;
    const triggerId = `faq-trigger-${index}`;
    return `<article class="faq-item">
      <button class="faq-trigger" type="button" id="${triggerId}" aria-expanded="false" aria-controls="${panelId}">${escapeHtml(item.q)}</button>
      <div class="faq-panel" id="${panelId}" role="region" aria-labelledby="${triggerId}"><p>${escapeHtml(item.a)}</p></div>
    </article>`;
  }

  function initFaq(root) {
    const triggers = Array.from(root.querySelectorAll(".faq-trigger"));
    if (!triggers.length) return;

    const toggle = (trigger) => {
      const panel = root.querySelector(`#${trigger.getAttribute("aria-controls")}`);
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.classList.toggle("open", !isOpen);
      panel.style.maxHeight = !isOpen ? `${panel.scrollHeight}px` : "0px";
    };

    triggers.forEach((trigger, i) => {
      trigger.addEventListener("click", () => toggle(trigger));
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle(trigger);
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          triggers[(i + 1) % triggers.length].focus();
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          triggers[(i - 1 + triggers.length) % triggers.length].focus();
        }
      });
    });
  }

  function renderFooterTemplate(site, testimonials, partners, faqs) {
    return `
      <div class="container footer-inner">
        <section>
          <h2>Casos referenciales</h2>
          <div class="footer-grid">
            ${testimonials
              .map(
                (item) => `<article class="card glass">
                  <h3>${escapeHtml(item.name)}</h3>
                  <p>${escapeHtml(item.industry)}</p>
                  <p>“${escapeHtml(item.quote)}”</p>
                  <p><strong>${escapeHtml(item.highlight)}</strong></p>
                </article>`
              )
              .join("")}
          </div>
        </section>

        <section>
          <h2>Aliados recomendados</h2>
          <p>Recomendados, no obligatorios. Si usted usa otros, nos adaptamos.</p>
          <div class="partner-row">
            ${partners
              .map(
                (item) => `<span class="badge" title="${escapeHtml(item.note || "")}">${escapeHtml(item.title)} · ${escapeHtml(item.subtitle)}</span>`
              )
              .join("")}
          </div>
        </section>

        <section id="faq">
          <h2>Preguntas frecuentes</h2>
          <div>${(faqs.home || []).map(renderFaqItem).join("")}</div>
        </section>

        <section class="closing-panel glass">
          <h2>¿Listo para ordenar su operación?</h2>
          <a href="#" class="btn btn-primary js-wa" data-interest="Footer / CTA final" data-source="home-footer-final">${escapeHtml(site.ctaPrimaryText || "Solicitar diagnóstico por WhatsApp")}</a>
        </section>
      </div>
    `;
  }

  async function renderFooter() {
    const footer = document.getElementById("global-footer");
    if (!footer) return;

    try {
      const [site, testimonials, partners, faqs] = await Promise.all([
        loadJson("/data/site.json"),
        loadJson("/data/testimonials.json"),
        loadJson("/data/partners.json"),
        loadJson("/data/faqs.json"),
      ]);

      footer.innerHTML = renderFooterTemplate(site, testimonials, partners, faqs);
    } catch (error) {
      console.warn("Footer dinámico: usando fallback estático.", error);
    }

    initFaq(footer);

    if (window.wireWhatsAppButtons) {
      window.wireWhatsAppButtons(footer);
    }
  }

  document.addEventListener("DOMContentLoaded", renderFooter);
})();
