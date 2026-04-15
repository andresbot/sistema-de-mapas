# GUIA DE INSTALACION

## 1. Objetivo
Esta guia describe como instalar, ejecutar y validar localmente el proyecto Mapify en su estado actual.

## 2. Requisitos previos
- Node.js 18 o superior (recomendado: Node.js 20 LTS)
- npm 9 o superior
- Git
- Conexion a Internet para descargar dependencias

## 2.1 Tecnologias del proyecto

### Frontend
- React 19 - UI Library
- Vite - Build tool
- Tailwind CSS - Estilos
- Leaflet - Mapas interactivos
- React Router - Navegacion
- Axios - HTTP requests

### Backend
- Node.js - Runtime
- Express.js - Web framework
- MySQL - Base de datos
- Prisma ORM - ORM
- JWT - Autenticacion

## 3. Estructura actual del proyecto
Actualmente el repositorio incluye la aplicacion frontend en la carpeta `client`.

## 4. Instalacion paso a paso

### 4.1 Clonar repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd sistema-de-mapas
```

### 4.2 Verificar versiones de entorno
```bash
node -v
npm -v
```

### 4.3 Instalar dependencias del frontend
```bash
cd client
npm install
```

## 5. Ejecucion en desarrollo

Desde la carpeta `client` ejecutar:

```bash
npm run dev
```

Salida esperada:
- Servidor de desarrollo activo (Vite)
- Aplicacion accesible en `http://localhost:5173`

## 6. Verificacion tecnica recomendada

Desde la carpeta `client` ejecutar:

### 6.1 Lint del proyecto
```bash
npm run lint
```

### 6.2 Build de produccion
```bash
npm run build
```

### 6.3 Vista previa del build
```bash
npm run preview
```

## 7. Scripts disponibles

En la carpeta `client`:
- `npm run dev`: inicia entorno de desarrollo con Vite
- `npm run lint`: ejecuta ESLint
- `npm run build`: genera build de produccion
- `npm run preview`: levanta una vista previa del build

## 8. Problemas comunes y solucion

### Error por version de Node
Problema: comandos fallan por version incompatible.

Solucion:
- Actualizar a Node.js 18+ (preferible 20 LTS)
- Reinstalar dependencias con `npm install`

### Dependencias corruptas
Problema: errores extraños al compilar o iniciar.

Solucion:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto ocupado (5173)
Problema: Vite no puede iniciar en el puerto por defecto.

Solucion:
- Cerrar proceso que use el puerto, o
- Ejecutar Vite en otro puerto:
```bash
npm run dev -- --port 5174
```

### Problemas con mapa (Leaflet)
Problema: el mapa no renderiza correctamente.

Validar:
- Que la aplicacion este cargando sin errores de consola
- Que los estilos del mapa esten correctamente importados en el frontend

## 9. Criterios de instalacion exitosa
- Dependencias instaladas sin errores
- `npm run dev` inicia correctamente
- Aplicacion abre en navegador
- `npm run lint` finaliza sin errores criticos
- `npm run build` genera carpeta de produccion correctamente

---

Mapify S.A.S. · Guia tecnica de instalacion · 2026
