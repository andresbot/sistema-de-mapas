# HS25 – Ver perfil público de negocio

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a public profile page for any place creator, displaying their name, avatar, and all the places they've published. Accessible by tapping "Ver perfil" in DetailScreen.

**Architecture:** New `GET /api/usuarios/:id/perfil` endpoint returns public user data + their places (no email/password). Frontend adds a `PublicProfileScreen` component and a `publicProfile` view state in App.jsx.

**Tech Stack:** Prisma (MySQL), Express, React (no extra libs)

**IMPORTANT:** This plan is intended to run AFTER HS27 (favoritos) has been merged, since HS27 also modifies App.jsx and ScreenViews.jsx.

---

### Task 1: Create public profile backend endpoint

**Files:**
- Create: `backend/src/controllers/usuariosController.js`
- Create: `backend/src/routes/usuarios.routes.js`
- Modify: `backend/src/server.js`

- [ ] **Step 1: Create controller**

Create `backend/src/controllers/usuariosController.js`:

```javascript
import { prisma } from '../config/prisma.js';

export const getPerfilPublico = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        avatar: true,
        createdAt: true,
        lugares: {
          where: { publicado: true },
          include: {
            categoria: { select: { nombre: true, icono: true, color: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const lugares = usuario.lugares.map((lugar) => ({
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

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      avatar: usuario.avatar || null,
      miembro: usuario.createdAt,
      lugares,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

- [ ] **Step 2: Create routes file**

Create `backend/src/routes/usuarios.routes.js`:

```javascript
import { Router } from 'express';
import { getPerfilPublico } from '../controllers/usuariosController.js';

const router = Router();

router.get('/usuarios/:id/perfil', getPerfilPublico);

export default router;
```

- [ ] **Step 3: Register routes in server.js**

Add after existing route registrations in `backend/src/server.js`:

```javascript
import usuariosRoutes from './routes/usuarios.routes.js';
// ...
app.use('/api', usuariosRoutes);
```

- [ ] **Step 4: Manual smoke test**

```bash
curl http://localhost:5000/api/usuarios/<any-userId>/perfil
# Expected: { id, nombre, avatar, miembro, lugares: [...] }
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/controllers/usuariosController.js \
        backend/src/routes/usuarios.routes.js \
        backend/src/server.js
git commit -m "funcionalidad: HS25 endpoint perfil público de negocio"
```

---

### Task 2: Add PublicProfileScreen to ScreenViews.jsx

**Files:**
- Modify: `frontend/src/components/ScreenViews.jsx`

The screen shows:
- Header with back button + user name
- Avatar / initials circle
- Member-since date
- Grid of the user's places (same style as saved-grid)

- [ ] **Step 1: Add PublicProfileScreen export at the bottom of ScreenViews.jsx**

```jsx
export function PublicProfileScreen({ profile, onBack, onSelectPlace, onNavigate }) {
  if (!profile) return null;

  const initials = profile.nombre
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const sinceYear = profile.miembro
    ? new Date(profile.miembro).getFullYear()
    : null;

  return (
    <div className="screen-shell profile-shell">
      <ShellHeader
        title={profile.nombre}
        subtitle={sinceYear ? `Miembro desde ${sinceYear}` : 'Creador de lugares'}
        onBack={onBack}
        actions={
          <button type="button" className="pill-button pill-button--ghost" onClick={() => onNavigate('mapa')}>
            Explorar
          </button>
        }
      />

      <main className="profile-layout glass-card">
        <div className="public-profile-hero">
          <div className="profile-avatar profile-avatar--lg">
            {profile.avatar
              ? <img src={profile.avatar} alt={profile.nombre} />
              : <span>{initials}</span>
            }
          </div>
          <div>
            <h2 className="public-profile__name">{profile.nombre}</h2>
            <p className="eyebrow">{profile.lugares.length} lugares publicados</p>
          </div>
        </div>

        {profile.lugares.length === 0 ? (
          <div className="empty-state">
            <p className="eyebrow">Sin lugares</p>
            <h1>Este usuario no ha publicado lugares aún</h1>
          </div>
        ) : (
          <div className="saved-grid">
            {profile.lugares.map((place) => {
              const meta = categoryMeta(place.categoria);
              return (
                <button
                  key={place.id}
                  type="button"
                  className="saved-item"
                  onClick={() => onSelectPlace(place)}
                >
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
      </main>

      <DockNav activeView="mapa" onNavigate={onNavigate} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ScreenViews.jsx
git commit -m "ui: HS25 pantalla PublicProfileScreen"
```

---

### Task 3: Wire PublicProfileScreen into App.jsx

**Files:**
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Import PublicProfileScreen**

Add `PublicProfileScreen` to the existing import from `./components/ScreenViews`:

```javascript
import {
  AddPlaceScreen,
  DetailScreen,
  ExplorerScreen,
  ProfileScreen,
  PublicProfileScreen,
  SavedScreen,
} from './components/ScreenViews';
```

- [ ] **Step 2: Add state**

Add after existing state declarations:

```javascript
const [publicProfile, setPublicProfile] = useState(null);
```

- [ ] **Step 3: Add fetch + open handler**

```javascript
const handleOpenPublicProfile = useCallback(async (userId) => {
  try {
    const res = await api.get(`/usuarios/${userId}/perfil`);
    setPublicProfile(res.data);
    setView('publicProfile');
  } catch {
    showToast('No se pudo cargar el perfil', 'error');
  }
}, [showToast]);
```

- [ ] **Step 4: Pass handler to DetailScreen**

Add `onOpenPublicProfile={handleOpenPublicProfile}` to the `<DetailScreen ...>` render.

- [ ] **Step 5: Add PublicProfileScreen to JSX render block**

Add after the `SavedScreen` block:

```jsx
{view === 'publicProfile' && publicProfile && (
  <PublicProfileScreen
    profile={publicProfile}
    onBack={() => setView('detalle')}
    onSelectPlace={handleSelectPlace}
    onNavigate={navigate}
  />
)}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/App.jsx
git commit -m "funcionalidad: HS25 navegar al perfil público desde detalle"
```

---

### Task 4: Add "Ver perfil" button in DetailScreen

**Files:**
- Modify: `frontend/src/components/ScreenViews.jsx`

`DetailScreen` receives `onOpenPublicProfile` prop. Find the section that displays the place creator info (or the detail actions area) and add a button.

- [ ] **Step 1: Add onOpenPublicProfile to DetailScreen props**

In the `DetailScreen` function signature, add `onOpenPublicProfile` to destructured props.

- [ ] **Step 2: Add button near creator info**

In the creator / info section of DetailScreen, after displaying the place name/category, add:

```jsx
{place.creadorId && onOpenPublicProfile && (
  <button
    type="button"
    className="inline-button"
    onClick={() => onOpenPublicProfile(place.creadorId)}
  >
    Ver perfil del creador
  </button>
)}
```

Note: `place.creadorId` must be included in the `getLugares` response. Check `lugaresController.js` — if `creadorId` is not currently returned in the response mapping, add it:
```javascript
creadorId: lugar.creadorId,
```

- [ ] **Step 3: Verify creadorId is in getLugares response**

Open `backend/src/controllers/lugaresController.js`, find the `response` mapping in `getLugares`, and confirm or add `creadorId: lugar.creadorId`.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ScreenViews.jsx \
        backend/src/controllers/lugaresController.js
git commit -m "funcionalidad: HS25 botón Ver perfil del creador en detalle"
```
