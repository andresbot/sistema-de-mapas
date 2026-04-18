# HISTORIAS DE USUARIO COMPLETAS
## Backlog funcional Mapify (HS1-HS32)

Proyecto: Mapify

---

## 1. Convenciones

- Identificador: HS1 a HS32
- Formato: Como [rol], quiero [necesidad], para [beneficio]
- Criterios: minimos verificables para validar la historia
- Estado sugerido: Pendiente / En progreso / Done (segun tablero)

---

## 2. Historias por sprint

### Sprint 1 - Base tecnica y autenticacion

## HS1 - Registro de usuario
Como visitante, quiero registrarme con mis datos basicos para acceder a la plataforma.

Criterios de aceptacion:
- Formulario con nombre, correo y contrasena validada.
- No se permite registrar correos duplicados.
- El usuario queda persistido en base de datos.

## HS2 - Login
Como usuario registrado, quiero iniciar sesion para usar funciones autenticadas.

Criterios de aceptacion:
- Se valida correo y contrasena.
- Si las credenciales son validas, se concede acceso.
- Si son invalidas, se muestra mensaje de error claro.

## HS3 - Persistencia de sesion (JWT)
Como usuario autenticado, quiero mantener mi sesion activa para no iniciar sesion en cada navegacion.

Criterios de aceptacion:
- El backend emite token JWT al autenticar.
- El frontend conserva sesion valida entre recargas.
- Rutas protegidas rechazan tokens invalidos o expirados.

## HS4 - Logout
Como usuario autenticado, quiero cerrar sesion para proteger mi cuenta en dispositivos compartidos.

Criterios de aceptacion:
- Existe accion visible para cerrar sesion.
- Se limpia token y estado local de usuario.
- Al cerrar sesion no se puede acceder a vistas protegidas.

## HS21 - Arquitectura frontend y backend
Como equipo de desarrollo, queremos una arquitectura base organizada para acelerar implementacion y mantenimiento.

Criterios de aceptacion:
- Estructura de carpetas definida para cliente y servidor.
- Configuracion inicial de rutas, servicios y controladores.
- Documentacion base de arquitectura actualizada.

## HS22 - Configurar MySQL con Prisma ORM
Como equipo tecnico, queremos conectar el backend a MySQL con Prisma para persistir datos de manera confiable.

Criterios de aceptacion:
- Conexion a MySQL funcional desde el backend.
- Prisma configurado con archivo de esquema y migraciones.
- Operaciones basicas de lectura/escritura verificadas.

## HS23 - Modelar base de datos completa con Prisma
Como equipo tecnico, queremos definir el modelo de datos principal para soportar usuarios, lugares y resenas.

Criterios de aceptacion:
- Modelo incluye entidades Usuario, Lugar, Resena y relaciones.
- Migraciones aplicables sin errores en entorno local.
- Restricciones de integridad definidas (PK, FK, unicidad).

### Sprint 2 - Mapa interactivo

## HS5 - Mapa interactivo
Como usuario, quiero visualizar un mapa interactivo para explorar lugares cercanos.

Criterios de aceptacion:
- El mapa carga en la vista principal sin errores bloqueantes.
- Se puede hacer zoom y desplazamiento.
- La experiencia es usable en escritorio y movil.

## HS6 - Marcadores en el mapa
Como usuario, quiero ver marcadores de lugares para identificar opciones disponibles.

Criterios de aceptacion:
- Cada lugar publicado se representa con marcador.
- Al seleccionar marcador se muestra informacion basica del lugar.
- No se renderizan marcadores duplicados.

## HS7 - Navegacion del mapa
Como usuario, quiero moverme de forma fluida por el mapa para explorar zonas de interes.

Criterios de aceptacion:
- Navegacion estable sin bloqueos visuales.
- Mantiene contexto de vista al volver desde detalle.
- Tiempo de respuesta aceptable en interacciones comunes.

### Sprint 3 - Lugares (CRUD)

