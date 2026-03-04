async function renderBlogList(){
  const list=document.getElementById('blog-list');
  if(!list) return;
  const posts=await fetch('/data/blog.json').then(r=>r.json());
  list.innerHTML=posts.map(p=>`<article class="card"><small>${p.date}</small><h3>${p.title}</h3><p>${p.excerpt}</p><a class="btn secondary" href="/blog-${p.slug}.html">Leer artículo</a></article>`).join('');
}
document.addEventListener('DOMContentLoaded',renderBlogList);
