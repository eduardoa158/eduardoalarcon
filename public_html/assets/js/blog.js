const postsContainer = document.querySelector("[data-posts]");

const renderPosts = (posts) => {
  postsContainer.innerHTML = posts
    .map(
      (post, index) => `
      <article class="card reveal tilt">
        <img src="${post.image}" alt="${post.imageAlt}" loading="lazy" />
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a class="button button-outline" href="${post.link}">Leer artículo completo</a>
      </article>
      ${index < posts.length - 1 ? "<div class='section-intro'>* * *</div>" : ""}
    `
    )
    .join("");
};

if (postsContainer) {
  fetch("/assets/data/posts.json")
    .then((response) => response.json())
    .then((data) => renderPosts(data.posts))
    .catch(() => {
      postsContainer.innerHTML = "<p class='section-intro'>No se pudieron cargar los posts.</p>";
    });
}
