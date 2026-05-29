# Deep Purple Luxury UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current teal/light design with a Deep Purple Luxury theme — dark backgrounds (`#0d0d14`), violet accent (`#7C3AED`), generous spacing, and a visible premium sidebar on desktop.

**Architecture:** Pure CSS overhaul across 7 existing style files. No React/JSX changes needed — the HTML classes already exist and are wired correctly. The new CSS rewrites every visual token and spacing value to match the luxury design.

**Tech Stack:** React + Vite + CSS custom properties (no CSS-in-JS, no Tailwind)

---

## File Map

| File | Change |
|------|--------|
| `frontend/src/styles/base.css` | Complete rewrite — new color system (purple palette, dark default) |
| `frontend/src/styles/layout.css` | Full rewrite — purple ambient blobs, updated glass cards |
| `frontend/src/styles/nav-responsive.css` | Full rewrite — luxury sidebar + dock redesign |
| `frontend/src/styles/components.css` | Full rewrite — purple buttons with glow, chips, inputs |
| `frontend/src/styles/screens.css` | Full rewrite — spacious place cards, map panel, detail |
| `frontend/src/styles/panels.css` | Full rewrite — review cards, forms, luxury spacing |
| `frontend/src/styles/auth-profile.css` | Full rewrite — premium auth and profile styles |

---

## Task 1: Core Color System (base.css + layout.css)

**Files:**
- Modify: `frontend/src/styles/base.css`
- Modify: `frontend/src/styles/layout.css`

- [ ] **Step 1: Rewrite base.css with Deep Purple palette**

Replace the ENTIRE content of `frontend/src/styles/base.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root, [data-theme="light"] {
  --bg-base: #f4f3ff;
  --bg-elevated: #ffffff;
  --bg-sunken: #ede9fe;
  --bg-glass: rgba(255,255,255,0.72);
  --bg-glass-strong: rgba(255,255,255,0.92);
  --bg-overlay: rgba(15,8,42,0.45);
  --text-1: #1e1033;
  --text-2: #5b4d7a;
  --text-3: #9d8fbf;
  --text-inv: #fff;
  --accent: #7C3AED;
  --accent-h: #6D28D9;
  --accent-soft: rgba(124,58,237,0.1);
  --accent-glow: rgba(124,58,237,0.2);
  --accent-grad: linear-gradient(135deg, #7C3AED, #4F46E5);
  --success: #10b981;
  --warn: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
  --danger-soft: rgba(239,68,68,0.1);
  --warn-soft: rgba(245,158,11,0.12);
  --border: rgba(124,58,237,0.1);
  --border-s: rgba(124,58,237,0.2);
  --border-a: rgba(124,58,237,0.4);
  --sh-sm: 0 1px 4px rgba(124,58,237,0.08);
  --sh-md: 0 8px 28px rgba(124,58,237,0.12);
  --sh-lg: 0 20px 60px rgba(124,58,237,0.18);
  --sh-glow: 0 0 40px rgba(124,58,237,0.2);
  --r-sm: 10px; --r-md: 16px; --r-lg: 20px; --r-xl: 28px; --r-pill: 999px;
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --ease: 0.22s cubic-bezier(0.4,0,0.2,1);
  --ease-slow: 0.45s cubic-bezier(0.4,0,0.2,1);
}

[data-theme="dark"] {
  --bg-base: #0d0d14;
  --bg-elevated: #13131f;
  --bg-sunken: #0a0a12;
  --bg-glass: rgba(13,13,20,0.82);
  --bg-glass-strong: rgba(19,19,31,0.96);
  --bg-overlay: rgba(0,0,0,0.7);
  --text-1: #f0f0f8;
  --text-2: #8888aa;
  --text-3: #4a4a6a;
  --text-inv: #0d0d14;
  --accent: #7C3AED;
  --accent-h: #9F67F0;
  --accent-soft: rgba(124,58,237,0.14);
  --accent-glow: rgba(124,58,237,0.28);
  --accent-grad: linear-gradient(135deg, #7C3AED, #4F46E5);
  --danger-soft: rgba(239,68,68,0.14);
  --warn-soft: rgba(245,158,11,0.15);
  --border: rgba(124,58,237,0.12);
  --border-s: rgba(124,58,237,0.22);
  --border-a: rgba(124,58,237,0.45);
  --sh-sm: 0 1px 4px rgba(0,0,0,0.4);
  --sh-md: 0 8px 28px rgba(0,0,0,0.5);
  --sh-lg: 0 20px 60px rgba(0,0,0,0.7);
  --sh-glow: 0 0 60px rgba(124,58,237,0.2);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  min-height: 100vh;
  background: var(--bg-base);
  color: var(--text-1);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background var(--ease-slow), color var(--ease-slow);
}

::selection { background: var(--accent-soft); color: var(--accent); }
button, input, textarea, select { font: inherit; color: inherit; }
a { color: var(--accent); text-decoration: none; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); border: 0;
}
```

