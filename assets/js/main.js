const body = document.body;
const menuToggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
    mobileMenu.style.display = mobileMenu.classList.contains('is-open') ? 'flex' : 'none';
  });
}

const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const tiltCards = document.querySelectorAll('[data-tilt]');
if (tiltCards.length) {
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

const parallaxItems = document.querySelectorAll('[data-parallax]');
if (parallaxItems.length && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax) || 0.2;
      item.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

const floatingIcons = document.querySelectorAll('.floating-icon');
if (floatingIcons.length && window.innerWidth < 768) {
  floatingIcons.forEach((icon) => {
    icon.style.display = 'none';
  });
}

const heroScene = document.querySelector('.hero-3d');
if (heroScene && window.innerWidth < 768) {
  heroScene.style.display = 'none';
}
