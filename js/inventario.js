const INVENTORY_API_BASE = 'https://cocktails-book-backend.onrender.com/api/cocktails'; // cambia se diverso

async function loadInventory() {
  try {
    const res = await fetch(`${INVENTORY_API_BASE}/api/inventory`);
    if (!res.ok) {
      console.error('Errore risposta inventario', res.status);
      return;
    }
    const items = await res.json();
    renderInventory(items);
  } catch (err) {
    console.error('Errore fetch inventario', err);
  }
}

function renderInventory(items) {
  const container = document.getElementById('inventory-list');
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<li>Nessuna bottiglia in inventario.</li>';
    return;
  }

  container.innerHTML = items.map(item => `
    <li>
      <strong>${item.ingredient_name || 'Ingrediente'}</strong>
      ${item.brand ? ` – ${item.brand}` : ''}
      ${item.bottle_size_ml ? ` (${item.bottle_size_ml} ml)` : ''}
      ${item.status ? ` – stato: ${item.status}` : ''}
      ${item.barcode ? `<br><small>Barcode: ${item.barcode}</small>` : ''}
      ${item.location ? `<br><small>Posizione: ${item.location}</small>` : ''}
    </li>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadInventory);
