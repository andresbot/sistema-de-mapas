# Frontend

Frontend React/Vite de Mapa de Resenas.

La documentacion principal del proyecto esta en:

```text
../README.md
```

## Desarrollo

```bash
npm install
npm run dev
```

Variables requeridas en `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=tu_token_publico_de_mapbox
```

## Scripts

```bash
npm run dev      # servidor local
npm run build    # build de produccion
npm run lint     # lint
npm run preview  # preview del build
```

## Despliegue En Vercel

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

En produccion, `VITE_API_URL` debe terminar en `/api`.
