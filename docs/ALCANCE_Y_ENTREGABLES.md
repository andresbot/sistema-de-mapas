# Alcance y Entregables del Proyecto
**Plataforma Web de Mapas y Resenas Locales - Mapify**

---

| Campo | Detalle |
|---|---|
| **Cliente (Product Owner)** | Proyecto academico - Gestion de Proyectos |
| **Desarrollador** | Mapify S.A.S. |
| **Metodologia** | SCRUM - 5 sprints de 2 semanas |
| **Fecha de inicio** | 16 de marzo de 2026 |
| **Fecha de entrega final** | 8 de junio de 2026 |
| **Version del documento** | v1.1 - abril 2026 |

> **Nota Scrum:** Este documento define intenciones y limites. El alcance es variable y flexible; el tiempo y el costo son fijos. Cualquier cambio de alcance debe ser acordado entre Product Owner y Scrum Master antes del Sprint Planning correspondiente.

---

## 1. Resumen Ejecutivo

### 1.1. Declaracion de Vision del Producto

Proporcionar una plataforma web que centralice el descubrimiento de lugares locales en un mapa interactivo, permitiendo registrar negocios, categorizarlos, publicar reseñas y consultar informacion util de manera rapida. El sistema debe reducir la dispersion de informacion, aumentar la visibilidad de negocios emergentes y ofrecer una experiencia usable desde dispositivos moviles y escritorio, con base tecnica escalable para futuras iteraciones.

### 1.2. Objetivos Estrategicos

- Entregar un MVP funcional en 5 sprints con mapa interactivo, categorias, filtros y modulo de resenas.
- Lograr el registro minimo de **20 lugares** con informacion valida para la salida beta.
- Alcanzar al menos **30 resenas** durante la etapa inicial de pruebas con usuarios.
- Garantizar que los lugares con menos de 5 resenas aparezcan en al menos **30 %** de resultados relevantes, segun regla de equidad definida.
- Mantener tiempo de carga del mapa menor a **3 segundos** en condiciones normales de red.

---

## 2. Stakeholders

| Rol | Nombre / Cargo | Responsabilidad en el proyecto |
|---|---|---|
| Product Owner (PO) | Representante academico del proyecto | Define y prioriza Product Backlog. Aprueba entregables por sprint. |
| Scrum Master | Integrante del equipo Mapify designado | Facilita ceremonias Scrum, elimina impedimentos y protege el proceso. |
| Equipo de desarrollo | Desarrolladores de Mapify S.A.S. | Diseñan, construyen, prueban y despliegan incrementos por sprint. |
| Usuarios clave | Comerciantes y administradores locales invitados | Validan utilidad del registro de lugares y calidad de resultados. |
| Usuarios finales | Comunidad local (visitantes y residentes) | Consultan lugares, filtran informacion y publican resenas. |
| Supervisor docente | Docente de Gestion de Proyectos de Software | Supervisa el proceso academico y evalua la gestion del equipo. |

---

## 3. Product Backlog - Alcance Funcional

> El Product Backlog es dinamico. Las epicas representan bloques de alto valor y su orden se ajusta por prioridad del Product Owner.

### 3.1. Epicas del Sistema

| Epica | Descripcion | Milestone | Historias incluidas | Prioridad |
|---|---|---|---|---|
| **E1 - Base + Auth + Arquitectura tecnica** | Registro/inicio/cierre de sesion, persistencia JWT, arquitectura inicial del proyecto y configuracion de base de datos con Prisma. | Sprint 1 - Base + Auth | HS1, HS2, HS3, HS4, HS21, HS22, HS23 | Must have |
| **E2 - Mapa interactivo** | Implementacion del mapa base, marcadores de lugares y navegacion del mapa. | Sprint 2 - Mapa | HS5, HS6, HS7 | Must have |
| **E3 - Lugares (CRUD)** | Gestion completa de lugares: ver detalle, crear, editar y eliminar. | Sprint 3 - Lugares (CRUD) | HS8, HS9, HS10, HS11 | Must have |
| **E4 - Resenas y reputacion** | Visualizacion, creacion, calificacion por estrellas y eliminacion de resenas. | Sprint 4 - Resenas | HS12, HS13, HS14, HS15 | Must have |
| **E5 - Filtros + UX** | Filtro por categoria, busqueda por nombre y mejoras de experiencia de usuario (responsive, navegacion y feedback visual). | Sprint 5 - Filtros + UX | HS16, HS17, HS18, HS19, HS20 | Must have |

