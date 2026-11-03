# Aurum & Co. — Prototipo web inicial

Proyecto académico de Ingeniería Web 2 — Universidad Manuela Beltrán.

## Descripción
Aurum & Co. es el prototipo de una plataforma web para una joyería de lujo. La interfaz permite explorar un catálogo de joyas, filtrar por categorías, buscar productos, consultar precios y disponibilidad, agregar artículos a una bolsa de compra y simular la confirmación de un pedido.

También incorpora un panel demostrativo con indicadores y una gráfica interactiva de pedidos construida con Chart.js. Las cifras y productos son datos simulados.

## Objetivo
Construir una primera versión navegable, adaptable y visualmente coherente con la identidad de una joyería, como base para incorporar posteriormente backend, base de datos, autenticación y administración de inventario.

## Tecnologías
- HTML5: estructura semántica.
- CSS3: diseño visual adaptable (responsive).
- JavaScript: filtros, búsqueda, carrito y navegación.
- Chart.js: gráfica interactiva.
- Git y GitHub: control de versiones.

## Estructura
```text
aurum-co-prototipo/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    └── app.js
```

## Cómo ejecutar
1. Descarga o clona el repositorio.
2. Abre la carpeta en Visual Studio Code.
3. Abre `index.html` en un navegador actualizado. Se recomienda la extensión Live Server.
4. Para ver la gráfica, permite la conexión a la biblioteca Chart.js mediante CDN.

No requiere instalación de backend ni base de datos en esta primera entrega.

## Funcionalidades implementadas
- Navegación entre secciones.
- Catálogo de anillos, collares, pulseras y aretes.
- Filtro por categoría y búsqueda por nombre.
- Visualización de precio y disponibilidad simulada.
- Carrito con agregado y eliminación de productos.
- Cálculo automático del total.
- Confirmación simulada del pedido, sin pagos reales.
- Gráfica de pedidos por semana o por últimos seis meses.
- Diseño responsive para escritorio, tablet y móvil.
- Recomendaciones básicas para el cuidado de joyas.

## Alcance y limitaciones
Este prototipo no procesa pagos, no realiza envíos, no cuenta con autenticación real, no utiliza una base de datos y no se conecta a inventario físico. Los datos son ilustrativos y se utilizan únicamente para demostrar la interfaz y la interactividad solicitadas en la actividad.

## Integrantes
- Cristian David Cotrino Vásquez
- Jhonnatan Alexander López

## Evidencias sugeridas
Guardar capturas en una carpeta `evidencias/`:
1. `01-inicio.png`: página principal.
2. `02-catalogo-filtros.png`: catálogo con una categoría seleccionada.
3. `03-carrito.png`: bolsa con productos agregados.
4. `04-grafica.png`: gráfica de pedidos.
5. `05-responsive.png`: vista móvil o ventana estrecha.

## Publicación en GitHub
Crear un repositorio público llamado `aurum-co`, subir el contenido de esta carpeta y copiar su URL pública para entregarla en Canvas.
