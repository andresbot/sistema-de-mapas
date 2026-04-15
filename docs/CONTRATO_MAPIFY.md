# Contrato de Desarrollo de Software

**Ejercicio Academico - Curso Gestion de Proyectos de Software**

---

> Documento de caracter exclusivamente academico - Sin efectos juridicos reales.

---

## Partes del Contrato

| Parte | Rol | Datos |
|---|---|---|
| [____________________________] | **EL CLIENTE** | [____________________________] |
| Mapify S.A.S. | **EL DESARROLLADOR** | Zarzal, Valle del Cauca, Colombia · NIT: 900.000.000-1 (Simulado) |

En el municipio de Zarzal, Departamento del Valle del Cauca, Republica de Colombia, a los ___ dias del mes de __________ de 2026, se celebra el presente Contrato de Desarrollo de Software entre:

**EL CLIENTE:** 

**EL DESARROLLADOR:** Mapify S.A.S. · NIT: 900.000.000-1 (Simulado) · Direccion: Zarzal, Valle del Cauca, Colombia · Representante Legal: [Nombre del Socio Fundador] · Cargo: Gerente General - Representante Legal.

---

## Clausula 1 · Objeto del Contrato

EL DESARROLLADOR se compromete a disenar, desarrollar y entregar el software denominado **Mapify - Plataforma Web de Mapas y Resenas Locales**, que consiste en una interfaz web funcional para explorar lugares en mapa interactivo, registrar lugares, administrar categorias, publicar resenas y aplicar filtros de busqueda para mejorar el descubrimiento local.

El desarrollo se ejecutara bajo la metodologia **SCRUM**, estructurado en **5 sprints de 2 semanas calendario** cada uno, con una fecha maxima de entrega del producto final el **8 de junio de 2026**.

El alcance detallado, los entregables por sprint y las especificaciones tecnicas se encuentran en el **Anexo 1** (Alcance y Entregables) y el **Anexo 2** (Especificaciones Tecnicas), que forman parte integral del presente contrato.

---

## Clausula 2 · Estructura de Sprints y Pagos

### 2.1. Planificacion de Sprints

Cada sprint tendra una duracion de 2 semanas calendario. Los entregables de cada sprint seran definidos en el documento de Alcance y Entregables (Anexo 1), revisado en cada Sprint Planning. EL CLIENTE aprobara los entregables de cada sprint mediante un **Acta de Aceptacion** firmada por su representante o delegado.

| Sprint | Periodo | Milestone cubierto | Entregable principal |
|---|---|---|---|
| Sprint 1 | 16 mar - 31 mar 2026 | Base + Auth | Registro y login, persistencia JWT, logout, arquitectura frontend/backend y configuracion de MySQL con Prisma ORM |
| Sprint 2 | 1 abr - 15 abr 2026 | Mapa | Mapa interactivo, marcadores y navegacion del mapa operativa |
| Sprint 3 | 16 abr - 30 abr 2026 | Lugares (CRUD) | Ver detalle, crear, editar y eliminar lugares |
| Sprint 4 | 1 may - 15 may 2026 | Resenas | Visualizacion, creacion, calificacion por estrellas y eliminacion de resenas |
| Sprint 5 | 16 may - 8 jun 2026 | Filtros + UX + cierre | Filtro por categoria, busqueda por nombre, mejoras de UX, validacion final y documentacion |

### 2.2. Pagos

En el marco del presente ejercicio academico, el pago estipulado es simbolico y no refleja tarifas de mercado real, conforme a la Clausula 7 (Naturaleza Didactica). Los montos se expresan en la unidad monetaria academica del curso (CM$).

| Concepto | Monto (CM$) | Condicion de pago |
|---|---|---|
| Pago por sprint (x 5 sprints) | CM$ 1.000.000 c/u | 50% al inicio del sprint · 50% al aprobar el entregable |
| Primer pago - Sprint 1 (anticipo) | CM$ 500.000 | Al inicio del Sprint 1 |
| Pago por aprobacion de entregable | CM$ 500.000 c/sprint | Contra Acta de Aceptacion firmada por EL CLIENTE |
| **TOTAL DEL CONTRATO** | **CM$ 5.000.000** | Distribuido en los 5 sprints |

### 2.3. Penalizacion por Entrega Tardia

En caso de que EL DESARROLLADOR no entregue los entregables acordados dentro de la fecha limite de cada sprint, se aplicara una **penalizacion del 10 %** sobre el monto del sprint afectado (CM$ 100.000 por sprint), deducible del pago del sprint siguiente. La penalizacion no aplica cuando el retraso sea consecuencia de fuerza mayor debidamente documentada, conforme a la Clausula 5.

---

