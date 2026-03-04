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

  function wireWhatsAppButtons() {
    document.querySelectorAll(".js-wa").forEach((el) => {
      const interest = el.dataset.interest || "General";
      const source = el.dataset.source || "home";
      el.setAttribute("href", buildWhatsAppLink(interest, source));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  }

  function mobileCtaBehavior() {
    const mobileCta = document.querySelector(".mobile-cta");
    if (!mobileCta) return;
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => {
      mobileCta.style.display = mq.matches ? "block" : "none";
    };
    sync();
    mq.addEventListener("change", sync);
  }

  window.buildWhatsAppLink = buildWhatsAppLink;

  document.addEventListener("DOMContentLoaded", function () {
    wireWhatsAppButtons();
    initReveal();
    mobileCtaBehavior();
  });
})();
