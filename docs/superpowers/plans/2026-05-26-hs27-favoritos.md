# HS27 – Guardar lugares en favoritos

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow authenticated users to bookmark/unbookmark places and view their saved list in the SavedScreen.

**Architecture:** Toggle endpoint (`POST /api/favoritos/:lugarId`) upserts or deletes a Favorito row. A `GET /api/favoritos` returns the current user's saved places. Frontend fetches on mount/auth change, passes `savedPlaces` to `SavedScreen`, and shows a bookmark button in `DetailScreen`.

**Tech Stack:** Prisma (MySQL), Express, React (no extra libs)

---

### Task 1: Add Favorito model to Prisma schema and apply migration

**Files:**
- Modify: `backend/prisma/schema.prisma`

The `favoritos` table was already created by migration `20260525193000_add_favoritos`. We only need to add the model declaration so Prisma Client knows about it.

- [ ] **Step 1: Add Favorito model**

Open `backend/prisma/schema.prisma` and add the following model after the `Resena` model:

```prisma
model Favorito {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  lugarId   String
  usuarioId String

  lugar   Lugar   @relation(fields: [lugarId], references: [id], onDelete: Cascade)
  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@unique([lugarId, usuarioId])
  @@map("favoritos")
}
```

Also add the back-relations:
- In `model Usuario`: add `favoritos Favorito[]`
- In `model Lugar`: add `favoritos  Favorito[]`

- [ ] **Step 2: Generate Prisma client**

```bash
cd backend && npx prisma generate
```

Expected: `Generated Prisma Client` (no errors). The migration is already applied to the DB.

- [ ] **Step 3: Commit**

```bash
git add backend/prisma/schema.prisma
git commit -m "db: agregar modelo Favorito al esquema de Prisma"
```

---

### Task 2: Create favorites controller and routes

**Files:**
- Create: `backend/src/controllers/favoritosController.js`
- Create: `backend/src/routes/favoritos.routes.js`
- Modify: `backend/src/server.js`

- [ ] **Step 1: Create controller**

Create `backend/src/controllers/favoritosController.js`:

```javascript
import { prisma } from '../config/prisma.js';

export const toggleFavorito = async (req, res) => {
  try {
    const { lugarId } = req.params;
    const usuarioId = req.user.id;

    const lugar = await prisma.lugar.findUnique({ where: { id: lugarId } });
    if (!lugar) return res.status(404).json({ success: false, message: 'Lugar no encontrado' });

    const existing = await prisma.favorito.findUnique({
      where: { lugarId_usuarioId: { lugarId, usuarioId } },
    });

    if (existing) {
      await prisma.favorito.delete({ where: { id: existing.id } });
      return res.json({ success: true, favorito: false });
    }

    await prisma.favorito.create({ data: { lugarId, usuarioId } });
    res.status(201).json({ success: true, favorito: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavoritos = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const favoritos = await prisma.favorito.findMany({
      where: { usuarioId },
      include: {
        lugar: {
          include: {
            categoria: { select: { nombre: true, icono: true, color: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const lugares = favoritos.map(({ lugar }) => ({
      id: lugar.id,
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      latitud: lugar.latitud,
      longitud: lugar.longitud,
      direccion: lugar.direccion,
      puntuacionPromedio: lugar.puntuacionPromedio,
      totalResenas: lugar.totalResenas,
      categoria: lugar.categoria?.nombre || 'General',
      categoriaIcono: lugar.categoria?.icono || '📍',
      categoriaColor: lugar.categoria?.color || '#007AFF',
    }));

    res.json(lugares);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

- [ ] **Step 2: Create routes file**

Create `backend/src/routes/favoritos.routes.js`:

```javascript
import { Router } from 'express';
import { toggleFavorito, getFavoritos } from '../controllers/favoritosController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/favoritos', verifyToken, getFavoritos);
router.post('/favoritos/:lugarId', verifyToken, toggleFavorito);

export default router;
```

- [ ] **Step 3: Register routes in server.js**

In `backend/src/server.js`, add after the `lugaresRoutes` import/use:

```javascript
import favoritosRoutes from './routes/favoritos.routes.js';
// ...
app.use('/api', favoritosRoutes);
```

- [ ] **Step 4: Manual smoke test** (backend must be running)

```bash
# Toggle: expect { success: true, favorito: true }
curl -X POST http://localhost:5000/api/favoritos/<any-lugarId> \
  -H "Authorization: Bearer <token>"

# List: expect array
curl http://localhost:5000/api/favoritos \
  -H "Authorization: Bearer <token>"
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/controllers/favoritosController.js \
        backend/src/routes/favoritos.routes.js \
        backend/src/server.js
