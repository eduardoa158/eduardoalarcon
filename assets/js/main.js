(function () {
  const WHATSAPP_NUMBER = "593959920299";

  function readUtms() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      content: params.get("utm_content") || "",
      term: params.get("utm_term") || "",
    };
  }

  function buildWhatsAppLink(interest, sourcePage) {
    const utm = readUtms();
    const message = [
      "Hola, vengo desde la web de Digital Vision Latam.",
      `Interés: ${interest || "General"}`,
      `Página: ${sourcePage || "home"}`,
      `UTM: source=${utm.source} medium=${utm.medium} campaign=${utm.campaign} content=${utm.content} term=${utm.term}`,
      "Industria: [ESCRIBA AQUÍ]",
      "Volumen aprox (mensajes/leads al mes): [ESCRIBA AQUÍ]",
      "¿Me ayudan con el diagnóstico?",
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function wireWhatsAppButtons(scope) {
    const root = scope || document;
    root.querySelectorAll(".js-wa").forEach((el) => {
      const interest = el.dataset.interest || "General";
      const source = el.dataset.source || "home";
      el.href = buildWhatsAppLink(interest, source);
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  function setupMobileCta() {
    const bar = document.querySelector(".mobile-cta");
    if (!bar) return;
    const media = window.matchMedia("(max-width: 900px)");

    const sync = () => {
      bar.style.display = media.matches ? "block" : "none";
    };

    sync();
    if (media.addEventListener) {
      media.addEventListener("change", sync);
    } else {
      media.addListener(sync);
    }
  }

  function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".main-nav");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const willOpen = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  window.buildWhatsAppLink = buildWhatsAppLink;
  window.wireWhatsAppButtons = wireWhatsAppButtons;

  document.documentElement.classList.add("js-enabled");

  document.addEventListener("DOMContentLoaded", () => {
    wireWhatsAppButtons(document);
    initReveal();
    setupMobileCta();
    setupMobileMenu();
  });
})();
