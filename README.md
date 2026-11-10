# Joyería J-C — Fase II: evolución y desarrollo del producto web

**Universidad Manuela Beltrán · Ingeniería Web 2**  
**Repositorio original:** https://github.com/jhonnatanlopez2006-alt/Joyeria-  
**Estado:** Fase II · prototipo funcional de comercio electrónico con persistencia LOCAL de demostración.

## Integrantes
- Cristian David Cotrino Vásquez.
- Jhonnatan Alexander López.

> Responsabilidades específicas: el equipo debe registrar su distribución real de tareas. El historial de GitHub evidencia cambios, pero no permite atribuir automáticamente todo el desarrollo a ambos integrantes.

## 1. Proyecto, problema y objetivo
**Joyería J-C** es la evolución del escaparate digital de una joyería de estilo contemporáneo y lujo. Busca resolver la dificultad de explorar las piezas, compararlas y preparar una solicitud de compra o asesoría fuera del establecimiento físico.

**Objetivo:** ofrecer una experiencia responsiva y accesible para descubrir una colección, consultar detalles, crear una selección, explorar un proceso de pedido de demostración y registrar solicitudes de asesoría en el navegador.

**Alcance actual:** frontend interactivo con datos de catálogo ficticios, conservación de selecciones y registros en `localStorage`. No hay pago real, autenticación, sincronización de stock, despacho, servidor, reserva efectiva ni almacenamiento de datos del cliente.

## 2. Evolución desde Fase I
La primera fase contaba con página inicial, identidad J-C en negro/blanco/dorado, catálogo, filtros, carrito temporal, modales, animaciones y un panel con valores fijos simulados.

En la Fase II:
- Se conserva el mismo repositorio, la identidad visual y la fotografía original `assets/anillo-solitario-jc.jpg`.
- Se separan datos, servicios, reglas de negocio y utilidades en módulos ES.
- Se agregan favoritos, ordenamiento, búsqueda normalizada (tildes y mayúsculas) y contador de resultados.
- El carrito conserva productos entre recargas, gestiona cantidades, respeta el stock de demostración y calcula subtotales.
- Se incorpora un formulario de confirmación con validación y aceptación explícita de la naturaleza simulada.
- Los pedidos demo quedan guardados en el navegador, con referencia, historial y consulta por código.
- Se registra una solicitud local de asesoría con validación de campos, fecha, horarios y conflicto de reservas en el mismo navegador; permite cancelación.
- El panel deja de mostrar cantidades de pedidos inventadas y presenta registros locales. Gráfica con Chart.js cuando está disponible, con alternativa textual.
- Se amplía el diseño responsive, navegación por teclado y consideración por movimiento reducido.
- Se agregan pruebas automatizadas sin dependencias externas, validación de sintaxis, CI de GitHub Actions y documentación de arquitectura, requisitos, decisiones y pruebas.

## 3. Funcionalidades y estado
| Módulo | Estado | Limitación |
|---|---|---|
| Inicio, navegación, diseño responsive y animaciones | Implementado | Recursos visuales externos requieren conexión |
| Catálogo, detalle, filtros, búsqueda y orden | Implementado | Productos de demostración |
| Favoritos y carrito con cantidades | Implementado | `localStorage`, limitado al dispositivo/navegador |
| Validación y registro de pedido | Implementado como demo | Sin transacción, pago o backend |
| Historial y consulta por referencia | Implementado como demo | No consulta pedidos externos |
| Formulario de solicitud de asesoría y cancelación | Implementado como demo | Sin agenda real ni correo de confirmación |
| Indicadores y gráfica de pedidos | Implementado | Solo registros locales, no ventas reales |
| Autenticación, roles y administración de inventario | Pendiente | Planeado para fase posterior |
| API Flask + SQL Server | Pendiente | Planeado para fase posterior |

## 4. Tecnología, dependencias y arquitectura
- **Frontend:** HTML5, CSS3 y JavaScript nativo con módulos ECMAScript.
- **Persistencia temporal:** Web Storage (`localStorage`). Es una simulación, no un servidor.
- **Gráfica:** Chart.js por CDN; hay alternativa textual si no carga.
- **Fuentes:** Google Fonts (DM Sans, Playfair Display).
- **Testing:** Node.js 20+ con `node:test`, sin librerías de testing de terceros.
- **Control de versiones y CI:** GitHub y GitHub Actions.
- **Estrategia futura:** Python/Flask (API REST) y SQL Server, no implementados.

```text
Joyeria-/
├── index.html
├── favicon.svg
├── assets/
│   └── anillo-solitario-jc.jpg
├── css/
│   └── styles.css
├── js/
│   └── app.js                    # Controlador UI
├── src/
│   ├── data/products.js         # Catálogo de demostración
│   ├── models/shop.js           # Reglas funcionales y validaciones
│   ├── services/storage.js      # Persistencia local
│   └── utils/format.js          # Formato, fechas y escape
├── tests/shop.test.js
├── documentacion/
│   ├── arquitectura/README.md
│   ├── requerimientos/FASE_II.md
│   ├── decisiones_tecnicas/ADR-001-frontend.md
│   └── pruebas/PLAN.md
├── .github/workflows/quality.yml
├── .gitignore
├── package.json
└── README.md
```

