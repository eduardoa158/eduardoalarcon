const languageSwitch = document.querySelector('[data-language-switch]');
const storedLang = localStorage.getItem('dv-language');

if (storedLang) {
  const isEnglishPage = window.location.pathname.startsWith('/en/');
  if (storedLang === 'en' && !isEnglishPage) {
    window.location.href = `/en${window.location.pathname}`;
  }
  if (storedLang === 'es' && isEnglishPage) {
    const target = window.location.pathname.replace('/en', '') || '/index.html';
    window.location.href = target;
  }
}

if (languageSwitch) {
  languageSwitch.addEventListener('change', (event) => {
    const value = event.target.value;
    localStorage.setItem('dv-language', value);
    const isEnglishPage = window.location.pathname.startsWith('/en/');
    if (value === 'en' && !isEnglishPage) {
      window.location.href = `/en${window.location.pathname}`;
    }
    if (value === 'es' && isEnglishPage) {
      const target = window.location.pathname.replace('/en', '') || '/index.html';
      window.location.href = target;
    }
  });
}
