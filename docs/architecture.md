# 🏗️ Arquitectura del Proyecto - Mapa de Reseñas

## 📊 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Navegador Web (Chrome, Firefox, etc.)              │   │
│  │  • Vite (Dev Server + Build Tool)                   │   │
│  │  • React 19 + React Router                          │   │
│  │  • Leaflet (Mapas)                                  │   │
│  │  • Tailwind CSS (Estilos)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS (Axios)
                     │ API REST (JSON)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js Server                                   │   │
│  │  • Rutas API (/api/lugares, /api/users, etc.)       │   │
│  │  • Middleware (Auth, Validación, Logs)              │   │
│  │  • Controllers (Lógica de negocio)                  │   │
│  │  • JWT (Autenticación)                              │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ Prisma ORM
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MySQL                                               │   │
│  │  • Tabla: users                                     │   │
│  │  • Tabla: places                                    │   │
│  │  • Tabla: reviews                                   │   │
│  │  • Tabla: categories                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas Completa

```
mapas/
│
├── 📄 README.md                    # Documentación principal
├── 📄 ARCHITECTURE.md              # Este archivo (arquitectura)
├── 📄 .gitignore                   # Archivos que Git debe ignorar
├── 📄 docker-compose.yml           # (Futuro) Para dockerizar el proyecto
│
├── 📂 client/                      # 🎨 FRONTEND (React + Vite)
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 postcss.config.js
│   ├── 📄 index.html
│   │
│   ├── 📂 public/                  # Archivos estáticos (imágenes, iconos)
│   │   └── vite.svg
│   │
│   └── 📂 src/                     # Código fuente del frontend
│       ├── 📄 main.jsx             # Punto de entrada
│       ├── 📄 App.jsx              # Componente raíz + Router
│       ├── 📄 index.css            # Estilos globales
│       │
│       ├── 📂 components/          # ⚛️ COMPONENT-DRIVEN DEVELOPMENT
│       │   │
│       │   ├── 📂 atoms/           # 🔹 ÁTOMOS - Componentes más básicos
│       │   │   ├── Button.jsx      # Botón (primary, secondary, etc.)
│       │   │   ├── Input.jsx       # Campo de texto
│       │   │   ├── Label.jsx       # Etiqueta de texto
│       │   │   ├── Avatar.jsx      # Imagen de perfil circular
│       │   │   ├── Badge.jsx       # Etiqueta pequeña (categoría, status)
│       │   │   ├── Icon.jsx        # Wrapper para iconos
│       │   │   ├── Rating.jsx      # Estrellas de calificación
│       │   │   ├── Spinner.jsx     # Indicador de carga
│       │   │   └── Image.jsx       # Imagen con lazy loading
│       │   │
│       │   ├── 📂 molecules/       # 🔸 MOLÉCULAS - Combinación de átomos
│       │   │   ├── SearchBar.jsx   # Input + Button de búsqueda
│       │   │   ├── FormField.jsx   # Label + Input + Error message
│       │   │   ├── CategoryTag.jsx # Badge + Icon de categoría
│       │   │   ├── UserInfo.jsx    # Avatar + Nombre + Fecha
│       │   │   ├── StarRating.jsx  # Rating + Contador de reseñas
│       │   │   ├── ImageUpload.jsx # Input file + Preview
│       │   │   └── AlertMessage.jsx # Icon + Mensaje (error, success)
│       │   │
│       │   ├── 📂 organisms/       # 🔶 ORGANISMOS - Secciones complejas
│       │   │   ├── Navbar.jsx      # Logo + Nav links + User menu
│       │   │   ├── Footer.jsx      # Footer completo
│       │   │   ├── LoginForm.jsx   # Formulario de login completo
│       │   │   ├── RegisterForm.jsx # Formulario de registro
│       │   │   ├── PlaceCard.jsx   # Card de lugar (img, título, rating)
│       │   │   ├── PlaceList.jsx   # Grid de PlaceCards
│       │   │   ├── ReviewCard.jsx  # Card de reseña individual
│       │   │   ├── ReviewList.jsx  # Lista de ReviewCards
│       │   │   ├── ReviewForm.jsx  # Form para crear reseña
│       │   │   ├── CategoryFilter.jsx # Filtros por categoría
│       │   │   ├── MapComponent.jsx # Mapa de Leaflet completo
│       │   │   ├── MapMarker.jsx   # Marcador personalizado
│       │   │   ├── PlaceDetails.jsx # Panel detalle completo de lugar
│       │   │   └── Modal.jsx       # Modal reutilizable
│       │   │
│       │   └── 📂 templates/       # 📐 TEMPLATES - Layouts de páginas
│       │       ├── MainLayout.jsx  # Layout principal (Navbar + Content + Footer)
│       │       ├── AuthLayout.jsx  # Layout para login/register
│       │       ├── MapLayout.jsx   # Layout con mapa + sidebar
│       │       └── DashboardLayout.jsx # Layout para admin
│       │
│       ├── 📂 pages/               # 📄 PÁGINAS - Vistas completas
│       │   ├── Home.jsx            # Landing page
│       │   ├── Explore.jsx         # Mapa + lista de lugares
│       │   ├── PlaceDetailsPage.jsx # Página de detalle de lugar
│       │   ├── Login.jsx           # Página de login
│       │   ├── Register.jsx        # Página de registro
│       │   ├── Profile.jsx         # Perfil de usuario
│       │   ├── CreatePlace.jsx     # Crear nuevo lugar
│       │   └── NotFound.jsx        # Error 404
│       │
│       ├── 📂 hooks/               # Custom Hooks (lógica reutilizable)
│       │   ├── useAuth.js          # Hook para autenticación
│       │   ├── usePlaces.js        # Hook para obtener lugares
│       │   ├── useReviews.js       # Hook para reseñas
│       │   └── useGeolocation.js   # Hook para obtener ubicación del usuario
│       │
│       ├── 📂 services/            # Comunicación con el backend
│       │   ├── api.js              # Configuración base de axios
│       │   ├── authService.js      # Login, registro, logout
│       │   ├── placesService.js    # CRUD de lugares
│       │   └── reviewsService.js   # CRUD de reseñas
│       │
│       ├── 📂 context/             # Context API (estado global)
│       │   ├── AuthContext.jsx     # Estado de autenticación
│       │   └── MapContext.jsx      # Estado del mapa
│       │
│       ├── 📂 utils/               # Funciones auxiliares
│       │   ├── constants.js        # Constantes (categorías, colores)
│       │   ├── validators.js       # Validación de formularios
│       │   └── formatters.js       # Formatear fechas, números, etc.
│       │
│       └── 📂 assets/              # Recursos (imágenes, iconos personalizados)
│           └── icons/
│
└── 📂 server/                      # ⚙️ BACKEND (Node.js + Express)
    ├── 📄 package.json
    ├── 📄 .env                     # Variables de entorno (SECRET, DB URL)
    ├── 📄 .env.example             # Ejemplo de .env para otros devs
    │
    └── 📂 src/                     # Código fuente del backend
        ├── 📄 server.js            # Punto de entrada del servidor
        ├── 📄 app.js               # Configuración de Express
        │
        ├── 📂 config/              # Configuraciones
        │   ├── database.js         # Conexión a MySQL
        │   └── jwt.js              # Configuración de JWT
        │
        ├── 📂 models/              # Modelos de datos (Prisma Models)
        │   ├── User.js             # Modelo de Usuario
        │   ├── Place.js            # Modelo de Lugar
        │   ├── Review.js           # Modelo de Reseña
        │   └── Category.js         # Modelo de Categoría
        │
        ├── 📂 routes/              # Rutas de la API
        │   ├── index.js            # Router principal
        │   ├── auth.routes.js      # /api/auth (login, register)
        │   ├── places.routes.js    # /api/places (CRUD lugares)
        │   ├── reviews.routes.js   # /api/reviews (CRUD reseñas)
        │   └── users.routes.js     # /api/users (perfil, etc.)
        │
        ├── 📂 controllers/         # Lógica de negocio
        │   ├── authController.js   # Login, registro, logout
        │   ├── placesController.js # CRUD de lugares
        │   ├── reviewsController.js # CRUD de reseñas
        │   └── usersController.js  # Perfil, actualizar usuario
        │
        ├── 📂 middleware/          # Funciones intermedias
        │   ├── auth.js             # Verificar JWT
        │   ├── validate.js         # Validar datos de entrada
        │   ├── errorHandler.js     # Manejo de errores global
        │   └── logger.js           # Logs de peticiones
        │
        ├── 📂 utils/               # Utilidades del servidor
        │   ├── generateToken.js    # Generar JWT
        │   └── catchAsync.js       # Wrapper para async/await
        │
        └── 📂 seeders/             # Datos de prueba
            └── seed.js             # Script para poblar la DB
```

