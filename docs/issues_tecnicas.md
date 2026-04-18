# HISTORIAS TECNICAS
## Backlog tecnico Mapify (HT)

Version: 2.1  

---

## 1. Convenciones

- Identificador: HT-01 en adelante
- Formato: Como equipo tecnico, necesitamos [accion tecnica], para [resultado de calidad]
- Relacion: cada historia tecnica debe enlazar HS funcionales cuando aplique
- Estados sugeridos: Pendiente / En progreso / Validacion / Done

---

## 2. Historias tecnicas por sprint

### Sprint 1 - Base tecnica y autenticacion

## HT-01 Estructura base del proyecto
Como equipo tecnico, necesitamos definir la estructura inicial de frontend y backend, para mantener orden y escalabilidad.

Relacion HS: HS21  
Criterios de aceptacion:
- Estructura de carpetas validada para cliente y servidor.
- Configuracion inicial de rutas y capas de servicio implementada.
- Guia corta de arquitectura actualizada.

## HT-02 Configuracion de entorno y variables
Como equipo tecnico, necesitamos estandarizar variables de entorno y configuraciones locales, para evitar errores por diferencias entre maquinas.

Relacion HS: HS21, HS22  
Criterios de aceptacion:
- Archivo de ejemplo de variables disponible.
- Configuracion local valida para cliente y servidor.
- Sin secretos expuestos en repositorio.

## HT-03 Integracion MySQL + Prisma ORM
Como equipo tecnico, necesitamos configurar MySQL con Prisma, para persistir informacion de forma consistente.

Relacion HS: HS22, HS23  
Criterios de aceptacion:
- Conexion funcional a base de datos.
- Prisma schema inicial generado y validado.
- Migracion inicial aplicada correctamente.

## HT-04 Seguridad base de autenticacion
Como equipo tecnico, necesitamos implementar hashing y validacion segura de credenciales, para proteger cuentas de usuario.

Relacion HS: HS1, HS2, HS3, HS4  
Criterios de aceptacion:
- Contrasenas hasheadas antes de persistir.
- Tokens JWT firmados y verificados.
- Middleware de rutas protegidas operativo.

### Sprint 2 - Mapa interactivo

## HT-05 Integracion Leaflet y capa de mapa
Como equipo tecnico, necesitamos integrar Leaflet en el frontend, para renderizar mapas interactivos de forma estable.

Relacion HS: HS5, HS7  
Criterios de aceptacion:
- Mapa renderiza correctamente en vista principal.
- Controles basicos de zoom y desplazamiento activos.
- Sin errores bloqueantes en consola en flujo normal.

## HT-06 API de lugares para marcadores
Como equipo tecnico, necesitamos exponer endpoint de lugares para consumo del mapa, para poblar marcadores dinamicamente.

Relacion HS: HS6, HS8  
Criterios de aceptacion:
- Endpoint de listado retorna datos minimos requeridos por mapa.
- Tiempo de respuesta aceptable en entorno local.
- Manejo de error definido para respuesta fallida.

### Sprint 3 - CRUD de lugares

## HT-07 Validaciones backend de lugares
Como equipo tecnico, necesitamos validar payload de creacion y edicion de lugares, para prevenir datos inconsistentes.

Relacion HS: HS9, HS10  
Criterios de aceptacion:
- Campos obligatorios y reglas de formato definidas.
- Respuestas de error con mensajes comprensibles.
- Pruebas basicas de validacion ejecutadas.

## HT-08 Control de permisos para modificacion
Como equipo tecnico, necesitamos controlar permisos para editar o eliminar lugares, para proteger integridad del contenido.

Relacion HS: HS10, HS11  
Criterios de aceptacion:
- Solo usuario autorizado modifica o elimina.
- Respuesta 401/403 para accesos no permitidos.
- Casos de autorizacion cubiertos en pruebas tecnicas.

## HT-09 Trazabilidad de operaciones CRUD
Como equipo tecnico, necesitamos registrar operaciones criticas del CRUD, para mejorar auditoria y soporte.

Relacion HS: HS9, HS10, HS11  
Criterios de aceptacion:
- Eventos minimos de crear/editar/eliminar registrados.
- Estructura de log consistente por operacion.
- Registros disponibles para debug de incidencias.

### Sprint 4 - Resenas y reputacion

## HT-10 Modelo y relaciones de resenas
Como equipo tecnico, necesitamos consolidar relaciones entre resena, usuario y lugar, para asegurar coherencia relacional.

Relacion HS: HS12, HS13, HS15  
Criterios de aceptacion:
- FK y restricciones de integridad aplicadas.
- No se crean resenas huerfanas.
- Eliminaciones respetan reglas definidas del modelo.

## HT-11 Reglas de negocio de calificacion
Como equipo tecnico, necesitamos validar calificaciones entre 1 y 5, para mantener calidad de datos de reputacion.

Relacion HS: HS13, HS14  
Criterios de aceptacion:
- Backend rechaza valores fuera de rango.
- Frontend bloquea seleccion invalida.
- Mensaje de error coherente en ambos lados.

### Sprint 5 - Filtros, UX y cierre

## HT-12 Optimizacion de consultas de busqueda y filtro
Como equipo tecnico, necesitamos optimizar consultas por nombre y categoria, para ofrecer respuesta rapida al usuario.

Relacion HS: HS16, HS17  
Criterios de aceptacion:
- Consultas soportan filtro combinado sin romper resultados.
- Tiempos de respuesta estables en dataset de prueba.
- Sin resultados duplicados en respuestas.

