# Definition of Done (DoD) - Mapify

*Proyecto:* Plataforma Web Interactiva Basada en Mapas (Mapify)  
*Metodología:* Scrum  
*Versión:* 1.0  
---

## Objetivo
Una tarea, historia de usuario, historia técnica o entregable del sprint se considera *Done* únicamente cuando cumple *todos* los criterios de esta definición.

---

## Criterios Generales (obligatorios en todos los sprints)

- [ ] El código está versionado en el repositorio Git con commits claros y descriptivos.
- [ ] Se realizó *Code Review* por al menos un miembro del equipo diferente al autor.
- [ ] El código compila y corre sin errores en el entorno de desarrollo.
- [ ] La funcionalidad cumple *100%* con los criterios de aceptación definidos en la historia de usuario o entregable.
- [ ] Se realizaron pruebas manuales exhaustivas (casos felices y casos de error).
- [ ] La funcionalidad es *100% responsiva* (funciona correctamente en móvil, tablet y escritorio).
- [ ] No existen errores críticos ni bugs de alta prioridad.
- [ ] La documentación técnica del entregable fue actualizada (README, comentarios en código o documento de arquitectura).
- [ ] La tarea se movió a "Done" en el tablero Scrum y el Product Owner la aprobó.
- [ ] Se obtuvo aprobación formal del cliente mediante *Acta de Aceptación* (o confirmación por escrito).

---

## Criterios Específicos de Mapify

- [ ] El mapa interactivo renderiza correctamente y permite interacción fluida (zoom, pines, búsqueda por ubicación).
- [ ] Los lugares registrados aparecen correctamente geolocalizados con toda la información requerida (nombre, categoría, descripción, fotos).
- [ ] El sistema de categorías (mínimo 6) funciona correctamente y los filtros por nombre/ubicación devuelven resultados precisos.
- [ ] El módulo de reseñas permite crear, visualizar y puntuar (1-5 estrellas) sin errores.
- [ ] El *algoritmo de búsqueda equitativa* está implementado y verificado: los lugares con menos de 5 reseñas aparecen en *al menos el 30%* de los resultados relevantes.
- [ ] Se respetan las especificaciones técnicas definidas en el Anexo 2 del contrato (stack tecnológico, API de mapas, diseño responsivo, etc.).
- [ ] La plataforma cumple con estándares básicos de privacidad y seguridad (protección de datos de usuarios y negocios).
- [ ] El rendimiento es aceptable (tiempo de carga del mapa < 3 segundos en conexión normal).

---

## Criterios de Calidad para el Lanzamiento Beta (Sprint 5)

- [ ] La plataforma completa está desplegada en un entorno accesible (Vercel / Railway / Firebase Hosting).
- [ ] Se cargaron *al menos 20 negocios* como datos iniciales.
- [ ] Se generó y entregó la documentación técnica final (manual de usuario + manual técnico).
- [ ] Se realizó una sesión de prueba beta con usuarios reales (mínimo 5 usuarios externos).
- [ ] Cero errores críticos reportados en la prueba final.