## HS8 - Ver detalle de lugar
Como usuario, quiero abrir el detalle de un lugar para conocer informacion relevante antes de visitarlo.

Criterios de aceptacion:
- Muestra nombre, categoria, ubicacion y descripcion.
- Incluye informacion de contacto cuando exista.
- La vista de detalle se carga sin errores criticos.

## HS9 - Crear lugar
Como usuario autorizado, quiero registrar un nuevo lugar para aumentar la visibilidad local.

Criterios de aceptacion:
- Formulario con campos obligatorios y validaciones.
- El lugar creado aparece en mapa y listado.
- Se confirma visualmente el guardado exitoso.

## HS10 - Editar lugar
Como usuario autorizado, quiero editar datos de un lugar para mantener informacion actualizada.

Criterios de aceptacion:
- Se permite modificar datos editables del lugar.
- Cambios persisten correctamente en base de datos.
- Se registra feedback visual de exito o error.

## HS11 - Eliminar lugar
Como usuario autorizado, quiero eliminar un lugar para retirar informacion obsoleta o incorrecta.

Criterios de aceptacion:
- Requiere confirmacion previa de eliminacion.
- El lugar no aparece despues de eliminarse.
- Se conserva integridad de datos relacionados.

### Sprint 4 - Resenas y reputacion

## HS12 - Ver resenas
Como usuario, quiero consultar resenas de un lugar para tomar mejores decisiones.

Criterios de aceptacion:
- Las resenas se listan asociadas al lugar correcto.
- Se muestra puntaje y comentario de cada resena.
- Si no hay resenas, se informa con mensaje claro.

## HS13 - Crear resena
Como usuario autenticado, quiero publicar una resena para compartir mi experiencia.

Criterios de aceptacion:
- Solo usuarios autenticados pueden crear resena.
- Permite comentario y calificacion valida.
- La resena creada queda visible en el detalle del lugar.

## HS14 - Calificacion con estrellas
Como usuario, quiero calificar con estrellas para expresar rapidamente mi nivel de satisfaccion.

Criterios de aceptacion:
- Componente permite puntajes enteros de 1 a 5.
- La seleccion visual coincide con el valor guardado.
- No acepta valores fuera del rango permitido.

## HS15 - Eliminar resena
Como usuario autorizado, quiero eliminar una resena para moderar contenido indebido.

Criterios de aceptacion:
- Solo autor o rol con permiso puede eliminar.
- La resena desaparece del listado al confirmar.
- La accion deja trazabilidad minima en sistema.

### Sprint 5 - Filtros, UX y cierre MVP

## HS16 - Filtrar por categoria
Como usuario, quiero filtrar lugares por categoria para encontrar opciones mas relevantes.

Criterios de aceptacion:
- Hay categorias disponibles para filtrar.
- El resultado se actualiza al aplicar filtro.
- Se puede limpiar el filtro y volver al estado inicial.

## HS17 - Busqueda por nombre
Como usuario, quiero buscar lugares por nombre para encontrarlos rapidamente.

Criterios de aceptacion:
- Busqueda no sensible a mayusculas/minusculas.
- Muestra coincidencias parciales por nombre.
- Si no hay resultados, se muestra mensaje orientativo.

## HS18 - Diseno responsive
Como usuario movil, quiero usar la app sin problemas de visualizacion para navegar comodamente.

Criterios de aceptacion:
- Vistas principales adaptan layout a movil y escritorio.
- No hay desbordes criticos en componentes clave.
- Interacciones tactiles son funcionales.

## HS19 - Navegacion clara
Como usuario, quiero una navegacion intuitiva para moverme entre mapa, detalle y perfil sin confusion.

Criterios de aceptacion:
- Menu o rutas principales claramente visibles.
- Enlaces entre pantallas mantienen continuidad de flujo.
- El usuario identifica facilmente donde esta y como volver.

## HS20 - Feedback visual
Como usuario, quiero recibir mensajes de estado para entender el resultado de mis acciones.

Criterios de aceptacion:
- Existen estados de carga para operaciones relevantes.
- Se muestran mensajes de exito tras acciones completadas.
- Se muestran mensajes de error accionables cuando falla algo.