- [ ] **Step 2: Rewrite layout.css**

Replace the ENTIRE content of `frontend/src/styles/layout.css` with:

```css
/* ===== LAYOUT ===== */
.app-container { min-height: 100vh; width: 100%; position: relative; overflow-x: hidden; }

.screen-shell {
  min-height: 100vh; position: relative; overflow: hidden;
  padding-bottom: 5.5rem;
  animation: fadeUp 0.35s var(--ease) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.loading-screen {
  min-height: 100vh; display: grid; place-items: center;
  background: var(--bg-base);
}

.loading-spinner {
  width: 3rem; height: 3rem; border-radius: 50%;
  border: 3px solid var(--border-s);
  border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ===== GLASS CARD ===== */
.glass-card {
  background: var(--bg-glass);
  border: 1px solid var(--border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--sh-md);
  border-radius: var(--r-xl);
  transition: box-shadow var(--ease), border-color var(--ease), background var(--ease-slow);
}

.glass-card:hover { box-shadow: var(--sh-lg); border-color: var(--border-s); }

.glass-card--solid { background: var(--bg-glass-strong); }

/* ===== AMBIENT BLOBS ===== */
.ambient {
  position: absolute; border-radius: 50%; filter: blur(100px);
  pointer-events: none; opacity: 0.4; z-index: 0;
}

.ambient-a {
  width: 36rem; height: 36rem; top: -15rem; left: -12rem;
  background: radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%);
}

.ambient-b {
  width: 28rem; height: 28rem; right: -10rem; top: 15rem;
  background: radial-gradient(circle, rgba(79,70,229,0.18), transparent 70%);
}

/* ===== HEADER ===== */
.screen-header {
  position: relative; z-index: 5;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; padding: 1.2rem 1.5rem 0;
}

.screen-header__brand { display: flex; align-items: center; gap: 0.85rem; }

.brand-mark {
  width: 2.8rem; height: 2.8rem; border-radius: var(--r-md);
  display: grid; place-items: center;
  font-weight: 900; font-size: 0.78rem; letter-spacing: 0.08em;
  background: var(--accent-grad); color: #fff;
  box-shadow: 0 8px 24px var(--accent-glow);
}

.brand-mark--big { width: 3.4rem; height: 3.4rem; border-radius: 18px; font-size: 0.88rem; }

.screen-header__title {
  font-weight: 800; font-size: 1.15rem; letter-spacing: -0.025em;
}

.screen-header__subtitle { color: var(--text-2); font-size: 0.82rem; }

.screen-header__actions { display: flex; align-items: center; gap: 0.7rem; }
```

- [ ] **Step 3: Verify the colors render correctly**

Open the browser (run `npm run dev` from `frontend/` if not already running). Check:
- Background is dark (`#0d0d14`) when system is in dark mode
- Brand mark "MR" shows purple gradient
- No teal/green anywhere

- [ ] **Step 4: Commit**

```bash
git add frontend/src/styles/base.css frontend/src/styles/layout.css
git commit -m "style: overhaul color system to deep purple luxury palette"
```

---

## Task 2: Navigation Redesign (nav-responsive.css)

**Files:**
- Modify: `frontend/src/styles/nav-responsive.css`

- [ ] **Step 1: Rewrite nav-responsive.css**

Replace the ENTIRE content of `frontend/src/styles/nav-responsive.css` with:

