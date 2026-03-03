const posts=[
{title:'Marketing Digital con IA en 2025: Automatiza, Personaliza y Conquista tu Mercado',slug:'blog_post_1.html',extracto:'El marketing digital ha evolucionado...',categorias:['IA','Marketing'],fecha:'2025-01-10',idioma:'es'},
{title:'Análisis de Datos Inteligente en 2025: Cómo la IA Transforma Información en Rentabilidad',slug:'blog_post_2.html',extracto:'En el competitivo entorno empresarial de 2025...',categorias:['IA','Datos'],fecha:'2025-01-11',idioma:'es'},
{title:'Agente IA en WhatsApp: 7 claves para responder más rápido',slug:'blog_post_3.html',extracto:'Cómo implementar respuestas eficientes sin fricción.',categorias:['WhatsApp','Ventas'],fecha:'2025-01-12',idioma:'es'},
{title:'Productividad comercial con automatización diaria',slug:'blog_post_4.html',extracto:'Rutinas prácticas para equipos pequeños.',categorias:['Productividad'],fecha:'2025-01-13',idioma:'es'},
{title:'AI Marketing in 2025: Automate and Personalize',slug:'en/blog_post_1.html',extracto:'Marketing success now depends on intelligence.',categorias:['AI','Marketing'],fecha:'2025-01-10',idioma:'en'},
{title:'Smart Data Analysis in 2025',slug:'en/blog_post_2.html',extracto:'Turn data into profitability with AI.',categorias:['AI','Data'],fecha:'2025-01-11',idioma:'en'},
{title:'Voice AI for sales teams',slug:'en/blog_post_3.html',extracto:'Scale outreach with natural conversations.',categorias:['Voice AI','Sales'],fecha:'2025-01-12',idioma:'en'},
{title:'WhatsApp IA workflows for SMEs',slug:'en/blog_post_4.html',extracto:'Practical playbook for SMB growth.',categorias:['WhatsApp','Automation'],fecha:'2025-01-13',idioma:'en'}
];
function renderBlog(lang='es'){
  const wrap=document.getElementById('blog-list'); if(!wrap) return;
  const q=(document.getElementById('blog-search')?.value||'').toLowerCase();
  const c=(document.getElementById('blog-cat')?.value||'all');
  wrap.innerHTML='';
  posts.filter(p=>p.idioma===lang).filter(p=>p.title.toLowerCase().includes(q)).filter(p=>c==='all'||p.categorias.includes(c)).forEach(p=>{
    const el=document.createElement('article');el.className='card';
    el.innerHTML=`<h3>${p.title}</h3><p>${p.extracto}</p><p class='muted'>${p.fecha} · ${p.categorias.join(', ')}</p><a class='btn btn-secondary' href='${p.slug}'>Leer artículo completo</a>`;
    wrap.appendChild(el);
  });
}
document.getElementById('blog-search')?.addEventListener('input',()=>renderBlog(document.documentElement.lang||'es'));
document.getElementById('blog-cat')?.addEventListener('change',()=>renderBlog(document.documentElement.lang||'es'));
renderBlog(document.documentElement.lang||'es');
