const sw=document.getElementById('lang-switch');
if(sw){
  const saved=localStorage.getItem('dv_lang');
  if(saved) document.documentElement.lang=saved;
  sw.addEventListener('change',e=>{
    const lang=e.target.value; localStorage.setItem('dv_lang',lang);
    const path=location.pathname.replace(/^\//,'');
    if(lang==='en' && !path.startsWith('en/')) location.href='/en/'+(path||'index.html');
    if(lang==='es' && path.startsWith('en/')) location.href='/' + path.replace(/^en\//,'');
  });
}
