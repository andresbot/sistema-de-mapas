# Mapa de Resenas

Aplicacion full-stack para descubrir, publicar, guardar y resenar lugares en un mapa interactivo. El proyecto tiene un frontend en React/Vite y un backend en Express con Prisma sobre una base MySQL compatible.

## Tabla De Contenido

- [Estado Del Proyecto](#estado-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnico](#stack-tecnico)
- [Estructura](#estructura)
- [Requisitos](#requisitos)
- [Configuracion Local](#configuracion-local)
- [Base De Datos Y Prisma](#base-de-datos-y-prisma)
- [Variables De Entorno](#variables-de-entorno)
- [Scripts Utiles](#scripts-utiles)
- [API Principal](#api-principal)
- [Administrador](#administrador)
- [Despliegue](#despliegue)
- [Verificacion](#verificacion)
- [Solucion De Problemas](#solucion-de-problemas)

## Estado Del Proyecto

El proyecto ya incluye:

- Landing publica.
- Exploracion de lugares en mapa.
- Busqueda, filtros y recomendaciones personalizadas.
- Registro, login y recuperacion de contrasena por correo.
- Publicacion de lugares con datos opcionales.
- Resenas, favoritos, reportes y notificaciones.
- Panel administrativo con metricas de visibilidad y moderacion.
- Soporte para modo claro/oscuro.

## Funcionalidades

### Publicas

- Ver landing inicial.
- Explorar el mapa sin iniciar sesion.
- Buscar y filtrar lugares.
- Abrir detalle de lugar.
- Ver perfil publico de usuarios.

### Usuarios autenticados

- Publicar lugares.
- Guardar favoritos.
- Publicar y eliminar resenas propias.
- Reportar resenas.
- Recibir recomendaciones basadas en busquedas e interacciones.
- Solicitar recuperacion de contrasena por correo.

### Administradores

- Ver metricas de visibilidad.
- Consultar visitas al perfil de lugares.
- Ver resenas, promedio de calificacion y favoritos.
- Moderar reportes.

## Stack Tecnico

### Frontend

- React 19.
- Vite.
- Mapbox GL y react-map-gl.
- Axios.
- lucide-react.
- CSS modular por pantallas/componentes.
- Navegacion por estado en `App.jsx` sin React Router.

### Backend

- Node.js.
- Express.
- Prisma ORM.
- MySQL compatible: MySQL local, TiDB Cloud, Aiven MySQL, etc.
- JWT para autenticacion.
- bcrypt para contrasenas.
- Nodemailer para correos de recuperacion.
- express-validator para validaciones.

## Estructura

```text
sistema-de-mapas/
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- scripts/
|   |   |-- services/
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- data/
|   |   |-- screens/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- utils/
|   |   `-- App.jsx
|   |-- .env.example
|   `-- package.json
|
`-- README.md
```

## Requisitos

- Node.js 18 o superior.
- npm.
- Git.
- Una base MySQL compatible.
- Token publico de Mapbox.
- Cuenta Gmail con contrasena de aplicacion si se quiere probar recuperacion de contrasena.

## Configuracion Local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd sistema-de-mapas
```

### 2. Instalar dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configurar variables del backend

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env` con tu conexion real.

### 4. Configurar variables del frontend

```bash
cd frontend
cp .env.example .env
```

Edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=tu_token_publico_de_mapbox
```

### 5. Aplicar migraciones

```bash
cd backend
npx prisma migrate dev
```

### 6. Ejecutar backend

```bash
cd backend
npm run dev
```

El backend queda en:

```text
http://localhost:5000
```

La prueba de salud queda en:

```text
http://localhost:5000/api/health
```

### 7. Ejecutar frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

El frontend queda en:

```text
http://localhost:5173
```

## Base De Datos Y Prisma

El schema principal esta en:

```text
backend/prisma/schema.prisma
```

El datasource usa MySQL:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Desarrollo Local Con MySQL

Ejemplo:

```env
DATABASE_URL="mysql://root:password@localhost:3306/mapas_db"
```

Si la base no existe:

```sql
CREATE DATABASE mapas_db;
```

Luego:

```bash
cd backend
npx prisma migrate dev
```

### TiDB Cloud

TiDB Cloud funciona porque es compatible con MySQL. Para el proyecto se puede usar la base `test` si el panel solo permite `sys` o `test`.

Ejemplo:

```env
DATABASE_URL="mysql://USUARIO:PASSWORD@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
```

No uses `sys` para la aplicacion.

Para aplicar migraciones en una base remota:

```bash
cd backend
npx prisma migrate deploy
```

### Prisma Studio

```bash
cd backend
npm run prisma:studio
```

## Variables De Entorno

### Backend

Archivo local: `backend/.env`

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="mysql://root:password@localhost:3306/mapas_db"

JWT_SECRET=tu_clave_secreta_super_segura_change_this_in_production
JWT_EXPIRES_IN=24h

FRONTEND_URL=http://localhost:5173
PASSWORD_RESET_EXPIRES_MINUTES=30

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password_de_16_caracteres
MAIL_FROM="sistema-mapas <tu_correo@gmail.com>"

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_REVIEW_FOLDER=sistema-mapas/resenas
```

Notas:

- `FRONTEND_URL` se usa para construir los enlaces de recuperacion de contrasena.
- `SMTP_PASS` debe ser una contrasena de aplicacion de Gmail, no la contrasena normal.
- Cloudinary se usa para subir imagenes de resenas. El upload preset es opcional si usas subida firmada.
- `JWT_SECRET` debe ser largo y privado en produccion.
- No subas archivos `.env` al repositorio.

### Frontend

Archivo local: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=tu_token_publico_de_mapbox
```

Notas:

- `VITE_API_URL` debe terminar en `/api`.
- En produccion debe apuntar al backend desplegado, por ejemplo:

```env
VITE_API_URL=https://sistema-de-mapas.onrender.com/api
```

## Scripts Utiles

### Backend

```bash
cd backend
npm run dev              # desarrollo con watch
npm start                # ejecutar servidor
npm run prisma:generate  # generar Prisma Client
npm run prisma:deploy    # aplicar migraciones existentes
npm run prisma:studio    # abrir Prisma Studio
npm run db:test          # probar conexion/configuracion Prisma
```

### Frontend

```bash
cd frontend
npm run dev      # servidor Vite
npm run build    # build de produccion
npm run lint     # lint
npm run preview  # preview local del build
```

## API Principal

Todas las rutas del backend viven bajo `/api`.

### Salud

```text
GET /api/health
```

### Autenticacion

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Lugares Y Resenas

```text
GET    /api/lugares
POST   /api/lugares
POST   /api/lugares/:id/visitas
DELETE /api/lugares/:id
POST   /api/lugares/:id/resenas
DELETE /api/lugares/:id/resenas/:resenaId
```

### Favoritos

```text
GET  /api/favoritos
POST /api/favoritos/:lugarId
```

### Reportes

```text
POST /api/lugares/:id/resenas/:resenaId/reportes
```

### Uploads

```text
POST /api/uploads/signature
```

### Recomendaciones

```text
GET  /api/recomendaciones
POST /api/recomendaciones/busquedas
```

### Usuarios

```text
GET /api/usuarios/:id/perfil
```

### Notificaciones

```text
GET /api/notificaciones
```

### Admin

```text
GET   /api/admin/metricas?range=7
GET   /api/admin/metricas?range=30
GET   /api/admin/reportes
PATCH /api/admin/reportes/:id
```

Las rutas protegidas requieren:

```http
Authorization: Bearer <token>
```

## Administrador

El rol admin vive en la tabla `usuarios`, columna `rol`.

La forma mas simple para crear un admin en produccion:

1. Registra el usuario desde la app.
2. En la base ejecuta:

```sql
USE test;

UPDATE usuarios
SET rol = 'admin'
WHERE email = 'correo@ejemplo.com';
```

3. Cierra sesion y vuelve a entrar.

Si usas una base local llamada `mapas_db`:

```sql
USE mapas_db;

UPDATE usuarios
SET rol = 'admin'
WHERE email = 'correo@ejemplo.com';
```

## Despliegue

La configuracion recomendada para un proyecto universitario es:

- Frontend: Vercel.
- Backend: Render Web Service.
- Base de datos: TiDB Cloud Serverless.

No se necesita dominio propio. Vercel y Render entregan URLs publicas.

### Backend En Render

Crear un Web Service:

```text
Root Directory: backend
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
```

Variables de entorno:

```env
DATABASE_URL=mysql://USUARIO:PASSWORD@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict
JWT_SECRET=una_clave_larga_y_privada
JWT_EXPIRES_IN=24h
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
PASSWORD_RESET_EXPIRES_MINUTES=30
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password_de_16_caracteres
MAIL_FROM=sistema-mapas <tu_correo@gmail.com>
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_REVIEW_FOLDER=sistema-mapas/resenas
```

Despues del deploy, probar:

```text
https://tu-backend.onrender.com/api/health
```

### Frontend En Vercel

Configurar el proyecto:

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Variables de entorno:

```env
VITE_API_URL=https://tu-backend.onrender.com/api
VITE_MAPBOX_TOKEN=tu_token_publico_de_mapbox
```

Importante: si cambias variables `VITE_`, debes hacer redeploy. Vite las inserta durante el build.

## Verificacion

Antes de abrir un pull request o entregar cambios:

```bash
cd backend
npx prisma validate
npx prisma generate
node --check src/server.js
```

```bash
cd frontend
npm run lint
npm run build
```

Escaneo recomendado para detectar caracteres danados:

```bash
rg -n "\x{00C3}|\x{00C2}|\x{00E2}|\x{00F0}|\x{FFFD}|\x{00EF}" backend/src backend/prisma frontend/src frontend/index.html frontend/README.md README.md
```

## Solucion De Problemas

### El frontend recibe 404 en `/lugares` o `/auth/login`

La variable `VITE_API_URL` no tiene `/api`.

Correcto:

```env
VITE_API_URL=https://tu-backend.onrender.com/api
```

Incorrecto:

```env
VITE_API_URL=https://tu-backend.onrender.com
```

Despues de corregirlo en Vercel, haz redeploy.

### `/api/health` dice `database: disconnected`

Revisa:

- `DATABASE_URL`.
- Que la URL apunte a `test` o a la base de la app, no a `sys`.
- Que tenga `sslaccept=strict` si usas TiDB Cloud.
- Que las migraciones se hayan aplicado.

### No llega el correo de recuperacion

Revisa:

- `SMTP_USER`.
- `SMTP_PASS`.
- Que Gmail tenga verificacion en 2 pasos.
- Que `SMTP_PASS` sea una contrasena de aplicacion.
- Que `FRONTEND_URL` sea la URL real del frontend.

### El mapa no carga

Revisa:

- `VITE_MAPBOX_TOKEN`.
- Que el token sea publico.
- Que el token tenga permisos para cargar mapas web.
- Que el dominio de Vercel este permitido si restringiste el token.

### Render tarda en responder

En plan gratuito Render puede dormir el servicio por inactividad. La primera solicitud puede tardar mas de lo normal.

## Notas Para Nuevos Desarrolladores

- Mantener el frontend y backend como proyectos separados.
- No introducir React Router sin una decision previa; la navegacion actual vive en estado.
- No cambiar contratos de API sin actualizar frontend y README.
- Evitar subir secretos reales.
- Si se agrega una tabla nueva, crear migracion Prisma y documentar el flujo de despliegue.
