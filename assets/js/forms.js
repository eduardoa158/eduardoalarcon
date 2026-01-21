document.querySelectorAll('[data-mailto-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(255, 43, 43, 0.8)';
        valid = false;
      } else {
        field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    });

    if (!valid) {
      return;
    }

    const subject = formData.get('asunto') || formData.get('subject') || 'Consulta Digital Vision';
    const option = formData.get('interes') || formData.get('interest');
    const name = formData.get('nombre') || formData.get('name');
    const email = formData.get('email');
    const message = formData.get('mensaje') || formData.get('message');

    const finalSubject = option ? `${subject} | ${option}` : subject;
    const body = `Nombre: ${name || ''}\nEmail: ${email || ''}\nInterés: ${option || ''}\nMensaje: ${message || ''}`;

    const mailto = `mailto:latamdigitalvision@gmail.com?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
});
