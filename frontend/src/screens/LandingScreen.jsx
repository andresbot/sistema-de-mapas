import React from 'react';
import { ArrowRight, MapPinned, PlusCircle, Star, Bookmark, MessageSquare } from 'lucide-react';
import MapContainer from '../components/MapContainer';

const CATEGORY_LIMIT = 5;

function getCategoryStats(places = []) {
  const counts = new Map();
  for (const place of places) {
    const category = place.categoria || 'General';
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, CATEGORY_LIMIT);
}

function getFeaturedPlaces(places = []) {
  return [...places]
    .sort((a, b) => Number(b.puntuacionPromedio || 0) - Number(a.puntuacionPromedio || 0))
    .slice(0, 3);
}

export default function LandingScreen({ places = [], onExplore, onPublish, onSelectPlace }) {
  const categories = getCategoryStats(places);
  const featured = getFeaturedPlaces(places);

  return (
    <div className="landing-screen">
      <div className="landing-map">
        <MapContainer
          lugares={places}
          userLocation={null}
          onMapClick={null}
          onOpenDetail={onSelectPlace}
          className="landing-map__canvas"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <header className="landing-topbar">
        <div className="landing-brand">
          <span>Mapa</span>
          <small>de Reseñas</small>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onExplore}>
          Explorar
        </button>
      </header>

      <main className="landing-content">
        <section className="landing-hero">
          <p className="eyebrow">Guía local de Zarzal</p>
          <h1>Encuentra lugares con contexto, reseñas y detalles útiles.</h1>
          <p>
            Explora restaurantes, parques, tiendas y espacios culturales desde el mapa.
            Guarda tus favoritos y publica nuevos lugares cuando quieras aportar a la comunidad.
          </p>

          <div className="landing-actions">
            <button type="button" className="btn btn--primary btn--hero" onClick={onExplore}>
              Explorar mapa <ArrowRight size={17} strokeWidth={2} />
            </button>
            <button type="button" className="btn btn--ghost btn--hero" onClick={onPublish}>
              <PlusCircle size={17} strokeWidth={2} /> Publicar lugar
            </button>
          </div>
        </section>

        <aside className="landing-card">
          <div className="landing-card__head">
            <MapPinned size={18} strokeWidth={1.8} />
            <div>
              <strong>{places.length || 0} lugares</strong>
              <span>listos para explorar</span>
            </div>
          </div>

          <div className="landing-metrics">
            <div><Star size={14} fill="currentColor" strokeWidth={0} /><span>Reseñas reales</span></div>
            <div><Bookmark size={14} strokeWidth={1.8} /><span>Favoritos</span></div>
            <div><MessageSquare size={14} strokeWidth={1.8} /><span>Comunidad</span></div>
          </div>

          {categories.length > 0 && (
            <div className="landing-section">
              <span className="landing-kicker">Categorías activas</span>
              <div className="landing-chip-grid">
                {categories.map(([category, count]) => (
                  <span key={category} className="landing-chip">{category}<b>{count}</b></span>
                ))}
              </div>
            </div>
          )}

          {featured.length > 0 && (
            <div className="landing-section">
              <span className="landing-kicker">Destacados</span>
              <div className="landing-featured">
                {featured.map((place) => (
                  <button key={place.id} type="button" onClick={() => onSelectPlace?.(place)}>
                    <span className="landing-featured__icon">
                      {place.categoriaIcono || <MapPinned size={15} strokeWidth={2} />}
                    </span>
                    <strong>{place.nombre}</strong>
                    <small>{place.categoria}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
