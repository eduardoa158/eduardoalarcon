document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

  const heroScene = document.querySelector(".hero-3d");
  if (heroScene && window.innerWidth > 960) {
    heroScene.addEventListener("mousemove", (event) => {
      const { offsetX, offsetY } = event;
      const xMove = (offsetX / heroScene.offsetWidth - 0.5) * 12;
      const yMove = (offsetY / heroScene.offsetHeight - 0.5) * 12;
      heroScene.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });

    heroScene.addEventListener("mouseleave", () => {
      heroScene.style.transform = "translate(0, 0)";
    });
  }

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 960) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      card.style.transform = `rotateX(${(-y / 40).toFixed(2)}deg) rotateY(${(x / 40).toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });
});
