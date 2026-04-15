# Planificacion de Sprints - MVP Mapify
**Plataforma Web de Mapas y Resenas Locales · 2026**

---

## Resumen general

| Sprint | Foco | Semanas | Historias (HS) | Puntos |
|--------|------|---------|----------------|--------|
| Sprint 1 | Base tecnica + autenticacion | 1-2 | 7 | Pendiente de cierre |
| Sprint 2 | Mapa interactivo | 3-4 | 3 | Pendiente de cierre |
| Sprint 3 | Lugares (CRUD) | 5-6 | 4 | Pendiente de cierre |
| Sprint 4 | Resenas y reputacion | 7-8 | 4 | Pendiente de cierre |
| Sprint 5 | Filtros + UX + cierre MVP | 9-10 | 5 | Pendiente de cierre |
| **Total** |  | **10 semanas** | **23** | **Pendiente de cierre** |

---

## Sprint 1 - Base tecnica y autenticacion

**Semanas:** 1-2 · **Milestone:** Sprint 1 - Base + Auth · **Historias:** 7

**Objetivo:** Dejar operativa la base del sistema con arquitectura frontend/backend, autenticacion de usuarios y configuracion de base de datos para habilitar el resto de funcionalidades del MVP.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS1 | Registro de usuario | Frontend + Backend |
| HS2 | Login | Frontend + Backend |
| HS3 | Persistencia de sesion (JWT) | Auth |
| HS4 | Logout | Frontend + Auth |
| HS21 | Arquitectura frontend y backend | Base tecnica |
| HS22 | Configurar MySQL con Prisma ORM | Backend + BD |
| HS23 | Modelar base de datos completa con Prisma | Backend + BD |

### Criterios de exito del sprint

- [ ] Registro, login, persistencia y logout funcionando de extremo a extremo.
- [ ] Arquitectura base del proyecto definida y documentada.
- [ ] Base de datos MySQL conectada mediante Prisma ORM.
- [ ] Flujo de autenticacion protegido con JWT.

---

## Sprint 2 - Mapa interactivo

**Semanas:** 3-4 · **Milestone:** Sprint 2 - Mapa · **Historias:** 3

**Objetivo:** Entregar una experiencia de exploracion geoespacial funcional con mapa, marcadores y navegacion base.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS5 | Mapa interactivo | Frontend |
| HS6 | Marcadores en el mapa | Frontend + Backend |
| HS7 | Navegacion del mapa | Frontend |

### Criterios de exito del sprint

- [ ] El mapa carga correctamente en la vista principal.
- [ ] Se visualizan marcadores de lugares sin errores criticos.
- [ ] La navegacion (zoom/movimiento/enfoque) es estable y usable.

---

## Sprint 3 - Lugares (CRUD)

**Semanas:** 5-6 · **Milestone:** Sprint 3 - Lugares (CRUD) · **Historias:** 4

**Objetivo:** Implementar gestion completa de lugares para crear, consultar, editar y eliminar informacion de forma consistente.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS8 | Ver detalle de lugar | Frontend |
| HS9 | Crear lugar | Frontend + Backend |
| HS10 | Editar lugar | Frontend + Backend |
| HS11 | Eliminar lugar | Backend |

### Criterios de exito del sprint

- [ ] Se puede crear un lugar con validaciones minimas de datos.
- [ ] El detalle de lugar muestra informacion completa y consistente.
- [ ] La edicion y eliminacion funcionan sin romper integridad de datos.
- [ ] Operaciones CRUD trazables en el tablero del sprint.

---

## Sprint 4 - Resenas y reputacion

**Semanas:** 7-8 · **Milestone:** Sprint 4 - Resenas · **Historias:** 4

**Objetivo:** Habilitar la capa de reputacion del producto mediante visualizacion, creacion, calificacion y eliminacion de reseñas.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS12 | Ver reseñas | Frontend |
| HS13 | Crear reseña | Frontend + Backend |
| HS14 | Calificacion con estrellas | Frontend |
| HS15 | Eliminar reseña | Backend |

### Criterios de exito del sprint

- [ ] Las reseñas se listan correctamente por lugar.
- [ ] Usuarios pueden crear reseñas con puntaje valido.
- [ ] Componente de estrellas funcional y consistente.
- [ ] Eliminacion de reseñas con control basico de permisos.

---

## Sprint 5 - Filtros, UX y cierre MVP

**Semanas:** 9-10 · **Milestone:** Sprint 5 - Filtros + UX · **Historias:** 5

**Objetivo:** Cerrar el MVP con mejora de descubrimiento y experiencia de uso: filtros, busqueda, responsive, navegacion clara y feedback visual.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS16 | Filtrar por categoria | Frontend + Backend |
| HS17 | Busqueda por nombre | Frontend + Backend |
| HS18 | Diseno responsive | Frontend |
| HS19 | Navegacion clara | Frontend |
| HS20 | Feedback visual | Frontend |

### Criterios de exito del sprint

- [ ] Filtro por categoria y busqueda por nombre operativos y combinables.
- [ ] Interfaz responsive validada en movil y escritorio.
- [ ] Navegacion clara entre vistas principales del sistema.
- [ ] Feedback visual implementado para estados clave (carga, exito, error).

---

## Definicion de listo (Definition of Ready)

Una historia entra al sprint solo si:

- [ ] Esta estimada en puntos de historia o marcada para estimacion en planning.
- [ ] Tiene criterios de aceptacion definidos y entendidos por el equipo.
- [ ] Sus dependencias tecnicas estan resueltas o explicitamente gestionadas.
- [ ] Cuenta con alcance claro para dividirse en tareas tecnicas.

## Definicion de hecho (Definition of Done)

Una historia se considera terminada cuando:

- [ ] El codigo pasa revision por pares (pull request aprobado).
- [ ] Las pruebas tecnicas requeridas del cambio estan en verde.
- [ ] La funcionalidad es verificable en entorno de desarrollo/staging.
- [ ] El Product Owner valida el comportamiento segun criterios de aceptacion.

---

Mapify S.A.S. · Planificacion Scrum MVP · 2026
