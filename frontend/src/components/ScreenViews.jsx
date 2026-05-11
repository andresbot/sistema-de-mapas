import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import MapView from './MapContainer';
import { RegisterForm } from './RegisterForm';
import {
  CATEGORY_META,
  CATEGORY_OPTIONS,
} from '../data/demoContent';
import MapGL, { Marker } from 'react-map-gl/mapbox';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = 'mapbox://styles/camilotriana0/cmohdb83m006v01qrbeol6y0m';

const ratingIcons = (rating) =>
  Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? 'is-active' : ''}>
      ★
    </span>
  ));

const categoryMeta = (category) => CATEGORY_META[category] || CATEGORY_META.General;

const initials = (name = 'MR') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const ShellHeader = ({ title, subtitle, onBack, actions }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="screen-header">
      <div className="screen-header__brand">
        {onBack ? (
          <button type="button" className="icon-button" onClick={onBack} aria-label="Volver">
            ←
          </button>
        ) : (
          <div className="brand-mark">MR</div>
        )}
        <div>
          <div className="screen-header__title">{title}</div>
          {subtitle && <div className="screen-header__subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="screen-header__actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {actions}
      </div>
    </header>
  );
};

const DockNav = ({ activeView, onNavigate, isAuthenticated }) => (
  <nav className="bottom-dock" aria-label="Navegación principal">
    <button className={`dock-item ${activeView === 'mapa' ? 'is-active' : ''}`} onClick={() => onNavigate('mapa')}>
      <span>🗺️</span>
      <small>Mapa</small>
    </button>
    <button className={`dock-item ${activeView === 'añadir' ? 'is-active' : ''}`} onClick={() => onNavigate('añadir')}>
      <span>＋</span>
      <small>Añadir</small>
    </button>
    <button className={`dock-item ${activeView === 'guardados' ? 'is-active' : ''}`} onClick={() => onNavigate('guardados')}>
      <span>★</span>
      <small>Guardados</small>
    </button>
    <button className={`dock-item ${activeView === 'perfil' ? 'is-active' : ''}`} onClick={() => onNavigate('perfil')}>
      <span>{isAuthenticated ? '👤' : '🔐'}</span>
      <small>{isAuthenticated ? 'Perfil' : 'Entrar'}</small>
    </button>
  </nav>
);