### Historias adicionales integradas en Sprint 1-5

Distribucion acordada:
- Sprint 1: HS24
- Sprint 2: HS28
- Sprint 3: HS25, HS27
- Sprint 4: HS26, HS29
- Sprint 5: HS30, HS31, HS32

## HS24 - Recuperar contrasena
Como usuario registrado, quiero recuperar mi contrasena mediante correo para volver a acceder cuando la olvide.

Criterios de aceptacion:
- Existe flujo de solicitud de recuperacion por correo.
- El enlace o codigo de recuperacion tiene expiracion configurable.
- La nueva contrasena reemplaza la anterior y requiere validacion minima.

## HS25 - Ver perfil publico de negocio
Como usuario, quiero ver un perfil publico consolidado de cada negocio para evaluar su reputacion y datos clave.

Criterios de aceptacion:
- El perfil muestra informacion principal del negocio y su categoria.
- Incluye promedio de calificacion y cantidad de resenas.
- Tiene URL amigable para compartir.

## HS26 - Reportar resena inapropiada
Como usuario, quiero reportar resenas ofensivas o falsas para mejorar la calidad del contenido.

Criterios de aceptacion:
- Existe opcion de reportar con motivo predefinido.
- El reporte queda asociado a la resena y usuario reportante.
- El contenido reportado pasa a cola de moderacion.

## HS27 - Guardar lugares en favoritos
Como usuario autenticado, quiero guardar lugares favoritos para consultarlos rapidamente despues.

Criterios de aceptacion:
- Se puede marcar y desmarcar un lugar como favorito.
- Existe vista/lista de favoritos del usuario.
- No se duplican favoritos del mismo lugar para un usuario.

## HS28 - Compartir lugar
Como usuario, quiero compartir un lugar mediante enlace para recomendarlo a otras personas.

Criterios de aceptacion:
- El sistema genera enlace directo al detalle del lugar.
- El enlace compartido abre correctamente en escritorio y movil.
- Si el lugar no existe o fue eliminado, se muestra estado controlado.

## HS29 - Moderar contenido reportado
Como administrador, quiero revisar y resolver reportes de contenido para mantener estandares de comunidad.

Criterios de aceptacion:
- Existe vista de reportes pendientes con filtros basicos.
- El administrador puede aprobar, ocultar o eliminar contenido reportado.
- Cada decision deja trazabilidad de fecha y responsable.

## HS30 - Ver metricas de visibilidad del negocio
Como propietario de negocio, quiero ver metricas basicas de visitas e interacciones para entender mi desempeno.

Criterios de aceptacion:
- Se muestran visitas al perfil, cantidad de resenas y promedio de calificacion.
- Hay rango temporal basico para consulta (por ejemplo, 7/30 dias).
- Los datos reflejan eventos reales registrados en sistema.

## HS31 - Recomendaciones personalizadas de lugares
Como usuario, quiero recibir recomendaciones basadas en mis busquedas e interacciones para descubrir opciones mas utiles.

Criterios de aceptacion:
- Se muestran recomendaciones segun al menos una regla de personalizacion.
- El modulo excluye lugares bloqueados o no disponibles.
- Las recomendaciones se actualizan con nuevo comportamiento del usuario.

## HS32 - Notificaciones de actividad relevante
Como usuario, quiero recibir notificaciones sobre actividad importante para mantenerme informado sin revisar manualmente.

Criterios de aceptacion:
- Se notifican eventos definidos (respuesta a resena, cambio en lugar favorito, etc.).
- El usuario puede marcar notificaciones como leidas.
- Existe control basico para activar o silenciar notificaciones.

---

## 3. Criterios globales para cerrar historias

- Cada historia debe cumplir la Definition of Done vigente.
- Debe existir evidencia funcional (captura, demo o prueba).
- La historia debe quedar trazada en tablero y sprint correspondiente.
- No se marca Done si hay regresiones criticas abiertas.
