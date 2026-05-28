import React, { useState } from 'react';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Flag,
  Star, MapPin, Clock, Phone, Globe, MessageSquare,
  User, Trash2, X
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
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn${n <= value ? ' is-filled' : ''}`}
          onClick={() => !readonly && onChange?.(n)}
        >
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

  const related = (relatedPlaces || []).filter(p => p.id !== place.id).slice(0, 3);

  const panelContent = (
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
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

      <div className="detail-actions">
        <button
          type="button"
          className={`btn btn--icon${isFavorited ? ' is-active' : ''}`}
          onClick={() => onToggleFavorito?.(place.id)}
          title={isFavorited ? 'Quitar de favoritos' : 'Guardar'}
        >
          {isFavorited
            ? <BookmarkCheck size={16} strokeWidth={2} />
            : <Bookmark size={16} strokeWidth={1.5} />}
        </button>
        <button
          type="button"
          className="btn btn--icon"
          onClick={() => onSharePlace?.(place)}
          title="Compartir"
        >
          <Share2 size={16} strokeWidth={1.5} />
        </button>
        {place.creadorId && onOpenPublicProfile && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => onOpenPublicProfile(place.creadorId)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <User size={14} strokeWidth={1.5} /> Ver creador
          </button>
        )}
      </div>

      {(place.descripcion || place.direccion || place.horario || place.telefono || place.sitioWeb) && (
        <div className="detail-section">
          <h4><MapPin size={13} strokeWidth={1.5} /> Información</h4>
          {place.descripcion && (
            <p style={{ fontSize: '0.83rem', color: 'var(--text-2)', marginBottom: '0.6rem', lineHeight: 1.55 }}>
              {place.descripcion}
            </p>
          )}
          {place.direccion && <div className="info-row"><MapPin size={13} strokeWidth={1.5} />{place.direccion}</div>}
          {place.horario   && <div className="info-row"><Clock  size={13} strokeWidth={1.5} />{place.horario}</div>}
          {place.telefono  && <div className="info-row"><Phone  size={13} strokeWidth={1.5} />{place.telefono}</div>}
          {place.sitioWeb  && (
            <div className="info-row">
              <Globe size={13} strokeWidth={1.5} />
              <a href={place.sitioWeb} target="_blank" rel="noreferrer">{place.sitioWeb}</a>
            </div>
          )}
        </div>
      )}

      <div className="detail-section">
        <h4><MessageSquare size={13} strokeWidth={1.5} /> Reseñas ({place.resenas?.length || 0})</h4>

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
            <button
              type="submit"
              disabled={submitting || !comentario.trim()}
              className="btn btn--primary btn--sm btn--block"
              style={{ marginTop: '0.5rem' }}
            >
              {submitting ? 'Publicando…' : 'Publicar reseña'}
            </button>
          </form>
        )}

        {place.resenas?.length > 0 ? place.resenas.map(rev => (
          <div key={rev.id} className="review-card">
            <div className="review-card__head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="review-avatar">{initials(rev.usuario?.nombre)}</div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-1)' }}>
                    {rev.usuario?.nombre || 'Usuario'}
                  </div>
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
                      <select
                        value={reportMotivo}
                        onChange={e => setReportMotivo(e.target.value)}
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem', width: 'auto', minWidth: '5rem' }}
                      >
                        <option value="spam">Spam</option>
                        <option value="ofensivo">Ofensivo</option>
                        <option value="falso">Falso</option>
                        <option value="otro">Otro</option>
                      </select>
                      <button type="button" className="btn btn--danger btn--sm"
                        onClick={() => {
                          onReportReview?.(place.id, rev.id, reportMotivo);
                          setReportingId(null);
                          setReportMotivo('spam');
                        }}>
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

      {related.length > 0 && (
        <div className="detail-section">
          <h4>Similares</h4>
          {related.map(p => <PlaceCard key={p.id} place={p} onClick={onSelectPlace} />)}
        </div>
      )}

      {onDelete && place?.id && (
        <div className="detail-section">
          <button
            type="button"
            className="btn btn--danger btn--block"
            onClick={() => window.confirm('¿Eliminar este lugar?') && onDelete(place.id)}
          >
            <Trash2 size={14} strokeWidth={1.5} /> Eliminar lugar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="app-container">
      <div className="map-layer">
        <MapContainer
          lugares={[place]}
          userLocation={null}
          onMapClick={null}
          onOpenDetail={null}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* MOBILE */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)', maxHeight: '80vh' }}>
        <div className="panel-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Volver al mapa
        </div>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {panelContent}
        </div>
      </div>

      {/* DESKTOP */}
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
