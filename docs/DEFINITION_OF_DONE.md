# Definition of Done (DoD)
**Mapify - Plataforma Web de Mapas y Resenas Locales**

Version: 1.0  
Fecha: 15 de abril de 2026  
Estado: Aprobado para uso del equipo Scrum

---

## 1. Proposito
La Definition of Done (DoD) define formalmente cuando una tarea, historia o incremento de sprint puede considerarse terminado.  
Un item solo se marca como Done si cumple todos los criterios aplicables de esta lista.

---

## 2. Alcance de aplicacion
Esta DoD aplica a:
- Tareas tecnicas (issues TEC)
- Historias del backlog (HS)
- Incrementos de sprint
- Entrega final del MVP

---

## 3. DoD por nivel

### A. Nivel Tarea (Task / Issue Tecnica)
Para marcar una tarea como Done, debe cumplir:

- [ ] Implementacion completa segun criterio tecnico definido (issue, historia o sub-tarea de sprint).
- [ ] Codigo en backend y/o frontend funcionando localmente sin errores bloqueantes.
- [ ] Estilo y convenciones del proyecto respetadas (backend: estandar del equipo; frontend: lint/formato del equipo).
- [ ] Codigo revisado por al menos una persona del equipo (peer review).
- [ ] Sin credenciales ni secretos expuestos en codigo o commits.
- [ ] Pruebas unitarias o tecnicas minimas ejecutadas y en verde para el cambio realizado.
- [ ] Documentacion tecnica breve actualizada si el cambio afecta arquitectura, endpoint, modelo o flujo.
- [ ] Estado actualizado en GitHub Issues/Projects (enlace, responsable, estado Done).

### B. Nivel Historia (HS)
Para marcar una historia como Done, debe cumplir:

- [ ] Todos los criterios de aceptacion (Conversation/Confirmation) verificados.
- [ ] Flujo end-to-end funcional (frontend + backend + datos).
- [ ] Validaciones funcionales y de negocio implementadas (ejemplo: auth, permisos, filtros, consistencia de datos).
- [ ] Pruebas de integracion del flujo principal ejecutadas sin errores criticos.
- [ ] Evidencia de funcionamiento disponible (capturas, video corto o registro de prueba).
- [ ] Aprobacion funcional del Product Owner en Sprint Review.

### C. Nivel Sprint
Para considerar un sprint como Done, debe cumplir:

- [ ] Historias comprometidas finalizadas o desvio comunicado y aceptado por Product Owner.
- [ ] Build e integracion continua en estado exitoso (lint, test, build) en rama principal.
- [ ] Incremento desplegado y accesible en entorno definido (staging o produccion academica).
- [ ] Sprint Review realizada con demostracion funcional.
- [ ] Retrospectiva realizada y al menos una accion de mejora definida.
- [ ] Backlog y tablero actualizados con trazabilidad de decisiones.

### D. Nivel Entrega Final (MVP)
Para considerar la entrega final como Done, debe cumplir:

- [ ] Modulos MVP operativos: auth, mapa interactivo, marcadores, CRUD de lugares, reseñas, filtros y mejoras UX.
- [ ] Pruebas de aceptacion con usuarios reales ejecutadas y documentadas.
- [ ] Criterio de equidad aplicado: lugares con menos de 5 reseñas aparecen en al menos 30% de resultados relevantes.
- [ ] Cobertura objetivo alcanzada para servicios criticos del backend (segun definicion del proyecto).
- [ ] Cero errores criticos abiertos al cierre de entrega.
- [ ] Documentacion minima completa: instalacion, arquitectura, alcance/MVP y trazabilidad funcional.
- [ ] Repositorio entregado con historial y pipeline de CI/CD activo.

---

## 4. Criterios de bloqueo (No Done)
Un item no puede cerrarse como Done si ocurre cualquiera de estos casos:
- Tiene criterios de aceptacion pendientes.
- Rompe funcionalidad existente o introduce regresiones criticas.
- Tiene fallos en pruebas clave o pipeline en rojo.
- No fue revisado o no tiene evidencia de prueba.
- Carece de trazabilidad en tablero/issue.

---

## 5. Responsables de validacion
- Equipo de Desarrollo: valida cumplimiento tecnico.
- Scrum Master: valida proceso y ceremonias.
- Product Owner: valida cumplimiento funcional y aprueba cierre de historia/incremento.

---

## 6. Regla de uso
Si hay duda sobre cerrar un item, se aplica esta regla:

**Si no cumple todos los checks aplicables, no esta Done.**

---

## 7. Revision de la DoD
Esta DoD es un artefacto vivo y puede ajustarse en retrospectiva por acuerdo entre Product Owner, Scrum Master y Equipo de Desarrollo.
Frecuencia recomendada de revision: al cierre de cada sprint.
