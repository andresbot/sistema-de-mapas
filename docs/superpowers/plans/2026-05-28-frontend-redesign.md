# Frontend Redesign — Explorador Urbano

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir completamente el frontend de "Mapa de Reseñas" con estética Explorador Urbano (oscuro, ámbar, serif), layout de mapa inmersivo con panel deslizante y navegación integrada en el panel, usando `lucide-react` para iconos.

**Architecture:** Se elimina `ScreenViews.jsx` (959 líneas) y se divide en 6 archivos en `src/screens/`. Se crean 5 componentes compartidos en `src/components/shared/`. El design system se reemplaza por `tokens.css` + `global.css`. `App.jsx` conserva toda su lógica — solo cambian los imports.

**Tech Stack:** React 18, Vite, lucide-react, react-map-gl/mapbox, CSS custom properties (sin Tailwind, sin CSS-in-JS)

---

## Mapa de archivos

**Crear:**
- `frontend/src/styles/tokens.css` — variables CSS (paleta, tipografía, espaciado)
- `frontend/src/styles/global.css` — reset, body, utilidades
- `frontend/src/styles/panel.css` — panel deslizante, chips, search flotante
- `frontend/src/styles/components.css` — botones, badges, toasts, formularios (reemplaza el actual)
- `frontend/src/components/shared/SearchBar.jsx`
- `frontend/src/components/shared/CategoryChips.jsx`
- `frontend/src/components/shared/PlaceCard.jsx`
- `frontend/src/components/shared/PanelNav.jsx`
- `frontend/src/screens/ExplorerScreen.jsx`
- `frontend/src/screens/DetailScreen.jsx`
- `frontend/src/screens/AddPlaceScreen.jsx`
- `frontend/src/screens/SavedScreen.jsx`
- `frontend/src/screens/PublicProfileScreen.jsx`
- `frontend/src/screens/ProfileScreen.jsx`

**Modificar:**
- `frontend/index.html` — agregar Google Fonts (Playfair Display + DM Sans)
- `frontend/src/main.jsx` — actualizar imports de CSS
- `frontend/src/App.jsx` — actualizar imports de screens
- `frontend/src/components/MapContainer.jsx` — actualizar clase `.custom-marker` al nuevo estilo ámbar

**Eliminar:**
- `frontend/src/components/ScreenViews.jsx`
- `frontend/src/styles/base.css`
- `frontend/src/styles/layout.css`
- `frontend/src/styles/nav-responsive.css`
- `frontend/src/styles/panels.css`
- `frontend/src/styles/auth-profile.css`
- `frontend/src/styles/screens.css` (se reemplaza con la nueva versión)

---

## Task 1: Design tokens y CSS global

**Files:**
- Create: `frontend/src/styles/tokens.css`
- Create: `frontend/src/styles/global.css`
- Modify: `frontend/index.html`

- [ ] **Step 1: Crear tokens.css**

```css
/* frontend/src/styles/tokens.css */
:root, [data-theme="dark"] {
  --bg:           #0C0C0E;
  --bg-2:         #111118;
  --bg-3:         #16161F;
  --glass:        rgba(12,12,14,0.88);
  --glass-strong: rgba(10,10,16,0.96);

  --amber:        #F59E0B;
  --amber-dim:    rgba(245,158,11,0.18);
  --amber-glow:   rgba(245,158,11,0.10);
  --amber-border: rgba(245,158,11,0.22);
  --amber-grad:   linear-gradient(135deg,#F59E0B,#D97706);

  --text-1: #F5F0E8;
  --text-2: #A89880;
  --text-3: #5C5248;
  --text-inv: #0C0C0E;

  --success:      #10B981;
  --danger:       #EF4444;
  --danger-soft:  rgba(239,68,68,0.12);
  --warn:         #F59E0B;

  --r-sm: 8px; --r: 14px; --r-lg: 20px; --r-xl: 28px; --r-pill: 999px;
  --ease: 0.22s cubic-bezier(0.4,0,0.2,1);
  --ease-slow: 0.45s cubic-bezier(0.4,0,0.2,1);
  --font-display: 'Playfair Display', Georgia, serif;
  --font: 'DM Sans', system-ui, sans-serif;
  --sh-sm: 0 1px 4px rgba(0,0,0,0.3);
  --sh-md: 0 8px 28px rgba(0,0,0,0.4);
  --sh-lg: 0 20px 60px rgba(0,0,0,0.5);
}

[data-theme="light"] {
  --bg:           #F5F0E8;
  --bg-2:         #FFFFFF;
  --bg-3:         #EDE8DC;
  --glass:        rgba(245,240,232,0.88);
  --glass-strong: rgba(245,240,232,0.96);
  --amber:        #D97706;
  --amber-dim:    rgba(217,119,6,0.18);
  --amber-glow:   rgba(217,119,6,0.10);
  --amber-border: rgba(217,119,6,0.25);
  --amber-grad:   linear-gradient(135deg,#D97706,#B45309);
  --text-1: #1A1208;
  --text-2: #6B5A3E;
  --text-3: #B09878;
  --text-inv: #F5F0E8;
  --sh-sm: 0 1px 4px rgba(26,18,8,0.08);
  --sh-md: 0 8px 28px rgba(26,18,8,0.12);
  --sh-lg: 0 20px 60px rgba(26,18,8,0.15);
}
```

- [ ] **Step 2: Crear global.css**

```css
/* frontend/src/styles/global.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text-1);
  overflow: hidden;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
button { font-family: var(--font); cursor: pointer; border: none; background: none; }
input, textarea, select {
  font-family: var(--font);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--amber-border);
  border-radius: var(--r);
  color: var(--text-1);
  padding: 0.6rem 0.8rem;
  font-size: 0.875rem;
  outline: none;
  width: 100%;
  transition: border-color var(--ease), box-shadow var(--ease);
}
[data-theme="light"] input,
[data-theme="light"] textarea,
[data-theme="light"] select { background: rgba(0,0,0,0.03); }
input:focus, textarea:focus, select:focus {
  border-color: var(--amber);
  box-shadow: 0 0 0 3px var(--amber-glow);
}
label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-2);
  letter-spacing: 0.04em;
  display: block;
  margin-bottom: 0.35rem;
}
/* Loading */
.loading-screen {
  display: flex; align-items: center; justify-content: center;
  height: 100%; background: var(--bg);
}
.loading-spinner {
  width: 32px; height: 32px;
  border: 2px solid var(--amber-border);
  border-top-color: var(--amber);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
/* Brand */
.brand-mark {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--amber);
  font-size: 1rem;
  letter-spacing: 0.04em;
}
.brand-mark--big { font-size: 2.2rem; }
.eyebrow {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--amber);
}
/* Scrollbar */
* { scrollbar-width: thin; scrollbar-color: var(--amber-border) transparent; }
*::-webkit-scrollbar { width: 4px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: var(--amber-border); border-radius: 2px; }
```

