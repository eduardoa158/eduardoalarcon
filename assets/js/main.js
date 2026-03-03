(function () {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const name = contactForm.querySelector('#nombre');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#mensaje');
      const status = contactForm.querySelector('[data-form-status]');

      let hasError = false;
      [name, email, message].forEach((field) => {
        const error = field.nextElementSibling;
        if (error && error.classList.contains('error')) error.textContent = '';
      });

      if (!name.value.trim()) {
        hasError = true;
        name.nextElementSibling.textContent = 'Ingrese su nombre.';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        hasError = true;
        email.nextElementSibling.textContent = 'Ingrese un email válido.';
      }

      if (message.value.trim().length < 10) {
        hasError = true;
        message.nextElementSibling.textContent = 'Escriba al menos 10 caracteres.';
      }

      if (hasError) {
        e.preventDefault();
        if (status) status.textContent = 'Corrija los campos marcados.';
        return;
      }

      if (status) {
        status.textContent = 'Validación correcta. Se abrirá su cliente de correo.';
        status.classList.add('success');
      }

      window.DVTracking = window.DVTracking || [];
      window.DVTracking.push({
        event: 'contact_form_submit',
        timestamp: new Date().toISOString(),
        source: window.location.pathname
      });
    });
  }

  window.DVTracking = window.DVTracking || [];
  window.DVTracking.push({
    event: 'page_view',
    timestamp: new Date().toISOString(),
    path: window.location.pathname
  });
})();