### 3.1.1. Historias adicionales integradas en Sprint 1-5

| Epica | Descripcion | Sprint de ejecucion | Historias incluidas | Prioridad |
|---|---|---|---|---|
| **E6 - Seguridad y cuentas** | Recuperacion de contrasena y gestion de acceso complementaria. | Sprint 1 | HS24 | Should have |
| **E7 - Comunidad y moderacion** | Perfil publico de negocio, reportes, moderacion y comparticion. | Sprint 2-4 | HS25, HS26, HS28, HS29 | Should have |
| **E8 - Engagement y crecimiento** | Favoritos, metricas, recomendaciones y notificaciones. | Sprint 3-5 | HS27, HS30, HS31, HS32 | Could/Should have |

### 3.2. MVP - Minimo Producto Viable

El MVP incluye las historias minimas para operar el flujo de extremo a extremo: explorar, filtrar, evaluar y consultar.

| HS | Descripcion | Razon de inclusion en MVP |
|---|---|---|
| HS2 | Login | Habilita acceso controlado al sistema. |
| HS3 | Persistencia de sesion (JWT) | Mantiene autenticacion estable durante la navegacion. |
| HS5 | Mapa interactivo | Base de la propuesta de valor de Mapify. |
| HS6 | Marcadores en el mapa | Permite visualizar los lugares georreferenciados. |
| HS8 | Ver detalle de lugar | Brinda la informacion principal para decision del usuario. |
| HS9 | Crear lugar | Permite poblar la plataforma con datos reales. |
| HS12 | Ver resenas | Aporta confianza y contexto para los usuarios. |
| HS13 | Crear resena | Habilita participacion y reputacion comunitaria. |
| HS16 | Filtrar por categoria | Mejora precision de exploracion. |
| HS17 | Busqueda por nombre | Reduce tiempo de descubrimiento. |

---

## 4. Entregables del Proyecto

### 4.1. Entregables de Software - Incrementos por Sprint

| Sprint | Periodo | Epicas | Incremento entregable |
|---|---|---|---|
| **Sprint 1** | 16-31 mar 2026 | E1 + E6 | Registro/login (HS1-HS2), persistencia JWT (HS3), logout (HS4), arquitectura y BD (HS21-HS23), y recuperacion de contrasena (HS24). |
| **Sprint 2** | 1-15 abr 2026 | E2 + E7 | Mapa interactivo (HS5), marcadores (HS6), navegacion del mapa (HS7) y compartir lugar por enlace (HS28). |
| **Sprint 3** | 16-30 abr 2026 | E3 + E7 + E8 | CRUD de lugares (HS8-HS11), perfil publico de negocio (HS25) y favoritos (HS27). |
| **Sprint 4** | 1-15 may 2026 | E4 + E7 | Modulo de resenas (HS12-HS15), reporte de resena inapropiada (HS26) y moderacion de contenido (HS29). |
| **Sprint 5** | 16 may-8 jun 2026 | E5 + E8 | Filtros y UX (HS16-HS20), metricas de negocio (HS30), recomendaciones (HS31) y notificaciones (HS32). |

### 4.2. Entregables de Gestion - Documentacion Scrum

| Artefacto Scrum | Descripcion | Frecuencia |
|---|---|---|
| Product Backlog actualizado | Listado priorizado de epicas e historias (HS). | Antes de cada Sprint Planning |
| Sprint Backlog | Historias comprometidas y tareas del sprint vigente. | Al inicio de cada sprint |
| Acta de Aceptacion | Aprobacion formal del incremento por parte del PO. | Al cierre de cada sprint |
| Reporte Burn-down | Seguimiento de trabajo restante vs tiempo. | Actualizacion diaria |
| Definition of Ready (DoR) | Criterios para que una historia entre a un sprint. | En Sprint Planning |
| Definition of Done (DoD) | Criterios para considerar terminado un incremento. | En Sprint Review |
| Retrospectiva | Hallazgos y acciones de mejora continua. | Al cierre de cada sprint |