- [ ] **Step 3: Actualizar index.html — agregar Google Fonts**

Abrir `frontend/index.html`. Reemplazar el contenido del `<head>` con:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Mapa de Reseñas - Explora, descubre y califica los mejores lugares de tu ciudad." />
    <meta name="theme-color" content="#0C0C0E" />
    <title>Mapa de Reseñas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/styles/tokens.css frontend/src/styles/global.css frontend/index.html
git commit -m "estilo: design tokens y CSS global del rediseño Explorador Urbano"
```

---

## Task 2: Panel CSS y componentes CSS

**Files:**
- Create: `frontend/src/styles/panel.css`
- Create: `frontend/src/styles/components.css` (reemplaza el actual)

- [ ] **Step 1: Crear panel.css**

```css
/* frontend/src/styles/panel.css */

/* ── APP SHELL ── */
.app-container { height: 100%; position: relative; overflow: hidden; }
.map-layer { position: absolute; inset: 0; z-index: 0; }

/* ── FLOATING SEARCH ── */
.search-float {
  position: absolute; top: 1rem; left: 1rem; right: 1rem; z-index: 10;
  display: flex; align-items: center; gap: 0.6rem;
  background: var(--glass-strong); border: 1px solid var(--amber-border);
  border-radius: var(--r-pill); padding: 0.6rem 1rem;
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--sh-md);
}
.search-float__input {
  flex: 1; background: none; border: none; padding: 0;
  font-size: 0.875rem; color: var(--text-1); box-shadow: none; width: auto;
}
.search-float__input::placeholder { color: var(--text-3); }
.search-float__input:focus { border: none; box-shadow: none; }
.search-float__avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--amber-dim); border: 1px solid var(--amber-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: var(--amber);
  flex-shrink: 0; cursor: pointer; transition: background var(--ease);
}
.search-float__avatar:hover { background: var(--amber); color: var(--text-inv); }

/* ── CATEGORY CHIPS ── */
.chips-float {
  position: absolute; top: 3.9rem; left: 1rem; right: 1rem; z-index: 10;
  display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px;
}
.chips-float::-webkit-scrollbar { display: none; }
.chip {
  flex-shrink: 0; background: var(--glass-strong); border: 1px solid var(--amber-border);
  border-radius: var(--r-pill); padding: 0.28rem 0.75rem;
  font-size: 0.72rem; font-weight: 600; color: var(--text-2);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  cursor: pointer; transition: all var(--ease); white-space: nowrap;
}
.chip:hover { color: var(--text-1); border-color: var(--amber); }
.chip.is-active { background: var(--amber); color: var(--bg); border-color: transparent; font-weight: 700; }

/* ── BOTTOM PANEL (mobile) ── */
.bottom-panel {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 20;
  background: var(--glass-strong); border-top: 1px solid var(--amber-border);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  transition: transform var(--ease-slow); display: flex; flex-direction: column;
  max-height: 85vh; will-change: transform;
}
.bottom-panel.is-collapsed { transform: translateY(calc(100% - 8.5rem)); }
.bottom-panel.is-expanded  { transform: translateY(0); }
.panel-handle-wrap { padding: 0.5rem 1.2rem 0; cursor: pointer; flex-shrink: 0; }
.panel-handle {
  width: 36px; height: 3px; background: var(--amber-border);
  border-radius: 2px; margin: 0 auto 0.6rem;
  transition: background var(--ease);
}
.panel-handle-wrap:hover .panel-handle { background: var(--amber); }

/* ── PANEL HEADER ── */
.panel-header {
  padding: 0.8rem 1.2rem 0.5rem;
  border-bottom: 1px solid rgba(245,158,11,0.07);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.panel-brand { font-family: var(--font-display); font-style: italic; color: var(--amber); font-size: 1rem; line-height: 1.1; }
.panel-brand small {
  display: block; font-family: var(--font); font-style: normal;
  font-size: 0.55rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3); margin-top: 0.1rem;
}

/* ── PANEL NAV ── */
.panel-nav {
  display: flex; gap: 0.2rem; padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(245,158,11,0.06); flex-shrink: 0;
}
.panel-nav__item {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
  padding: 0.45rem 0.25rem; border-radius: var(--r);
  font-size: 0.57rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text-3); transition: all var(--ease); border: 1px solid transparent; cursor: pointer;
}
.panel-nav__item:hover { color: var(--text-2); background: var(--amber-glow); }
.panel-nav__item.is-active { color: var(--amber); background: var(--amber-dim); border-color: var(--amber-border); }

