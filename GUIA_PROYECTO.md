# Guia del Proyecto Web

## Caracteristicas principales de la web

- Prototipo e-commerce de moda francesa para la marca Maison Atelier.
- Arquitectura de 5 vistas clave:
  - Home
  - Catalogo
  - Vista de producto
  - Carrito
  - Checkout
- Navegacion consistente con navbar y footer reutilizados en todas las vistas.
- SEO on-page aplicado:
  - HTML semantico (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`)
  - Metadatos por pagina (`title`, `meta description`, `canonical`, `robots`)
  - Contenido indexable con jerarquia de encabezados.
- Datos estructurados con Schema.org segun la vista:
  - Home: `Organization`, `WebSite`
  - Catalogo: `CollectionPage`, `BreadcrumbList`, `ItemList`
  - Producto: `Product`, `Offer`
  - Carrito: `ShoppingCart`
  - Checkout: `CheckoutPage`
- Diseno responsive completo para movil, tablet y escritorio.
- Estilo visual moderno y coherente (tipografia editorial + componentes de interfaz limpios).

## Paleta de colores

### Colores base

- `#111827` - Tinta principal (textos y elementos de alto contraste)
- `#F5EFE5` - Arena suave (fondos de secciones destacadas)
- `#C2412D` - Rojo terracota (CTA y acentos principales)
- `#B48B46` - Dorado sobrio (detalles de marca y acentos secundarios)
- `#FFFFFF` - Blanco (fondos base)
- `#F8FAFC` - Gris muy claro (bloques secundarios y fondos suaves)

### Uso recomendado

- **Primario de marca:** `#C2412D`
- **Texto principal:** `#111827`
- **Fondo general:** `#FFFFFF` y `#F8FAFC`
- **Fondo premium/destacado:** `#F5EFE5`
- **Acento elegante:** `#B48B46`

### Variables CSS sugeridas

```css
:root {
  --brand-ink: #111827;
  --brand-sand: #F5EFE5;
  --brand-red: #C2412D;
  --brand-gold: #B48B46;
  --surface-white: #FFFFFF;
  --surface-muted: #F8FAFC;
}
```