## HT-13 Estandar de feedback visual y manejo de errores
Como equipo tecnico, necesitamos una estrategia uniforme de estados UI, para mejorar usabilidad y mantenimiento.

Relacion HS: HS18, HS19, HS20  
Criterios de aceptacion:
- Estados de carga, exito y error definidos para vistas clave.
- Componentes reutilizables para notificaciones implementados.
- Mensajes consistentes en tono y formato.

## HT-14 Checklist tecnico de cierre MVP
Como equipo tecnico, necesitamos un checklist final de estabilidad, para reducir riesgo en entrega del MVP.

Relacion HS: HS1-HS23  
Criterios de aceptacion:
- Lint y build en verde en rama principal.
- Validacion funcional cruzada por sprint completada.
- Documentacion tecnica actualizada (instalacion, arquitectura, trazabilidad).

### Backlog tecnico adicional integrado en Sprint 1-5

## HT-15 Flujo seguro de recuperacion de contrasena
Como equipo tecnico, necesitamos implementar recuperacion de contrasena con token temporal, para reducir bloqueos de acceso sin comprometer seguridad.

Relacion HS: HS24  
Criterios de aceptacion:
- Se genera token de recuperacion con expiracion y un solo uso.
- El flujo invalida tokens vencidos o reutilizados.
- Se registra evento de recuperacion para auditoria basica.

## HT-16 Modelo de favoritos y consultas eficientes
Como equipo tecnico, necesitamos modelar favoritos y optimizar su consulta, para ofrecer una experiencia rapida en la lista personal.

Relacion HS: HS27  
Criterios de aceptacion:
- Tabla o entidad de favoritos con unicidad usuario-lugar.
- Endpoints para agregar, eliminar y listar favoritos.
- Consultas paginadas sin duplicados.

## HT-17 Pipeline de reportes y moderacion
Como equipo tecnico, necesitamos un pipeline de reportes de contenido, para habilitar moderacion trazable y consistente.

Relacion HS: HS26, HS29  
Criterios de aceptacion:
- Modelo de reporte con estado (pendiente, resuelto, descartado).
- Panel administrativo consume lista de reportes con filtros.
- Acciones de moderacion quedan auditadas con usuario y fecha.

## HT-18 Enlaces canonicos y compartibles
Como equipo tecnico, necesitamos generar rutas canonicas para perfiles y lugares, para asegurar comparticion estable y SEO tecnico basico.

Relacion HS: HS25, HS28  
Criterios de aceptacion:
- Cada lugar/perfil tiene slug o identificador estable para URL.
- Redireccion controlada en rutas invalidas o legacy.
- Metadatos minimos de comparticion disponibles.

## HT-19 Capa de metricas y agregaciones
Como equipo tecnico, necesitamos construir agregaciones de actividad, para mostrar metricas utiles a propietarios de negocio.

Relacion HS: HS30  
Criterios de aceptacion:
- Eventos clave (visitas, interacciones, resenas) se registran.
- Consulta por periodos basicos (7 y 30 dias) implementada.
- Endpoint de metricas retorna datos consistentes con eventos registrados.

## HT-20 Motor inicial de recomendaciones
Como equipo tecnico, necesitamos implementar un motor de recomendacion basado en reglas, para personalizar descubrimiento sin alta complejidad inicial.

Relacion HS: HS31  
Criterios de aceptacion:
- Reglas de recomendacion documentadas y versionadas.
- Endpoint devuelve recomendaciones por usuario autenticado.
- Fallback definido cuando no hay historial suficiente.

## HT-21 Servicio de notificaciones y preferencia de lectura
Como equipo tecnico, necesitamos gestionar notificaciones y su estado, para ofrecer seguimiento de actividad relevante.

Relacion HS: HS32  
Criterios de aceptacion:
- Modelo de notificacion con estado leida/no leida.
- Endpoint para listar y marcar notificaciones como leidas.
- Preferencia basica de silenciamiento por usuario.

## HT-22 Observabilidad y alertas operativas
Como equipo tecnico, necesitamos observabilidad de errores y tiempos de respuesta, para detectar incidentes antes de impacto mayor.

Relacion HS: HS24-HS32  
Criterios de aceptacion:
- Logging estructurado en backend para endpoints criticos.
- Medicion basica de latencia y tasa de error.
- Alertas minimas para fallos recurrentes en flujos clave.

---

## 3. Dependencias tecnicas clave

- HT-01 y HT-02 son prerrequisito para HT-03 y HT-04.
- HT-03 es prerrequisito para historias con persistencia de datos.
- HT-06 habilita HS6 y acelera HS8.
- HT-07 y HT-08 son prerrequisito para cerrar CRUD de lugares.
- HT-10 y HT-11 son prerrequisito para cierre de reputacion.
- HT-12 y HT-13 deben completarse antes de HT-14.
- HT-15 habilita resiliencia de acceso para cuentas activas.
- HT-17 depende de definiciones de permisos de administracion.
- HT-19 es prerrequisito para visualizacion estable de metricas de negocio.
- HT-20 requiere datos minimos de interaccion para recomendaciones confiables.
- HT-21 y HT-22 deben cerrar antes del cierre de Sprint 5.

---

## 4. Criterios de cierre para historias tecnicas

- Cumple Definition of Done a nivel tarea tecnica.
- Tiene evidencia tecnica (PR, prueba o captura de verificacion).
- Queda vinculada a historia funcional y sprint.
- No deja deuda critica abierta sin plan de mitigacion.