---

## 🗄️ Modelos de Base de Datos (MySQL + Prisma)

### **1. User (Usuario)**
```javascript
{
  id: Int,
  nombre: String,
  email: String,          // único
  password: String,       // hasheado con bcrypt
  avatar: String,         // URL de imagen
  rol: String,           // 'user' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Category (Categoría)**
```javascript
{
  id: Int,
  nombre: String,        // "Restaurantes", "Turismo", etc.
  slug: String,          // "restaurantes", "turismo"
  icono: String,         // Nombre del icono
  color: String,         // Color hexadecimal
  descripcion: String
}
```

### **3. Place (Lugar)**
```javascript
{
  id: Int,
  nombre: String,
  descripcion: String,
  categoriaId: Int,      // FK a Category
  latitud: Decimal,
  longitud: Decimal,
  direccion: String,
  telefono: String,
  horario: String,
  sitioWeb: String,
  imagenes: Json,        // Array de URLs
  creadorId: Int,        // FK a User
  puntuacionPromedio: Number,  // Calculado de las reseñas
  totalReseñas: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### **4. Review (Reseña)**
```javascript
{
  id: Int,
  lugarId: Int,          // FK a Place
  usuarioId: Int,        // FK a User
  puntuacion: Number,    // 1-5 estrellas
  comentario: String,
  imagenes: Json,        // Fotos del usuario
  fechaVisita: Date,
  meGusta: Number,       // Contador de likes
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 API REST - Endpoints

### **Autenticación**
```
POST   /api/auth/register        - Registrar usuario
POST   /api/auth/login           - Iniciar sesión
GET    /api/auth/me              - Obtener usuario actual (requiere JWT)
```

### **Lugares**
```
GET    /api/places               - Listar todos los lugares (con filtros)
GET    /api/places/:id           - Obtener un lugar por ID
POST   /api/places               - Crear nuevo lugar (auth)
PUT    /api/places/:id           - Actualizar lugar (auth)
DELETE /api/places/:id           - Eliminar lugar (auth)
GET    /api/places/nearby        - Lugares cercanos (query: lat, lng, radius)
```

### **Reseñas**
```
GET    /api/reviews              - Listar reseñas (filtrar por lugar)
GET    /api/reviews/:id          - Obtener una reseña
POST   /api/reviews              - Crear reseña (auth)
PUT    /api/reviews/:id          - Actualizar reseña (auth)
DELETE /api/reviews/:id          - Eliminar reseña (auth)
```

### **Categorías**
```
GET    /api/categories           - Listar todas las categorías
GET    /api/categories/:id       - Obtener una categoría
```

### **Usuarios**
```
GET    /api/users/:id            - Obtener perfil de usuario
PUT    /api/users/:id            - Actualizar perfil (auth)
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario se registra → Backend crea user + hashea password
2. Usuario hace login → Backend verifica password → Genera JWT
3. Frontend guarda JWT en localStorage
4. En cada petición → Frontend envía JWT en header:
   Authorization: Bearer <token>
5. Backend verifica JWT → Permite/Deniega acceso
```

---

## 🎨 Categorías Predefinidas

```javascript
const categorias = [
  {
    nombre: 'Restaurantes',
    slug: 'restaurantes',
    icono: 'UtensilsCrossed',
    color: '#ef4444'  // Rojo
  },
  {
    nombre: 'Cafeterías',
    slug: 'cafeterias',
    icono: 'Coffee',
    color: '#8b4513'  // Marrón
  },
  {
    nombre: 'Turismo',
    slug: 'turismo',
    icono: 'Camera',
    color: '#3b82f6'  // Azul
  },
  {
    nombre: 'Parques',
    slug: 'parques',
    icono: 'Trees',
    color: '#10b981'  // Verde
  },
  {
    nombre: 'Entretenimiento',
    slug: 'entretenimiento',
    icono: 'Ticket',
    color: '#a855f7'  // Púrpura
  },
  {
    nombre: 'Hoteles',
    slug: 'hoteles',
    icono: 'Hotel',
    color: '#f59e0b'  // Naranja
  }
]
```

---

## 🚀 Fases de Desarrollo

### **Fase 1: MVP (Producto Mínimo Viable)** ⭐
- ✅ Configuración del proyecto
- ✅ Mapa interactivo básico con Leaflet
- ✅ Ver lugares en el mapa (datos estáticos)
- ✅ Filtrar por categoría
- ✅ Ver detalle de un lugar

### **Fase 2: Backend + Base de Datos**
- ⬜ Configurar Express, MySQL y Prisma ORM
- ⬜ Crear modelos de datos
- ⬜ API REST completa
- ⬜ Conectar frontend con backend

### **Fase 3: Autenticación**
- ⬜ Registro de usuarios
- ⬜ Login/Logout
- ⬜ Proteger rutas

### **Fase 4: Funcionalidades Principales**
- ⬜ Crear nuevos lugares
- ⬜ Sistema de reseñas
- ⬜ Subir imágenes
- ⬜ Búsqueda y filtros avanzados

### **Fase 5: Features Avanzadas**
- ⬜ Geolocalización del usuario
- ⬜ Favoritos/Guardados
- ⬜ Panel de administración
- ⬜ Notificaciones
- ⬜ Compartir en redes sociales

### **Fase 6: Optimización y Deploy**
- ⬜ Testing (Jest, React Testing Library)
- ⬜ Optimización de rendimiento
- ⬜ SEO
- ⬜ Deploy en Vercel (frontend) + Railway (backend)

---

## 🛠️ Tecnologías Elegidas y Por Qué

| Tecnología | Propósito | ¿Por qué? |
|------------|-----------|-----------|
| **React** | UI Framework | Componentes reutilizables, gran comunidad, fácil de aprender |
| **Vite** | Build Tool | Mucho más rápido que CRA, HMR instantáneo |
| **Tailwind CSS** | Estilos | Desarrollo rápido, diseños modernos, mobile-first |
| **Leaflet** | Mapas | Gratis, ligero, fácil de usar, sin límites de API |
| **React Router** | Navegación | Estándar de la industria para SPAs |
| **Axios** | HTTP Client | Más features que fetch, interceptors, mejor DX |
| **Node.js** | Backend Runtime | JavaScript full-stack, gran ecosistema |
| **Express** | Web Framework | Simple, flexible, bien documentado |
| **MySQL** | Base de Datos | Relacional, robusta y ampliamente adoptada |
| **Prisma ORM** | ORM | Tipado, migraciones y modelado declarativo |
| **JWT** | Autenticación | Stateless, seguro, fácil de implementar |

---

## 📚 Aprenderás

- ✅ Arquitectura cliente-servidor
- ✅ API REST
- ✅ Autenticación y seguridad
- ✅ Manejo de estado en React
- ✅ Integración de mapas
- ✅ Base de datos SQL relacional
- ✅ Git y GitHub Flow
- ✅ Mejores prácticas de código

---

## 🎯 Próximos Pasos

1. ✅ Configurar Git y GitHub
2. Crear estructura de carpetas
3. Implementar mapa básico
4. Configurar backend
5. Conectar todo

---

**¡Esta es la hoja de ruta completa del proyecto!** 🚀
