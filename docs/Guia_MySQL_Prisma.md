# Guia completa: MySQL + Prisma (Backend)

Esta guia explica como levantar, validar y operar la capa de datos con MySQL y Prisma en este proyecto.

## 1. Requisitos

- Node.js 18+
- npm 9+
- MySQL 8.x (local o en la nube)
- Acceso al backend en esta ruta: backend

## 2. Variables de entorno

Archivo: backend/.env

Usar esta variable obligatoria:

```env
DATABASE_URL="mysql://root:password@localhost:3306/mapas_db"
```

Notas:
- Cambiar root y password por credenciales reales.
- Si el puerto de MySQL es diferente, actualizar 3306.
- En produccion, usar credenciales seguras y no versionar secretos.

## 3. Instalacion inicial

Desde la carpeta backend:

```bash
npm install
```

## 4. Flujo recomendado para desarrollo

### 4.1 Generar cliente Prisma

```bash
npm run prisma:generate
```

### 4.2 Crear/aplicar migraciones

```bash
npm run prisma:migrate
```

Este comando:
- crea la base de datos si no existe
- crea la migracion en prisma/migrations
- aplica cambios al esquema real

### 4.3 Probar conexion y query de prueba

```bash
npm run db:test
```

Resultado esperado en consola:
- mensaje de conexion exitosa MySQL con Prisma
- resultado de SELECT 1

### 4.4 Levantar backend

```bash
npm run dev
```

Endpoint de salud:
- GET http://localhost:5000/api/health

Respuesta esperada:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## 5. Prisma Studio

Prisma Studio ya esta configurado como script del proyecto.

Ejecutar desde backend:

```bash
npm run prisma:studio
```

Comportamiento esperado:
- abre una UI web para inspeccionar y editar tablas
- util para validar datos sin usar cliente SQL externo

Tip:
- si el puerto por defecto esta ocupado, iniciar manualmente:

```bash
npx prisma studio --port 5555
```

## 6. Comandos utiles (resumen)

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
npm run db:test
npm run dev
```

## 7. Produccion (deploy)

1. Configurar DATABASE_URL del entorno productivo (MySQL gestionado).
2. Ejecutar migraciones en deploy:

```bash
npm run prisma:deploy
```

3. Iniciar aplicacion:

```bash
npm run start
```

Recomendaciones:
- no usar root en produccion
- usar usuario dedicado con privilegios minimos
- hacer backups programados
- rotar credenciales periodicamente

## 8. Troubleshooting rapido

### Error: DATABASE_URL no definida
- Verificar backend/.env
- Verificar que el proceso arranca en carpeta backend

### Error: Access denied for user
- Revisar usuario/password
- Verificar permisos del usuario en MySQL

### Error: Unknown database
- Ejecutar npm run prisma:migrate

### Error al generar cliente Prisma
- Ejecutar npm install
- Luego npm run prisma:generate

### Prisma Studio no abre
- Probar otro puerto:
  - npx prisma studio --port 5555
- Revisar firewall local o puerto ocupado

## 9. Archivos clave

- backend/prisma/schema.prisma
- backend/prisma/migrations
- backend/src/config/prisma.js
- backend/src/config/database.js
- backend/src/scripts/test-prisma.js
- backend/src/server.js
- backend/.env.example
