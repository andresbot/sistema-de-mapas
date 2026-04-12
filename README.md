# 🗺️ Mapa de Reseñas

Aplicación web full-stack para descubrir y compartir lugares con reseñas, categorías y mapa interactivo.

![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

---

## 📖 Descripción

Proyecto de aprendizaje para construir una aplicación completa de mapas con reseñas. Los usuarios pueden:

- 🗺️ Explorar lugares en un mapa interactivo
- 📍 Ver restaurantes, sitios turísticos, cafeterías, etc.
- ⭐ Leer y escribir reseñas
- 🔍 Filtrar por categorías
- 📱 Diseño responsive (mobile-first)
- 🔐 Crear cuenta y autenticarse

---

## 🛠️ Tecnologías

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Leaflet** - Mapas interactivos
- **React Router** - Navegación
- **Axios** - HTTP requests

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Base de datos
- **Mongoose** - ODM
- **JWT** - Autenticación

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/) (local o MongoDB Atlas)
- [Git](https://git-scm.com/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/mapas.git
cd mapas
```

### 2. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

### 3. Instalar dependencias del backend

```bash
cd ../backend
npm install
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mapas-db
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
```

---

## ▶️ Ejecutar el Proyecto

### Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El servidor correrá en `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
La app estará en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
mapas/
├── frontend/          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
│
├── backend/          # Backend Node.js
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   └── package.json
│
└── ARCHITECTURE.md   # Documentación de arquitectura
```

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para detalles completos.

---

## 🎯 Roadmap

- [x] Configuración inicial del proyecto
- [x] Arquitectura frontend + backend
- [ ] Mapa interactivo básico
- [ ] Sistema de categorías
- [ ] Autenticación de usuarios
- [ ] CRUD de lugares
- [ ] Sistema de reseñas
- [ ] Subida de imágenes
- [ ] Deploy a producción

---