git commit -m "funcionalidad: HS27 endpoints toggle y listado de favoritos"
```

---

### Task 3: Wire favorites into frontend

**Files:**
- Modify: `frontend/src/services/placesService.js`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/ScreenViews.jsx`

#### 3a – placesService.js

Add at the end of `frontend/src/services/placesService.js`:

```javascript
export const getFavoritos = async () => {
  const response = await api.get('/favoritos');
  return response.data;
};

export const toggleFavorito = async (lugarId) => {
  const response = await api.post(`/favoritos/${lugarId}`);
  return response.data; // { success, favorito: boolean }
};
```

#### 3b – App.jsx changes

1. Import the new service functions:
```javascript
import { getLugares, getFavoritos, toggleFavorito } from './services/placesService';
```

2. Add state + fetch after `const [toast, setToast] = useState(null);`:
```javascript
const [savedPlaces, setSavedPlaces] = useState([]);
const [favoritoIds, setFavoritoIds] = useState(new Set());
```

3. Add a `fetchFavoritos` function (call it when authenticated):
```javascript
const fetchFavoritos = useCallback(async () => {
  if (!isAuthenticated) { setSavedPlaces([]); setFavoritoIds(new Set()); return; }
  try {
    const data = await getFavoritos();
    setSavedPlaces(data);
    setFavoritoIds(new Set(data.map((p) => p.id)));
  } catch {
    // silent fail
  }
}, [isAuthenticated]);
```

4. Add `fetchFavoritos` to the initial `useEffect` (already loads on mount):
```javascript
useEffect(() => {
  fetchLugares();
  fetchFavoritos();
  // ... geolocation unchanged
}, [fetchFavoritos]);
```
Note: wrap `fetchLugares` with `useCallback` to satisfy the deps array, or keep deps as `[]` and call `fetchFavoritos()` directly — either is fine.

5. Add toggle handler:
```javascript
const handleToggleFavorito = async (lugarId) => {
  if (!isAuthenticated) { requireAuth('detalle'); return; }
  try {
    await toggleFavorito(lugarId);
    await fetchFavoritos();
  } catch {
    showToast('Error al actualizar favorito', 'error');
  }
};
```

6. Pass new props to `DetailScreen`:
```jsx
<DetailScreen
  ...existing props...
  isFavorited={favoritoIds.has(selectedPlace?.id)}
  onToggleFavorito={handleToggleFavorito}
/>
```

7. Pass `savedPlaces` to `SavedScreen`:
```jsx
<SavedScreen
  onNavigate={navigate}
  savedPlaces={savedPlaces}
  onSelectPlace={handleSelectPlace}
/>
```

#### 3c – ScreenViews.jsx changes

**DetailScreen** — add bookmark button in the header area.

Add `isFavorited` and `onToggleFavorito` to the destructured props of `DetailScreen`. Then inside the header actions area (near the back button), add:

```jsx
<button
  type="button"
  className={`icon-button${isFavorited ? ' icon-button--active' : ''}`}
  onClick={() => onToggleFavorito(place.id)}
  aria-label={isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
  title={isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
>
  {isFavorited ? '🔖' : '🏷️'}
</button>
```

**SavedScreen** — fix the component to correctly show/hide empty state.

Replace the `SavedScreen` function signature:
```jsx
export function SavedScreen({ onNavigate, savedPlaces = [], onSelectPlace }) {
  const items = savedPlaces;
  const isEmpty = items.length === 0;
```

Then in the JSX, wrap the empty state and grid conditionally:
```jsx
{isEmpty ? (
  <div className="empty-state">
    <p className="eyebrow">Sin guardados</p>
    <h1>Aún no tienes lugares guardados</h1>
    <p>Marca algunos lugares como favoritos para reunirlos aquí.</p>
  </div>
) : (
  <div className="saved-grid">
    {items.map((place) => {
      const meta = categoryMeta(place.categoria);
      return (
        <button key={place.id} type="button" className="saved-item" onClick={() => onSelectPlace(place)}>
          <span className="saved-item__icon">{meta.icon}</span>
          <div>
            <strong>{place.nombre}</strong>
            <p>{place.categoria}</p>
          </div>
        </button>
      );
    })}
  </div>
)}
```

- [ ] **Step 1: Edit placesService.js** — add `getFavoritos` and `toggleFavorito` exports
- [ ] **Step 2: Edit App.jsx** — add state, fetch, toggle handler, pass props
- [ ] **Step 3: Edit ScreenViews.jsx** — DetailScreen bookmark button, SavedScreen conditional render
- [ ] **Step 4: Commit**

```bash
git add frontend/src/services/placesService.js \
        frontend/src/App.jsx \
        frontend/src/components/ScreenViews.jsx
git commit -m "funcionalidad: HS27 guardar/quitar favoritos en frontend"
```
