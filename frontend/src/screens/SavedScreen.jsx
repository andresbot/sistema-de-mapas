import React from 'react';
import { BookmarkCheck, BookmarkX, Map } from 'lucide-react';
import PlaceCard from '../components/shared/PlaceCard';
import WorkspaceScreen from '../components/shared/WorkspaceScreen';

function SavedContent({ savedPlaces, onSelectPlace, onNavigate }) {
  if (savedPlaces.length === 0) {
    return (
      <div className="empty-state workspace-empty">
        <BookmarkX size={40} strokeWidth={1} color="var(--amber-border)" />
        <h3>Sin lugares guardados</h3>
        <p>Abre un lugar desde el mapa y toca guardar para construir tu propia ruta local.</p>
        <button type="button" className="btn btn--primary" style={{ marginTop: '0.5rem' }}
          onClick={() => onNavigate('mapa')}>
          Explorar mapa
        </button>
      </div>
    );
  }
  return (
    <div className="workspace-list-grid">
      {savedPlaces.map(place => (
        <PlaceCard key={place.id} place={place} onClick={onSelectPlace} />
      ))}
    </div>
  );
}

export default function SavedScreen({ onNavigate, savedPlaces = [], onSelectPlace, notifCount = 0 }) {
  return (
    <WorkspaceScreen
      activeView="guardados"
      eyebrow="Colección"
      title={`${savedPlaces.length} guardado${savedPlaces.length !== 1 ? 's' : ''}`}
      subtitle="Un acceso rápido a los lugares que quieres visitar, recomendar o revisar después."
      icon={BookmarkCheck}
      onNavigate={onNavigate}
      notifCount={notifCount}
      actions={(
        <button type="button" className="btn btn--primary" onClick={() => onNavigate('mapa')}>
          <Map size={15} strokeWidth={1.8} /> Explorar mapa
        </button>
      )}
    >
      <SavedContent savedPlaces={savedPlaces} onSelectPlace={onSelectPlace} onNavigate={onNavigate} />
    </WorkspaceScreen>
  );
}
