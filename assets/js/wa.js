(function () {
  function getUTMs() {
    var params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
      content: params.get('utm_content') || '',
      term: params.get('utm_term') || ''
    };
  }

  function buildWhatsAppLink(interest, sourcePage) {
    var utm = getUTMs();
    var message = [
      'Hola, vengo desde la web de Digital Vision Latam.',
      'Interés: ' + (interest || 'General'),
      'Página: ' + (sourcePage || window.location.pathname),
      'UTM: source=' + utm.source + ' medium=' + utm.medium + ' campaign=' + utm.campaign + ' content=' + utm.content + ' term=' + utm.term,
      'Industria: [ESCRIBA AQUÍ]',
      'Volumen aprox (mensajes/leads al mes): [ESCRIBA AQUÍ]',
      '¿Me ayudan con el diagnóstico?'
    ].join('\n');

    return 'https://wa.me/593959920299?text=' + encodeURIComponent(message);
  }

  function wireWhatsAppButtons() {
    var buttons = document.querySelectorAll('.js-wa');
    buttons.forEach(function (btn) {
      var interest = btn.getAttribute('data-interest') || 'General';
      var source = btn.getAttribute('data-source') || window.location.pathname;
      btn.setAttribute('href', buildWhatsAppLink(interest, source));
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });
  }

  window.getUTMs = getUTMs;
  window.buildWhatsAppLink = buildWhatsAppLink;
  window.wireWhatsAppButtons = wireWhatsAppButtons;
})();
