const posts = [
  {
    title: 'Marketing Digital con IA en 2025: Automatiza, Personaliza y Conquista tu Mercado',
    slug: 'blog_post_1.html',
    excerpt:
      'El marketing digital ha evolucionado. Las estrategias que funcionaban hace apenas unos años hoy son insuficientes. En 2025, el éxito no depende de quién grita más fuerte, sino de quién se comunica de manera más inteligente. La clave de esta inteligencia es la automatización con IA, una fuerza que está redefiniendo la conexión entre marcas y clientes.',
    categories: ['IA', 'Marketing'],
    date: '2025-01-10',
    language: 'es',
    image: 'https://r2.flowith.net/files/o/1757529836736-ai_marketing_revolution_brain_index_5%401024x1024.png',
  },
  {
    title: 'Análisis de Datos Inteligente en 2025: Cómo la IA Transforma Información en Rentabilidad',
    slug: 'blog_post_2.html',
    excerpt:
      'En el competitivo entorno empresarial de 2025, los datos no son solo información; son el activo más valioso de su negocio. Sin embargo, la mayoría de las PyMEs se ahogan en un océano de datos sin saber cómo extraer su verdadero valor. La respuesta no está en trabajar más duro, sino en trabajar de manera más inteligente. Bienvenidos a la era del análisis de datos inteligente, impulsado por la Inteligencia Artificial.',
    categories: ['IA', 'Datos'],
    date: '2025-01-18',
    language: 'es',
    image: 'https://r2.flowith.net/files/o/1757529823761-ai_data_analysis_2025_blog_image_index_4%401024x1024.png',
  },
  {
    title: 'WhatsApp Inteligente: Respuestas que Convierten sin Saturar a tu Equipo',
    slug: 'blog_post_3.html',
    excerpt:
      'Explora cómo un Agente IA bien configurado puede responder en minutos, mantener el tono de marca y preparar conversaciones listas para ventas.',
    categories: ['WhatsApp', 'Automatización'],
    date: '2025-02-02',
    language: 'es',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Agentes de Voz: Prospectos Calificados con Guiones que Aprenden',
    slug: 'blog_post_4.html',
    excerpt:
      'Una guía práctica para adoptar agentes de voz con IA, desde el guion inicial hasta el seguimiento automático de reuniones.',
    categories: ['Voz', 'Ventas'],
    date: '2025-02-12',
    language: 'es',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'AI Marketing in 2025: Automate, Personalize, and Win Your Market',
    slug: 'blog_post_1.html',
    excerpt:
      'Digital marketing has evolved. In 2025, success depends on smarter communication and AI automation that reshapes how brands connect with customers.',
    categories: ['AI', 'Marketing'],
    date: '2025-01-10',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757529836736-ai_marketing_revolution_brain_index_5%401024x1024.png',
  },
  {
    title: 'Intelligent Data Analysis in 2025: How AI Turns Information into Profitability',
    slug: 'blog_post_2.html',
    excerpt:
      'In 2025, data is the most valuable asset for businesses. AI-driven analysis reveals insights that traditional reporting can no longer deliver.',
    categories: ['AI', 'Data'],
    date: '2025-01-18',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757529823761-ai_data_analysis_2025_blog_image_index_4%401024x1024.png',
  },
  {
    title: 'Automation Playbooks: Building Scalable Operations with AI',
    slug: 'blog_post_3.html',
    excerpt:
      'Learn how teams structure automation playbooks that remove repetitive tasks while keeping human oversight where it matters.',
    categories: ['Automation', 'Operations'],
    date: '2025-02-03',
    language: 'en',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Voice Agents for Sales: Qualification Without Compromise',
    slug: 'blog_post_4.html',
    excerpt:
      'A practical look at deploying AI voice agents that qualify leads, follow up, and keep your pipeline moving.',
    categories: ['Voice', 'Sales'],
    date: '2025-02-11',
    language: 'en',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
];

const listContainer = document.querySelector('[data-blog-list]');
const searchInput = document.querySelector('[data-blog-search]');
const categoryContainer = document.querySelector('[data-blog-categories]');

if (listContainer) {
  const language = listContainer.dataset.language || 'es';
  const filteredPosts = posts.filter((post) => post.language === language);
  const categories = Array.from(
    new Set(filteredPosts.flatMap((post) => post.categories))
  );

  const renderPosts = (items) => {
    listContainer.innerHTML = items
      .map(
        (post) => `
        <article class="card blog-card reveal">
          <img src="${post.image}" alt="${post.title}" loading="lazy" />
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="badge-inline">${post.date}</div>
          <a class="button secondary" href="${post.slug}">${language === 'es' ? 'Leer artículo' : 'Read article'}</a>
        </article>
      `
      )
      .join('');
  };

  renderPosts(filteredPosts);

  if (categoryContainer) {
    categoryContainer.innerHTML = [
      `<button class="chip active" data-category="all">${language === 'es' ? 'Todos' : 'All'}</button>`,
      ...categories.map(
        (category) => `<button class="chip" data-category="${category}">${category}</button>`
      ),
    ].join('');

    categoryContainer.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      const target = event.target.closest('.chip');
      if (!target) return;
      const category = target.dataset.category;
      categoryContainer.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
      target.classList.add('active');
      const selection = category === 'all'
        ? filteredPosts
        : filteredPosts.filter((post) => post.categories.includes(category));
      renderPosts(selection);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const term = event.target.value.toLowerCase();
      const result = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term)
      );
      renderPosts(result);
    });
  }
}
