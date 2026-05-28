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
        <div className="profile-avatar">
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.nombre}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : inits}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-1)' }}>
            {profile.nombre}
          </div>
          {sinceYear && <div className="eyebrow" style={{ marginTop: '0.15rem' }}>Miembro desde {sinceYear}</div>}
          <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', marginTop: '0.1rem' }}>
            {profile.lugares?.length || 0} lugar{(profile.lugares?.length || 0) !== 1 ? 'es' : ''} publicado{(profile.lugares?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {!(profile.lugares?.length) ? (
        <div className="empty-state" style={{ padding: '1.5rem 0' }}>
          <p>Este usuario no ha publicado lugares aún.</p>
        </div>
      ) : (
        <div className="place-list" style={{ padding: 0 }}>
          {(profile.lugares || []).map(place => (
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
