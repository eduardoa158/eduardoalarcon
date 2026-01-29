const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const revealItems = document.querySelectorAll(".reveal");
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const buttons = document.querySelectorAll(".button");
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (prefersReducedMotion) return;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  });
});

const tiltCards = document.querySelectorAll(".tilt");
if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}

const heroBrain = document.querySelector("#heroBrain");
const heroMedia = heroBrain ? heroBrain.closest(".hero-media") : null;
const supportsHover = window.matchMedia("(hover: hover)").matches;

if (heroBrain && heroMedia && supportsHover && !prefersReducedMotion) {
  let rafId = null;

  const updateTilt = (event) => {
    const rect = heroMedia.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * 8).toFixed(2);
    const rotateY = (x * 8).toFixed(2);

    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      heroBrain.style.setProperty("--tilt-x", `${rotateX}deg`);
      heroBrain.style.setProperty("--tilt-y", `${rotateY}deg`);
      heroBrain.style.setProperty("--tilt-scale", "1.03");
    });
  };

  heroMedia.addEventListener("mousemove", updateTilt);
  heroMedia.addEventListener("mouseleave", () => {
    heroBrain.style.setProperty("--tilt-x", "0deg");
    heroBrain.style.setProperty("--tilt-y", "0deg");
    heroBrain.style.setProperty("--tilt-scale", "1");
  });
}

const testimonialSlides = document.querySelectorAll(".testimonial-slide");
let testimonialIndex = 0;

const showTestimonial = (index) => {
  testimonialSlides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === index);
  });
};

const nextTestimonial = () => {
  testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
  showTestimonial(testimonialIndex);
};

if (testimonialSlides.length) {
  showTestimonial(testimonialIndex);
  if (!prefersReducedMotion) {
    setInterval(nextTestimonial, 6000);
  }
}

const prevButton = document.querySelector("[data-testimonial-prev]");
const nextButton = document.querySelector("[data-testimonial-next]");

if (prevButton && nextButton) {
  prevButton.addEventListener("click", () => {
    testimonialIndex = (testimonialIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonial(testimonialIndex);
  });
  nextButton.addEventListener("click", nextTestimonial);
}

const whatsappForm = document.querySelector("[data-whatsapp-form]");
if (whatsappForm) {
  whatsappForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = whatsappForm.querySelector("[name='nombre']").value.trim();
    const subject = whatsappForm.querySelector("[name='asunto']").value.trim();
    const message = whatsappForm.querySelector("[name='mensaje']").value.trim();
    const email = whatsappForm.querySelector("[name='email']").value.trim();
    const fullMessage = `Hola, soy ${name}. Mi email es ${email}. Asunto: ${subject}. Mensaje: ${message}`;
    const url = `https://wa.me/593959920299?text=${encodeURIComponent(fullMessage)}`;
    window.open(url, "_blank");
  });
}