## Clausula 3 · Propiedad Intelectual y Derechos

### 3.1. Titularidad del Codigo y Activos

EL CLIENTE ([____________________________]) sera **dueño exclusivo** de todos los derechos de propiedad intelectual derivados del presente contrato, incluyendo el codigo fuente, componentes frontend en React, servicios backend, esquemas de base de datos, documentacion tecnica y cualquier otro activo generado en el marco del desarrollo.

EL DESARROLLADOR cedera de forma irrevocable todos los derechos de propiedad intelectual al finalizar el alcance del proyecto o los 5 sprints planeados, mediante un documento de cesion formal adjunto al Acta de Entrega Final.

### 3.2. Confidencialidad del Desarrollo

EL DESARROLLADOR se compromete a no divulgar la arquitectura del sistema, el codigo fuente, los datos usados para pruebas, ni ninguna informacion tecnica o estrategica a terceros ajenos al presente contrato, durante la ejecucion del mismo y por un periodo de **12 meses** posteriores a su terminacion.

---

## Clausula 4 · Garantias y Mantenimiento

### 4.1. Pruebas de Aceptacion

EL CLIENTE estara a cargo del diseño y ejecucion de las pruebas de aceptacion de cada entregable. EL CLIENTE dispondra de **3 dias habiles** por sprint para revisar y aprobar o rechazar el entregable mediante Acta de Aceptacion.

### 4.2. Garantias del Software

EL DESARROLLADOR garantiza que:

- El software entregado estara libre de errores criticos que impidan su funcionamiento principal durante los **30 dias** posteriores a la entrega final.
- Cumplira con los requisitos funcionales y no funcionales detallados en el Anexo 2 (Especificaciones Tecnicas).
- El sistema cumplira con los criterios de aceptacion definidos por sprint y con el DoD acordado por las partes.

### 4.3. Soporte Post-Lanzamiento

EL DESARROLLADOR brindara soporte tecnico por **3 meses** tras la entrega final del Sprint 5, incluyendo:

- Correccion de bugs criticos con tiempo de respuesta maximo de **24 horas habiles**.
- Ajustes menores hasta **10 horas mensuales** sin costo adicional para EL CLIENTE.
- Soporte remoto por los canales acordados entre las partes.

---

## Clausula 5 · Terminacion del Contrato

### 5.1. Causales de Terminacion

- Incumplimiento reiterado de plazos: mas de 2 sprints entregados con retraso injustificado.
- Entregables no aprobados en 2 revisiones consecutivas por el mismo sprint, sin correccion satisfactoria.
- Incumplimiento grave de la clausula de confidencialidad (Clausula 3.2).
- Acuerdo mutuo entre las partes, formalizado por escrito.

### 5.2. Efectos de la Terminacion

- EL CLIENTE pagara unicamente por los sprints cuyo entregable haya sido formalmente aprobado mediante Acta de Aceptacion.
- EL DESARROLLADOR entregara todo el codigo fuente, documentacion y activos generados hasta la fecha de terminacion, en el estado en que se encuentren.
- Las clausulas de confidencialidad (3.2) y propiedad intelectual (3.1) conservaran su vigencia tras la terminacion del contrato.

### 5.3. Caso Fortuito y Fuerza Mayor

Las partes quedan exoneradas de responsabilidad por el incumplimiento de sus obligaciones cuando dicho incumplimiento sea consecuencia directa de un evento de fuerza mayor o caso fortuito, debidamente invocado y constatado conforme a la ley colombiana (Codigo Civil, articulo 64). En tal caso, la parte afectada debera notificar a la otra de forma inmediata y por escrito.

---

## Clausula 6 · Confidencialidad

Ambas partes se comprometen a mantener estricta confidencialidad sobre los terminos economicos del contrato, la informacion tecnica del sistema, los datos institucionales usados durante el desarrollo y pruebas, y las estrategias comerciales o academicas de cualquiera de las partes. Esta obligacion se extendera por **12 meses** posteriores a la terminacion del contrato por cualquier causa.

---

## Clausula 7 · Naturaleza Didactica y Prevalencia

> **Esta clausula prevalece sobre cualquier otra disposicion del contrato, anulando terminos que le resulten contradictorios.**

El presente contrato se suscribe en el marco de un ejercicio academico del Curso de Gestion de Proyectos de Software, con caracter exclusivamente didactico y sin fines comerciales. Las partes reconocen que:

1. La relacion cliente-desarrollador es simulada. El pago estipulado es simbolico en unidades monetarias academicas (CM$) y no refleja tarifas de mercado real.
2. La capacidad maxima de trabajo del Equipo Desarrollador se limita a las horas semanales definidas por el curso, priorizando el aprendizaje sobre los resultados funcionales.
3. El objetivo principal es evaluar habilidades de gestion de proyectos y trabajo en equipo, bajo supervision docente.
4. Se empleara la metodologia SCRUM con sprints de 2 semanas. Las tareas se seleccionaran en Sprint Planning por acuerdo entre las partes, priorizando el Product Backlog.
5. **Esta clausula prevalece sobre cualquier otra disposicion del contrato, anulando terminos que le resulten contradictorios.**

---

## Clausula 8 · Jurisdiccion

El presente contrato se rige por las leyes de la Republica de Colombia, en particular por el Codigo Civil (Ley 84 de 1873), el Codigo de Comercio (Decreto 410 de 1971) y la Ley 23 de 1982 sobre Derechos de Autor. Cualquier disputa relacionada con la ejecucion, interpretacion o terminacion del presente contrato sera resuelta en primera instancia mediante negociacion directa entre las partes. De no llegarse a un acuerdo, las controversias se someteran a los tribunales competentes del municipio de **Zarzal, Valle del Cauca, Colombia**.

---

## Firmas

En constancia de lo anterior, las partes suscriben el presente contrato en dos (2) ejemplares del mismo tenor y valor, el ___ de _______ de 2026, en Zarzal, Valle del Cauca.

|  |  |
|---|---|
| **EL CLIENTE** | **Firma:** _________________________ |
| [Nombre del Representante Legal del Cliente] | **C.C. / NIT:** _________________________ |
| [Cargo del Representante del Cliente] |  |
| [NIT del Cliente] |  |

|  |  |
|---|---|
| **EL DESARROLLADOR** | **Firma:** _________________________ |
| [Nombre del Representante Legal de Mapify S.A.S.] | **C.C. / NIT:** _________________________ |
| Gerente General - Mapify S.A.S. |  |
| NIT: 900.000.000-1 |  |

---

## Anexo 1 · Alcance y Entregables por Sprint

Los siguientes entregables constituyen el alcance acordado para cada sprint. Cualquier modificacion al alcance debera ser acordada por escrito por ambas partes antes del inicio del sprint afectado.

| Sprint | Periodo | Historias | Entregable / Criterio de aceptacion |
|---|---|---|---|
| Sprint 1 | 16-31 mar | HS1, HS2, HS3, HS4, HS21, HS22, HS23 | Base tecnica y autenticacion completas: registro, login, JWT, logout, arquitectura inicial y configuracion/modelado de BD con Prisma. |
| Sprint 2 | 1-15 abr | HS5, HS6, HS7 | Mapa interactivo operativo con marcadores y navegacion funcional. |
| Sprint 3 | 16-30 abr | HS8, HS9, HS10, HS11 | CRUD de lugares completo: ver detalle, crear, editar y eliminar. |
| Sprint 4 | 1-15 may | HS12, HS13, HS14, HS15 | Modulo de resenas completo: ver, crear, calificar y eliminar. |
| Sprint 5 | 16 may-8 jun | HS16, HS17, HS18, HS19, HS20 | Filtros + UX: filtro por categoria, busqueda por nombre, responsive, navegacion clara y feedback visual; cierre documental y validacion final. |

---

## Anexo 2 · Especificaciones Tecnicas

### Stack Tecnologico

| Capa | Tecnologia | Rol en el sistema |
|---|---|---|
| Frontend | React + Vite | Interfaz de usuario para mapa, lugares, resenas y filtros |
| Backend | Node.js + API REST | Endpoints de autenticacion, lugares y resenas |
| Base de datos | MySQL + Prisma ORM | Persistencia y modelado de entidades del dominio |
| Mapa | Libreria de mapas web | Visualizacion de lugares y navegacion geoespacial |
| CI/CD | GitHub Actions | Integracion continua y validaciones automaticas |
| Despliegue | Entorno academico web | Publicacion del MVP para pruebas y demostracion |

### Requisitos No Funcionales

- **Rendimiento:** carga inicial del mapa en tiempo razonable para entorno academico.
- **Seguridad:** autenticacion con JWT y validacion de entradas en backend.
- **Usabilidad:** interfaz legible y operable en desktop y movil.
- **Trazabilidad:** cambios y avances registrados en issues y milestones.
- **Escalabilidad:** arquitectura preparada para agregar nuevas funcionalidades sin rediseno total.

### Repositorio y Entrega

- El codigo fuente se entregara en el repositorio GitHub del equipo, con historial de commits y ramas por feature.
- La documentacion tecnica incluira README, arquitectura, modelo de datos y guias de instalacion/uso.

---

Mapify S.A.S. · Ejercicio academico 2026 · Zarzal, Valle del Cauca, Colombia.