---

## 5. Acuerdos de Calidad - DoR y DoD

### 5.1. Definition of Ready (DoR)

Una historia esta lista para entrar al Sprint Backlog cuando cumple todos estos criterios:

- [ ] Esta redactada en formato: Como [rol], quiero [objetivo], para [beneficio].
- [ ] Tiene criterios de aceptacion verificables.
- [ ] Tiene estimacion en puntos de historia acordada por el equipo.
- [ ] Tiene prioridad definida por el Product Owner.
- [ ] No tiene dependencias bloqueantes sin resolver.
- [ ] El equipo entiende el alcance y puede desglosar tareas.

### 5.2. Definition of Done (DoD)

Un incremento se considera terminado cuando cumple todos estos criterios:

#### A - Nivel de tarea
- [ ] El codigo cumple convenciones y estandares del proyecto (ESLint y buenas practicas de React).
- [ ] Se realizaron pruebas funcionales del flujo principal y no hay errores criticos.
- [ ] El cambio esta versionado en Git con commits claros.
- [ ] El tablero de trabajo refleja el estado real del avance.

#### B - Nivel de Historia (HS)
- [ ] Se validaron todos los criterios de aceptacion de la historia.
- [ ] La funcionalidad se comporta correctamente en movil y escritorio.
- [ ] El incremento esta integrado sin romper funcionalidades existentes.
- [ ] Se documenta cualquier decision tecnica relevante.
- [ ] Product Owner aprueba la historia (HS) en Sprint Review.

#### C - Nivel de Sprint
- [ ] Las historias comprometidas estan en estado Done o justificadas ante PO.
- [ ] Se realizo Sprint Review con demostracion funcional.
- [ ] Se realizo Retrospectiva con al menos una accion de mejora.
- [ ] El Burn-down del sprint esta actualizado.

#### D - Nivel de Entrega Final (Sprint 5)
- [ ] Plataforma desplegada y accesible para evaluacion.
- [ ] Minimo 20 lugares cargados y listos para consulta.
- [ ] Documentacion completa: objetivos, arquitectura, guia de instalacion y manual de uso basico.
- [ ] Cierre academico con evidencia de pruebas y aprobacion del PO.

---

## 6. Limites del Proyecto - Out of Scope

> Todo lo incluido en esta seccion queda fuera del alcance actual del MVP. Su incorporacion requiere aprobacion formal de cambio.

| Si incluye este proyecto | No incluye (Out of Scope) |
|---|---|
| Mapa interactivo web para exploracion de lugares. | Aplicacion movil nativa (iOS/Android). |
| Registro de lugares, categorias y resenas. | Integraciones de pago en linea. |
| Busqueda y filtros basicos por categoria y nombre. | Motor de recomendacion con IA en tiempo real. |
| Criterio de equidad en resultados para lugares con pocas resenas. | Integraciones empresariales avanzadas de analitica comercial. |
| Interfaz responsive para escritorio y movil. | Soporte operativo 24/7 con SLA empresarial. |
| Despliegue academico para pruebas beta. | Despliegue productivo multi-region de alta disponibilidad. |

---

## 7. Criterios de Aceptacion de Incrementos

Cada incremento se acepta o rechaza al cierre de sprint con este flujo:

| Paso | Responsable | Descripcion |
|---|---|---|
| 1 - Sprint Review | Equipo Mapify + PO | Demostracion del incremento funcionando en entorno de desarrollo o despliegue. |
| 2 - Validacion funcional | Product Owner | Verificacion de criterios de aceptacion y DoD por historia. |
| 3 - Aprobacion o rechazo | Product Owner | Si aprueba: firma acta. Si rechaza: registra hallazgos y fecha de correccion. |
| 4 - Acta de Aceptacion | Ambas partes | Evidencia formal de entrega parcial por sprint. |
| 5 - Entrega final (Sprint 5) | Equipo + PO + Supervisor | Validacion integral del MVP, documentacion y cierre academico del proyecto. |

---

Mapify S.A.S. - Documento vivo - v1.1 - abril 2026 - Sujeto a revision en cada Sprint Planning.
