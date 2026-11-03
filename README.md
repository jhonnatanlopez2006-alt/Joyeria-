# Joyería J-C — Microproyecto web

**Universidad Manuela Beltrán · Ingeniería Web 2**  
**Entrega 1: Diseño del microproyecto web**

## Integrantes
- Cristian David Cotrino Vásquez
- Jhonnatan Alexander López

## 1. Descripción del proyecto
Joyería J-C es un prototipo web de comercio electrónico para una joyería de lujo. Presenta una colección digital de anillos, cadenas, collares, pulseras y aretes. Permite explorar los productos, consultar precios y disponibilidad demostrativa, preparar una bolsa de compra y simular la confirmación de un pedido.

## 2. Necesidad identificada
Digitalizar la experiencia de venta y atención de una joyería mediante una plataforma elegante, segura, accesible y adaptable. Se busca facilitar la consulta de piezas y reducir la dependencia de la tienda física, además de ofrecer información para asesoría personalizada.

## 3. Objetivo del proyecto
Diseñar e implementar progresivamente una plataforma web que permita a los clientes explorar el catálogo, consultar detalles y disponibilidad, preparar pedidos y acceder a información de asesoría. En una siguiente fase, el administrador podrá gestionar productos, inventario y pedidos desde un panel.

## 4. Requerimientos del sistema

### 4.1 Requerimientos funcionales definidos en la ficha técnica
1. Registro e inicio de sesión con roles de cliente y administrador.
2. Catálogo de productos con filtros y búsqueda.
3. Consulta de detalles y disponibilidad de cada pieza.
4. Carrito de compras y generación de pedidos.
5. Panel de administración de productos, inventario y pedidos.
6. Agendamiento de citas de asesoría.
7. Consulta del estado del pedido.

### 4.2 Requerimientos no funcionales
- Diseño adaptable a móviles, tabletas y computadores.
- Estética de lujo, clara, consistente y fácil de navegar.
- Validación de datos y manejo de errores.
- Protección de credenciales y sesiones.
- Restricción de funciones según el perfil.
- Código modular, mantenible y documentado.

## 5. Arquitectura web propuesta

| Componente | Tecnología propuesta | Responsabilidad |
|---|---|---|
| Frontend | HTML5, CSS3 y JavaScript | Interfaz y navegación del catálogo |
| Backend | Python con Flask | Reglas de negocio y API |
| Base de datos | SQL Server | Usuarios, productos, inventario y pedidos |
| Control de acceso | Sesiones y roles | Restringir funciones según perfil |
| Versionamiento | Git y GitHub | Historial y colaboración |

**Estado de esta entrega:** el repositorio contiene un prototipo frontend. Flask, SQL Server, autenticación real, persistencia de datos y administración son componentes propuestos para las siguientes iteraciones; todavía no están implementados.

## 6. Funcionalidades presentes en el prototipo
- Navegación por las secciones de inicio, colección, esencia y asesoría.
- Catálogo demostrativo de anillos, collares, pulseras y aretes.
- Filtros por categoría y búsqueda por nombre o categoría.
- Visualización de precios en pesos colombianos (COP) y disponibilidad simulada.
- Carrito con agregado y eliminación de productos.
- Cálculo automático del total de la bolsa.
- Confirmación de pedido simulada, sin transacción ni pago real.
- Panel demostrativo de indicadores y gráfica interactiva con Chart.js.
- Diseño responsive para escritorio, tablet y móvil.
- Animaciones de entrada, efectos al desplazarse, transiciones y estados hover.
- Sección audiovisual con video de una joya en reproducción automática silenciosa y en bucle, contenida en una proporción 16:9 para evitar desbordamientos.
- Ficha de detalle de cada producto con imagen ampliada, categoría, precio, disponibilidad y opción para agregarlo a la bolsa.
- Favicon SVG personalizado con monograma J-C.
- Paleta minimalista en blanco, gris y negro con acentos dorados puntuales.
- Recomendaciones básicas para el cuidado de las joyas.

