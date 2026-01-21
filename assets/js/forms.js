const forms = document.querySelectorAll('[data-mailto]');

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || '';
    const message = formData.get('message') || '';
    const intent = formData.get('intent') || '';

    if (!name || !email || !message) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const mailSubject = intent ? `[${intent}] ${subject || 'Solicitud'}` : subject || 'Solicitud';
    const body = `Nombre: ${name}%0AEmail: ${email}%0AInterés: ${intent}%0A%0AMensaje:%0A${message}`;
    const mailto = `mailto:latamdigitalvision@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${body}`;

    window.location.href = mailto;
    form.reset();
  });
});
