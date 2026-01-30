function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

async function loadCocktail(slug) {
  const res = await fetch(`https://cocktails-book-back-end.onrender.com/api/cocktails/slug/${encodeURIComponent(slug)}`);
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

  // gestisce ingredienti sia come array di stringhe sia come array di oggetti
  const ingredientiHtml = (c.ingredienti || [])
    .map((i) => {
      if (typeof i === "string") {
        return `<li>${i}</li>`;
      }
      const nome = i.nome || i.name || "";
      const qty =
        i.quantita ||
        i.quantity ||
        i.qta ||
        "";
      return `<li>${qty ? qty + " – " : ""}${nome}</li>`;
    })
    .join("");

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
          ${ingredientiHtml}
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
