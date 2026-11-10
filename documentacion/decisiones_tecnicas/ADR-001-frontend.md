# ADR-001: Conservar el frontend ligero de Fase I
**Estado:** Aceptada, Fase II.

**Contexto:** El proyecto ya tenía una vitrina visual propia basada en HTML, CSS y JavaScript. La rúbrica exige evolución, modularidad y funcionalidades verificables.

**Decisión:** Conservar el stack y separar los módulos en `src/data`, `src/models`, `src/services`, `src/utils`, dejando `js/app.js` como controlador de interfaz. Usar módulos ECMAScript nativos, `localStorage` para una demo autónoma y `node:test` para pruebas sin dependencias externas.

**Consecuencias:** Arranque rápido y despliegue estático; no se requiere bundler. Se necesita servir la página por HTTP para la carga de módulos. La persistencia no garantiza integridad ni multiusuario y no se deben simular servicios comerciales reales.

**Alternativas descartadas por ahora:** Migración sin necesidad demostrada a React y backend incompleto sin infraestructura ni credenciales.