/* ── PLACE LIST ── */
.place-list { overflow-y: auto; flex: 1; padding: 0.4rem 0.8rem 0.5rem; }
.place-card-item {
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.6rem 0.5rem; border-radius: var(--r);
  border: 1px solid transparent; cursor: pointer; transition: all var(--ease);
}
.place-card-item:not(:last-child) { border-bottom: 1px solid rgba(245,158,11,0.05); }
.place-card-item:hover { background: var(--amber-glow); border-color: var(--amber-border); }
.place-card-item__icon {
  width: 38px; height: 38px; border-radius: 11px;
  background: var(--amber-dim); border: 1px solid var(--amber-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.place-card-item__body { flex: 1; min-width: 0; }
.place-card-item__name {
  font-family: var(--font-display); font-style: italic; font-size: 0.83rem; font-weight: 700;
  color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1rem;
}
.place-card-item__meta { font-size: 0.65rem; color: var(--text-2); font-weight: 500; }
.place-card-item__rating {
  font-size: 0.7rem; font-weight: 700; color: var(--amber);
  flex-shrink: 0; display: flex; align-items: center; gap: 0.15rem;
}

/* ── ADD BUTTON ── */
.panel-add-btn {
  margin: 0.6rem 1rem 0.9rem;
  background: var(--amber-grad); color: var(--text-inv);
  border-radius: var(--r-lg); padding: 0.72rem;
  font-weight: 700; font-size: 0.875rem; letter-spacing: 0.03em;
  display: flex; align-items: center; justify-content: center; gap: 0.45rem;
  box-shadow: 0 4px 20px rgba(245,158,11,0.3); flex-shrink: 0;
  transition: box-shadow var(--ease), transform var(--ease);
}
.panel-add-btn:hover { box-shadow: 0 6px 28px rgba(245,158,11,0.45); transform: translateY(-1px); }

/* ── PANEL CONTENT (scrollable body) ── */
.panel-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

/* ── PANEL BACK BUTTON ── */
.panel-back {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.8rem 1.2rem; color: var(--text-2); font-size: 0.8rem; font-weight: 600;
  cursor: pointer; border-bottom: 1px solid rgba(245,158,11,0.06);
  transition: color var(--ease); flex-shrink: 0;
}
.panel-back:hover { color: var(--amber); }

/* ── DESKTOP ── */
@media (min-width: 960px) {
  .bottom-panel { display: none !important; }
  .chips-float  { display: none !important; }
  .desktop-panel {
    position: absolute; top: 0; right: 0; bottom: 0; width: 320px; z-index: 20;
    background: var(--glass-strong); border-left: 1px solid var(--amber-border);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    display: flex; flex-direction: column;
  }
  .map-layer    { right: 320px; }
  .search-float { right: calc(320px + 1rem); }
}

/* ── CUSTOM MAP MARKER (ámbar) ── */
.custom-marker {
  width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.1);
  transition: transform var(--ease), box-shadow var(--ease);
  cursor: pointer;
}
.custom-marker:hover { transform: rotate(-45deg) scale(1.15); box-shadow: 0 6px 24px rgba(245,158,11,0.45); }
.custom-marker-emoji { transform: rotate(45deg); display: block; font-size: 1rem; }
.custom-marker-tip {
  width: 0; height: 0; border-left: 5px solid transparent;
  border-right: 5px solid transparent; border-top-width: 7px; border-top-style: solid;
}
```

- [ ] **Step 2: Crear components.css (reemplaza el anterior)**

```css
/* frontend/src/styles/components.css */

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
  padding: 0.65rem 1.2rem; border-radius: var(--r-pill);
  font-family: var(--font); font-weight: 700; font-size: 0.875rem;
  letter-spacing: 0.02em; cursor: pointer; border: 1px solid transparent;
  transition: all var(--ease);
}
.btn--primary {
  background: var(--amber-grad); color: var(--text-inv);
  box-shadow: 0 4px 20px rgba(245,158,11,0.3);
}
.btn--primary:hover { box-shadow: 0 6px 28px rgba(245,158,11,0.45); transform: translateY(-1px); }
.btn--ghost {
  background: var(--amber-dim); color: var(--text-1);
  border-color: var(--amber-border);
}
.btn--ghost:hover { background: var(--amber-glow); border-color: var(--amber); }
.btn--danger { background: var(--danger-soft); color: var(--danger); border-color: rgba(239,68,68,0.25); }
.btn--danger:hover { background: rgba(239,68,68,0.2); }
.btn--block { width: 100%; }
.btn--sm { padding: 0.35rem 0.75rem; font-size: 0.78rem; }
.btn--icon {
  width: 36px; height: 36px; padding: 0; border-radius: 50%;
  background: var(--amber-dim); border: 1px solid var(--amber-border); color: var(--text-1);
}
.btn--icon:hover { background: var(--amber-glow); border-color: var(--amber); color: var(--amber); }
.btn--icon.is-active { background: var(--amber-dim); color: var(--amber); border-color: var(--amber-border); }
.btn:active { transform: scale(0.97); }

/* ── REVIEW STARS ── */
.star-row { display: flex; gap: 0.25rem; }
.star-btn { color: var(--text-3); cursor: pointer; transition: color var(--ease); }
.star-btn.is-filled, .star-btn:hover { color: var(--amber); }

/* ── REVIEW CARD ── */
.review-card {
  padding: 0.9rem 0; border-bottom: 1px solid rgba(245,158,11,0.06);
}
.review-card:last-child { border-bottom: none; }
.review-card__head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0.5rem; gap: 0.5rem;
}
.review-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--amber-dim); border: 1px solid var(--amber-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.68rem; font-weight: 700; color: var(--amber); flex-shrink: 0;
}
.review-card__stars { display: flex; gap: 0.15rem; color: var(--amber); margin-bottom: 0.35rem; }
.review-card__text { font-size: 0.82rem; color: var(--text-2); line-height: 1.5; }
.review-card__date { font-size: 0.65rem; color: var(--text-3); margin-top: 0.25rem; }

/* ── FORM ── */
.form-field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.9rem; }
.form-section-title {
  font-family: var(--font-display); font-style: italic; font-size: 0.9rem;
  color: var(--text-1); margin-bottom: 0.7rem; display: flex; align-items: center; gap: 0.4rem;
}

/* ── INFO ROWS ── */
.info-row {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.45rem 0; color: var(--text-2); font-size: 0.82rem;
  border-bottom: 1px solid rgba(245,158,11,0.05);
}
.info-row:last-child { border-bottom: none; }
.info-row a { color: var(--amber); }
.info-row a:hover { text-decoration: underline; }

