const TAX_RATE = 0.21;
const STORAGE_KEY = "mvp_cart_items";

const form = document.getElementById("checkoutForm");
const formMsg = document.getElementById("formMsg");
const successMsg = document.getElementById("successMsg");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const steps = Array.from(document.querySelectorAll(".checkout-step"));
const tags = Array.from(document.querySelectorAll(".step-tag"));
const orderDataInput = document.getElementById("orderData");

const checkoutItemsEl = document.getElementById("checkoutItems");
const subtotalEl = document.getElementById("resumenSubtotal");
const impuestosEl = document.getElementById("resumenImpuestos");
const totalEl = document.getElementById("resumenTotal");

let currentStep = 0;
const carrito = leerCarrito();

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

function formatearEuros(valor) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(valor);
}

function calcularTotales(items) {
  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const impuestos = subtotal * TAX_RATE;
  const total = subtotal + impuestos;
  return { subtotal, impuestos, total };
}

function pintarResumen() {
  if (carrito.length === 0) {
    checkoutItemsEl.innerHTML = "<p class='rounded-lg bg-amber-50 p-3 text-sm text-amber-800'>No hay productos en el carrito. Vuelve al carrito para añadir alguno.</p>";
    subtotalEl.textContent = formatearEuros(0);
    impuestosEl.textContent = formatearEuros(0);
    totalEl.textContent = formatearEuros(0);
    submitBtn.disabled = true;
    submitBtn.classList.add("cursor-not-allowed", "opacity-50");
    return;
  }

  submitBtn.disabled = false;
  submitBtn.classList.remove("cursor-not-allowed", "opacity-50");

  checkoutItemsEl.innerHTML = carrito
    .map(
      (item) => `
      <article class="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-3" itemprop="acceptedOffer" itemscope itemtype="https://schema.org/Offer">
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold" itemprop="name">${item.nombre}</p>
          <p class="text-xs text-slate-600">${item.cantidad} x ${formatearEuros(item.precio)}</p>
        </div>
        <p class="ml-3 text-sm font-bold text-[#C2412D]">${formatearEuros(item.cantidad * item.precio)}</p>
      </article>
    `
    )
    .join("");

  const { subtotal, impuestos, total } = calcularTotales(carrito);
  subtotalEl.textContent = formatearEuros(subtotal);
  impuestosEl.textContent = formatearEuros(impuestos);
  totalEl.textContent = formatearEuros(total);

  orderDataInput.value = JSON.stringify({ items: carrito, subtotal, impuestos, total });
  actualizarSchema(total);
}

function actualizarSchema(total) {
  const schemaEl = document.getElementById("checkoutSchema");
  if (!schemaEl) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CheckoutPage",
    name: "Finalizar compra",
    inLanguage: "es",
    mainEntity: {
      "@type": "Order",
      priceCurrency: "EUR",
      price: Number(total.toFixed(2))
    }
  };

  schemaEl.textContent = JSON.stringify(schema);
}

function setInputState(input) {
  input.classList.remove("border-rose-500", "border-[#B48B46]");
  if (!input.value.trim()) return;

  if (input.checkValidity()) {
    input.classList.add("border-[#B48B46]");
  } else {
    input.classList.add("border-rose-500");
  }
}

function camposPaso(index) {
  return Array.from(steps[index].querySelectorAll("input"));
}

function validarPaso(index) {
  const campos = camposPaso(index);
  let valido = true;

  for (const input of campos) {
    setInputState(input);

    if (!input.checkValidity()) {
      valido = false;

      const errores = [];

      if (input.validity.valueMissing) errores.push("required");
      if (input.validity.typeMismatch) errores.push("typeMismatch");
      if (input.validity.patternMismatch) errores.push("patternMismatch");
      if (input.validity.tooShort) errores.push("tooShort");
      if (input.validity.tooLong) errores.push("tooLong");
      if (input.validity.rangeUnderflow) errores.push("min");
      if (input.validity.rangeOverflow) errores.push("max");
      if (input.validity.stepMismatch) errores.push("step");
      if (input.validity.badInput) errores.push("badInput");

      console.warn(
        "[Checkout inválido]",
        input.name || input.id,
        "→",
        errores.join(", "),
        "| valor:",
        `"${input.value}"`
      );
    }
  }

  return valido;
}

function renderPaso() {
  steps.forEach((step, index) => {
    step.classList.toggle("hidden", index !== currentStep);
  });

  tags.forEach((tag, index) => {
    const activo = index === currentStep;
    tag.classList.toggle("bg-[#C2412D]", activo);
    tag.classList.toggle("text-white", activo);
    tag.classList.toggle("bg-[#F8FAFC]", !activo);
    tag.classList.toggle("text-[#111827]", !activo);
  });

  prevBtn.classList.toggle("hidden", currentStep === 0);
  nextBtn.classList.toggle("hidden", currentStep === steps.length - 1);
  submitBtn.classList.toggle("hidden", currentStep !== steps.length - 1);
  formMsg.textContent = "";
}

for (const input of form.querySelectorAll("input")) {
  input.addEventListener("input", () => setInputState(input));
  input.addEventListener("blur", () => setInputState(input));
}

nextBtn.addEventListener("click", () => {
  const valido = validarPaso(currentStep);
  if (!valido) {
    formMsg.textContent = "Revisa los campos marcados en rojo antes de continuar.";
    return;
  }

  if (currentStep < steps.length - 1) {
    currentStep += 1;
    renderPaso();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep -= 1;
    renderPaso();
  }
});

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const valido = validarPaso(currentStep);

  if (!valido) {
    successMsg.classList.add("hidden");
    formMsg.classList.remove("text-emerald-700");
    formMsg.classList.add("text-rose-600");
    formMsg.textContent = "Completa los datos de pago correctamente para finalizar.";
    return;
  }

  const payload = {
    cliente: Object.fromEntries(new FormData(form).entries()),
    pedido: JSON.parse(orderDataInput.value || "{}")
  };

  console.log("Checkout payload:", payload);

  localStorage.removeItem(STORAGE_KEY);
  carrito.length = 0;

  form.reset();
  formMsg.textContent = "";
  successMsg.textContent = "Compra realizada correctamente. Gracias por tu pedido.";
  successMsg.classList.remove("hidden");

  for (const input of form.querySelectorAll("input")) {
    input.classList.remove("border-rose-500", "border-[#B48B46]");
  }

  submitBtn.disabled = true;
  submitBtn.classList.add("cursor-not-allowed", "opacity-50");
  prevBtn.classList.add("hidden");
  nextBtn.classList.add("hidden");

  currentStep = 0;
  renderPaso();
  pintarResumen();
});

pintarResumen();
renderPaso();