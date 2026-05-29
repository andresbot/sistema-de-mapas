import React from 'react';
import { ArrowLeft, Clock3, Home, ImagePlus, MapPin, Navigation, Phone, Send, SquarePen, X } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import PanelNav from '../components/shared/PanelNav';
import {
  MAX_PLACE_IMAGES,
  MAX_PLACE_IMAGE_BYTES,
  PLACE_IMAGE_TYPES,
  uploadPlaceImages,
} from '../services/uploadService.js';

const CATEGORIES = ['Restaurante', 'Parque', 'Cultura', 'Tienda', 'Servicio', 'Turismo', 'General'];

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

export default function AddPlaceScreen({
  values, setValues, coords, onCoordsChange, onSubmit,
  onBack, onUseCurrentLocation, userLocation, onNavigate, notifCount = 0,
}) {
  const [panelExpanded, setPanelExpanded] = React.useState(false);
  const [pinCoords, setPinCoords] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const selectedImagesRef = React.useRef([]);
  const [imageError, setImageError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  React.useEffect(() => () => {
    selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, []);

  const handleCoordsChange = React.useCallback((c) => {
    setPinCoords(c);
    onCoordsChange(c);
    setPanelExpanded(true);
  }, [onCoordsChange]);

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
      if (selectedImages.length + nextImages.length >= MAX_PLACE_IMAGES) {
        errors.push(`Solo puedes adjuntar ${MAX_PLACE_IMAGES} imagenes por lugar.`);
        break;
      }

      if (!PLACE_IMAGE_TYPES.has(file.type)) {
        errors.push(`${file.name}: usa JPG, PNG o WebP.`);
        continue;
      }

      if (file.size > MAX_PLACE_IMAGE_BYTES) {
        errors.push(`${file.name}: maximo ${formatImageSize(MAX_PLACE_IMAGE_BYTES)}.`);
        continue;
      }

      nextImages.push(makePreviewImage(file));
    }

    if (nextImages.length > 0) {
      setSelectedImages((current) => [...current, ...nextImages]);
    }

    setImageError(errors[0] || '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || !values.nombre?.trim() || !coords) return;

    setSubmitting(true);
    setImageError('');

    try {
      const imagenes = selectedImages.length
        ? await uploadPlaceImages(selectedImages.map((image) => image.file))
        : [];
      const saved = await onSubmit(event, imagenes);

      if (saved !== false) {
        selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        selectedImagesRef.current = [];
      }
    } catch (error) {
      setImageError(error.message || 'No se pudieron subir las imagenes.');
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <p className="eyebrow" style={{ marginBottom: '0.3rem' }}>Nueva ubicación</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>
          Haz clic en el mapa para colocar el marcador.
        </p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem',
        background: 'var(--amber-dim)', border: '1px solid var(--amber-border)',
        borderRadius: 'var(--r)', padding: '0.5rem 0.8rem'
      }}>
        <MapPin size={14} color="var(--amber)" strokeWidth={1.5} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', flex: 1 }}>
          {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Sin coordenadas'}
        </span>
        {userLocation && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onUseCurrentLocation}
            style={{ gap: '0.3rem' }}>
            <Navigation size={12} strokeWidth={1.5} /> Mi ubicación
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Nombre del lugar *</label>
          <input type="text" value={values.nombre} required placeholder="ej. Café del Centro"
            onChange={e => setValues(v => ({ ...v, nombre: e.target.value }))} />
        </div>

        <div className="form-field">
          <label>Categoría</label>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} type="button"
                className={`chip${values.categoria === cat ? ' is-active' : ''}`}
                onClick={() => setValues(v => ({ ...v, categoria: cat }))}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label>Descripción</label>
          <textarea rows={3} value={values.descripcion} placeholder="Cuéntanos sobre este lugar..."
            onChange={e => setValues(v => ({ ...v, descripcion: e.target.value }))} />
        </div>

        <div className="form-section-title">
          <MapPin size={13} strokeWidth={1.5} /> Datos opcionales
        </div>

        <div className="form-field">
          <label>Dirección</label>
          <div className="input-with-icon">
            <MapPin size={14} strokeWidth={1.5} />
            <input type="text" value={values.direccion || ''} placeholder="Av. Libertador 1234, Barrio Norte"
              onChange={e => setValues(v => ({ ...v, direccion: e.target.value }))} />
          </div>
        </div>

        <div className="form-field">
          <label>Horario</label>
          <div className="input-with-icon">
            <Clock3 size={14} strokeWidth={1.5} />
            <input type="text" value={values.horario || ''} placeholder="08:00 - 20:00"
              onChange={e => setValues(v => ({ ...v, horario: e.target.value }))} />
          </div>
        </div>

        <div className="form-field">
          <label>Teléfono</label>
          <div className="input-with-icon">
            <Phone size={14} strokeWidth={1.5} />
            <input type="tel" value={values.telefono || ''} placeholder="+57 300 123 4567"
              onChange={e => setValues(v => ({ ...v, telefono: e.target.value }))} />
          </div>
        </div>

        <div className="form-section-title">
          <ImagePlus size={13} strokeWidth={1.5} /> Fotos del lugar
        </div>

        <div className="place-upload">
          <label className="review-upload__trigger">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              disabled={submitting || selectedImages.length >= MAX_PLACE_IMAGES}
            />
            <ImagePlus size={14} strokeWidth={1.7} />
            <span>Agregar fotos</span>
            <small>{selectedImages.length}/{MAX_PLACE_IMAGES}</small>
          </label>

          {selectedImages.length > 0 && (
            <div className="place-upload__preview" aria-label="Fotos seleccionadas">
              {selectedImages.map((image) => (
                <figure key={image.id} className="review-upload__thumb">
                  <img src={image.previewUrl} alt={image.file.name} />
                  <button
                    type="button"
                    onClick={() => removeSelectedImage(image.id)}
                    aria-label="Quitar foto"
                  >
                    <X size={11} strokeWidth={2} />
                  </button>
                </figure>
              ))}
            </div>
          )}

          {imageError && <p className="review-upload__error">{imageError}</p>}
        </div>

        <button type="submit" className="btn btn--primary btn--block"
          disabled={submitting || !values.nombre?.trim() || !coords}
          style={{ marginTop: '0.5rem' }}>
          <Send size={15} strokeWidth={2} /> {submitting ? 'Publicando...' : 'Publicar lugar'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="app-container">
      <div className="map-layer">
        <MapContainer
          lugares={[]}
          userLocation={userLocation}
          onMapClick={handleCoordsChange}
          onOpenDetail={null}
          style={{ width: '100%', height: '100%' }}
          selectedPin={pinCoords}
        />
      </div>

      {/* MOBILE */}
      <div className={`bottom-panel ${panelExpanded ? 'is-expanded' : 'is-collapsed'}`} style={{ maxHeight: '92vh' }}>
        <div className="panel-handle-wrap" onClick={() => setPanelExpanded(v => !v)}>
          <div className="panel-handle" />
        </div>
        <div className="panel-back panel-back--split">
          <button type="button" className="panel-back__action" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={1.5} /> Cancelar
          </button>
          <button type="button" className="panel-home-link" onClick={() => onNavigate('landing')}>
            <Home size={13} strokeWidth={1.8} /> Inicio
          </button>
        </div>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {formContent}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-back panel-back--split">
          <button type="button" className="panel-back__action" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={1.5} /> Cancelar
          </button>
          <button type="button" className="panel-home-link" onClick={() => onNavigate('landing')}>
            <Home size={13} strokeWidth={1.8} /> Inicio
          </button>
        </div>
        <PanelNav activeView="añadir" onNavigate={onNavigate} notifCount={notifCount} />
        <section className="panel-intro">
          <span className="panel-intro__icon"><SquarePen size={15} strokeWidth={1.7} /></span>
          <div>
            <p className="eyebrow">Publicar</p>
            <h2>Nuevo lugar</h2>
            <p>Marca la ubicación, agrega los datos básicos y deja información útil para quien lo visite.</p>
          </div>
        </section>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {formContent}
        </div>
      </div>
    </div>
  );
}