**Decisión de arquitectura:** se conserva el stack original de la primera fase, reforzándolo con separación de responsabilidades. Esta app no requiere backend para demostrar interacciones locales; el plan para integrarlo se documenta en `documentacion/arquitectura/README.md`.

## 5. Instalación, configuración y ejecución
1. Clonar:
   ```bash
   git clone https://github.com/jhonnatanlopez2006-alt/Joyeria-.git
   cd Joyeria-
   ```
2. Requisito: navegador moderno y un servidor HTTP local. Para ejecutar pruebas se requiere **Node.js 20+**.
3. Ejecutar el servidor (Python 3):
   ```bash
   python -m http.server 5500
   ```
4. Abrir **http://localhost:5500**. Alternativamente, usar la extensión Live Server de VS Code.
5. Las rutas de módulos ES requieren servir la web por HTTP; no se recomienda abrir el HTML con protocolo `file://`.
6. No hay variables de entorno, credenciales ni base de datos que configurar. El catálogo es una demostración integrada.

### Comprobaciones de calidad
```bash
npm run check
npm test
```
Ambos comandos usan Node.js; `npm install` no es necesario porque no hay dependencias del proyecto. Las comprobaciones también están descritas en `.github/workflows/quality.yml`.

## 6. Pruebas y evidencias
- **Pruebas unitarias:** `tests/shop.test.js`: catálogo, búsqueda, favoritos, orden, límites de stock, totales, validación de pedido, agenda, persistencia y recuperación tras datos inválidos.
- **Validación de sintaxis:** `npm run check`.
- **CI:** `.github/workflows/quality.yml` ejecuta los tests cuando GitHub Actions puede iniciar el flujo.
- **Plan de pruebas manuales:** `documentacion/pruebas/PLAN.md`, incluyendo escritorio/móvil, teclado, recargas y formularios.

Los resultados reales deben verificarse en **Actions** y en el navegador. La presencia de un test no constituye por sí sola evidencia de aprobación. No se presentan capturas ni ensayos manuales como completados si no se han ejecutado.

## 7. Documentación técnica
- [Arquitectura y diagrama](documentacion/arquitectura/README.md)
- [Trazabilidad de requisitos](documentacion/requerimientos/FASE_II.md)
- [Decisión tecnológica](documentacion/decisiones_tecnicas/ADR-001-frontend.md)
- [Plan y casos de prueba](documentacion/pruebas/PLAN.md)

## 8. Registro de evolución (commits)
Los commits de la Fase I se conservan. La Fase II documenta incrementos con nombres convencionales (`refactor:`, `feat:`, `test:`, `docs:`). Para inspeccionar autores, fechas, archivos y hashes completos, consultar la pestaña **Commits** del repositorio. El cambio fue preparado en la rama `fase-ii/evolucion-web-2026` antes de integrarlo a la rama principal.

## 9. Privacidad, integridad y restricciones
- No se procesan pagos, tarjetas ni credenciales, ni se envían datos de formularios a un servidor.
- Los nombres y correos ingresados solo se usan para validar; **no se almacenan**.
- Los pedidos y solicitudes guardan identificadores, importes y datos de operación simulados; no tienen valor contractual.
- `localStorage` puede borrarse, falsificarse o no estar disponible. No sirve como fuente de inventario, identidad o pedidos reales.
- Las fotografías externas y recursos de CDN deben evaluarse en disponibilidad y derechos de uso antes de uso comercial.

## 10. Próximos pasos
1. Construir una API REST Flask y persistencia SQL Server con migraciones.
2. Incorporar autenticación real, roles y autorización del lado del servidor.
3. Implementar CRUD administrativo de inventario y pedidos y prevención de sobreventa con transacciones.
4. Integrar reservas con agenda multiusuario, notificaciones y trazabilidad.
5. Ampliar tests end-to-end, verificación de accesibilidad y despliegue automatizado.
6. Integrar pagos solo si el alcance futuro lo exige, mediante un proveedor autorizado.

## 11. Entrega en Canvas
**Integrantes:** Cristian David Cotrino Vásquez; Jhonnatan Alexander López.  
**Proyecto:** Joyería J-C.  
**Repositorio:** https://github.com/jhonnatanlopez2006-alt/Joyeria-  

**Resumen:** Se transformó el prototipo inicial en una vitrina modular y responsiva con catálogo avanzado, favoritos, carrito persistente, pedidos y citas de demostración, indicadores basados en registros locales y componentes accesibles. Se incorporaron pruebas automatizadas, flujo de calidad y documentación técnica para continuar con el backend en etapas posteriores.
