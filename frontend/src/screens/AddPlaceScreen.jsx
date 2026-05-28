import React from 'react';
import { ArrowLeft, Clock3, MapPin, Navigation, Phone, Send } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import PanelNav from '../components/shared/PanelNav';

const CATEGORIES = ['Restaurante', 'Parque', 'Cultura', 'Tienda', 'Servicio', 'Turismo', 'General'];

export default function AddPlaceScreen({
  values, setValues, coords, onCoordsChange, onSubmit,
  onBack, onUseCurrentLocation, userLocation, onNavigate, notifCount = 0,
}) {
  const [panelExpanded, setPanelExpanded] = React.useState(false);
  const [pinCoords, setPinCoords] = React.useState(null);

  const handleCoordsChange = React.useCallback((c) => {
    setPinCoords(c);
    onCoordsChange(c);
    setPanelExpanded(true);
  }, [onCoordsChange]);

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

      <form onSubmit={onSubmit}>
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

        <button type="submit" className="btn btn--primary btn--block"
          disabled={!values.nombre?.trim() || !coords}
          style={{ marginTop: '0.5rem' }}>
          <Send size={15} strokeWidth={2} /> Publicar lugar
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
        <div className="panel-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Cancelar
        </div>
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {formContent}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} /> Cancelar
        </div>
        <PanelNav activeView="añadir" onNavigate={onNavigate} notifCount={notifCount} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {formContent}
        </div>
      </div>
    </div>
  );
}
