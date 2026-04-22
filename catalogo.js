const STORAGE_KEY = "mvp_cart_items";

const productos = Array.isArray(window.PRODUCTOS) ? window.PRODUCTOS : [];
const catalogoEl = document.getElementById("catalogo");
const badgeItemsEl = document.getElementById("badgeItems");

let carrito = leerCarrito();

function leerCarrito() {
  const datos = localStorage.getItem(STORAGE_KEY);
  if (!datos) return [];

  try {
    const carritoGuardado = JSON.parse(datos);
    if (!Array.isArray(carritoGuardado)) return [];
    return carritoGuardado;
  } catch {
    return [];
  }
}

function guardarCarrito() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

function totalItems() {
  return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

function actualizarBadge() {
  badgeItemsEl.textContent = String(totalItems());
}

function renderCatalogo() {
  if (!catalogoEl) return;

  if (productos.length === 0) {
    catalogoEl.innerHTML = "<p class='rounded-lg bg-amber-50 p-3 text-sm text-amber-800'>No hay productos disponibles en este momento.</p>";
    return;
  }

  catalogoEl.innerHTML = productos
    .map(
      (producto, index) => `
      <article class="rounded-2xl border border-[#E5E7EB] bg-[var(--surface-muted)] p-3 shadow-sm" itemprop="itemListElement" itemscope itemtype="https://schema.org/Product">
        <meta itemprop="position" content="${index + 1}">
        <img src="${producto.miniatura}" alt="${producto.nombre}" class="mb-3 h-52 w-full rounded-xl object-cover" loading="lazy" itemprop="image">
        <h2 class="text-base font-bold" itemprop="name">${producto.nombre}</h2>
        <p class="mt-1 text-sm text-slate-600">${producto.descripcion}</p>
        <p class="mt-2 text-lg font-black text-[var(--brand-red)]" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <meta itemprop="priceCurrency" content="EUR">
          <span itemprop="price">${producto.precio.toFixed(2)}</span> €
        </p>
        <button data-id="${producto.id}" type="button" class="mt-3 w-full rounded-xl bg-[var(--brand-red)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#9F3525]">
          Anadir al carrito
        </button>
      </article>
    `
    )
    .join("");
}

function anyadirProducto(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  const itemExistente = carrito.find((item) => item.id === idProducto);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarBadge();
}

catalogoEl?.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-id]");
  if (!boton) return;

  anyadirProducto(boton.dataset.id);
});

renderCatalogo();
actualizarBadge();
