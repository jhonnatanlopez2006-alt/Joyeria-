# Pruebas de Fase II

## Automatizadas
Ejecutar `npm test` (Node.js 20 o superior), seguido de `npm run check`. Los tests de `tests/shop.test.js` cubren filtros, normalización, ordenamiento, límites de stock, cantidades, cálculo de subtotal, integridad de almacenamiento, validación de pedido, creación de referencia, agenda y colisiones locales.

## Manuales (pendientes de ejecución por equipo)
No se presentan como ejecutadas. Probar en Chrome/Firefox y móvil 360, 768 y 1440 px:
1. Abrir la página por servidor local y navegar con enlaces, mouse y teclado.
2. Filtrar por anillos, buscar «lumiere», cambiar el orden y activar favoritos.
3. Agregar productos, aumentar/disminuir cantidades y comprobar límite de stock; recargar y comprobar persistencia.
4. Abrir/cerrar modales y carrito con Escape, clic fuera y teclado.
5. Intentar confirmar con nombre/correo inválidos y consentimiento desmarcado; corregir y registrar un pedido demo.
6. Copiar la referencia y consultarla en «Mis registros», refrescar y verificar el historial local.
7. Intentar reservar fecha antigua y horario ocupado; registrar y cancelar solicitud; comprobar persistencia local.
8. Comprobar que no se solicita tarjeta, no se crea pago ni se declara un envío de confirmación.
9. Inspeccionar consola y pestaña Network; comprobar gráficos con Chart.js disponible y fallback cuando no esté.
10. Verificar textos y botones accesibles, contrastes y la opción del sistema «reducir movimiento».

**Criterio de aprobación:** Las funciones se comportan como documentadas y los tests automatizados finalizan con código 0. La ausencia de API real debe permanecer explícita.