## 7. Tecnologías y herramientas
- HTML5 y CSS3.
- JavaScript.
- Chart.js mediante CDN.
- Google Fonts: DM Sans y Playfair Display.
- Git y GitHub.
- Visual Studio Code como editor recomendado.

## 8. Estructura del proyecto

```text
Joyeria-/
├── index.html
├── favicon.svg
├── README.md
├── css/
│   └── styles.css
└── js/
    └── app.js
```

## 9. Instalación y ejecución local
1. Clonar el repositorio:

   ```bash
   git clone https://github.com/jhonnatanlopez2006-alt/Joyeria-.git
   ```

2. Ingresar a la carpeta:

   ```bash
   cd Joyeria-
   ```

3. Abrir el proyecto en Visual Studio Code.
4. Ejecutar `index.html` con Live Server o abrirlo directamente en un navegador actualizado.
5. Para visualizar la gráfica, permitir la carga de Chart.js desde su CDN.

Esta entrega no requiere instalar Flask ni configurar SQL Server.

## 10. Alcance y limitaciones
Este proyecto es un prototipo académico frontend. Los productos, existencias, indicadores y pedidos son datos de demostración. No se procesan pagos, no se generan órdenes persistentes, no existe autenticación real ni conexión a una base de datos o inventario físico. Tampoco están desarrollados todavía el backend Flask, los roles, el panel administrativo ni la agenda funcional de citas.

Las fotografías, el video de joyería y las fuentes tipográficas se cargan desde servicios externos, por lo que requieren conexión a internet. El video está configurado en modo silencioso, reproducción automática y bucle; algunos navegadores pueden bloquear la reproducción automática. El favicon personalizado está definido en `favicon.svg`. Antes de una publicación comercial se deben verificar las licencias, disponibilidad y derechos de uso de los recursos visuales.

## 11. Historial de commits
El historial consultado del repositorio contiene el commit inicial:

| Commit | Descripción |
|---|---|
| `e436423` | `Add files via upload` — carga inicial de los archivos del prototipo. |
| `16940b9` | `Rebrand site as Joyería J-C` — actualización del nombre y la identidad del sitio. |
| `06313ba` | `Refresh Joyería J-C luxury visual design and animations` — renovación de estilos, colores y efectos visuales. |
| `7d2231a` | `Add scroll reveal and accessible menu animation` — animaciones de aparición y mejora del menú móvil. |
| `433f3b1` | `Update README with Joyería J-C requirements and project scope` — documentación alineada con la ficha técnica. |
| `fe7e2f7` | `Polish Joyería J-C brand lockup` — ajuste del logotipo tipográfico. |
| `7f704ed` | `Record actual project commit history in README` — actualización del historial documentado. |
| `2299303` | `Finalize J-C footer mark and remove placeholder contact address` — ajuste final del logotipo y enlace de colección. |

Los identificadores se muestran abreviados para facilitar la lectura. El historial completo, con hashes y fechas exactos, está disponible en la pestaña **Commits** del repositorio.

## 12. Evidencias sugeridas para la entrega
1. Página de inicio y encabezado de Joyería J-C.
2. Sección de video con proporción adaptable.
3. Catálogo con filtros, búsqueda y acceso a detalles de cada pieza.
4. Ficha de producto y bolsa de compra con productos agregados y total.
5. Panel demostrativo y vista responsive en un dispositivo móvil.

## 13. Resultado esperado
Un prototipo web funcional a nivel de frontend, visualmente profesional y adaptable, que sirva como base para integrar autenticación, backend en Flask, base de datos SQL Server, gestión de inventario, pedidos y citas de asesoría.

## 14. Conclusión
Joyería J-C integra diseño de interfaces, desarrollo frontend, interactividad y control de versiones para responder a la necesidad de llevar la experiencia de una joyería de lujo al entorno digital. Esta versión establece una base documentada para continuar con los componentes de backend y persistencia definidos en la ficha técnica.
