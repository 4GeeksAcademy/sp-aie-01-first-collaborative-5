function mountHtmlFragment(selector, filePath) {
  const mountPoint = document.querySelector(selector);
  if (!mountPoint) return;

  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${filePath}`);
      }
      return response.text();
    })
    .then((html) => {
      mountPoint.innerHTML = html;
    })
    .catch((error) => {
      console.warn("Fallo cargando fragmento:", error.message);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  mountHtmlFragment("#headerMount", "header.html");
  mountHtmlFragment("#footerMount", "footer.html");
});