/* ── EMPTY STATE ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 3rem 1.5rem; text-align: center; gap: 0.6rem;
  color: var(--text-3);
}
.empty-state h3 { font-family: var(--font-display); font-style: italic; color: var(--text-2); font-size: 1.1rem; }
.empty-state p  { font-size: 0.82rem; line-height: 1.5; max-width: 22rem; }

/* ── TOAST ── */
.toast {
  position: fixed; top: 1.25rem; right: 1.25rem; z-index: 9999;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem 1rem; border-radius: var(--r-lg);
  background: var(--glass-strong); border: 1px solid var(--amber-border);
  box-shadow: var(--sh-lg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  animation: toastIn 0.3s var(--ease) both; max-width: 22rem;
}
@keyframes toastIn { from { opacity:0; transform:translateY(-12px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
.toast--success { border-color: rgba(16,185,129,0.3); }
.toast--success .toast__icon { color: #10b981; }
.toast--error   { border-color: rgba(239,68,68,0.3); }
.toast--error   .toast__icon { color: var(--danger); }
.toast__icon { font-size: 1rem; font-weight: 800; flex-shrink: 0; }
.toast__msg  { font-size: 0.875rem; font-weight: 600; color: var(--text-1); flex: 1; }
.toast__close { color: var(--text-3); font-size: 1.1rem; cursor: pointer; padding: 0 0.2rem; transition: color var(--ease); }
.toast__close:hover { color: var(--text-1); }

/* ── DETAIL PANEL SPECIFIC ── */
.detail-name {
  font-family: var(--font-display); font-style: italic; font-weight: 900;
  font-size: 1.35rem; color: var(--text-1); line-height: 1.2; margin-bottom: 0.3rem;
}
.detail-meta {
  display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
  font-size: 0.75rem; color: var(--text-2); margin-bottom: 0.8rem;
}
.detail-meta .amber { color: var(--amber); font-weight: 700; }
.detail-actions {
  display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;
}
.detail-section { padding: 1rem 0; border-top: 1px solid rgba(245,158,11,0.07); }
.detail-section h4 {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--amber); margin-bottom: 0.7rem;
  display: flex; align-items: center; gap: 0.4rem;
}

/* ── PROFILE ── */
.profile-avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--amber-dim); border: 2px solid var(--amber-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 700; color: var(--amber); flex-shrink: 0;
}
.profile-stat { text-align: center; }
.profile-stat strong { display: block; font-size: 1.3rem; font-weight: 800; color: var(--amber); }
.profile-stat span   { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); }

/* ── AUTH TABS ── */
.auth-tabs { display: flex; border-bottom: 1px solid rgba(245,158,11,0.1); margin-bottom: 1.2rem; }
.auth-tab {
  flex: 1; padding: 0.6rem; text-align: center; font-size: 0.82rem; font-weight: 700;
  color: var(--text-3); border-bottom: 2px solid transparent; cursor: pointer;
  transition: all var(--ease);
}
.auth-tab.is-active { color: var(--amber); border-bottom-color: var(--amber); }
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/styles/panel.css frontend/src/styles/components.css
git commit -m "estilo: panel deslizante y componentes del rediseño"
```

---

## Task 3: Componentes compartidos

**Files:**
- Create: `frontend/src/components/shared/SearchBar.jsx`
- Create: `frontend/src/components/shared/CategoryChips.jsx`
- Create: `frontend/src/components/shared/PlaceCard.jsx`
- Create: `frontend/src/components/shared/PanelNav.jsx`

Primero crear el directorio: `frontend/src/components/shared/`

- [ ] **Step 1: Crear SearchBar.jsx**

```jsx
// frontend/src/components/shared/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onAvatarClick, userInitials }) {
  return (
    <div className="search-float">
      <Search size={16} color="var(--amber)" strokeWidth={1.5} />
      <input
        className="search-float__input"
        type="text"
        placeholder="Buscar lugares..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {userInitials && (
        <div className="search-float__avatar" onClick={onAvatarClick} title="Mi perfil">
          {userInitials}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Crear CategoryChips.jsx**

```jsx
// frontend/src/components/shared/CategoryChips.jsx
import React from 'react';

const CATEGORIES = ['Todos', 'Restaurante', 'Parque', 'Cultura', 'Tienda', 'Servicio', 'Turismo'];

export default function CategoryChips({ selected, onSelect }) {
  return (
    <div className="chips-float">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          type="button"
          className={`chip${selected === cat ? ' is-active' : ''}`}
          onClick={() => onSelect(cat === selected ? 'Todos' : cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Crear PlaceCard.jsx**

```jsx
// frontend/src/components/shared/PlaceCard.jsx
import React from 'react';
import { Star } from 'lucide-react';

const CATEGORY_ICONS = {
  restaurante: '🍴', parque: '🌳', cultura: '🎭', tienda: '🛍️',
  servicio: '🛠️', turismo: '🏛️', general: '📍',
};

function getCategoryIcon(categoria = '') {
  return CATEGORY_ICONS[categoria.toLowerCase()] || '📍';
}

export default function PlaceCard({ place, onClick }) {
  const icon = place.categoriaIcono || getCategoryIcon(place.categoria);
  const rating = Number(place.puntuacionPromedio || 0).toFixed(1);

  return (
    <div className="place-card-item" onClick={() => onClick?.(place)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.(place)}>
      <div className="place-card-item__icon">{icon}</div>
      <div className="place-card-item__body">
        <div className="place-card-item__name">{place.nombre}</div>
        <div className="place-card-item__meta">
          {place.categoria}{place.direccion ? ` · ${place.direccion}` : ''}
        </div>
      </div>
      {place.totalResenas > 0 && (
        <div className="place-card-item__rating">
          <Star size={11} fill="currentColor" strokeWidth={0} />
          {rating}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Crear PanelNav.jsx**

```jsx
// frontend/src/components/shared/PanelNav.jsx
import React from 'react';
import { Map, Bookmark, PlusCircle, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'mapa',      icon: Map,         label: 'Explorar' },
  { id: 'guardados', icon: Bookmark,    label: 'Guardados' },
  { id: 'añadir',   icon: PlusCircle,  label: 'Agregar' },
  { id: 'perfil',   icon: User,        label: 'Perfil' },
];

export default function PanelNav({ activeView, onNavigate }) {
  return (
    <div className="panel-nav">
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          className={`panel-nav__item${activeView === id ? ' is-active' : ''}`}
          onClick={() => onNavigate(id)}
        >
          <Icon size={18} strokeWidth={activeView === id ? 2 : 1.5} />
          {label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/shared/
git commit -m "ui: componentes compartidos SearchBar, CategoryChips, PlaceCard, PanelNav"
```

---

## Task 4: ExplorerScreen

**Files:**
- Create: `frontend/src/screens/ExplorerScreen.jsx`

Props que recibe desde App.jsx:
- `places`, `filteredPlaces`, `search`, `setSearch`, `category`, `setCategory`
- `onSelectPlace`, `onOpenAdd`, `onNavigate`, `onMapClick`
- `userLocation`, `isAuthenticated`, `user`, `onLogout`

- [ ] **Step 1: Crear ExplorerScreen.jsx**

```jsx
// frontend/src/screens/ExplorerScreen.jsx
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import SearchBar from '../components/shared/SearchBar';
import CategoryChips from '../components/shared/CategoryChips';
import PanelNav from '../components/shared/PanelNav';
import PlaceCard from '../components/shared/PlaceCard';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

export default function ExplorerScreen({
  places, filteredPlaces, search, setSearch, category, setCategory,
  onSelectPlace, onOpenAdd, onNavigate, onMapClick,
  userLocation, isAuthenticated, user, onLogout,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleSelectPlace = (place) => {
    onSelectPlace(place);
  };

  const handleMapClick = (coords) => {
    onMapClick(coords);
  };

  const userInits = user?.nombre ? initials(user.nombre) : null;

  return (
    <div className="app-container">
      {/* MAP */}
      <div className="map-layer">
        <MapContainer
          lugares={filteredPlaces}
          userLocation={userLocation}
          onMapClick={handleMapClick}
          onOpenDetail={handleSelectPlace}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* SEARCH FLOATING */}
      <SearchBar
        value={search}
        onChange={setSearch}
        userInitials={userInits}
        onAvatarClick={() => onNavigate('perfil')}
      />

      {/* CATEGORY CHIPS (mobile only, hidden on desktop via CSS) */}
      <CategoryChips selected={category} onSelect={setCategory} />

      {/* BOTTOM PANEL (mobile) */}
      <div className={`bottom-panel${panelOpen ? ' is-expanded' : ' is-collapsed'}`}>
        <div className="panel-handle-wrap" onClick={() => setPanelOpen(o => !o)}>
          <div className="panel-handle" />
        </div>

        <PanelNav activeView="mapa" onNavigate={onNavigate} />

        <div className="place-list">
          {filteredPlaces.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p>No hay lugares que coincidan.</p>
            </div>
          ) : (
            filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} onClick={handleSelectPlace} />
            ))
          )}
        </div>

        <button type="button" className="panel-add-btn" onClick={onOpenAdd}>
          <PlusCircle size={16} strokeWidth={2} />
          Publicar lugar
        </button>
      </div>

      {/* DESKTOP PANEL */}
      <div className="desktop-panel">
        <div className="panel-header">
          <div className="panel-brand">
            Mapa<br /><small>de Reseñas</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button type="button" className="btn btn--icon" onClick={toggleTheme} title={isDark ? 'Modo claro' : 'Modo oscuro'}>
              {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>
            {userInits && (
              <div className="search-float__avatar" style={{ width: 32, height: 32 }}
                onClick={() => onNavigate('perfil')} title="Mi perfil">
                {userInits}
              </div>
            )}
          </div>
        </div>

        <PanelNav activeView="mapa" onNavigate={onNavigate} />

        {/* Desktop search inside panel */}
        <div style={{ padding: '0.6rem 1rem 0' }}>
          <SearchBar value={search} onChange={setSearch} />
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['Todos','Restaurante','Parque','Cultura','Tienda'].map(cat => (
              <button key={cat} type="button"
                className={`chip${category === cat ? ' is-active' : ''}`}
                style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem' }}
                onClick={() => setCategory(cat === category ? 'Todos' : cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="place-list" style={{ marginTop: '0.4rem' }}>
          {filteredPlaces.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p>No hay lugares que coincidan.</p>
            </div>
          ) : (
            filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} onClick={handleSelectPlace} />
            ))
          )}
        </div>

        <button type="button" className="panel-add-btn" onClick={onOpenAdd}>
          <PlusCircle size={16} strokeWidth={2} />
          Publicar lugar
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/screens/ExplorerScreen.jsx
git commit -m "ui: ExplorerScreen con mapa inmersivo y panel deslizante"
```

---

## Task 5: DetailScreen

**Files:**
- Create: `frontend/src/screens/DetailScreen.jsx`

Props desde App.jsx: `place, onBack, onNavigate, onSelectPlace, relatedPlaces, onOpenAdd, onDelete, onAddReview, onDeleteReview, currentUserId, isFavorited, onToggleFavorito, onOpenPublicProfile, onSharePlace, onReportReview`

- [ ] **Step 1: Crear DetailScreen.jsx**

```jsx
// frontend/src/screens/DetailScreen.jsx
import React, { useState } from 'react';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Flag, Star,
  MapPin, Clock, Phone, Globe, MessageSquare, User, Trash2, X
} from 'lucide-react';
import PanelNav from '../components/shared/PanelNav';
import PlaceCard from '../components/shared/PlaceCard';
import MapContainer from '../components/MapContainer';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

function StarRow({ value, onChange, readonly = false }) {
  return (
    <div className="star-row">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" className={`star-btn${n <= value ? ' is-filled' : ''}`}
          onClick={() => !readonly && onChange?.(n)} style={{ background: 'none', border: 'none', padding: '0.1rem' }}>
          <Star size={16} fill={n <= value ? 'currentColor' : 'none'} strokeWidth={n <= value ? 0 : 1.5} />
        </button>
      ))}
    </div>
  );
}

export default function DetailScreen({
  place, onBack, onNavigate, onSelectPlace, relatedPlaces = [],
  onOpenAdd, onDelete, onAddReview, onDeleteReview, currentUserId,
  isFavorited = false, onToggleFavorito, onOpenPublicProfile,
  onSharePlace, onReportReview,
}) {
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reportingId, setReportingId] = useState(null);
  const [reportMotivo, setReportMotivo] = useState('spam');

  if (!place) return null;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comentario.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAddReview?.(place.id, { puntuacion, comentario });
      setComentario('');
      setPuntuacion(5);
    } finally {
      setSubmitting(false);
    }
  };

  const panelContent = (
    <div className="panel-content" style={{ padding: '0 1.2rem 1.5rem' }}>
      {/* Name + meta */}
      <div className="detail-name">{place.nombre}</div>
      <div className="detail-meta">
        <span>{place.categoriaIcono || '📍'} {place.categoria}</span>
        {place.puntuacionPromedio > 0 && (
          <span className="amber" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={12} fill="currentColor" strokeWidth={0} />
            {Number(place.puntuacionPromedio).toFixed(1)}
            <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>({place.totalResenas})</span>
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="detail-actions">
        <button type="button" className={`btn btn--icon${isFavorited ? ' is-active' : ''}`}
          onClick={() => onToggleFavorito?.(place.id)} title={isFavorited ? 'Quitar de favoritos' : 'Guardar'}>
          {isFavorited
            ? <BookmarkCheck size={16} strokeWidth={2} />
            : <Bookmark size={16} strokeWidth={1.5} />}
        </button>
        <button type="button" className="btn btn--icon"
          onClick={() => onSharePlace?.(place)} title="Compartir">
          <Share2 size={16} strokeWidth={1.5} />
        </button>
        {place.creadorId && onOpenPublicProfile && (
          <button type="button" className="btn btn--ghost btn--sm"
            onClick={() => onOpenPublicProfile(place.creadorId)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={14} strokeWidth={1.5} /> Ver creador
          </button>
        )}
      </div>

      {/* Info rows */}
      {(place.descripcion || place.direccion || place.horario || place.telefono || place.sitioWeb) && (
        <div className="detail-section">
          <h4><MapPin size={13} strokeWidth={1.5} /> Información</h4>
          {place.descripcion && <p style={{ fontSize: '0.83rem', color: 'var(--text-2)', marginBottom: '0.6rem', lineHeight: 1.55 }}>{place.descripcion}</p>}
          {place.direccion && <div className="info-row"><MapPin size={13} strokeWidth={1.5} />{place.direccion}</div>}
          {place.horario   && <div className="info-row"><Clock  size={13} strokeWidth={1.5} />{place.horario}</div>}
          {place.telefono  && <div className="info-row"><Phone  size={13} strokeWidth={1.5} />{place.telefono}</div>}
          {place.sitioWeb  && <div className="info-row"><Globe  size={13} strokeWidth={1.5} /><a href={place.sitioWeb} target="_blank" rel="noreferrer">{place.sitioWeb}</a></div>}
        </div>
      )}

      {/* Reviews */}
      <div className="detail-section">
        <h4><MessageSquare size={13} strokeWidth={1.5} /> Reseñas ({place.resenas?.length || 0})</h4>

        {/* Add review form */}
        {currentUserId && (
          <form onSubmit={submitReview} style={{ marginBottom: '1rem' }}>
            <StarRow value={puntuacion} onChange={setPuntuacion} />
            <textarea
              placeholder="Escribe tu reseña..."
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              rows={2}
              style={{ marginTop: '0.5rem', resize: 'vertical' }}
            />
            <button type="submit" disabled={submitting || !comentario.trim()}
              className="btn btn--primary btn--sm btn--block" style={{ marginTop: '0.5rem' }}>
              {submitting ? 'Publicando…' : 'Publicar reseña'}
            </button>
          </form>
        )}

        {/* Reviews list */}
        {place.resenas?.length > 0 ? place.resenas.map(rev => (
          <div key={rev.id} className="review-card">
            <div className="review-card__head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="review-avatar">{initials(rev.usuario?.nombre)}</div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-1)' }}>{rev.usuario?.nombre || 'Usuario'}</div>
                  <div className="review-card__date">{new Date(rev.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {currentUserId && rev.usuarioId === currentUserId && (
                  <button type="button" className="btn btn--danger btn--sm"
                    onClick={() => onDeleteReview?.(place.id, rev.id)}>
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                )}
                {currentUserId && rev.usuarioId !== currentUserId && (
                  reportingId === rev.id ? (
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      <select value={reportMotivo} onChange={e => setReportMotivo(e.target.value)}
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem', width: 'auto', minWidth: '5rem' }}>
                        <option value="spam">Spam</option>
                        <option value="ofensivo">Ofensivo</option>
                        <option value="falso">Falso</option>
                        <option value="otro">Otro</option>
                      </select>
                      <button type="button" className="btn btn--danger btn--sm"
                        onClick={() => { onReportReview?.(place.id, rev.id, reportMotivo); setReportingId(null); setReportMotivo('spam'); }}>
                        Confirmar
                      </button>
                      <button type="button" className="btn btn--ghost btn--sm"
                        onClick={() => { setReportingId(null); setReportMotivo('spam'); }}>
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="btn btn--ghost btn--sm"
                      onClick={() => setReportingId(rev.id)} title="Reportar">
                      <Flag size={12} strokeWidth={1.5} />
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="review-card__stars">
              {Array.from({ length: rev.puntuacion }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            {rev.comentario && <div className="review-card__text">{rev.comentario}</div>}
          </div>
        )) : (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', padding: '0.5rem 0' }}>Aún no hay reseñas.</p>
        )}
      </div>

      {/* Related */}
      {relatedPlaces.filter(p => p.id !== place.id).slice(0, 3).length > 0 && (
        <div className="detail-section">
          <h4>Similares</h4>
          {relatedPlaces.filter(p => p.id !== place.id).slice(0, 3).map(p => (
            <PlaceCard key={p.id} place={p} onClick={onSelectPlace} />
          ))}
        </div>
      )}

      {/* Delete place */}
      {onDelete && place?.id && (
        <div className="detail-section">
          <button type="button" className="btn btn--danger btn--block"
            onClick={() => window.confirm('¿Eliminar este lugar?') && onDelete(place.id)}>
            <Trash2 size={14} strokeWidth={1.5} /> Eliminar lugar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="app-container">
      {/* Map stays in background */}
      <div className="map-layer">
        <MapContainer
          lugares={[place]}
          userLocation={null}
          onMapClick={null}
          onOpenDetail={null}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* MOBILE bottom panel */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)' }}>
        <div className="panel-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Volver al mapa
        </div>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {panelContent}
        </div>
      </div>

      {/* DESKTOP right panel */}
      <div className="desktop-panel">
        <div className="panel-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Volver
        </div>
        <PanelNav activeView="detalle" onNavigate={onNavigate} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {panelContent}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/screens/DetailScreen.jsx
git commit -m "ui: DetailScreen con panel deslizante y lucide icons"
```

---

## Task 6: AddPlaceScreen

**Files:**
- Create: `frontend/src/screens/AddPlaceScreen.jsx`

Props: `values, setValues, coords, onCoordsChange, onSubmit, onBack, onUseCurrentLocation, userLocation, isAuthenticated, onNavigate`

- [ ] **Step 1: Crear AddPlaceScreen.jsx**

```jsx
// frontend/src/screens/AddPlaceScreen.jsx
import React from 'react';
import { ArrowLeft, MapPin, Send, Navigation } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import PanelNav from '../components/shared/PanelNav';

const CATEGORIES = ['Restaurante','Parque','Cultura','Tienda','Servicio','Turismo','General'];

export default function AddPlaceScreen({
  values, setValues, coords, onCoordsChange, onSubmit,
  onBack, onUseCurrentLocation, userLocation, isAuthenticated, onNavigate,
}) {
  const formContent = (
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Nueva ubicación</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>
          Haz clic en el mapa para mover el marcador o usa tu ubicación actual.
        </p>
      </div>

      {/* Coords display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem',
        background: 'var(--amber-dim)', border: '1px solid var(--amber-border)',
        borderRadius: 'var(--r)', padding: '0.5rem 0.8rem' }}>
        <MapPin size={14} color="var(--amber)" strokeWidth={1.5} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', flex: 1 }}>
          {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Sin coordenadas'}
        </span>
        {userLocation && (
          <button type="button" className="btn btn--ghost btn--sm"
            onClick={onUseCurrentLocation} style={{ gap: '0.3rem' }}>
            <Navigation size={12} strokeWidth={1.5} /> Mi ubicación
          </button>
        )}
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label>Nombre del lugar *</label>
          <input type="text" value={values.nombre} required
            placeholder="ej. Café del Centro"
            onChange={e => setValues(v => ({ ...v, nombre: e.target.value }))} />
        </div>

        <div className="form-field">
          <label>Categoría</label>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} type="button"
                className={`chip${values.categoria === cat ? ' is-active' : ''}`}
                onClick={() => setValues(v => ({ ...v, categoria: cat }))}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label>Descripción</label>
          <textarea rows={3} value={values.descripcion} placeholder="Cuéntanos sobre este lugar..."
            onChange={e => setValues(v => ({ ...v, descripcion: e.target.value }))} />
        </div>

        <button type="submit" className="btn btn--primary btn--block"
          disabled={!values.nombre.trim() || !coords}
          style={{ marginTop: '0.5rem' }}>
          <Send size={15} strokeWidth={2} /> Publicar lugar
        </button>
      </form>
    </div>
  );

  return (
    <div className="app-container">
      <div className="map-layer">
        <MapContainer
          lugares={[]}
          userLocation={userLocation}
          onMapClick={onCoordsChange}
          onOpenDetail={null}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* MOBILE */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)' }}>
        <div className="panel-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Cancelar
        </div>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {formContent}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Cancelar
        </div>
        <PanelNav activeView="añadir" onNavigate={onNavigate} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {formContent}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/screens/AddPlaceScreen.jsx
git commit -m "ui: AddPlaceScreen con formulario en panel y mapa interactivo"
```

---

## Task 7: SavedScreen, PublicProfileScreen, ProfileScreen

**Files:**
- Create: `frontend/src/screens/SavedScreen.jsx`
- Create: `frontend/src/screens/PublicProfileScreen.jsx`
- Create: `frontend/src/screens/ProfileScreen.jsx`

- [ ] **Step 1: Crear SavedScreen.jsx**

```jsx
// frontend/src/screens/SavedScreen.jsx
import React from 'react';
import { BookmarkX } from 'lucide-react';
import PanelNav from '../components/shared/PanelNav';
import PlaceCard from '../components/shared/PlaceCard';

export default function SavedScreen({ onNavigate, savedPlaces = [], onSelectPlace }) {
  return (
    <div className="app-container">
      {/* background placeholder */}
      <div className="map-layer" style={{ background: 'var(--bg-2)' }} />

      {/* MOBILE */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)', maxHeight: '100vh' }}>
        <PanelNav activeView="guardados" onNavigate={onNavigate} />
        <SavedContent savedPlaces={savedPlaces} onSelectPlace={onSelectPlace} onNavigate={onNavigate} />
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-header">
          <div className="panel-brand">Guardados<br /><small>tus favoritos</small></div>
        </div>
        <PanelNav activeView="guardados" onNavigate={onNavigate} />
        <SavedContent savedPlaces={savedPlaces} onSelectPlace={onSelectPlace} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

function SavedContent({ savedPlaces, onSelectPlace, onNavigate }) {
  if (savedPlaces.length === 0) {
    return (
      <div className="empty-state" style={{ flex: 1 }}>
        <BookmarkX size={40} strokeWidth={1} color="var(--amber-border)" />
        <h3>Sin guardados aún</h3>
        <p>Marca lugares como favoritos desde la pantalla de detalle.</p>
        <button type="button" className="btn btn--primary" style={{ marginTop: '0.5rem' }}
          onClick={() => onNavigate('mapa')}>
          Explorar mapa
        </button>
      </div>
    );
  }
  return (
    <div className="place-list">
      {savedPlaces.map(place => (
        <PlaceCard key={place.id} place={place} onClick={onSelectPlace} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Crear PublicProfileScreen.jsx**

```jsx
// frontend/src/screens/PublicProfileScreen.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import PanelNav from '../components/shared/PanelNav';
import PlaceCard from '../components/shared/PlaceCard';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

export default function PublicProfileScreen({ profile, onBack, onSelectPlace, onNavigate, isAuthenticated = false }) {
  if (!profile) return null;

  const sinceYear = profile.miembro ? new Date(profile.miembro).getFullYear() : null;
  const inits = initials(profile.nombre);

  const content = (
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', padding: '0.5rem 0' }}>
        <div className="profile-avatar" style={{ width: 52, height: 52 }}>
          {profile.avatar ? <img src={profile.avatar} alt={profile.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : inits}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-1)' }}>{profile.nombre}</div>
          {sinceYear && <div className="eyebrow" style={{ marginTop: '0.15rem' }}>Miembro desde {sinceYear}</div>}
          <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', marginTop: '0.1rem' }}>
            {profile.lugares.length} lugar{profile.lugares.length !== 1 ? 'es' : ''} publicado{profile.lugares.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {profile.lugares.length === 0 ? (
        <div className="empty-state" style={{ padding: '1.5rem 0' }}>
          <p>Este usuario no ha publicado lugares aún.</p>
        </div>
      ) : (
        <div className="place-list" style={{ padding: 0 }}>
          {profile.lugares.map(place => (
            <PlaceCard key={place.id} place={place} onClick={onSelectPlace} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="app-container">
      <div className="map-layer" style={{ background: 'var(--bg-2)' }} />

      {/* MOBILE */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)', maxHeight: '100vh' }}>
        <div className="panel-back" onClick={onBack}><ArrowLeft size={16} strokeWidth={1.5} /> Volver</div>
        <div className="panel-content" style={{ overflowY: 'auto' }}>{content}</div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-back" onClick={onBack}><ArrowLeft size={16} strokeWidth={1.5} /> Volver</div>
        <PanelNav activeView="mapa" onNavigate={onNavigate} isAuthenticated={isAuthenticated} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>{content}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Crear ProfileScreen.jsx**

```jsx
// frontend/src/screens/ProfileScreen.jsx
import React, { useState } from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import PanelNav from '../components/shared/PanelNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

export default function ProfileScreen({ user, isAuthenticated, onLogout, onNavigate, onAuthSuccess }) {
  const { isDark, toggleTheme } = useTheme();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = tab === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({ nombre: form.nombre, email: form.email, password: form.password });
      if (response.success) {
        onAuthSuccess?.();
      } else {
        setError(response.message || 'Error al autenticarse');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al autenticarse');
    } finally {
      setLoading(false);
    }
  };

  const authContent = (
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
      <div className="auth-tabs">
        <button type="button" className={`auth-tab${tab === 'login' ? ' is-active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Iniciar sesión</button>
        <button type="button" className={`auth-tab${tab === 'register' ? ' is-active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>Registrarse</button>
      </div>
      <form onSubmit={handleAuth}>
        {tab === 'register' && (
          <div className="form-field">
            <label>Nombre</label>
            <input type="text" required value={form.nombre} placeholder="Tu nombre"
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
        )}
        <div className="form-field">
          <label>Email</label>
          <input type="email" required value={form.email} placeholder="tu@email.com"
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="form-field">
          <label>Contraseña</label>
          <input type="password" required value={form.password} placeholder="••••••••"
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        {error && <p style={{ fontSize: '0.78rem', color: 'var(--danger)', marginBottom: '0.7rem' }}>{error}</p>}
        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Cargando…' : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );

  const profileContent = (
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 0 1.2rem' }}>
        <div className="profile-avatar">{initials(user?.nombre)}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-1)' }}>{user?.nombre}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginTop: '0.1rem' }}>{user?.email}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button type="button" className="btn btn--ghost" onClick={toggleTheme} style={{ flex: 1, gap: '0.4rem' }}>
          {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <button type="button" className="btn btn--danger" onClick={onLogout} style={{ flex: 1, gap: '0.4rem' }}>
          <LogOut size={15} strokeWidth={1.5} /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="map-layer" style={{ background: 'var(--bg-2)' }} />

      {/* MOBILE */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)', maxHeight: '100vh' }}>
        <PanelNav activeView="perfil" onNavigate={onNavigate} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {isAuthenticated ? profileContent : authContent}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-header">
          <div className="panel-brand">Perfil<br /><small>{isAuthenticated ? user?.nombre : 'no autenticado'}</small></div>
        </div>
        <PanelNav activeView="perfil" onNavigate={onNavigate} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {isAuthenticated ? profileContent : authContent}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/screens/SavedScreen.jsx \
        frontend/src/screens/PublicProfileScreen.jsx \
        frontend/src/screens/ProfileScreen.jsx
git commit -m "ui: SavedScreen, PublicProfileScreen, ProfileScreen rediseñadas"
```

---

## Task 8: Cleanup y wiring final

**Files:**
- Modify: `frontend/src/main.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/MapContainer.jsx`
- Delete: `frontend/src/components/ScreenViews.jsx`
- Delete: `frontend/src/styles/base.css`, `layout.css`, `nav-responsive.css`, `panels.css`, `auth-profile.css`, `screens.css`

- [ ] **Step 1: Actualizar main.jsx**

Reemplazar el contenido completo:

```jsx
// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './styles/tokens.css'
import './styles/global.css'
import './styles/panel.css'
import './styles/components.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 2: Actualizar App.jsx — cambiar imports de screens**

Leer el archivo primero. Reemplazar el bloque de imports de ScreenViews:

**Antes:**
```jsx
import {
  AddPlaceScreen,
  DetailScreen,
  ExplorerScreen,
  ProfileScreen,
  PublicProfileScreen,
  SavedScreen,
} from './components/ScreenViews';
```

**Después:**
```jsx
import ExplorerScreen     from './screens/ExplorerScreen';
import DetailScreen       from './screens/DetailScreen';
import AddPlaceScreen     from './screens/AddPlaceScreen';
import SavedScreen        from './screens/SavedScreen';
import ProfileScreen      from './screens/ProfileScreen';
import PublicProfileScreen from './screens/PublicProfileScreen';
```

No cambiar nada más en App.jsx — toda la lógica se conserva.

- [ ] **Step 3: Actualizar custom-marker en MapContainer.jsx**

Leer el archivo. Buscar el div con `className="custom-marker"` y actualizar el inline style para eliminar el background hardcodeado (ahora lo controla `panel.css`):

Cambiar:
```jsx
<div className="custom-marker" style={{ background: lugar.categoriaColor || '#007AFF' }}>
```
Por:
```jsx
<div className="custom-marker" style={{ background: lugar.categoriaColor || 'var(--amber)' }}>
```

- [ ] **Step 4: Eliminar archivos obsoletos**

```bash
cd frontend/src
rm components/ScreenViews.jsx
rm styles/base.css styles/layout.css styles/nav-responsive.css styles/panels.css styles/auth-profile.css styles/screens.css
```

- [ ] **Step 5: Verificar que el frontend arranca sin errores**

```bash
cd frontend && npm run dev
```

Abrir `http://localhost:5173`. Verificar:
- La pantalla de mapa carga con fondo oscuro y panel deslizante
- Los marcadores del mapa se ven en ámbar
- En desktop aparece el panel lateral derecho
- Se puede abrir el detalle de un lugar
- Los iconos de lucide aparecen (no emojis) en botones de UI

Si hay errores de importación, revisar que todos los paths de `../screens/` y `../components/shared/` sean correctos.

- [ ] **Step 6: Commit final**

```bash
git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/components/MapContainer.jsx
git rm frontend/src/components/ScreenViews.jsx
git rm frontend/src/styles/base.css frontend/src/styles/layout.css \
       frontend/src/styles/nav-responsive.css frontend/src/styles/panels.css \
       frontend/src/styles/auth-profile.css frontend/src/styles/screens.css
git commit -m "refactor: wiring final del rediseño — eliminar ScreenViews y CSS obsoleto"
```
