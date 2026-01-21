const posts = [
  {
    title: 'Marketing Digital con IA en 2025: Automatiza, Personaliza y Conquista tu Mercado',
    slug: 'blog_post_1.html',
    excerpt:
      'El marketing digital ha evolucionado. Las estrategias que funcionaban hace apenas unos años hoy son insuficientes. En 2025, el éxito no depende de quién grita más fuerte, sino de quién se comunica de manera más inteligente. La clave de esta inteligencia es la automatización con IA, una fuerza que está redefiniendo la conexión entre marcas y clientes.',
    categories: ['Marketing', 'IA'],
    date: '2025-01-10',
    language: 'es',
    image: 'https://r2.flowith.net/files/o/1757529836736-ai_marketing_revolution_brain_index_5%401024x1024.png',
  },
  {
    title: 'Análisis de Datos Inteligente en 2025: Cómo la IA Transforma Información en Rentabilidad',
    slug: 'blog_post_2.html',
    excerpt:
      'En el competitivo entorno empresarial de 2025, los datos no son solo información; son el activo más valioso de su negocio. Sin embargo, la mayoría de las PyMEs se ahogan en un océano de datos sin saber cómo extraer su verdadero valor. La respuesta no está en trabajar más duro, sino en trabajar de manera más inteligente. Bienvenidos a la era del análisis de datos inteligente, impulsado por la Inteligencia Artificial.',
    categories: ['Datos', 'IA'],
    date: '2025-02-04',
    language: 'es',
    image: 'https://r2.flowith.net/files/o/1757529823761-ai_data_analysis_2025_blog_image_index_4%401024x1024.png',
  },
  {
    title: 'WhatsApp IA para ventas ágiles: guía de implementación realista',
    slug: 'blog_post_3.html',
    excerpt:
      'Aprende a diseñar respuestas predefinidas, tiempos de seguimiento y un flujo de ventas simple para convertir conversaciones en oportunidades reales.',
    categories: ['WhatsApp', 'Ventas'],
    date: '2025-02-18',
    language: 'es',
    image: 'https://r2.flowith.net/files/o/1757519356259-digitalsuite_business_brain_index_0%401024x1024.png',
  },
  {
    title: 'Productividad con automatización ligera: primeros pasos para equipos pequeños',
    slug: 'blog_post_4.html',
    excerpt:
      'Procesos simples, herramientas accesibles y hábitos de medición para liberar tiempo sin perder el control operativo.',
    categories: ['Automatización', 'Productividad'],
    date: '2025-03-02',
    language: 'es',
    image: 'https://r2.flowith.net/files/o/1757519349280-modular_scalable_automation_illustration_index_1%401024x1024.png',
  },
  {
    title: 'AI Marketing in 2025: Automate, Personalize, and Win Your Market',
    slug: 'blog_post_1.html',
    excerpt:
      'Digital marketing has evolved. In 2025, success depends on intelligent automation, not volume. Learn the foundations of AI-driven growth.',
    categories: ['Marketing', 'AI'],
    date: '2025-01-10',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757529836736-ai_marketing_revolution_brain_index_5%401024x1024.png',
  },
  {
    title: 'Smart Data Analysis in 2025: How AI Turns Information into Profit',
    slug: 'blog_post_2.html',
    excerpt:
      'Data is the most valuable asset in 2025. Discover how AI analysis helps businesses move from reporting to prediction.',
    categories: ['Data', 'AI'],
    date: '2025-02-04',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757529823761-ai_data_analysis_2025_blog_image_index_4%401024x1024.png',
  },
  {
    title: 'WhatsApp AI Sales Sprint: A practical 7-day launch',
    slug: 'blog_post_3.html',
    excerpt:
      'Build a fast, human-friendly flow with pre-defined answers, lead qualification, and clear next steps.',
    categories: ['WhatsApp', 'Sales'],
    date: '2025-02-18',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757519356259-digitalsuite_business_brain_index_0%401024x1024.png',
  },
  {
    title: 'Voice AI Agents that support your team without overload',
    slug: 'blog_post_4.html',
    excerpt:
      'Understand how AI voice agents can qualify leads and book meetings while your team focuses on closing.',
    categories: ['Voice', 'Automation'],
    date: '2025-03-05',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757519378860-financial_consulting_data_analysis_index_2%401024x1024.png',
  },
  {
    title: 'Automation blueprints for growing operations',
    slug: 'blog_post_5.html',
    excerpt:
      'Discover small operational changes that create compounding efficiency for founders and operations leaders.',
    categories: ['Automation', 'Operations'],
    date: '2025-03-12',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757519349280-modular_scalable_automation_illustration_index_1%401024x1024.png',
  },
  {
    title: 'Productivity systems with AI that feel human',
    slug: 'blog_post_6.html',
    excerpt:
      'Align tools, rituals, and messaging so your team can move faster without losing clarity.',
    categories: ['Productivity', 'AI'],
    date: '2025-03-20',
    language: 'en',
    image: 'https://r2.flowith.net/files/o/1757529880961-ai_tools_hub_shared_access_index_2%401024x1024.png',
  },
];

const blogContainer = document.querySelector('#blog-posts');
const searchInput = document.querySelector('#blog-search');
const categorySelect = document.querySelector('#blog-category');

const language = document.body.dataset.lang || 'es';

const renderPosts = () => {
  if (!blogContainer) return;
  const searchTerm = (searchInput?.value || '').toLowerCase();
  const category = categorySelect?.value || 'all';

  const filtered = posts.filter((post) => {
    const matchesLang = post.language === language;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || post.categories.includes(category);
    return matchesLang && matchesSearch && matchesCategory;
  });

  blogContainer.innerHTML = filtered
    .map((post) => {
      const linkPrefix = language === 'en' ? '/en/' : '/';
      return `
      <article class="card blog-card reveal" data-tilt>
        <img src="${post.image}" alt="${post.title}" loading="lazy" />
        <div>
          <p class="tag">${post.categories.join(' • ')} · ${post.date}</p>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <a class="btn btn-secondary" href="${linkPrefix}${post.slug}">${language === 'en' ? 'Read full article' : 'Leer artículo completo'}</a>
        </div>
      </article>
    `;
    })
    .join('');
};

if (searchInput) searchInput.addEventListener('input', renderPosts);
if (categorySelect) categorySelect.addEventListener('change', renderPosts);

renderPosts();