export function ExplorerScreen({
  places,
  filteredPlaces,
  search,
  setSearch,
  category,
  setCategory,
  onSelectPlace,
  onOpenAdd,
  onNavigate,
  onMapClick,
  userLocation,
  isAuthenticated,
  user,
  onLogout,
}) {
  const visiblePlaces = filteredPlaces.length ? filteredPlaces : places;

  return (
    <div className="screen-shell explorer-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <ShellHeader
        title="Mapa de Reseñas"
        subtitle="Explora lugares, filtra y salta al detalle en segundos"
        actions={
          <>
            {isAuthenticated ? (
              <button type="button" className="pill-button pill-button--ghost" onClick={onLogout}>
                Cerrar sesión
              </button>
            ) : (
              <button type="button" className="pill-button pill-button--ghost" onClick={() => onNavigate('perfil')}>
                Entrar
              </button>
            )}
            <button type="button" className="pill-button pill-button--primary" onClick={onOpenAdd}>
              Añadir lugar
            </button>
          </>
        }
      />

      <aside className="desktop-rail">
        <div className="desktop-rail__brand">
          <div className="brand-mark brand-mark--big">MR</div>
          <div>
            <h2>Mapa de Reseñas</h2>
            <p>Guía visual de la ciudad</p>
          </div>
        </div>

        <nav className="desktop-rail__nav">
          <button type="button" className="rail-link is-active">
            <span>🗺️</span> Explorar
          </button>
          <button type="button" className="rail-link" onClick={onOpenAdd}>
            <span>＋</span> Añadir
          </button>
          <button type="button" className="rail-link" onClick={() => onNavigate('guardados')}>
            <span>★</span> Guardados
          </button>
          <button type="button" className="rail-link" onClick={() => onNavigate('perfil')}>
            <span>{isAuthenticated ? '👤' : '🔐'}</span> {isAuthenticated ? 'Perfil' : 'Entrar'}
          </button>
        </nav>

        <div className="desktop-rail__footnote">
          <strong>{user ? user.nombre : 'Explorador'}</strong>
          <span>{userLocation ? 'Ubicación detectada' : 'Sin GPS todavía'}</span>
        </div>
      </aside>

      <main className="explorer-main">
        <section className="hero-panel glass-card">
          <div className="hero-panel__copy">
            <p className="eyebrow">Explorer</p>
            <h1>Descubre lugares con historias reales</h1>
            <p>
              Mapa, reseñas, filtros visuales y acceso directo al detalle de cada lugar.
            </p>
          </div>

          <div className="search-box">
            <span className="search-box__icon">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar restaurantes, parques, cultura..."
            />
          </div>

          <div className="chip-row">
            {CATEGORY_OPTIONS.map((item) => {
              const meta = categoryMeta(item);
              return (
                <button
                  type="button"
                  key={item}
                  className={`chip ${category === item ? 'is-active' : ''}`}
                  onClick={() => setCategory(item)}
                >
                  <span>{meta.icon}</span>
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        <section className="explorer-stage">
          <div className="map-panel glass-card">
            <MapView
              lugares={visiblePlaces}
              userLocation={userLocation}
              onMapClick={onMapClick}
              onOpenDetail={onSelectPlace}
              onDelete={undefined}
            />
          </div>

          <aside className="list-panel glass-card">
            <div className="list-panel__head">
              <div>
                <p className="eyebrow">Lugares</p>
                <h2>{visiblePlaces.length} resultados</h2>
              </div>
              <button type="button" className="inline-button" onClick={() => onNavigate('guardados')}>
                Ver guardados
              </button>
            </div>

            <div className="place-stack">
              {visiblePlaces.slice(0, 6).map((place) => {
                const meta = categoryMeta(place.categoria);
                return (
                  <button
                    type="button"
                    key={place.id}
                    className="place-card"
                    onClick={() => onSelectPlace(place)}
                  >
                    <div className="place-card__top">
                      <span className="place-card__badge" style={{ background: `${meta.color}14`, color: meta.color }}>
                        {meta.icon} {place.categoria || meta.label}
                      </span>
                      <span className="place-card__score">★ {Number(place.puntuacionPromedio || 0).toFixed(1)}</span>
                    </div>
                    <h3>{place.nombre}</h3>
                    <p>{place.descripcion}</p>
                    <div className="place-card__meta">
                      <span>📍 {place.direccion || 'Ubicación sin dirección'}</span>
                      <span>{place.totalResenas || 0} reseñas</span>
                    </div>
                    {place?.creador && (
                      <small style={{ color: 'var(--text-3)', marginTop: '0.25rem', display: 'block' }}>
                        por {place.creador.nombre}
                      </small>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </section>
      </main>

      <DockNav activeView="mapa" onNavigate={onNavigate} isAuthenticated={isAuthenticated} />
    </div>
  );
}

export function DetailScreen({ place, onBack, onNavigate, onSelectPlace, relatedPlaces = [], onOpenAdd, onDelete, onAddReview, onEdit, currentUserId }) {
  const meta = categoryMeta(place?.categoria);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');

  const submitReview = (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    if (onAddReview) {
      onAddReview(place.id, { puntuacion, comentario });
      setComentario('');
      setPuntuacion(5);
    }
  };

  return (
    <div className="screen-shell detail-shell">
      <ShellHeader
        title="Detalle de lugar"
        subtitle="Fotos, reseñas y contexto del punto seleccionado"
        onBack={onBack}
        actions={
          <>
            {onEdit && place?.creador?.id === currentUserId && (
              <button type="button" className="pill-button pill-button--ghost" onClick={() => onEdit(place)}>
                Editar
              </button>
            )}
            <button type="button" className="pill-button pill-button--primary" onClick={() => onNavigate('mapa')}>
              Volver al mapa
            </button>
          </>
        }
      />

      <main className="detail-layout">
        <section className="detail-main">
          {place?.imagenes && place.imagenes.length > 0 && (
            <div className="gallery-grid">
              {place.imagenes.map((img, idx) => (
                <article key={idx} className="gallery-tile" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }} />
              ))}
            </div>
          )}

          <div className="detail-card glass-card">
            <div className="detail-card__head">
              <div>
                <span className="chip chip--static" style={{ background: `${meta.color}16`, color: meta.color }}>
                  {meta.icon} {place?.categoria || meta.label}
                </span>
                <h1>{place?.nombre}</h1>
                <div className="rating-line">
                  <div className="rating-stars">{ratingIcons(Math.round(place?.puntuacionPromedio || 0))}</div>
                  <span>{Number(place?.puntuacionPromedio || 0).toFixed(1)}</span>
                  <small>({place?.totalResenas || 0} reseñas)</small>
                </div>
                {place?.creador && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                    Creado por <strong>{place.creador.nombre}</strong>
                  </p>
                )}
              </div>
              <button type="button" className="icon-button icon-button--ghost">⭑</button>
            </div>

            <p className="detail-description">
              {place?.descripcion || 'Este lugar no tiene descripción todavía, pero ya puedes explorar su ubicación y reseñas.'}
            </p>

            <div className="detail-bento">
              <article className="info-card">
                <h3>Dirección</h3>
                <p>{place?.direccion || 'Dirección pendiente'}</p>
              </article>
              <article className="info-card">
                <h3>Horario</h3>
                <p>{place?.horario || 'Horario pendiente'}</p>
              </article>
              <article className="info-card">
                <h3>Contacto</h3>
                <p>{place?.telefono || 'Sin teléfono registrado'}</p>
              </article>
              <article className="info-card">
                <h3>Ubicación</h3>
                <p>
                  {place?.latitud?.toFixed?.(4) || '0.0000'}, {place?.longitud?.toFixed?.(4) || '0.0000'}
                </p>
              </article>
            </div>
          </div>
        </section>

        <aside className="detail-side">
          <section className="cta-card glass-card">
            <p className="eyebrow">¿Estuviste aquí?</p>
            <h2>Comparte tu experiencia con la comunidad</h2>
            
            <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.5rem' }}>Calificación</label>
                <div className="review-stars review-stars--interactive" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <span 
                      key={index} 
                      className={index < puntuacion ? 'is-active' : ''}
                      onClick={() => setPuntuacion(index + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)' }}>
                Comentario
                <textarea 
                  rows="3" 
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Qué te pareció este lugar?"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)' }}
                  required
                />
              </label>
              <button type="submit" className="pill-button pill-button--primary pill-button--block">
                Publicar reseña
              </button>
            </form>
          </section>

          <section className="reviews-card glass-card">
            <div className="section-head">
              <h3>Reseñas recientes</h3>
              <button type="button" className="inline-button">Filtrar</button>
            </div>

            <div className="review-feed">
              {place?.resenas?.length > 0 ? (
                place.resenas.map((review) => (
                  <article key={review.id} className="review-card">
                    <div className="review-card__head">
                      <div className="review-avatar">{initials(review.usuario?.nombre || 'Usuario')}</div>
                      <div>
                        <strong>{review.usuario?.nombre || 'Usuario'}</strong>
                        <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="review-stars">{ratingIcons(review.puntuacion)}</div>
                    <p>{review.comentario}</p>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <p>Aún no hay reseñas para este lugar.</p>
                </div>
              )}
            </div>
          </section>

          <section className="related-card glass-card">
            <div className="section-head">
              <h3>Explorar similares</h3>
              <span className="inline-kicker">{relatedPlaces.length} cercanos</span>
            </div>

            <div className="related-stack">
              {relatedPlaces.slice(0, 3).map((item) => (
                <button key={item.id} type="button" className="related-item" onClick={() => onSelectPlace(item)}>
                  <span>{categoryMeta(item.categoria).icon}</span>
                  <div>
                    <strong>{item.nombre}</strong>
                    <p>{item.categoria}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {onDelete && place?.id && place?.creador?.id === currentUserId && (
            <button type="button" className="pill-button pill-button--danger pill-button--block" onClick={() => onDelete(place.id)}>
              Eliminar lugar
            </button>
          )}
        </aside>
      </main>

      <DockNav activeView="detalle" onNavigate={onNavigate} isAuthenticated={true} />
    </div>
  );
}

export function AddPlaceScreen({
  values,
  setValues,
  coords,
  onCoordsChange,
  onSubmit,
  onBack,
  onUseCurrentLocation,
  userLocation,
  isAuthenticated,
  onNavigate,
  editPlace,
}) {
  const isEditing = !!editPlace;

  const handleRatingClick = (rating) => {
    setValues((current) => ({ ...current, puntuacion: rating }));
  };

  return (
    <div className="screen-shell add-shell">
      <ShellHeader
        title={isEditing ? 'Editar lugar' : 'Añadir lugar'}
        subtitle={isEditing ? 'Actualiza los datos del lugar' : 'Completa el formulario y marca la ubicación exacta'}
        onBack={onBack}
        actions={
          <button type="button" className="pill-button pill-button--ghost" onClick={() => onNavigate('mapa')}>
            Volver al mapa
          </button>
        }
      />

      <main className="add-layout">
        <section className="form-column">
          <header className="section-copy">
            <p className="eyebrow">{isEditing ? 'Editar' : 'Publicar'}</p>
            <h1>{isEditing ? 'Editar lugar' : 'Añadir lugar y reseña'}</h1>
            <p>{isEditing ? 'Modifica los datos del lugar seleccionado.' : 'Comparte la experiencia para que otras personas descubran este punto.'}</p>
          </header>

          <form className="stack-form" onSubmit={onSubmit}>
            <section className="form-card glass-card">
              <h2>Detalles del lugar</h2>
              <label>
                Nombre del lugar
                <input
                  type="text"
                  value={values.nombre}
                  onChange={(event) => setValues((current) => ({ ...current, nombre: event.target.value }))}
                  placeholder="Ej. Café del centro"
                  required
                />
              </label>
              <label>
                Categoría
                <select
                  value={values.categoria}
                  onChange={(event) => setValues((current) => ({ ...current, categoria: event.target.value }))}
                >
                  {CATEGORY_OPTIONS.filter((item) => item !== 'Todos').map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Descripción
                <textarea
                  rows="4"
                  value={values.descripcion}
                  onChange={(event) => setValues((current) => ({ ...current, descripcion: event.target.value }))}
                  placeholder="Describe el ambiente, servicio o lo que lo hace especial"
                />
              </label>
              <label>
                Dirección
                <input
                  type="text"
                  value={values.direccion}
                  onChange={(event) => setValues((current) => ({ ...current, direccion: event.target.value }))}
                  placeholder="Ej. Av. Libertador 1234"
                />
              </label>
              <label>
                Horario
                <input
                  type="text"
                  value={values.horario}
                  onChange={(event) => setValues((current) => ({ ...current, horario: event.target.value }))}
                  placeholder="Ej. 08:00 - 20:00"
                />
              </label>
              <label>
                Teléfono
                <input
                  type="text"
                  value={values.telefono}
                  onChange={(event) => setValues((current) => ({ ...current, telefono: event.target.value }))}
                  placeholder="Ej. +57 300 123 4567"
                />
              </label>
              <label>
                Sitio web
                <input
                  type="url"
                  value={values.sitioWeb}
                  onChange={(event) => setValues((current) => ({ ...current, sitioWeb: event.target.value }))}
                  placeholder="Ej. https://ejemplo.com"
                />
              </label>
            </section>

            <section className="form-card glass-card">
              <h2>Ubicación</h2>
              <p className="muted-copy">Ajusta el pin sobre el mapa o usa tu ubicación actual.</p>
              <div className="pin-preview">
                <div className="pin-preview__map" style={{ height: '300px', width: '100%', overflow: 'hidden', padding: 0, position: 'relative', borderRadius: 'var(--r-md)' }}>
                  <MapGL
                    initialViewState={{
                      longitude: coords?.lng || -76.0710,
                      latitude: coords?.lat || 4.3920,
                      zoom: 15
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle={MAPBOX_STYLE}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    onClick={(e) => onCoordsChange?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
                    cursor="crosshair"
                  >
                    {coords && (
                      <Marker longitude={coords.lng} latitude={coords.lat} anchor="bottom">
                        <div style={{
                          width: '24px', height: '24px', backgroundColor: '#ef4444',
                          borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
                          border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }} />
                      </Marker>
                    )}
                  </MapGL>
                </div>
                <div className="pin-preview__actions">
                  <button type="button" className="pill-button pill-button--ghost pill-button--block" onClick={onUseCurrentLocation}>
                    Usar mi ubicación
                  </button>
                  <div className="coords-grid">
                    <label>
                      Latitud
                      <input
                        type="number"
                        step="0.000001"
                        value={coords?.lat ?? ''}
                        onChange={(event) =>
                          onCoordsChange?.({
                            lat: Number(event.target.value) || 0,
                            lng: coords?.lng ?? 0,
                          })
                        }
                        placeholder={userLocation ? userLocation.lat.toFixed(5) : '4.39200'}
                      />
                    </label>
                    <label>
                      Longitud
                      <input
                        type="number"
                        step="0.000001"
                        value={coords?.lng ?? ''}
                        onChange={(event) =>
                          onCoordsChange?.({
                            lat: coords?.lat ?? 0,
                            lng: Number(event.target.value) || 0,
                          })
                        }
                        placeholder={userLocation ? userLocation.lng.toFixed(5) : '-76.07100'}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {!isEditing && (
              <section className="form-card glass-card">
                <h2>Tu reseña</h2>
                <label>
                  Calificación
                  <div className="review-stars review-stars--interactive" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={index < (values.puntuacion || 5) ? 'is-active' : ''}
                        onClick={() => handleRatingClick(index + 1)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </label>
                <label>
                  Comentarios
                  <textarea
                    rows="5"
                    value={values.comentario}
                    onChange={(event) => setValues((current) => ({ ...current, comentario: event.target.value }))}
                    placeholder="¿Qué te pareció este lugar?"
                  />
                </label>
              </section>
            )}

            <section className="form-card glass-card">
              <h2>Fotos opcionales</h2>
              <div className="drop-zone">
                <span>⬆︎</span>
                <strong>Haz clic o arrastra fotos aquí</strong>
                <p>Sube hasta 5 imágenes cuando la carga esté disponible.</p>
              </div>
            </section>

            <div className="form-actions">
              <button type="button" className="pill-button pill-button--ghost" onClick={onBack}>
                Cancelar
              </button>
              <button type="submit" className="pill-button pill-button--primary pill-button--wide">
                {isEditing ? 'Actualizar lugar' : 'Publicar lugar'}
              </button>
            </div>
          </form>
        </section>

        <aside className="add-side">
          <section className="summary-card glass-card">
            <p className="eyebrow">Resumen</p>
            <h2>{values.nombre || (isEditing ? 'Editando lugar' : 'Nuevo lugar')}</h2>
            <div className="summary-grid">
              <div>
                <span>Categoría</span>
                <strong>{values.categoria}</strong>
              </div>
              <div>
                <span>Latitud</span>
                <strong>{coords ? coords.lat.toFixed(5) : '—'}</strong>
              </div>
              <div>
                <span>Longitud</span>
                <strong>{coords ? coords.lng.toFixed(5) : '—'}</strong>
              </div>
              <div>
                <span>Estado</span>
                <strong>{isAuthenticated ? 'Listo para guardar' : 'Necesitas iniciar sesión'}</strong>
              </div>
            </div>
          </section>

          <section className="summary-card glass-card">
            <p className="eyebrow">Siguiente paso</p>
            <h2>{isEditing ? 'Qué puedes cambiar' : 'Lo que hace falta'}</h2>
            <ul className="check-list">
              <li>{isEditing ? 'Corregir datos del lugar' : 'Elegir coordenadas exactas'}</li>
              <li>{isEditing ? 'Actualizar ubicación si es necesario' : 'Revisar la descripción'}</li>
              <li>{isEditing ? 'Guardar los cambios' : 'Publicar el lugar en el mapa'}</li>
            </ul>
            {!isAuthenticated && (
              <button type="button" className="pill-button pill-button--primary pill-button--block" onClick={() => onNavigate('perfil')}>
                Iniciar sesión
              </button>
            )}
          </section>
        </aside>
      </main>

      <DockNav activeView="añadir" onNavigate={onNavigate} isAuthenticated={isAuthenticated} />
    </div>
  );
}

export function SavedScreen({ onNavigate, savedPlaces = [], onSelectPlace, places = [] }) {
  const items = savedPlaces;

  return (
    <div className="screen-shell profile-shell">
      <ShellHeader
        title="Guardados"
        subtitle="Tus lugares favoritos aparecerán aquí"
        actions={
          <button type="button" className="pill-button pill-button--primary" onClick={() => onNavigate('mapa')}>
            Explorar
          </button>
        }
      />

      <main className="saved-layout glass-card">
        <div className="empty-state">
          <p className="eyebrow">Sin guardados</p>
          <h1>Aún no tienes lugares guardados</h1>
          <p>
            Marca algunos lugares como favoritos para reunirlos aquí. Mientras tanto, puedes explorar los destacados.
          </p>
        </div>

        <div className="saved-grid">
          {items.map((place) => {
            const meta = categoryMeta(place.categoria);
            return (
              <button key={place.id} type="button" className="saved-item" onClick={() => onSelectPlace(place)}>
                <span className="saved-item__icon">{meta.icon}</span>
                <div>
                  <strong>{place.nombre}</strong>
                  <p>{place.categoria}</p>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <DockNav activeView="guardados" onNavigate={onNavigate} isAuthenticated={true} />
    </div>
  );
}

export function ProfileScreen({ user, isAuthenticated, onLogout, onNavigate, onAuthSuccess }) {
  if (!isAuthenticated) {
    return (
      <div className="screen-shell auth-shell">
        <div className="ambient ambient-a" />
        <div className="ambient ambient-b" />

        <main className="auth-layout">
          <section className="auth-copy glass-card">
            <p className="eyebrow">Autenticación</p>
            <h1>Mapa de Reseñas</h1>
            <p>
              Accede para guardar lugares, publicar reseñas y explorar la ciudad con tu perfil.
            </p>
            <div className="auth-points">
              <div>
                <strong>Exploración</strong>
                <span>Mapa interactivo y filtros visuales</span>
              </div>
              <div>
                <strong>Comunidad</strong>
                <span>Reseñas y puntuaciones claras</span>
              </div>
              <div>
                <strong>Contribución</strong>
                <span>Agrega puntos nuevos en segundos</span>
              </div>
            </div>
          </section>

          <section className="auth-card-wrap">
            <RegisterForm onAuthSuccess={onAuthSuccess} />
          </section>
        </main>

        <DockNav activeView="perfil" onNavigate={onNavigate} isAuthenticated={false} />
      </div>
    );
  }

  return (
    <div className="screen-shell profile-shell">
      <ShellHeader
        title="Perfil"
        subtitle="Tu espacio personal dentro del mapa"
        actions={
          <button type="button" className="pill-button pill-button--primary" onClick={() => onNavigate('mapa')}>
            Explorar
          </button>
        }
      />

      <main className="profile-layout glass-card">
        <div className="profile-hero">
          <div className="profile-avatar">{initials(user?.nombre || 'Explorador')}</div>
          <div>
            <p className="eyebrow">Bienvenido</p>
            <h1>Hola, {user?.nombre || 'Explorador'}</h1>
            <p>{user?.email || 'Tu sesión está activa'}</p>
          </div>
        </div>

        <div className="stats-grid">
          <article>
            <strong>12</strong>
            <span>Lugares vistos</span>
          </article>
          <article>
            <strong>4</strong>
            <span>Favoritos</span>
          </article>
          <article>
            <strong>8</strong>
            <span>Reseñas</span>
          </article>
        </div>

        <div className="profile-actions">
          <button type="button" className="pill-button pill-button--ghost" onClick={() => onNavigate('añadir')}>
            Añadir lugar
          </button>
          <button type="button" className="pill-button pill-button--ghost" onClick={() => onNavigate('guardados')}>
            Ver guardados
          </button>
          <button type="button" className="pill-button pill-button--danger" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </main>

      <DockNav activeView="perfil" onNavigate={onNavigate} isAuthenticated={true} />
    </div>
  );
}
