const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const mobileToggle = document.querySelector('[data-mobile-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

if (isDesktop && !prefersReduced) {
  const hero = document.querySelector('[data-parallax]');
  const floating = document.querySelectorAll('[data-float]');

  if (hero) {
    hero.addEventListener('mousemove', (event) => {
      const { width, height, left, top } = hero.getBoundingClientRect();
      const x = (event.clientX - left) / width - 0.5;
      const y = (event.clientY - top) / height - 0.5;
      hero.style.transform = `translate3d(${x * 12}px, ${y * 12}px, 0)`;
    });
    hero.addEventListener('mouseleave', () => {
      hero.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  floating.forEach((icon) => {
    const speed = Number(icon.dataset.speed || 1);
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * speed * 0.02;
      icon.style.transform = `translateY(${offset}px)`;
    });
  });
}

const tiltCards = document.querySelectorAll('[data-tilt]');

if (isDesktop && !prefersReduced) {
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const { width, height, left, top } = card.getBoundingClientRect();
      const x = (event.clientX - left) / width - 0.5;
      const y = (event.clientY - top) / height - 0.5;
      card.style.transform = `rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0)';
    });
  });
}