```css
/* ===== SIDEBAR ===== */
.desktop-rail {
  position: fixed; left: 0; top: 0; bottom: 0;
  width: 17rem; padding: 2rem 1.4rem;
  background: var(--bg-glass-strong);
  border-right: 1px solid var(--border);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  display: none; flex-direction: column; justify-content: space-between;
  z-index: 40;
}

.desktop-rail__brand {
  display: flex; align-items: center; gap: 0.9rem; margin-bottom: 2.5rem;
}
.desktop-rail__brand h2 {
  font-size: 1.1rem; font-weight: 800; margin: 0;
  letter-spacing: -0.03em; color: var(--text-1);
}
.desktop-rail__brand p { color: var(--text-2); font-size: 0.82rem; margin: 0; }

.desktop-rail__nav { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }

.rail-link {
  display: flex; align-items: center; gap: 0.85rem;
  background: transparent; color: var(--text-2);
  border-radius: var(--r-lg); padding: 0.9rem 1.1rem;
  text-align: left; font-weight: 600; font-size: 0.92rem;
  transition: all var(--ease); border: 1px solid transparent;
}

.rail-link span { font-size: 1.1rem; }

.rail-link:hover {
  background: var(--accent-soft); color: var(--text-1);
  border-color: var(--border-s);
}

.rail-link.is-active {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--border-a);
  font-weight: 700;
  box-shadow: inset 0 0 0 1px var(--border-a), var(--sh-sm);
}

.desktop-rail__footnote {
  display: flex; flex-direction: column; gap: 0.3rem;
  border-top: 1px solid var(--border); padding-top: 1.25rem;
  color: var(--text-3); font-size: 0.85rem;
}
.desktop-rail__footnote strong { color: var(--text-1); font-weight: 700; }

/* ===== BOTTOM DOCK ===== */
.bottom-dock {
  position: fixed; left: 0.75rem; right: 0.75rem; bottom: 0.75rem;
  z-index: 20;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.35rem;
  padding: 0.5rem; border-radius: var(--r-xl);
  background: var(--bg-glass-strong);
  border: 1px solid var(--border);
  box-shadow: var(--sh-lg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.dock-item {
  border-radius: var(--r-lg); background: transparent;
  color: var(--text-3); padding: 0.65rem 0.3rem;
  display: grid; place-items: center; gap: 0.15rem;
  font-size: 0.72rem; font-weight: 700;
  transition: background var(--ease), color var(--ease);
  border: 1px solid transparent;
}

.dock-item span { font-size: 1.2rem; }

.dock-item.is-active {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--border-a);
}

/* ===== MAP MARKERS ===== */
.custom-marker {
  width: 40px; height: 40px; border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.9);
  transition: transform 0.2s, box-shadow 0.2s;
}
.custom-marker:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.4), 0 0 20px rgba(124,58,237,0.3);
  transform: rotate(-45deg) scale(1.08);
}
.custom-marker-emoji { transform: rotate(45deg); font-size: 17px; line-height: 1; }
.custom-marker-tip {
  width: 0; height: 0;
  border-left: 7px solid transparent; border-right: 7px solid transparent;
  border-top: 10px solid; margin: -2px auto 0;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

/* ===== MAPBOX OVERRIDES ===== */
.mapbox-popup-override .mapboxgl-popup-content {
  border-radius: var(--r-lg) !important; padding: 0 !important;
  overflow: hidden;
  background: var(--bg-elevated) !important;
  box-shadow: var(--sh-lg) !important;
  border: 1px solid var(--border-s) !important;
  width: 280px !important;
}
.mapbox-popup-override .mapboxgl-popup-tip {
  border-top-color: var(--border-s) !important;
  border-bottom-color: var(--border-s) !important;
}

.popup-card { padding: 1.1rem; }
.category-tag {
  padding: 0.3rem 0.7rem; border-radius: var(--r-sm);
  font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.06em;
}
.popup-nombre {
  margin: 0.6rem 0 0.3rem; font-size: 1.05rem; font-weight: 800;
  color: var(--text-1); letter-spacing: -0.02em;
}
.popup-descripcion {
  font-size: 0.83rem; color: var(--text-2); line-height: 1.5; margin-bottom: 0.75rem;
}

.popup-details {
  list-style: none; padding: 0; margin: 0 0 0.75rem;
  border-top: 1px solid var(--border); padding-top: 0.65rem;
}
.popup-details li {
  font-size: 0.78rem; color: var(--text-2);
  display: flex; align-items: flex-start; gap: 0.4rem; margin-bottom: 0.25rem;
}
.detail-icon { flex-shrink: 0; font-size: 0.82rem; }

.popup-rating { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.75rem; }
.popup-stars { font-size: 0.9rem; letter-spacing: 1px; }
.popup-rating-text { font-size: 0.72rem; color: var(--text-3); font-weight: 700; }
.popup-sin-resenas { font-size: 0.78rem; color: var(--text-3); font-style: italic; }

.popup-actions {
  display: flex; gap: 0.5rem; margin-top: 0.75rem;
  border-top: 1px solid var(--border); padding-top: 0.75rem;
}

.btn-resena-main {
  flex: 1; background: var(--accent-soft); border: 1px solid var(--border-a);
  padding: 0.65rem; border-radius: var(--r-md); font-weight: 700;
  cursor: pointer; font-size: 0.83rem;
  display: flex; align-items: center; justify-content: center; gap: 0.35rem;
  color: var(--accent); transition: background var(--ease), box-shadow var(--ease);
}
.btn-resena-main:hover {
  background: var(--accent-glow);
  box-shadow: 0 4px 16px var(--accent-glow);
}

.btn-delete-place {
  flex: 1; background: var(--danger-soft); border: 1px solid rgba(239,68,68,0.2);
  color: var(--danger); padding: 0.65rem; border-radius: var(--r-md);
  font-weight: 700; font-size: 0.83rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.3rem;
  transition: background var(--ease);
}
.btn-delete-place:hover { background: rgba(239,68,68,0.2); }

/* ===== ANIMATIONS ===== */
.screen-shell, .glass-card, .place-card, .review-card,
.related-item, .saved-item {
  animation: fadeUp 0.35s var(--ease) both;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
  }
}

/* ===== RESPONSIVE ===== */
@media (min-width: 960px) {
  .desktop-rail { display: flex; }

  .screen-shell { padding-bottom: 0; }

  .explorer-main, .detail-layout, .add-layout, .auth-layout,
  .profile-layout, .saved-layout { padding-left: 19rem; }

  .explorer-stage { grid-template-columns: minmax(0, 1fr) minmax(22rem, 0.4fr); align-items: stretch; }
  .detail-layout { grid-template-columns: minmax(0, 1.4fr) minmax(22rem, 0.85fr); }
  .add-layout { grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.75fr); }
  .auth-layout { grid-template-columns: minmax(0, 0.85fr) minmax(20rem, 0.9fr); }

  .saved-layout, .profile-layout {
    grid-template-columns: 1fr; max-width: 64rem; margin: 0 auto;
  }

  .detail-main { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); align-items: start; }
  .form-column { max-width: 44rem; }
  .add-side { position: sticky; top: 5rem; align-self: start; }

  .saved-grid { grid-template-columns: repeat(2, 1fr); }

  .bottom-dock { display: none; }
}

@media (max-width: 959px) {
  .desktop-rail { display: none; }

  .gallery-grid, .detail-bento, .stats-grid, .summary-grid,
  .coords-grid, .saved-grid, .social-row {
    grid-template-columns: 1fr;
  }

  .hero-panel, .list-panel, .map-panel, .detail-card,
  .cta-card, .reviews-card, .related-card, .form-card,
  .summary-card, .profile-layout, .saved-layout, .auth-card {
    border-radius: var(--r-lg);
  }
}
```

