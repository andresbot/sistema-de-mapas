# Rediseño Frontend Completo — Mapa de Reseñas

## Decisiones de diseño

| Dimensión | Decisión |
|---|---|
| Estética | Explorador Urbano — fondo casi negro, acento ámbar dorado, tipografía serif |
| Layout | Mapa inmersivo + panel deslizante |
| Navegación | Integrada dentro del panel (mapa 100% limpio) |
| Estrategia | Reescritura limpia (clean rewrite) |
| Iconos UI | `lucide-react` |
| Iconos mapa | Marcadores custom con SVG / emoji transitorio |

---

## Design System

### Paleta de colores

```css
--bg:           #0C0C0E   /* base oscura */
--bg-2:         #111118   /* elevada */
--bg-3:         #16161F   /* tarjetas */
--glass:        rgba(12,12,14,0.88)
--glass-strong: rgba(10,10,16,0.96)

--amber:        #F59E0B   /* acento principal */
--amber-dim:    rgba(245,158,11,0.18)
--amber-glow:   rgba(245,158,11,0.10)
--amber-border: rgba(245,158,11,0.22)

--text-1:       #F5F0E8   /* texto principal */
--text-2:       #A89880   /* texto secundario */
--text-3:       #5C5248   /* texto muted */

--success:      #10B981
--danger:       #EF4444
--warn:         #F59E0B
```

### Tipografía

- **Display / nombres de lugares**: `Playfair Display` — italic 700, serif. Evoca guía de viaje de lujo.
- **UI / cuerpo**: `DM Sans` — 400/500/600/700. Moderno, legible, neutro.
- Importar desde Google Fonts en `index.html`.

### Tokens de espaciado y radios

```css
--r-sm:   8px
--r:      14px
--r-lg:   20px
--r-xl:   28px
--r-pill: 999px
--ease:   0.22s cubic-bezier(0.4, 0, 0.2, 1)
```

### Breakpoint responsive

- `< 960px` → móvil: panel deslizante **desde abajo**, ocultar panel derecho
- `≥ 960px` → desktop: panel derecho **fijo**, ocultar panel inferior

---

## Arquitectura de archivos (nueva estructura)

```
frontend/src/
├── screens/                    ← nueva carpeta, un archivo por pantalla
│   ├── ExplorerScreen.jsx
│   ├── DetailScreen.jsx
│   ├── AddPlaceScreen.jsx
│   ├── SavedScreen.jsx
│   ├── ProfileScreen.jsx
│   └── PublicProfileScreen.jsx
├── components/
│   ├── MapContainer.jsx        ← sin cambios (lógica Mapbox)
│   ├── Toast.jsx               ← sin cambios
│   ├── shared/
│   │   ├── Panel.jsx           ← panel deslizante reutilizable
│   │   ├── PanelNav.jsx        ← nav integrada en el panel
│   │   ├── PlaceCard.jsx       ← tarjeta de lugar (lista)
│   │   ├── SearchBar.jsx       ← búsqueda flotante
│   │   └── CategoryChips.jsx   ← chips de categoría
├── styles/
│   ├── tokens.css              ← SOLO variables CSS (reemplaza base.css)
│   ├── global.css              ← reset + tipografía + body
│   ├── panel.css               ← estilos del panel deslizante
│   ├── components.css          ← botones, chips, badges reutilizables
│   └── screens.css             ← estilos específicos por pantalla
├── App.jsx                     ← sin cambios lógicos, actualizar imports
└── main.jsx                    ← actualizar imports de estilos
```

**Archivos a eliminar:**
- `src/components/ScreenViews.jsx` (959 líneas → dividido en `screens/`)
- `src/styles/base.css`, `layout.css`, `nav-responsive.css`, `panels.css`, `auth-profile.css`

**Archivos a conservar sin cambios:**
- Todo el backend
- `src/context/AuthContext.jsx`, `ThemeContext.jsx`
- `src/services/api.js`, `authService.js`, `placesService.js`
- `src/components/MapContainer.jsx`, `Toast.jsx`
- `src/App.jsx` (solo actualizar imports y props)

---

## Pantallas

### 1. ExplorerScreen

**Móvil:**
- Mapa ocupa 100% viewport
- `SearchBar` flotante en la parte superior (pill con blur)
- `CategoryChips` flotantes bajo la barra de búsqueda
- `Panel` deslizante desde abajo (altura ~45% collapsed, 80% expanded)
  - Handle de arrastre
  - `PanelNav` con iconos lucide: Map, Bookmark, Plus, User
  - Lista de lugares con `PlaceCard`

**Desktop:**
- Mapa ocupa toda la pantalla menos el panel derecho
- `SearchBar` flotante sobre el mapa (top-left, width ~240px)
- Panel derecho fijo (width 300px)
  - Header: marca "Mapa de Reseñas" + avatar de usuario
  - `PanelNav` horizontal (tabs: Explorar | Guardados | Perfil)
  - Filtro de categoría inline
  - Lista scrollable de `PlaceCard`
  - Botón "＋ Publicar lugar" fijo al fondo

