function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

async function loadCocktail(slug) {
  const res = await fetch(`https://adenophyllous-ernestina-weevilly.ngrok-free.dev/api/cocktails/slug/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    return null;
  }
  return await res.json();
}

function renderCocktail(c) {
  const container = document.getElementById("cocktail-detail");

  if (!c) {
    container.innerHTML = "<p>Cocktail non trovato.</p>";
    return;
  }

  const imgSrc = c.image || "https://via.placeholder.com/600x400?text=Cocktail";

  container.innerHTML = `
    <article>
      <h1>${c.nome}</h1>
      <p class="meta">
        ${c.autore || ""}${c.autore && c.anno ? " · " : ""}${c.anno || ""}
      </p>
      <p class="place">${c.luogo || ""}</p>

      <img src="${imgSrc}" alt="${c.nome}" class="hero" />

      <section>
        <h2>Ingredienti</h2>
        <ul>
          ${(c.ingredienti || [])
            .map(i => `<li>${i}</li>`)
            .join("")}
        </ul>
      </section>

      <section>
        <h2>Metodo</h2>
        <p>${c.metodo || ""}</p>
      </section>

      <section>
        <h2>Servizio</h2>
        <p><strong>Bicchiere:</strong> ${c.bicchiere || "-"}</p>
        <p><strong>Ghiaccio:</strong> ${c.ghiaccio || "-"}</p>
        <p><strong>Garnish:</strong> ${c.garnish || "-"}</p>
      </section>

      ${c.note ? `<section><h2>Note</h2><p>${c.note}</p></section>` : ""}
    </article>
  `;
}

(async () => {
  const slug = getSlugFromQuery();
  const cocktail = await loadCocktail(slug);
  renderCocktail(cocktail);
})();