- [ ] **Step 2: Verify sidebar in browser at desktop width (>960px)**

Check:
- Sidebar is visible, dark, 17rem wide
- Active nav item has purple background + purple border
- Bottom dock hidden on desktop, visible on mobile

- [ ] **Step 3: Commit**

```bash
git add frontend/src/styles/nav-responsive.css
git commit -m "style: redesign sidebar and dock with deep purple luxury theme"
```

---

## Task 3: Buttons, Chips, Components (components.css)

**Files:**
- Modify: `frontend/src/styles/components.css`

- [ ] **Step 1: Rewrite components.css**

Replace the ENTIRE content of `frontend/src/styles/components.css` with:

```css
/* ===== BUTTONS ===== */
.pill-button, .icon-button, .inline-button, .chip, .dock-item,
.rail-link, .social-button {
  border: 1px solid transparent; cursor: pointer;
  transition: transform var(--ease), background var(--ease),
              border-color var(--ease), color var(--ease), box-shadow var(--ease);
}

.pill-button, .social-button {
  padding: 0.75rem 1.25rem; border-radius: var(--r-pill);
  font-weight: 700; font-size: 0.88rem;
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  letter-spacing: 0.01em;
}

.pill-button:hover, .icon-button:hover, .social-button:hover,
.inline-button:hover, .chip:hover { transform: translateY(-2px); }

.pill-button:active { transform: translateY(0) scale(0.97); }

.pill-button--primary {
  background: var(--accent-grad); color: #fff;
  box-shadow: 0 8px 28px var(--accent-glow);
  border-color: transparent;
}
.pill-button--primary:hover {
  box-shadow: 0 12px 40px var(--accent-glow), 0 0 0 1px rgba(124,58,237,0.3);
}

.pill-button--ghost {
  background: var(--accent-soft); color: var(--text-1);
  border-color: var(--border-s);
}
.pill-button--ghost:hover {
  background: var(--accent-glow);
  border-color: var(--border-a);
}

.pill-button--danger {
  background: var(--danger-soft); color: var(--danger);
  border-color: rgba(239,68,68,0.25);
}
.pill-button--danger:hover { background: rgba(239,68,68,0.2); }

.pill-button--block { width: 100%; }
.pill-button--wide { min-width: 11rem; }

.icon-button {
  width: 2.6rem; height: 2.6rem; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--accent-soft); color: var(--text-1);
  border-color: var(--border-s); font-size: 1rem;
}

.icon-button--ghost { background: transparent; border-color: var(--border); }
.icon-button:hover { background: var(--accent-glow); border-color: var(--border-a); }

.inline-button {
  background: var(--accent-soft); color: var(--text-2);
  border-color: var(--border-s);
  padding: 0.5rem 0.9rem; border-radius: var(--r-pill);
  font-size: 0.82rem; font-weight: 700;
  letter-spacing: 0.01em;
}
.inline-button:hover {
  background: var(--accent-glow); color: var(--accent); border-color: var(--border-a);
}

/* ===== THEME TOGGLE ===== */
.theme-toggle {
  width: 2.6rem; height: 2.6rem; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--accent-soft); border: 1px solid var(--border-s);
  cursor: pointer; font-size: 1.1rem;
  transition: transform var(--ease), background var(--ease), box-shadow var(--ease);
}
.theme-toggle:hover {
  transform: rotate(20deg) scale(1.1);
  background: var(--accent-glow);
  box-shadow: 0 4px 16px var(--accent-glow);
}

/* ===== CHIPS ===== */
.chip-row {
  display: flex; gap: 0.5rem; overflow-x: auto;
  padding-bottom: 0.2rem; scrollbar-width: none;
}
.chip-row::-webkit-scrollbar { display: none; }

.chip {
  flex: 0 0 auto; display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.55rem 1rem; border-radius: var(--r-pill);
  background: var(--bg-elevated); color: var(--text-2);
  border-color: var(--border-s); font-size: 0.83rem; font-weight: 700;
  transition: all var(--ease);
}

.chip.is-active, .chip--static {
  background: var(--accent-soft); color: var(--accent);
  border-color: var(--border-a);
  box-shadow: 0 4px 16px var(--accent-glow);
}

/* ===== EYEBROW ===== */
.eyebrow {
  margin: 0; color: var(--accent); text-transform: uppercase;
  letter-spacing: 0.14em; font-size: 0.68rem; font-weight: 800;
}
```