### 2. DetailScreen

Panel deslizante con información del lugar. En móvil sube desde abajo (full-height). En desktop reemplaza el panel derecho.

**Contenido del panel:**
- Botón volver (X o ←) en la esquina
- Nombre del lugar en Playfair Display italic
- Categoría + distancia + rating (con `Star` de lucide)
- Botones de acción en fila: Favorito (`Bookmark`), Compartir (`Share2`), Reportar (`Flag`)
- Descripción
- Info: dirección (`MapPin`), horario (`Clock`), teléfono (`Phone`), web (`Globe`)
- Sección "Reseñas" con `MessageSquare` icon
  - Formulario inline para agregar reseña (estrellas + comentario)
  - Lista de reseñas existentes con opción de eliminar/reportar
- "Ver perfil del creador" con `User` icon
- Lugares similares (3 tarjetas)
- Botón "Eliminar lugar" (solo creador/admin)

### 3. AddPlaceScreen

Panel que reemplaza al de exploración. Mini-mapa para seleccionar coordenadas. Formulario: nombre, categoría (chips seleccionables), descripción. Botón enviar con `Send` icon.

### 4. SavedScreen

Reemplaza el contenido del panel. Grid de lugares guardados con `PlaceCard`. Estado vacío con `BookmarkX` icon de lucide.

### 5. ProfileScreen

Panel con perfil del usuario autenticado. Stats (lugares publicados, reseñas). Formulario de login/registro cuando no autenticado. Avatar con iniciales.

### 6. PublicProfileScreen

Panel con perfil público de otro usuario. Avatar + nombre + año de miembro. Grid de lugares publicados.

---

## Componentes compartidos

### Panel.jsx
- `isOpen`, `onClose`, `children`
- Animación CSS: `transform: translateY(0)` / `translateY(100%)` en móvil
- En desktop: no animado, siempre visible como columna derecha

### PanelNav.jsx
- `activeView`, `onNavigate`, `isAuthenticated`
- Iconos lucide: `Map`, `Bookmark`, `Plus`, `User`
- En móvil: fila horizontal dentro del panel
- En desktop: tabs horizontales en el panel derecho

### PlaceCard.jsx
- `place`, `onClick`, `isFavorited`
- Layout: icono de categoría + nombre (Playfair italic) + meta + rating
- Hover: amber glow border

### SearchBar.jsx
- `value`, `onChange`, `placeholder`
- Icono `Search` de lucide
- Pill flotante con glassmorphism

### CategoryChips.jsx
- `selected`, `onChange`
- Lista: Todos, Restaurante, Parque, Cultura, Tienda, Servicio, Turismo

---

## Iconos lucide a usar

| Uso | Icono |
|---|---|
| Buscar | `Search` |
| Marcador mapa | `MapPin` |
| Favorito | `Bookmark`, `BookmarkCheck` |
| Compartir | `Share2` |
| Reportar | `Flag` |
| Volver | `ArrowLeft`, `X` |
| Usuario | `User` |
| Estrellas | `Star` |
| Reseña | `MessageSquare` |
| Reloj | `Clock` |
| Teléfono | `Phone` |
| Web | `Globe` |
| Agregar | `Plus`, `PlusCircle` |
| Eliminar | `Trash2` |
| Enviar | `Send` |
| Guardados vacíos | `BookmarkX` |
| Tema | `Sun`, `Moon` |
| Explorar | `Map` |

Uso estándar: `strokeWidth={1.5}` para UI principal, `strokeWidth={2}` para acciones críticas. Tamaño base: `size={18}`.

---

## Comportamiento del panel

```
Estado collapsed (móvil): translateY(55%)  — visible handle + nav
Estado expanded (móvil):  translateY(0)    — panel completo
Trigger expand: tap en handle o tap en lugar del mapa
Trigger collapse: swipe down o botón X en detalle
```

---

## Modo claro / oscuro

El diseño es **dark-first**. `ThemeContext` sigue activo. En modo claro, los tokens se invierten:

```css
[data-theme="light"] {
  --bg:           #F5F0E8
  --bg-2:         #FFFFFF
  --glass-strong: rgba(245,240,232,0.96)
  --text-1:       #1A1208
  --text-2:       #6B5A3E
  --amber:        #D97706   /* ligeramente más oscuro para contraste */
}
```

El botón de toggle usa `Sun` / `Moon` de lucide, ubicado en el header del panel.

---

## Lo que NO cambia

- Toda la lógica de `App.jsx` (estado, handlers, fetch)
- Todos los servicios (`api.js`, `placesService.js`, `authService.js`)
- Contextos (`AuthContext`, `ThemeContext`)
- El backend completo (Prisma, Express, controllers, routes)
- `MapContainer.jsx` y `Toast.jsx`
