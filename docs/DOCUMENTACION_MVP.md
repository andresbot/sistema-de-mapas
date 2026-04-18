# Plan de Historias - Mapify
**Plataforma Web de Mapas y Resenas Locales · 2026**

---

## Objetivo del plan

Entregar un sistema funcional de extremo a extremo que permita: autenticacion de usuarios, exploracion de lugares en mapa interactivo, gestion de lugares (CRUD), gestion de resenas y consulta mediante filtros y busqueda por nombre.

---

## Alcance funcional

El plan cubre **32 historias** (HS1-HS32) correspondientes al backlog integrado del proyecto. La entrega se organiza en los **5 sprints existentes** del ciclo academico.

### Flujo cubierto

```text
Autenticacion -> Mapa -> Lugares (CRUD) -> Resenas -> Filtros y UX
```

---

## Historias incluidas

| ID | Historia | Milestone | Sprint | Prioridad |
|----|----------|-----------|--------|-----------|
| HS1 | Registro de usuario | Sprint 1 - Base + Auth | 1 | Must have |
| HS2 | Login | Sprint 1 - Base + Auth | 1 | Must have |
| HS3 | Persistencia de sesion (JWT) | Sprint 1 - Base + Auth | 1 | Must have |
| HS4 | Logout | Sprint 1 - Base + Auth | 1 | Must have |
| HS21 | Arquitectura frontend y backend | Sprint 1 - Base + Auth | 1 | Must have |
| HS22 | Configurar MySQL con Prisma ORM | Sprint 1 - Base + Auth | 1 | Must have |
| HS23 | Modelar base de datos completa con Prisma | Sprint 1 - Base + Auth | 1 | Must have |
| HS5 | Mapa interactivo | Sprint 2 - Mapa | 2 | Must have |
| HS6 | Marcadores en el mapa | Sprint 2 - Mapa | 2 | Must have |
| HS7 | Navegacion del mapa | Sprint 2 - Mapa | 2 | Must have |
| HS8 | Ver detalle de lugar | Sprint 3 - Lugares (CRUD) | 3 | Must have |
| HS9 | Crear lugar | Sprint 3 - Lugares (CRUD) | 3 | Must have |
| HS10 | Editar lugar | Sprint 3 - Lugares (CRUD) | 3 | Must have |
| HS11 | Eliminar lugar | Sprint 3 - Lugares (CRUD) | 3 | Must have |
| HS12 | Ver resenas | Sprint 4 - Resenas | 4 | Must have |
| HS13 | Crear resena | Sprint 4 - Resenas | 4 | Must have |
| HS14 | Calificacion con estrellas | Sprint 4 - Resenas | 4 | Must have |
| HS15 | Eliminar resena | Sprint 4 - Resenas | 4 | Must have |
| HS16 | Filtrar por categoria | Sprint 5 - Filtros + UX | 5 | Must have |
| HS17 | Busqueda por nombre | Sprint 5 - Filtros + UX | 5 | Must have |
| HS18 | Diseno responsive | Sprint 5 - Filtros + UX | 5 | Must have |
| HS19 | Navegacion clara | Sprint 5 - Filtros + UX | 5 | Must have |
| HS20 | Feedback visual | Sprint 5 - Filtros + UX | 5 | Must have |
| HS24 | Recuperar contrasena | Sprint 1 - Base + Auth | 1 | Should have |
| HS25 | Ver perfil publico de negocio | Sprint 3 - Lugares (CRUD) | 3 | Should have |
| HS26 | Reportar resena inapropiada | Sprint 4 - Resenas | 4 | Should have |
| HS27 | Guardar lugares en favoritos | Sprint 3 - Lugares (CRUD) | 3 | Should have |
| HS28 | Compartir lugar | Sprint 2 - Mapa | 2 | Could have |
| HS29 | Moderar contenido reportado | Sprint 4 - Resenas | 4 | Should have |
| HS30 | Ver metricas de visibilidad del negocio | Sprint 5 - Filtros + UX | 5 | Should have |
| HS31 | Recomendaciones personalizadas de lugares | Sprint 5 - Filtros + UX | 5 | Could have |
| HS32 | Notificaciones de actividad relevante | Sprint 5 - Filtros + UX | 5 | Could have |
| **Total** |  |  | **32 historias** |  |

---

## Historias excluidas

En la version actual del plan no hay historias excluidas: todas las HS1-HS32 forman parte del backlog integrado.

| ID | Historia | Razon de exclusion |
|----|----------|--------------------|
| N/A | No aplica | Todas las historias del backlog se encuentran planificadas |

---

## Resumen de esfuerzo

| Concepto | Valor |
|----------|-------|
| Historias incluidas en el plan | 32 de 32 |
| Historias diferidas | 0 |
| Cobertura del backlog total | 100% |
| Sprints planificados | 5 |
| Duracion estimada | 10 semanas (2 semanas por sprint) |

---

## Criterios de exito

1. Un usuario puede autenticarse correctamente (registro/login/logout) y mantener sesion de forma estable.
2. El sistema permite explorar lugares en mapa interactivo y visualizar marcadores y detalle de lugar sin errores criticos.
3. El flujo completo de gestion de lugares y resenas (crear, ver, editar/eliminar donde aplique) funciona de extremo a extremo.
4. Los filtros por categoria, busqueda por nombre y mejoras de UX permiten una experiencia usable en desktop y movil.
5. Las historias HS24-HS32 quedan integradas y trazadas dentro de los cinco sprints existentes.

---

Mapify S.A.S. · Ejercicio academico 2026
