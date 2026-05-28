import React from 'react';
import { ArrowLeft, UserRound } from 'lucide-react';
import PlaceCard from '../components/shared/PlaceCard';
import WorkspaceScreen from '../components/shared/WorkspaceScreen';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

export default function PublicProfileScreen({ profile, onBack, onSelectPlace, onNavigate, isAuthenticated = false, notifCount = 0 }) {
  if (!profile) return null;

  const sinceYear = profile.miembro ? new Date(profile.miembro).getFullYear() : null;
  const inits = initials(profile.nombre);

  const content = (
    <div className="workspace-grid workspace-grid--profile">
      <section className="workspace-panel workspace-panel--account">
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
      </section>

      {!(profile.lugares?.length) ? (
        <div className="empty-state workspace-empty workspace-panel workspace-panel--wide">
          <p>Este usuario no ha publicado lugares aún.</p>
        </div>
      ) : (
        <div className="workspace-list-grid workspace-panel--wide">
          {(profile.lugares || []).map(place => (
            <PlaceCard key={place.id} place={place} onClick={onSelectPlace} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <WorkspaceScreen
      activeView="mapa"
      eyebrow="Perfil público"
      title={profile.nombre}
      subtitle="Lugares publicados por este usuario dentro del mapa."
      icon={UserRound}
      onNavigate={onNavigate}
      isAuthenticated={isAuthenticated}
      notifCount={notifCount}
      actions={(
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={1.8} /> Volver
        </button>
      )}
    >
      {content}
    </WorkspaceScreen>
  );
}