- [ ] **Step 2: Verify in browser**

Check:
- Primary buttons show purple gradient with glow shadow
- Active chips show purple with glow
- Icon buttons have purple tint background

- [ ] **Step 3: Commit**

```bash
git add frontend/src/styles/components.css
git commit -m "style: redesign buttons and chips with purple luxury aesthetics"
```

---

## Task 4: Place Cards and Screens (screens.css)

**Files:**
- Modify: `frontend/src/styles/screens.css`

- [ ] **Step 1: Rewrite screens.css**

Replace the ENTIRE content of `frontend/src/styles/screens.css` with:

```css
/* ===== EXPLORER ===== */
.explorer-main { display: grid; gap: 1.25rem; padding: 1.25rem; }

.hero-panel { padding: 1.5rem; display: grid; gap: 1rem; }

.hero-panel__copy h1 {
  font-size: clamp(1.6rem, 3vw, 2.8rem);
  line-height: 1.05; font-weight: 800; letter-spacing: -0.035em;
}

.hero-panel__copy p { color: var(--text-2); }

.search-box {
  display: flex; align-items: center; gap: 0.85rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-s);
  border-radius: var(--r-xl); padding: 0.9rem 1.2rem;
  box-shadow: var(--sh-sm);
  transition: border-color var(--ease), box-shadow var(--ease);
}

.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft), var(--sh-md);
}

.search-box__icon { color: var(--text-3); font-size: 1.1rem; }

.search-box input {
  width: 100%; border: none; outline: none;
  background: transparent; color: var(--text-1);
  font-size: 0.92rem;
}
.search-box input::placeholder { color: var(--text-3); }

.explorer-stage { display: grid; gap: 1.25rem; }

/* ===== MAP ===== */
.map-panel {
  height: clamp(28rem, 62vh, 48rem); overflow: hidden;
  border: 1px solid var(--border-s);
  box-shadow: var(--sh-lg);
}

.map-view-root, .map-view-root .leaflet-container {
  height: 100%; width: 100%;
}

.map-view-root .leaflet-container {
  border-radius: calc(var(--r-xl) - 2px); overflow: hidden;
}

/* ===== LIST PANEL ===== */
.list-panel { padding: 1.25rem; display: grid; gap: 1rem; }

.list-panel__head {
  display: flex; align-items: center; justify-content: space-between;
}

.list-panel__head h2 { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; }

.place-stack { display: grid; gap: 0.75rem; }

/* ===== PLACE CARD ===== */
.place-card {
  width: 100%; border-radius: var(--r-lg); padding: 1.1rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text-1); text-align: left;
  transition: transform var(--ease), box-shadow var(--ease), border-color var(--ease);
  cursor: pointer;
}

.place-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--sh-md), 0 0 0 1px var(--border-a);
  border-color: var(--border-a);
}

.place-card__top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0.6rem;
}

.place-card__badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  border-radius: var(--r-pill); padding: 0.35rem 0.8rem;
  font-size: 0.74rem; font-weight: 800; letter-spacing: 0.04em;
}

.place-card__score { color: var(--warn); font-weight: 800; font-size: 0.88rem; }

.place-card h3 {
  font-size: 1rem; font-weight: 800; margin: 0; letter-spacing: -0.02em;
}
.place-card p {
  color: var(--text-2); font-size: 0.84rem; margin: 0.3rem 0 0; line-height: 1.5;
}

.place-card__meta {
  display: flex; flex-wrap: wrap; justify-content: space-between;
  gap: 0.5rem; color: var(--text-3); font-size: 0.79rem; margin-top: 0.75rem;
}

/* ===== DETAIL ===== */
.detail-layout { display: grid; gap: 1.25rem; padding: 1.25rem; }
.detail-main { display: grid; gap: 1.25rem; }
.detail-side { display: grid; gap: 1.25rem; }

.gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }

.gallery-tile {
  min-height: 8rem; border-radius: var(--r-lg); padding: 1rem;
  color: #fff; display: flex; flex-direction: column; justify-content: flex-end;
  box-shadow: var(--sh-md);
  transition: transform var(--ease);
}
.gallery-tile:hover { transform: scale(1.02); }
.gallery-tile strong { font-size: 0.95rem; }
.gallery-tile p { margin: 0.2rem 0 0; color: rgba(255,255,255,0.8); font-size: 0.82rem; }
.gallery-tile__icon { font-size: 1.3rem; margin-bottom: 0.4rem; }

.from-sky-500 { background: linear-gradient(135deg, #0ea5e9, #4f46e5); }
.from-emerald-500 { background: linear-gradient(135deg, #10b981, #0f766e); }
.from-amber-500 { background: linear-gradient(135deg, #f59e0b, #ea580c); }
.from-fuchsia-500 { background: linear-gradient(135deg, #d946ef, #7c3aed); }

.detail-card { padding: 1.5rem; }
.detail-card h1 {
  font-size: clamp(1.5rem, 2.5vw, 2.2rem);
  font-weight: 800; letter-spacing: -0.03em; margin: 0.6rem 0 0;
}

.detail-card__head {
  display: flex; justify-content: space-between; align-items: flex-start;
}

.detail-description {
  color: var(--text-2); line-height: 1.75; margin: 1rem 0 0;
}

.rating-line {
  display: flex; align-items: center; gap: 0.55rem;
  color: var(--text-2); margin-top: 0.5rem; font-size: 0.9rem;
}

.rating-stars { display: flex; gap: 1px; }

.review-stars, .review-stars--large, .review-stars--interactive {
  display: flex; align-items: center; gap: 0.2rem;
}

.review-stars span {
  color: var(--border-s); font-size: 1rem;
  transition: color var(--ease), transform var(--ease);
}
.review-stars span.is-active { color: var(--warn); }
.review-stars--large span { font-size: 1.5rem; }
.review-stars--interactive span:hover { transform: scale(1.2); }

.detail-bento {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;
  margin-top: 1rem;
}

.info-card {
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 1rem;
  transition: border-color var(--ease), box-shadow var(--ease);
}
.info-card:hover {
  border-color: var(--border-a);
  box-shadow: 0 4px 16px var(--accent-glow);
}
.info-card h3 {
  font-size: 0.72rem; font-weight: 800; margin: 0;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent);
}
.info-card p { color: var(--text-2); font-size: 0.88rem; margin: 0.3rem 0 0; }
```

