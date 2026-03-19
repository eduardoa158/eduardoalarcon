const langButton = document.querySelector('.lang-toggle');
const storedLang = localStorage.getItem('dv_lang');

const isEnglish = window.location.pathname.startsWith('/en/');
const currentLang = isEnglish ? 'en' : 'es';

if (storedLang && storedLang !== currentLang) {
  const target = storedLang === 'en' ? `/en${window.location.pathname}` : window.location.pathname.replace('/en', '');
  window.location.replace(target);
}

if (langButton) {
  langButton.textContent = currentLang === 'en' ? 'ES' : 'EN';
  langButton.addEventListener('click', () => {
    const nextLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('dv_lang', nextLang);
    const nextPath = nextLang === 'en' ? `/en${window.location.pathname}` : window.location.pathname.replace('/en', '');
    window.location.href = nextPath;
  });
}
