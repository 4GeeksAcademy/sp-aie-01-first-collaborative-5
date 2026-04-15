# Guia de funcionamiento del carrito

## Objetivo
Este documento explica como funciona el carrito actual y que debe comprender cualquier companero para mantenerlo o ampliarlo sin romper el flujo.

## Archivos implicados
- carrito.html: estructura visual del carrito y contenedores que usa JavaScript.
- carrito.js: logica del catalogo, carrito, cantidades, totales y paso a checkout.
- checkout.html: recibe al usuario cuando pulsa Comprar.
- checkout.js: usa los datos del carrito guardados en el navegador.

## Flujo general
1. Al cargar la pagina, carrito.js define productos de ejemplo.
2. Se leen los items guardados en localStorage.
3. Se pinta el catalogo de productos con boton Anadir al carrito.
4. Se pinta la lista de productos anadidos.
5. Se calculan subtotal, impuestos y total.
6. Al pulsar Comprar, si hay productos, se guarda estado y se navega a checkout.html.

## Donde se guardan los datos
- Clave de almacenamiento: mvp_cart_items
- Tipo de dato: array en formato JSON
- Cada item del carrito tiene este formato:
  - id
  - nombre
  - precio
  - miniatura
  - cantidad

## Funciones clave de carrito.js

### leerCarrito
- Lee la clave mvp_cart_items desde localStorage.
- Si no existe o esta corrupta, devuelve array vacio.

### guardarCarrito
- Guarda el array actual del carrito en localStorage.

### renderCatalogo
- Recorre productosDemo y construye las cards del catalogo.
- Cada boton lleva data-id con el id del producto.
- Ese data-id es obligatorio para que el click funcione.

### anyadirProducto
- Busca producto por id.
- Si ya estaba en carrito, suma cantidad.
- Si no estaba, lo agrega con cantidad 1.
- Guarda y vuelve a pintar la lista.

### renderListaCarrito
- Si carrito esta vacio, muestra mensaje de vacio.
- Si hay items, pinta miniatura, precio unitario, cantidad y total por producto.
- Tambien dibuja botones de sumar y restar cantidad.

### modificarCantidad
- Suma o resta cantidad segun el boton pulsado.
- Si la cantidad baja a 0 o menos, elimina el item.
- Guarda y vuelve a renderizar.

### actualizarTotales
- Subtotal: suma de precio por cantidad.
- Impuestos: subtotal multiplicado por TAX_RATE.
- Total: subtotal mas impuestos.
- Tambien actualiza badge de numero de items.

## Eventos que hacen que el boton funcione

### Evento en el catalogo
- Se usa delegacion de eventos sobre el contenedor catalogo.
- Busca el boton mas cercano con selector button[data-id].
- Si lo encuentra, llama a anyadirProducto con ese id.

Esto permite que funcione aunque las cards se creen por JavaScript y no existan desde el HTML inicial.

### Evento en la lista del carrito
- Se usa delegacion en listaCarrito.
- Busca button[data-action][data-id].
- data-action define si la operacion es sumar o restar.

## Requisitos minimos en carrito.html
Para que el JavaScript funcione, estos ids deben existir:
- catalogo
- listaCarrito
- carritoVacio
- badgeItems
- subtotal
- impuestos
- total
- vaciarCarrito
- comprarBtn

Si cambias un id en HTML, debes actualizarlo tambien en carrito.js.

## Reglas para agregar productos nuevos
1. Anadir objeto en productosDemo con id unico.
2. Incluir nombre, precio y miniatura.
3. No repetir ids.
4. Evitar precio como texto; debe ser numero.

## Errores comunes y solucion

### El boton Anadir no hace nada
- Verifica que el script carrito.js se este cargando.
- Verifica que exista el contenedor con id catalogo.
- Verifica que cada boton generado tenga data-id.
- Revisa consola del navegador por errores JavaScript.

### El carrito no persiste al recargar
- Verifica permisos del navegador para localStorage.
- Verifica que no se haya cambiado la clave mvp_cart_items.

### Totales no cuadran
- Revisar que precio sea numero en productosDemo.
- Revisar que TAX_RATE tenga el valor esperado.

## Como conectar con backend en el futuro
1. Mantener la estructura interna del carrito en memoria.
2. Sustituir guardarCarrito por llamada a API si hay login.
3. Mantener renderizado igual para no tocar UX.
4. En checkout, enviar payload final al endpoint de ordenes.

## Resumen para companero nuevo
Si quieres que el boton Anadir al carrito funcione siempre, debes garantizar tres cosas:
1. El boton tiene data-id correcto.
2. El evento delegado en catalogo sigue activo.
3. El id del contenedor y la funcion anyadirProducto no se rompen.