- [ ] **Step 2: Verify in browser**

Check:
- Place cards have visible dark background with purple border on hover
- Search box has rounded `border-radius: var(--r-xl)` look
- Detail info cards show purple label text for the titles

- [ ] **Step 3: Commit**

```bash
git add frontend/src/styles/screens.css
git commit -m "style: redesign place cards and screens with luxury spacing"
```

---

## Task 5: Panels, Forms, Auth (panels.css + auth-profile.css)

**Files:**
- Modify: `frontend/src/styles/panels.css`
- Modify: `frontend/src/styles/auth-profile.css`

- [ ] **Step 1: Rewrite panels.css**

Replace the ENTIRE content of `frontend/src/styles/panels.css` with:

```css
/* ===== CTA / REVIEWS / RELATED ===== */
.cta-card { padding: 1.5rem; display: grid; gap: 0.9rem; text-align: center; }
.cta-card h2 { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; }

.reviews-card, .related-card { padding: 1.25rem; }

.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0.85rem;
}
.section-head h3 { font-size: 1rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }

.review-feed, .related-stack { display: grid; gap: 0.75rem; }

.review-card {
  width: 100%; border-radius: var(--r-lg); padding: 1.1rem;
  background: var(--bg-elevated); border: 1px solid var(--border);
  color: var(--text-1); text-align: left;
  transition: transform var(--ease), border-color var(--ease), box-shadow var(--ease);
}
.review-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-a);
  box-shadow: 0 8px 24px var(--accent-glow);
}

.review-card__head {
  display: flex; align-items: center; gap: 0.75rem;
  justify-content: space-between; margin-bottom: 0.6rem;
}

.review-avatar, .profile-avatar {
  width: 2.6rem; height: 2.6rem; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--accent-soft);
  border: 1px solid var(--border-a);
  font-weight: 800; font-size: 0.75rem; color: var(--accent);
  flex-shrink: 0;
}

.review-card strong { font-size: 0.88rem; font-weight: 700; }
.review-card p { color: var(--text-2); font-size: 0.85rem; margin: 0.3rem 0 0; line-height: 1.5; }

.related-item, .saved-item {
  display: flex; align-items: center; gap: 0.85rem;
  width: 100%; border-radius: var(--r-lg); padding: 0.9rem 1rem;
  background: var(--bg-elevated); border: 1px solid var(--border);
  color: var(--text-1); text-align: left; cursor: pointer;
  transition: transform var(--ease), border-color var(--ease), box-shadow var(--ease);
}
.related-item:hover, .saved-item:hover {
  transform: translateY(-2px);
  border-color: var(--border-a);
  box-shadow: 0 4px 16px var(--accent-glow);
}

.related-item span, .saved-item__icon {
  width: 2.8rem; height: 2.8rem; display: grid; place-items: center;
  border-radius: var(--r-md); background: var(--accent-soft);
  border: 1px solid var(--border-a); flex-shrink: 0; font-size: 1.1rem;
}
.related-item strong, .saved-item strong { font-size: 0.9rem; margin: 0; font-weight: 700; }
.related-item p, .saved-item p { color: var(--text-2); font-size: 0.8rem; margin: 0.15rem 0 0; }

.inline-kicker {
  color: var(--accent); text-transform: uppercase;
  letter-spacing: 0.1em; font-size: 0.68rem; font-weight: 800;
}

/* ===== FORMS ===== */
.add-layout { display: grid; gap: 1.25rem; padding: 1.25rem; }
.form-column { display: grid; gap: 1.25rem; min-width: 0; }
.add-side { display: grid; gap: 1.25rem; }

.section-copy { display: grid; gap: 0.4rem; }
.section-copy h1 {
  font-size: clamp(1.5rem, 2.5vw, 2.2rem);
  font-weight: 800; letter-spacing: -0.03em;
}
.section-copy p { color: var(--text-2); }

.stack-form { display: grid; gap: 1.25rem; }

.form-card { padding: 1.4rem; display: grid; gap: 1rem; }
.form-card h2 { font-size: 1rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }

.form-card label, .field {
  display: grid; gap: 0.4rem; color: var(--text-2);
  font-weight: 600; font-size: 0.85rem;
}

.form-card input, .form-card textarea, .form-card select, .auth-form input {
  min-height: 2.9rem; border-radius: var(--r-md);
  border: 1px solid var(--border-s); background: var(--bg-sunken);
  color: var(--text-1); padding: 0.8rem 1rem;
  transition: border-color var(--ease), box-shadow var(--ease);
  font-size: 0.9rem;
}

.form-card input:focus, .form-card textarea:focus, .form-card select:focus,
.auth-form input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.form-card textarea { resize: vertical; }
.muted-copy { color: var(--text-2); font-size: 0.88rem; }

.pin-preview { display: grid; gap: 0.75rem; }

.pin-preview__map, .drop-zone {
  min-height: 10rem; border-radius: var(--r-lg);
  border: 2px dashed var(--border-s);
  background: var(--accent-soft); display: grid; place-items: center;
  text-align: center; padding: 1.5rem; color: var(--text-2);
  transition: border-color var(--ease), background var(--ease);
}
.pin-preview__map:hover, .drop-zone:hover {
  border-color: var(--accent); background: var(--accent-glow);
}

.pin-preview__map strong, .drop-zone strong {
  color: var(--text-1); display: block; margin-top: 0.5rem; font-size: 0.9rem;
}

.coords-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.7rem; }
.form-actions { display: flex; align-items: center; gap: 0.75rem; }

.summary-card { padding: 1.4rem; }
.summary-card h2 { font-size: 1.05rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }

.summary-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.7rem; margin-top: 0.75rem;
}

.summary-grid div {
  border: 1px solid var(--border); background: var(--bg-sunken);
  border-radius: var(--r-md); padding: 0.85rem;
  transition: border-color var(--ease);
}
.summary-grid div:hover { border-color: var(--border-a); }
.summary-grid span {
  display: block; color: var(--accent);
  font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.1em; margin-bottom: 0.3rem;
}
.summary-grid strong { font-size: 0.9rem; }

.check-list {
  margin: 0.75rem 0 0; padding-left: 1.1rem; color: var(--text-2);
  display: grid; gap: 0.5rem; font-size: 0.88rem;
}
```

