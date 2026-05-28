import React, { useMemo, useState, useCallback } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import PlacePopup from './PlacePopup';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
// El usuario proporcionó este estilo específico enfocado en Zarzal
const MAPBOX_STYLE = 'mapbox://styles/camilotriana0/cmohdb83m006v01qrbeol6y0m';

/**
 * Vista principal del mapa usando Mapbox GL.
 */
const MapView = ({ lugares = [], userLocation, onMapClick, onOpenDetail, onDelete, onMove, selectedPin, className = '', style = {} }) => {
  const [popupInfo, setPopupInfo] = useState(null);

  const handleMove = useCallback((e) => {
    if (onMove) {
      const { longitude, latitude } = e.viewState;
      onMove({ lat: latitude, lng: longitude });
    }
  }, [onMove]);

  /**
   * Deduplicar: si por alguna razón llegan lugares con id repetido,
   * el Map garantiza que solo se queda el primero con ese id.
   */
  const lugaresUnicos = useMemo(() => {
    const seen = new Map();
    for (const lugar of lugares) {
      if (!seen.has(lugar.id)) {
        seen.set(lugar.id, lugar);
      }
    }
    return Array.from(seen.values());
  }, [lugares]);

  const handleMapClick = useCallback((e) => {
    // Si la interacción es en un lugar, Mapbox pasa un originalEvent
    if (onMapClick) {
      onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    }
    setPopupInfo(null);
  }, [onMapClick]);

  return (
    <div className={`map-view-root ${className}`.trim()} style={{ width: '100%', height: '100%', ...style }}>
      <MapGL
        initialViewState={{
          longitude: -76.0710,
          latitude: 4.3920,
          zoom: 15
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAPBOX_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleMapClick}
        onMove={handleMove}
        cursor={onMapClick ? 'crosshair' : 'grab'}
      >
        {/* --- MARCADOR DE USUARIO --- */}
        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
            <div style={{
              width: '20px', height: '20px', backgroundColor: '#ef4444',
              borderRadius: '50%', border: '3px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }} title="Tu posición actual" />
          </Marker>
        )}

        {/* --- PIN DE UBICACIÓN SELECCIONADA --- */}
        {selectedPin && (
          <Marker longitude={selectedPin.lng} latitude={selectedPin.lat} anchor="bottom">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: '2.5px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(245,158,11,0.5), 0 0 0 4px rgba(245,158,11,0.15)',
                animation: 'pinDrop 0.3s ease-out',
              }}>
                <span style={{ transform: 'rotate(45deg)', fontSize: '1rem', display: 'block' }}>📍</span>
              </div>
              <div style={{
                width: 0, height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '7px solid #d97706',
              }} />
            </div>
          </Marker>
        )}

        {/* --- MARCADORES DE LUGARES (deduplicados) --- */}
        {lugaresUnicos.map((lugar) => (
          <Marker
            key={lugar.id}
            longitude={lugar.longitud}
            latitude={lugar.latitud}
            anchor="bottom"
            onClick={e => {
              // Evita que el clic se propague al mapa y llame a handleMapClick
              e.originalEvent.stopPropagation();
              setPopupInfo(lugar);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
              <div className="custom-marker" style={{ background: lugar.categoriaColor || 'var(--amber)' }}>
                <span className="custom-marker-emoji">{lugar.categoriaIcono || '📍'}</span>
              </div>
              <div className="custom-marker-tip" style={{ borderTopColor: lugar.categoriaColor || '#007AFF' }}></div>
            </div>
          </Marker>
        ))}

        {/* --- POPUP DE INFORMACIÓN --- */}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitud}
            latitude={popupInfo.latitud}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="mapbox-popup-override"
            offset={[0, 10]} // Ajuste para que no tape la punta del marcador
          >
            <PlacePopup
              lugar={popupInfo}
              onOpenDetail={() => {
                setPopupInfo(null);
                if (onOpenDetail) onOpenDetail(popupInfo);
              }}
              onDelete={() => {
                setPopupInfo(null);
                if (onDelete) onDelete(popupInfo.id);
              }}
            />
          </Popup>
        )}
      </MapGL>
    </div>
  );
};

export default MapView;
