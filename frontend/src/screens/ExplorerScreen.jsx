import React, { useState } from 'react';
import { Compass, Home, PlusCircle, Sparkles, Sun, Moon } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import SearchBar from '../components/shared/SearchBar';
import CategoryChips from '../components/shared/CategoryChips';
import PanelNav from '../components/shared/PanelNav';
import PlaceCard from '../components/shared/PlaceCard';
import { useTheme } from '../context/ThemeContext';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

function RecommendationsPanel({
  recommendations = [],
  meta = {},
  loading = false,
  isAuthenticated = false,
  onSelectPlace,
}) {
  if (!isAuthenticated) return null;

  const title = meta.hasPersonalization ? 'Recomendado para ti' : 'Para empezar';
  const subtitle = meta.hasPersonalization
    ? 'Basado en tus búsquedas, visitas y favoritos recientes.'
    : 'Busca o abre lugares para personalizar más esta lista.';

  return (
    <section className="recommendations-panel">
      <div className="recommendations-panel__head">
        <span className="recommendations-panel__icon">
          <Sparkles size={14} strokeWidth={1.8} />
        </span>
        <div>
          <p className="eyebrow">{title}</p>
          <h3>{subtitle}</h3>
        </div>
      </div>

      {loading ? (
        <div className="recommendations-panel__loading">Actualizando recomendaciones...</div>
      ) : recommendations.length === 0 ? (
        <div className="recommendations-panel__empty">
          Abre algunos lugares o guarda favoritos para activar recomendaciones.
        </div>
      ) : (
        <div className="recommendations-list">
          {recommendations.slice(0, 3).map((place) => (
            <button
              key={place.id}
              type="button"
              className="recommendation-card"
              onClick={() => onSelectPlace?.(place)}
            >
              <span className="recommendation-card__icon">{place.categoriaIcono || '📍'}</span>
              <span className="recommendation-card__body">
                <strong>{place.nombre}</strong>
                <small>{place.reason || place.categoria}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default function ExplorerScreen({
  filteredPlaces, search, setSearch, category, setCategory,
  onSelectPlace, onOpenAdd, onNavigate, onMapClick,
  userLocation, user, isAuthenticated = false,
  recommendations = [], recommendationsMeta = {}, recommendationsLoading = false,
  notifCount = 0,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const userInits = user?.nombre ? initials(user.nombre) : null;

  return (
    <div className="app-container">
      {/* MAP */}
      <div className="map-layer">
        <MapContainer
          lugares={filteredPlaces}
          userLocation={userLocation}
          onMapClick={onMapClick}
          onOpenDetail={onSelectPlace}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* FLOATING SEARCH */}
      <SearchBar
        value={search}
        onChange={setSearch}
        userInitials={userInits}
        onAvatarClick={() => onNavigate('perfil')}
        onHomeClick={() => onNavigate('landing')}
      />

      {/* CHIPS (mobile only via CSS) */}
      <CategoryChips selected={category} onSelect={setCategory} />

      {/* BOTTOM PANEL (mobile) */}
      <div className={`bottom-panel${panelOpen ? ' is-expanded' : ' is-collapsed'}`}>
        <div className="panel-handle-wrap" onClick={() => setPanelOpen(o => !o)}>
          <div className="panel-handle" />
        </div>

        <PanelNav activeView="mapa" onNavigate={onNavigate} notifCount={notifCount} />

        <RecommendationsPanel
          recommendations={recommendations}
          meta={recommendationsMeta}
          loading={recommendationsLoading}
          isAuthenticated={isAuthenticated}
          onSelectPlace={onSelectPlace}
        />

        <div className="place-list">
          {filteredPlaces.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p>No hay lugares que coincidan.</p>
            </div>
          ) : (
            filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} onClick={onSelectPlace} />
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
          <button type="button" className="panel-brand panel-brand--button" onClick={() => onNavigate('landing')}>
            Mapa<br /><small>de Reseñas</small>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onNavigate('landing')}>
              <Home size={14} strokeWidth={1.8} /> Inicio
            </button>
            <button type="button" className="btn btn--icon" onClick={toggleTheme}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}>
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

        <PanelNav activeView="mapa" onNavigate={onNavigate} notifCount={notifCount} />

        <section className="panel-intro">
          <span className="panel-intro__icon"><Compass size={15} strokeWidth={1.7} /></span>
          <div>
            <p className="eyebrow">Explorar</p>
            <h2>{filteredPlaces.length} lugar{filteredPlaces.length !== 1 ? 'es' : ''} encontrado{filteredPlaces.length !== 1 ? 's' : ''}</h2>
            <p>Busca por nombre, categoría o dirección y abre el detalle para reseñar, guardar o compartir.</p>
          </div>
        </section>

        <RecommendationsPanel
          recommendations={recommendations}
          meta={recommendationsMeta}
          loading={recommendationsLoading}
          isAuthenticated={isAuthenticated}
          onSelectPlace={onSelectPlace}
        />

        <div style={{ padding: '0.6rem 1rem 0' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['Todos', 'Restaurante', 'Parque', 'Cultura', 'Tienda'].map(cat => (
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
              <PlaceCard key={place.id} place={place} onClick={onSelectPlace} />
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
