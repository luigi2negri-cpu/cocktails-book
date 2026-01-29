const listContainer = document.getElementById("cocktail-list");
const searchInput = document.getElementById("search");
const filterBase = document.getElementById("filter-base");

let cocktails = [];

async function loadCocktails() {
  const res = await fetch("https://adenophyllous-ernestina-weevilly.ngrok-free.dev/api/cocktails");
  cocktails = await res.json();
  renderList(cocktails);
}

function guessBaseSpirit(cocktail) {
  const text = (cocktail.ingredienti || []).join(" ").toLowerCase();
  if (text.includes("gin")) return "gin";
  if (text.includes("rum")) return "rum";
  if (text.includes("bourbon") || text.includes("rye") || text.includes("whiskey") || text.includes("whisky")) return "whiskey";
  if (text.includes("tequila") || text.includes("mezcal")) return "tequila";
  if (text.includes("vodka")) return "vodka";
  return "";
}

function renderList(list) {
  listContainer.innerHTML = "";

  if (!list.length) {
    listContainer.innerHTML = "<p>Nessun cocktail trovato.</p>";
    return;
  }

  list.forEach(c => {
    const base = guessBaseSpirit(c);
    const card = document.createElement("article");
    card.className = "cocktail-card";

    const imgSrc = c.image || "https://via.placeholder.com/300x200?text=Cocktail";

    card.innerHTML = `
      <a href="cocktail.html?slug=${encodeURIComponent(c.slug)}">
        <img src="${imgSrc}" alt="${c.nome}" class="thumb" />
        <h2>${c.nome}</h2>
      </a>
      <p class="meta">
        ${c.autore || ""}${c.autore && c.anno ? " · " : ""}${c.anno || ""}
      </p>
      <p class="place">${c.luogo || ""}</p>
      <p class="base">${base ? "Base: " + base : ""}</p>
    `;

    listContainer.appendChild(card);
  });
}

function applyFilters() {
  const term = searchInput.value.toLowerCase();
  const baseFilter = filterBase.value;

  const filtered = cocktails.filter(c => {
    const haystack = [
      c.nome,
      c.autore,
      c.luogo,
      c.anno,
      (c.ingredienti || []).join(" ")
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !term || haystack.includes(term);
    const base = guessBaseSpirit(c);
    const matchesBase = !baseFilter || base === baseFilter;

    return matchesSearch && matchesBase;
  });

  renderList(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterBase.addEventListener("change", applyFilters);

loadCocktails();
