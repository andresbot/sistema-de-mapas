import React from 'react';
import { BookmarkX } from 'lucide-react';
import PanelNav from '../components/shared/PanelNav';
import PlaceCard from '../components/shared/PlaceCard';

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

export default function SavedScreen({ onNavigate, savedPlaces = [], onSelectPlace, notifCount = 0 }) {
  return (
    <div className="app-container">
      <div className="map-layer" style={{ background: 'var(--bg-2)' }} />

      {/* MOBILE */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)', maxHeight: '100vh' }}>
        <PanelNav activeView="guardados" onNavigate={onNavigate} notifCount={notifCount} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          <SavedContent savedPlaces={savedPlaces} onSelectPlace={onSelectPlace} onNavigate={onNavigate} />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-header">
          <div className="panel-brand">Guardados<br /><small>tus favoritos</small></div>
        </div>
        <PanelNav activeView="guardados" onNavigate={onNavigate} notifCount={notifCount} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          <SavedContent savedPlaces={savedPlaces} onSelectPlace={onSelectPlace} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
