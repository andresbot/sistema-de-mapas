import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PlacePopup from './PlacePopup';

// ----- Icono de usuario (rojo) -----
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Genera un DivIcon circular con el color de la categoría del lugar.
 * Permite distinguir visualmente cada categoría sin depender de imágenes externas.
 */
const createCategoryIcon = (color = '#007AFF', emoji = '📍') =>
  L.divIcon({
    className: '',
    html: `
      <div class="custom-marker" style="background:${color};">
        <span class="custom-marker-emoji">${emoji}</span>
      </div>
      <div class="custom-marker-tip" style="border-top-color:${color};"></div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -50],
  });

// ----- Subcomponente de eventos de mapa -----
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
};

/**
 * Vista principal del mapa.
 *
 * Criterios de aceptación cumplidos:
 *  ✅ Cada lugar publicado se representa con un marcador (uno por lugar).
 *  ✅ Al seleccionar un marcador se muestra información básica (PlacePopup).
 *  ✅ No se renderizan marcadores duplicados (deduplicación por id con useMemo).
 */
const MapView = ({ lugares = [], userLocation, onMapClick, onResena, onEdit, onDelete }) => {
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

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={[4.3920, -76.0710]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents onMapClick={onMapClick} />

        {/* --- MARCADOR DE USUARIO (rojo) --- */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={redIcon}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '8px' }}>
                <strong>📍 Estás aquí</strong><br />
                Tu posición actual.
              </div>
            </Popup>
          </Marker>
        )}

        {/* --- MARCADORES DE LUGARES (deduplicados) --- */}
        {lugaresUnicos.map((lugar) => (
          <Marker
            key={lugar.id}
            position={[lugar.latitud, lugar.longitud]}
            icon={createCategoryIcon(lugar.categoriaColor, lugar.categoriaIcono)}
          >
            <Popup>
              <PlacePopup
                lugar={lugar}
                onResena={onResena}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;