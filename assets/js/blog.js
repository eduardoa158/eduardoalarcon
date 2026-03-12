const query = new URLSearchParams(window.location.search);
const lang = document.documentElement.lang === "en" ? "en" : "es";
const posts = BLOG_POSTS[lang];

const listContainer = document.querySelector("[data-blog-list]");
const detailContainer = document.querySelector("[data-blog-detail]");
const searchInput = document.querySelector("[data-blog-search]");
const categorySelect = document.querySelector("[data-blog-category]");

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const renderList = (items) => {
  if (!listContainer) return;
  listContainer.innerHTML = items
    .map(
      (post) => `
      <article class="card fade-up" data-tilt>
        <span class="badge">${post.category}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <small>${formatDate(post.date)}</small>
        <div style="margin-top:16px;">
          <a class="btn btn-ghost" href="blog-post.html?id=${post.id}">
            ${lang === "en" ? "Read article" : "Leer artículo"}
          </a>
        </div>
      </article>
    `
    )
    .join("");
};

const renderDetail = (post) => {
  if (!detailContainer || !post) return;
  detailContainer.innerHTML = `
    <div class="card">
      <span class="badge">${post.category}</span>
      <h1 style="margin:16px 0;">${post.title}</h1>
      <small>${formatDate(post.date)}</small>
      <div style="margin-top:20px;" class="blog-content">${post.content}</div>
    </div>
  `;
};

if (listContainer) {
  renderList(posts);

  const categories = ["all", ...new Set(posts.map((post) => post.category))];
  if (categorySelect) {
    categorySelect.innerHTML = categories
      .map(
        (category) =>
          `<option value="${category}">${category === "all" ? (lang === "en" ? "All categories" : "Todas las categorías") : category}</option>`
      )
      .join("");
  }

  const filterPosts = () => {
    const queryText = searchInput ? searchInput.value.toLowerCase() : "";
    const category = categorySelect ? categorySelect.value : "all";
    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(queryText) ||
        post.excerpt.toLowerCase().includes(queryText);
      const matchesCategory = category === "all" || post.category === category;
      return matchesSearch && matchesCategory;
    });
    renderList(filtered);
  };

  if (searchInput) searchInput.addEventListener("input", filterPosts);
  if (categorySelect) categorySelect.addEventListener("change", filterPosts);
}

if (detailContainer) {
  const postId = query.get("id");
  const post = posts.find((item) => item.id === postId) || posts[0];
  renderDetail(post);
}
