const listContainer = document.getElementById("cocktail-list");
const searchInput = document.getElementById("search");
const filterBase = document.getElementById("filter-base");
const btnAll = document.getElementById("btn-all");
const btnAvailable = document.getElementById("btn-available");

const API_BASE = "https://cocktails-book-back-end.onrender.com/api/cocktails"; // cambia se usi un altro dominio

let cocktails = [];

// Carica i cocktail da un endpoint (tutti o solo fattibili)
async function loadCocktails(endpoint = "/api/cocktails") {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) {
      console.error("Errore caricamento cocktail:", res.status);
      return;
    }
    const data = await res.json();
    cocktails = data;
    applyFilters();
  } catch (err) {
    console.error("Errore di rete caricando i cocktail:", err);
  }
}

// Renderizza la lista di cocktail
function renderList(list) {
  if (!listContainer) return;

  if (!list || list.length === 0) {
    listContainer.innerHTML = "<p>Nessun cocktail trovato.</p>";
    return;
  }

  listContainer.innerHTML = list
    .map((cocktail) => {
      return `
        <article class="cocktail-card">
          <a href="cocktail.html?slug=${encodeURIComponent(cocktail.slug)}">
            <img src="${cocktail.image}" alt="${cocktail.nome}" />
            <h2>${cocktail.nome}</h2>
            ${
              cocktail.autore
                ? `<p class="meta">${cocktail.autore}${
                    cocktail.anno ? " · " + cocktail.anno : ""
                  }</p>`
                : ""
            }
          </a>
        </article>
      `;
    })
    .join("");
}

// Applica ricerca + filtro base spirit
function applyFilters() {
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  const baseFilter = filterBase ? filterBase.value.toLowerCase() : "";

  const filtered = cocktails.filter((cocktail) => {
    const name = (cocktail.nome || "").toLowerCase();
    const author = (cocktail.autore || "").toLowerCase();
    const ingredientsText = Array.isArray(cocktail.ingredienti)
      ? cocktail.ingredienti.map((ing) => ing.nome || ing).join(" ").toLowerCase()
      : (cocktail.ingredienti || "").toLowerCase();

    const matchesSearch =
      !searchTerm ||
      name.includes(searchTerm) ||
      author.includes(searchTerm) ||
      ingredientsText.includes(searchTerm);

    // filtro base: cerca il nome del distillato principale nel testo ingredienti
    const matchesBase =
      !baseFilter || ingredientsText.includes(baseFilter);

    return matchesSearch && matchesBase;
  });

  renderList(filtered);
}

// Listener ricerca e filtro
if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}
if (filterBase) {
  filterBase.addEventListener("change", applyFilters);
}

// Bottoni: tutti vs solo fattibili
if (btnAll) {
  btnAll.addEventListener("click", () => {
    loadCocktails("/api/cocktails");
  });
}

if (btnAvailable) {
  btnAvailable.addEventListener("click", () => {
    loadCocktails("/api/cocktails/available");
  });
}

// Carica tutti i cocktail al primo load
document.addEventListener("DOMContentLoaded", () => {
  loadCocktails("/api/cocktails");
});
