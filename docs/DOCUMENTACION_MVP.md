# Plan MVP - Mapify
**Plataforma Web de Mapas y Resenas Locales · 2026**

---

## Objetivo del MVP

Entregar un sistema funcional de extremo a extremo que permita: autenticacion de usuarios, exploracion de lugares en mapa interactivo, gestion de lugares (CRUD), gestion de resenas y consulta mediante filtros y busqueda por nombre.

---

## Alcance del MVP

El MVP cubre **23 historias** (HS1-HS23) correspondientes al backlog priorizado del proyecto en 5 sprints. El criterio de seleccion garantiza que el flujo critico completo quede operativo desde el primer release.

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
| **Total** |  |  | **23 historias** |  |

---

## Historias excluidas del MVP (Fase 2)

En la version actual del backlog no hay historias adicionales fuera de HS1-HS23. Por lo tanto, **no hay exclusiones formales** para esta entrega MVP.

| ID | Historia | Razon de exclusion |
|----|----------|--------------------|
| N/A | No aplica | El alcance MVP actual contempla todas las historias planificadas en milestones activos |

---

## Resumen de esfuerzo

| Concepto | Valor |
|----------|-------|
| Historias incluidas en MVP | 23 de 23 |
| Historias diferidas a Fase 2 | 0 |
| Cobertura del backlog actual | 100% |
| Sprints planificados | 5 |
| Duracion estimada | 10 semanas (2 semanas por sprint) |

---

## Criterios de exito del MVP

1. Un usuario puede autenticarse correctamente (registro/login/logout) y mantener sesion de forma estable.
2. El sistema permite explorar lugares en mapa interactivo y visualizar marcadores y detalle de lugar sin errores criticos.
3. El flujo completo de gestion de lugares y resenas (crear, ver, editar/eliminar donde aplique) funciona de extremo a extremo.
4. Los filtros por categoria, busqueda por nombre y mejoras de UX permiten una experiencia usable en desktop y movil.

---

Mapify S.A.S. · Ejercicio academico 2026
