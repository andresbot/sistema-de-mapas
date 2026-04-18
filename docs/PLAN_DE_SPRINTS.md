# Planificacion de Sprints - Mapify
**Plataforma Web de Mapas y Resenas Locales · 2026**

---

## Resumen general

| Sprint | Foco | Semanas | Historias (HS) | Puntos |
|--------|------|---------|----------------|--------|
| Sprint 1 | Base tecnica + autenticacion | 1-2 | 8 | Pendiente de cierre |
| Sprint 2 | Mapa interactivo + comparticion | 3-4 | 4 | Pendiente de cierre |
| Sprint 3 | Lugares (CRUD) + perfil/favoritos | 5-6 | 6 | Pendiente de cierre |
| Sprint 4 | Resenas + moderacion | 7-8 | 6 | Pendiente de cierre |
| Sprint 5 | Filtros + UX + analitica | 9-10 | 8 | Pendiente de cierre |
| **Total** |  | **10 semanas** | **32** | **Pendiente de cierre** |

> Alcance del backlog integrado: **32 historias (HS1-HS32)**.
> Todas las historias se ejecutan dentro de los 5 sprints existentes.

---

## Sprint 1 - Base tecnica y autenticacion

**Semanas:** 1-2 · **Milestone:** Sprint 1 - Base + Auth · **Historias:** 8

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
| HS24 | Recuperar contrasena | Auth |

### Criterios de exito del sprint

- [ ] Registro, login, persistencia y logout funcionando de extremo a extremo.
- [ ] Arquitectura base del proyecto definida y documentada.
- [ ] Base de datos MySQL conectada mediante Prisma ORM.
- [ ] Flujo de autenticacion protegido con JWT.
- [ ] Flujo de recuperacion de contrasena operativo.

---

## Sprint 2 - Mapa interactivo

**Semanas:** 3-4 · **Milestone:** Sprint 2 - Mapa · **Historias:** 4

**Objetivo:** Entregar una experiencia de exploracion geoespacial funcional con mapa, marcadores y navegacion base.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS5 | Mapa interactivo | Frontend |
| HS6 | Marcadores en el mapa | Frontend + Backend |
| HS7 | Navegacion del mapa | Frontend |
| HS28 | Compartir lugar | Frontend |

### Criterios de exito del sprint

- [ ] El mapa carga correctamente en la vista principal.
- [ ] Se visualizan marcadores de lugares sin errores criticos.
- [ ] La navegacion (zoom/movimiento/enfoque) es estable y usable.
- [ ] Comparticion por enlace del lugar funcionando correctamente.

---

## Sprint 3 - Lugares (CRUD)

**Semanas:** 5-6 · **Milestone:** Sprint 3 - Lugares (CRUD) · **Historias:** 6

**Objetivo:** Implementar gestion completa de lugares para crear, consultar, editar y eliminar informacion de forma consistente.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS8 | Ver detalle de lugar | Frontend |
| HS9 | Crear lugar | Frontend + Backend |
| HS10 | Editar lugar | Frontend + Backend |
| HS11 | Eliminar lugar | Backend |
| HS25 | Ver perfil publico de negocio | Frontend + Backend |
| HS27 | Guardar lugares en favoritos | Frontend + Backend |

### Criterios de exito del sprint

- [ ] Se puede crear un lugar con validaciones minimas de datos.
- [ ] El detalle de lugar muestra informacion completa y consistente.
- [ ] La edicion y eliminacion funcionan sin romper integridad de datos.
- [ ] Operaciones CRUD trazables en el tablero del sprint.
- [ ] Perfil publico de negocio y favoritos operativos.

---

## Sprint 4 - Resenas y reputacion

**Semanas:** 7-8 · **Milestone:** Sprint 4 - Resenas · **Historias:** 6

**Objetivo:** Habilitar la capa de reputacion del producto mediante visualizacion, creacion, calificacion y eliminacion de reseñas.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS12 | Ver reseñas | Frontend |
| HS13 | Crear reseña | Frontend + Backend |
| HS14 | Calificacion con estrellas | Frontend |
| HS15 | Eliminar reseña | Backend |
| HS26 | Reportar resena inapropiada | Frontend + Backend |
| HS29 | Moderar contenido reportado | Backend + Admin |

### Criterios de exito del sprint

- [ ] Las reseñas se listan correctamente por lugar.
- [ ] Usuarios pueden crear reseñas con puntaje valido.
- [ ] Componente de estrellas funcional y consistente.
- [ ] Eliminacion de reseñas con control basico de permisos.
- [ ] Flujo de reporte y moderacion de contenido disponible.

---

## Sprint 5 - Filtros, UX y cierre MVP

**Semanas:** 9-10 · **Milestone:** Sprint 5 - Filtros + UX · **Historias:** 8

**Objetivo:** Cerrar el MVP con mejora de descubrimiento y experiencia de uso: filtros, busqueda, responsive, navegacion clara y feedback visual.

### Historias

| ID | Historia | Rol/Area |
|----|----------|----------|
| HS16 | Filtrar por categoria | Frontend + Backend |
| HS17 | Busqueda por nombre | Frontend + Backend |
| HS18 | Diseno responsive | Frontend |
| HS19 | Navegacion clara | Frontend |
| HS20 | Feedback visual | Frontend |
| HS30 | Ver metricas de visibilidad del negocio | Frontend + Backend |
| HS31 | Recomendaciones personalizadas de lugares | Frontend + Backend |
| HS32 | Notificaciones de actividad relevante | Frontend + Backend |

### Criterios de exito del sprint

- [ ] Filtro por categoria y busqueda por nombre operativos y combinables.
- [ ] Interfaz responsive validada en movil y escritorio.
- [ ] Navegacion clara entre vistas principales del sistema.
- [ ] Feedback visual implementado para estados clave (carga, exito, error).
- [ ] Metricas, recomendaciones y notificaciones integradas en el flujo de usuario.

---

## Integracion de HS24-HS32

Las historias HS24-HS32 se ejecutan dentro de Sprint 1-5 para mantener un unico ciclo de entrega.

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