- [ ] **Step 2: Rewrite auth-profile.css**

Replace the ENTIRE content of `frontend/src/styles/auth-profile.css` with:

```css
/* ===== AUTH ===== */
.auth-layout { display: grid; gap: 1.5rem; padding: 1.25rem; align-items: center; }

.auth-copy { min-width: 0; }
.auth-copy h1 {
  font-size: clamp(1.6rem, 3vw, 2.6rem);
  font-weight: 800; letter-spacing: -0.035em;
}
.auth-copy p { color: var(--text-2); margin: 0.35rem 0 0; }

.auth-points { display: grid; gap: 0.75rem; margin-top: 1.25rem; }
.auth-points div {
  border: 1px solid var(--border); border-radius: var(--r-lg);
  padding: 1rem 1.1rem; background: var(--bg-sunken);
  transition: border-color var(--ease), box-shadow var(--ease);
}
.auth-points div:hover {
  border-color: var(--border-a);
  box-shadow: 0 4px 16px var(--accent-glow);
}
.auth-points strong { font-size: 0.88rem; display: block; font-weight: 700; }
.auth-points span { color: var(--text-2); font-size: 0.82rem; }

.auth-card-wrap { min-width: 0; }

.auth-card { padding: 1.5rem; display: grid; gap: 1rem; }

.auth-card__header { display: flex; align-items: center; gap: 0.85rem; }
.auth-card__header h2 { margin: 0; font-size: 1.15rem; font-weight: 800; letter-spacing: -0.025em; }
.auth-card__header p { margin: 0; color: var(--text-2); font-size: 0.85rem; }

.auth-toggle {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem;
  background: var(--bg-sunken); border: 1px solid var(--border-s);
  padding: 0.35rem; border-radius: var(--r-lg);
}

.auth-toggle__tab {
  border-radius: var(--r-md); border: none;
  background: transparent; color: var(--text-3);
  padding: 0.75rem 0.8rem; font-weight: 700; font-size: 0.88rem;
  cursor: pointer; transition: background var(--ease), color var(--ease), box-shadow var(--ease);
}

.auth-toggle__tab.is-active {
  background: var(--accent-soft); color: var(--accent);
  box-shadow: 0 2px 12px var(--accent-glow);
}

.auth-form { display: grid; gap: 0.85rem; }

.auth-error {
  color: var(--danger); background: var(--danger-soft);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: var(--r-md); padding: 0.75rem 0.9rem;
  font-size: 0.85rem; margin: 0;
}

.auth-divider {
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: center; gap: 0.75rem; color: var(--text-3);
  font-size: 0.82rem;
}
.auth-divider span { height: 1px; background: var(--border-s); }

.social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
.social-button {
  min-height: 2.9rem; background: var(--bg-sunken);
  border-color: var(--border-s); font-weight: 700;
}
.social-button:hover {
  border-color: var(--border-a);
  background: var(--accent-soft);
}

.auth-switch { margin: 0; text-align: center; color: var(--text-3); font-size: 0.85rem; }
.auth-switch button {
  margin-left: 0.3rem; border: none; background: none;
  color: var(--accent); font-weight: 700; cursor: pointer;
}

/* ===== PROFILE ===== */
.profile-layout { padding: 1.5rem; gap: 1.25rem; display: grid; }

.profile-hero {
  display: flex; align-items: center; gap: 1.25rem;
  padding: 1rem 0;
}

.profile-avatar {
  width: 4rem; height: 4rem; font-size: 1.1rem;
  border: 2px solid var(--border-a);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.profile-layout h1 {
  font-size: clamp(1.4rem, 2.5vw, 2.2rem);
  font-weight: 800; letter-spacing: -0.03em;
}
.profile-layout p { color: var(--text-2); margin: 0.2rem 0 0; font-size: 0.88rem; }

.stats-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
}
.stats-grid article {
  border: 1px solid var(--border); background: var(--bg-sunken);
  border-radius: var(--r-lg); padding: 1rem; text-align: center;
  transition: border-color var(--ease), box-shadow var(--ease), transform var(--ease);
}
.stats-grid article:hover {
  border-color: var(--border-a);
  box-shadow: 0 8px 24px var(--accent-glow);
  transform: translateY(-2px);
}
.stats-grid strong {
  font-size: 1.5rem; font-weight: 900; display: block;
  background: var(--accent-grad); -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; background-clip: text;
}
.stats-grid span { color: var(--text-2); font-size: 0.78rem; display: block; margin-top: 0.2rem; font-weight: 600; }

.profile-actions { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }

/* ===== SAVED ===== */
.saved-layout { padding: 1.5rem; gap: 1.25rem; display: grid; }
.saved-layout h1 {
  font-size: clamp(1.4rem, 2.5vw, 2.2rem);
  font-weight: 800; letter-spacing: -0.03em;
}
.saved-layout p { color: var(--text-2); }

.empty-state { max-width: 32rem; }

.saved-grid { display: grid; gap: 0.75rem; }
```

- [ ] **Step 3: Verify in browser**

Check across all screens:
- Review cards have purple glow on hover
- Form inputs have purple focus ring
- Profile stats show gradient number text
- Auth toggle active tab has purple glow

- [ ] **Step 4: Commit**

```bash
git add frontend/src/styles/panels.css frontend/src/styles/auth-profile.css
git commit -m "style: redesign panels, forms, auth and profile with luxury spacing"
```
