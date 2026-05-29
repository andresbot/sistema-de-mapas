import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Flag,
  Star, MapPin, Clock, Phone, Globe, MessageSquare,
  User, Trash2, X, MapPinned, Home, ImagePlus
} from 'lucide-react';
import PanelNav from '../components/shared/PanelNav';
import PlaceCard from '../components/shared/PlaceCard';
import MapContainer from '../components/MapContainer';
import {
  MAX_REVIEW_IMAGES,
  MAX_REVIEW_IMAGE_BYTES,
  REVIEW_IMAGE_TYPES,
  uploadReviewImages,
} from '../services/uploadService.js';

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

function getReviewImages(imagenes) {
  return Array.isArray(imagenes)
    ? imagenes.filter((image) => image?.secureUrl && image?.publicId).slice(0, MAX_REVIEW_IMAGES)
    : [];
}

function formatImageSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function makePreviewImage(file) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

export default function DetailScreen({
  place, onBack, onNavigate, onSelectPlace, relatedPlaces = [],
  onDelete, onAddReview, onDeleteReview, currentUserId,
  isFavorited = false, onToggleFavorito, onOpenPublicProfile,
  onSharePlace, onReportReview, notifCount = 0,
}) {
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const selectedImagesRef = useRef([]);
  const [imageError, setImageError] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reportingId, setReportingId] = useState(null);
  const [reportMotivo, setReportMotivo] = useState('spam');

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => () => {
    selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, []);

  if (!place) return null;

  const clearSelectedImages = () => {
    setSelectedImages((current) => {
      current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
  };

  const removeSelectedImage = (imageId) => {
    setSelectedImages((current) => {
      const image = current.find((item) => item.id === imageId);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return current.filter((item) => item.id !== imageId);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;

    const nextImages = [];
    const errors = [];

    for (const file of files) {
      if (selectedImages.length + nextImages.length >= MAX_REVIEW_IMAGES) {
        errors.push(`Solo puedes adjuntar ${MAX_REVIEW_IMAGES} imagenes por resena.`);
        break;
      }

      if (!REVIEW_IMAGE_TYPES.has(file.type)) {
        errors.push(`${file.name}: usa JPG, PNG o WebP.`);
        continue;
      }

      if (file.size > MAX_REVIEW_IMAGE_BYTES) {
        errors.push(`${file.name}: maximo ${formatImageSize(MAX_REVIEW_IMAGE_BYTES)}.`);
        continue;
      }

      nextImages.push(makePreviewImage(file));
    }

    if (nextImages.length > 0) {
      setSelectedImages((current) => [...current, ...nextImages]);
    }

    setImageError(errors[0] || '');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if ((!comentario.trim() && selectedImages.length === 0) || submitting) return;
    setSubmitting(true);
    setImageError('');
    try {
      const imagenes = selectedImages.length
        ? await uploadReviewImages(selectedImages.map((image) => image.file))
        : [];
      const saved = await onAddReview?.(place.id, {
        puntuacion,
        comentario: comentario.trim(),
        imagenes,
      });

      if (saved === false) return;

      setComentario('');
      setPuntuacion(5);
      clearSelectedImages();
    } catch (error) {
      setImageError(error.message || 'No se pudieron subir las imagenes.');
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
            <div className="review-upload">
              <label className="review-upload__trigger">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  disabled={submitting || selectedImages.length >= MAX_REVIEW_IMAGES}
                />
                <ImagePlus size={14} strokeWidth={1.7} />
                <span>Agregar imagenes</span>
                <small>{selectedImages.length}/{MAX_REVIEW_IMAGES}</small>
              </label>

              {selectedImages.length > 0 && (
                <div className="review-upload__preview" aria-label="Imagenes seleccionadas">
                  {selectedImages.map((image) => (
                    <figure key={image.id} className="review-upload__thumb">
                      <img src={image.previewUrl} alt={image.file.name} />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(image.id)}
                        aria-label="Quitar imagen"
                      >
                        <X size={11} strokeWidth={2} />
                      </button>
                    </figure>
                  ))}
                </div>
              )}

              {imageError && <p className="review-upload__error">{imageError}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting || (!comentario.trim() && selectedImages.length === 0)}
              className="btn btn--primary btn--sm btn--block"
              style={{ marginTop: '0.5rem' }}
            >
              {submitting ? 'Publicando…' : 'Publicar reseña'}
            </button>
          </form>
        )}

        {place.resenas?.length > 0 ? place.resenas.map(rev => {
          const reviewImages = getReviewImages(rev.imagenes);

          return (
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
            {reviewImages.length > 0 && (
              <div className="review-gallery" aria-label="Imagenes de la resena">
                {reviewImages.map((image, index) => (
                  <button
                    key={image.publicId}
                    type="button"
                    className="review-gallery__item"
                    onClick={() => setLightboxImage(image)}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img src={image.secureUrl} alt={`Imagen ${index + 1} de la resena`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          );
        }) : (
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
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)', maxHeight: '92vh' }}>
        <div className="panel-back panel-back--split">
          <button type="button" className="panel-back__action" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={1.5} /> Volver al mapa
          </button>
          <button type="button" className="panel-home-link" onClick={() => onNavigate('landing')}>
            <Home size={13} strokeWidth={1.8} /> Inicio
          </button>
        </div>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {panelContent}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-back panel-back--split">
          <button type="button" className="panel-back__action" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={1.5} /> Volver
          </button>
          <button type="button" className="panel-home-link" onClick={() => onNavigate('landing')}>
            <Home size={13} strokeWidth={1.8} /> Inicio
          </button>
        </div>
        <PanelNav activeView="detalle" onNavigate={onNavigate} notifCount={notifCount} />
        <section className="panel-intro">
          <span className="panel-intro__icon"><MapPinned size={15} strokeWidth={1.7} /></span>
          <div>
            <p className="eyebrow">Detalle</p>
            <h2>{place.nombre}</h2>
            <p>Consulta datos útiles, reseñas y acciones rápidas del lugar seleccionado.</p>
          </div>
        </section>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {panelContent}
        </div>
      </div>

      {lightboxImage && (
        <div
          className="review-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen de la resena"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            className="review-lightbox__close"
            onClick={() => setLightboxImage(null)}
            aria-label="Cerrar imagen"
          >
            <X size={18} strokeWidth={2} />
          </button>
          <img
            src={lightboxImage.secureUrl}
            alt="Imagen de la resena"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
