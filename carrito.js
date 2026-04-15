const TAX_RATE = 0.21;
const STORAGE_KEY = "mvp_cart_items";

const productosDemo = [
  {
    id: "p1",
    nombre: "Auriculares Pulse",
    precio: 49.9,
    miniatura: "https://placehold.co/80x80/f0f9ff/0f172a?text=AUD"
  },
  {
    id: "p2",
    nombre: "Teclado Compact Air",
    precio: 69.5,
    miniatura: "https://placehold.co/80x80/ecfeff/0f172a?text=TEC"
  },
  {
    id: "p3",
    nombre: "Mouse Orbit Pro",
    precio: 39,
    miniatura: "https://placehold.co/80x80/f0fdf4/0f172a?text=MOU"
  }
];

const catalogoEl = document.getElementById("catalogo");
const listaCarritoEl = document.getElementById("listaCarrito");
const carritoVacioEl = document.getElementById("carritoVacio");
const badgeItemsEl = document.getElementById("badgeItems");
const subtotalEl = document.getElementById("subtotal");
const impuestosEl = document.getElementById("impuestos");
const totalEl = document.getElementById("total");
const vaciarCarritoBtn = document.getElementById("vaciarCarrito");
const comprarBtn = document.getElementById("comprarBtn");

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

function formatearEuros(valor) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(valor);
}

function renderCatalogo() {
  catalogoEl.innerHTML = productosDemo
    .map(
      (producto, index) => `
      <article class="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3" itemprop="itemListElement" itemscope itemtype="https://schema.org/Product">
        <meta itemprop="position" content="${index + 1}">
        <img src="${producto.miniatura}" alt="Miniatura de ${producto.nombre}" class="mb-3 h-20 w-20 rounded-lg object-cover" itemprop="image">
        <h3 class="font-bold" itemprop="name">${producto.nombre}</h3>
        <p class="text-sm text-slate-600">
          <span itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <span class="font-semibold text-slate-900" itemprop="price">${producto.precio.toFixed(2)}</span>
            <span itemprop="priceCurrency" content="EUR">€</span>
          </span>
        </p>
        <button data-id="${producto.id}" type="button" class="mt-3 w-full rounded-lg bg-[#C2412D] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#9F3525]">
          Añadir al carrito
        </button>
      </article>
    `
    )
    .join("");
}

function totalItems() {
  return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

function totalSubtotal() {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

function actualizarTotales() {
  const subtotal = totalSubtotal();
  const impuestos = subtotal * TAX_RATE;
  const total = subtotal + impuestos;

  subtotalEl.textContent = formatearEuros(subtotal);
  impuestosEl.textContent = formatearEuros(impuestos);
  totalEl.textContent = formatearEuros(total);
  badgeItemsEl.textContent = `${totalItems()} items`;
}

function renderListaCarrito() {
  if (carrito.length === 0) {
    listaCarritoEl.innerHTML = "";
    carritoVacioEl.classList.remove("hidden");
    actualizarTotales();
    return;
  }

  carritoVacioEl.classList.add("hidden");
  listaCarritoEl.innerHTML = carrito
    .map(
      (item) => `
      <article class="rounded-xl border border-[#E5E7EB] p-3 sm:p-4" data-id="${item.id}">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <img src="${item.miniatura}" alt="${item.nombre}" class="h-16 w-16 rounded-lg object-cover">
            <div>
              <h3 class="font-semibold">${item.nombre}</h3>
              <p class="text-sm text-slate-600">Precio unitario: <strong>${formatearEuros(item.precio)}</strong></p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button data-action="restar" data-id="${item.id}" type="button" class="h-9 w-9 rounded-lg border border-[#D1D5DB] font-bold text-slate-700 hover:border-[#B48B46] hover:bg-[#F5EFE5]">-</button>
            <span class="min-w-8 text-center font-semibold">${item.cantidad}</span>
            <button data-action="sumar" data-id="${item.id}" type="button" class="h-9 w-9 rounded-lg border border-[#D1D5DB] font-bold text-slate-700 hover:border-[#B48B46] hover:bg-[#F5EFE5]">+</button>
          </div>

          <div class="text-right">
            <p class="text-xs uppercase tracking-wide text-slate-500">Total producto</p>
            <p class="text-lg font-black text-[#C2412D]">${formatearEuros(item.precio * item.cantidad)}</p>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  actualizarTotales();
}

function anyadirProducto(idProducto) {
  const producto = productosDemo.find((p) => p.id === idProducto);
  if (!producto) return;

  const itemExistente = carrito.find((item) => item.id === idProducto);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  renderListaCarrito();
}

function modificarCantidad(idProducto, delta) {
  const item = carrito.find((producto) => producto.id === idProducto);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter((producto) => producto.id !== idProducto);
  }

  guardarCarrito();
  renderListaCarrito();
}

catalogoEl.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-id]");
  if (!boton) return;
  anyadirProducto(boton.dataset.id);
});

listaCarritoEl.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-action][data-id]");
  if (!boton) return;

  const accion = boton.dataset.action;
  const id = boton.dataset.id;
  const delta = accion === "sumar" ? 1 : -1;
  modificarCantidad(id, delta);
});

vaciarCarritoBtn.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  renderListaCarrito();
});

comprarBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Añade al menos un producto para continuar al checkout.");
    return;
  }
  guardarCarrito();
  window.location.href = "checkout.html";
});

renderCatalogo();
renderListaCarrito();