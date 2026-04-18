# Objetivos del Proyecto

**Mapify - Plataforma Web de Mapas y Resenas Locales**

---

## Objetivo General

Desarrollar e implementar una plataforma web funcional que permita descubrir, registrar y calificar lugares locales mediante un mapa interactivo, integrando autenticacion de usuarios, gestion de lugares (CRUD), gestion de reseñas y filtros de busqueda. La solucion debe consolidar en una sola herramienta el flujo completo de exploracion y consulta para usuarios finales, con una arquitectura mantenible para futuras iteraciones.

**Indicador de exito:** plataforma MVP operativa en 5 sprints, con al menos 20 lugares registrados, 30 reseñas publicadas y funcionamiento estable sin errores criticos en pruebas de aceptacion.
**Fecha limite:** 8 de junio de 2026, con entregas parciales al cierre de cada sprint.

---

## Contexto tecnico del producto

Mapify se desarrolla como aplicacion web basada en React 19 + Vite en frontend, y Node.js + Express.js en backend, con persistencia en MySQL mediante Prisma ORM y autenticacion con JWT. El sistema organiza la entrega en cinco sprints con alcance funcional integrado. Esta estructura permite evolucion incremental del producto con trazabilidad directa sobre el backlog HS1-HS32.

La plataforma debe ofrecer una experiencia de uso clara: el usuario se autentica, explora lugares en el mapa, consulta detalles, interactua con resenas y filtra resultados por categoria o nombre desde una interfaz responsive.

---

## Objetivos Especificos

### Objetivo 1 - Construir la base tecnica y de autenticacion

Implementar la arquitectura inicial frontend/backend, el modelado de base de datos y el flujo de autenticacion (registro, login, persistencia de sesion y logout), asegurando que el sistema tenga una base estable para las funcionalidades posteriores.

**Como se mide?**
Arquitectura funcional con frontend y backend comunicados, base de datos modelada con Prisma, y flujo de autenticacion operativo de extremo a extremo sin errores criticos.

**Por que importa?**
Sin una base tecnica estable no es posible escalar de forma confiable hacia mapa, lugares, resenas y filtros.

> **Conexion con historias:** HS1, HS2, HS3, HS4, HS21, HS22, HS23

**Herramientas:** React, Node.js, Express.js, MySQL, Prisma ORM, JWT, GitHub.
**Fecha limite:** 31 de marzo de 2026.

---

### Objetivo 2 - Implementar exploracion geoespacial en mapa interactivo

Desarrollar el modulo de mapa para visualizar lugares con marcadores y navegacion fluida, habilitando la interaccion base del producto.

**Como se mide?**
Mapa renderizado correctamente, marcadores visibles, navegacion del mapa estable y experiencia usable desde escritorio y movil.

**Por que importa?**
El mapa es el centro de la propuesta de valor de Mapify y el primer punto de contacto para el descubrimiento de lugares.

> **Conexion con historias:** HS5, HS6, HS7

**Herramientas:** React, Leaflet, React Router, Axios.
**Fecha limite:** 15 de abril de 2026.

---

### Objetivo 3 - Habilitar gestion de lugares y reseñas

Construir los modulos de lugares (detalle, creacion, edicion, eliminacion) y reseñas (visualizar, crear, calificar y eliminar) para cubrir el flujo funcional principal de participacion de usuarios.

**Como se mide?**
Flujo CRUD de lugares operativo y modulo de reseñas funcional sin errores criticos, con persistencia correcta de datos y validaciones de negocio.

**Por que importa?**
Sin estos modulos, el mapa solo muestra datos estaticos y no genera valor comunitario ni trazabilidad de calidad de lugares.

> **Conexion con historias:** HS8, HS9, HS10, HS11, HS12, HS13, HS14, HS15

**Herramientas:** Node.js, Express.js, MySQL, Prisma ORM, React, Axios.
**Fecha limite:** 15 de mayo de 2026.

---

### Objetivo 4 - Optimizar experiencia de usuario y cerrar validacion MVP

Implementar filtros y mejoras de experiencia (categoria, busqueda por nombre, responsive, navegacion clara y feedback visual), y validar la plataforma en su version final para entrega academica.

**Como se mide?**
Filtros operativos, busqueda funcional, interfaz responsive, evidencia de pruebas de aceptacion y cierre sin errores criticos abiertos.

**Por que importa?**
Estas mejoras convierten un prototipo funcional en un MVP util y presentable para usuarios reales.

> **Conexion con historias:** HS16, HS17, HS18, HS19, HS20

**Herramientas:** React, Tailwind CSS, React Router, pruebas funcionales, GitHub Actions.
**Fecha limite:** 8 de junio de 2026.

---

### Objetivo 5 - Integrar historias complementarias dentro del plan base

Implementar las historias complementarias para fortalecer seguridad de cuentas, moderacion comunitaria y capacidades de crecimiento del producto (favoritos, metricas, recomendaciones y notificaciones), integrandolas en los cinco sprints existentes.

**Como se mide?**
Historias HS24-HS32 planificadas, desarrolladas y validadas dentro de Sprint 1-5 con trazabilidad completa y sin degradar funcionalidades base.

**Por que importa?**
Permite evolucionar Mapify desde un MVP funcional hacia una plataforma sostenible con mayor retencion de usuarios y valor para negocios locales.

> **Conexion con historias:** HS24, HS25, HS26, HS27, HS28, HS29, HS30, HS31, HS32

**Herramientas:** Node.js, Express.js, MySQL, Prisma ORM, React, GitHub Actions, panel de analitica.
**Fecha limite:** 8 de junio de 2026.

---

## Trazabilidad Objetivos - Sprints - Historias

| Objetivo | Sprint | Historias relacionadas |
|---|---|---|
| OE1 - Base tecnica y auth | Sprint 1 | HS1, HS2, HS3, HS4, HS21, HS22, HS23 |
| OE2 - Mapa interactivo | Sprint 2 | HS5, HS6, HS7 |
| OE3 - Lugares y resenas | Sprint 3 y 4 | HS8, HS9, HS10, HS11, HS12, HS13, HS14, HS15 |
| OE4 - Filtros, UX y validacion MVP | Sprint 5 | HS16, HS17, HS18, HS19, HS20 |
| OE5 - Integracion de historias complementarias | Sprint 1 a 5 | HS24, HS25, HS26, HS27, HS28, HS29, HS30, HS31, HS32 |

---

## Cronograma resumido 2026

| Periodo | Actividad principal | Sprint |
|---|---|---|
| 16 mar - 31 mar | Base tecnica, autenticacion y recuperacion de contrasena | Sprint 1 |
| 1 abr - 15 abr | Mapa, navegacion y comparticion | Sprint 2 |
| 16 abr - 30 abr | CRUD de lugares, perfil publico y favoritos | Sprint 3 |
| 1 may - 15 may | Resenas, reportes y moderacion | Sprint 4 |
| 16 may - 8 jun | Filtros, UX, metricas, recomendaciones y notificaciones | Sprint 5 |

---

## Alineacion con impacto local

Mapify contribuye al fortalecimiento digital de negocios y lugares locales al centralizar informacion de ubicacion, valoracion y consulta en una sola plataforma. El enfoque del MVP prioriza utilidad practica y escalabilidad tecnica para continuar evolucionando el producto en fases posteriores.

---

Documento alineado con backlog integrado HS1-HS32 · Metodologia Scrum por sprints · Entrega integrada en Sprint 1-5
