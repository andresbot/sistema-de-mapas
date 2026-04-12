import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración iconos Azules (Lugares DB)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// NUEVO: Configuración Icono Rojo (Usuario)
const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Aplicamos el azul por defecto globalmente
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ lugares = [], userLocation, onMapClick, onResena, onEdit, onDelete }) => {
  
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (onMapClick) onMapClick(e.latlng);
      },
    });
    return null;
  };

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
        
        <MapEvents />

        {/* --- MARCADOR ROJO (UBICACIÓN USUARIO) --- */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={redIcon}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>📍 Estás aquí</strong><br />
                Tu posición real detectada.
              </div>
            </Popup>
          </Marker>
        )}

        {/* --- MARCADORES AZULES (LUGARES DE ZARZAL) --- */}
        {lugares.map((lugar) => (
          <Marker 
            key={lugar.id} 
            position={[lugar.latitud, lugar.longitud]}
          >
            <Popup>
              <div className="popup-card">
                <span className="category-tag">{lugar.categoria}</span>
                <h3>{lugar.nombre}</h3>
                <p>{lugar.descripcion || 'Sin descripción disponible.'}</p>
                
                <button className="btn-resena-main" onClick={() => onResena(lugar.id)}>
                  ⭐ Reseñar
                </button>
                
                <div className="admin-tools-row">
                  <button className="btn-tool" onClick={() => onEdit(lugar)} title="Editar">✏️</button>
                  <button className="btn-tool btn-del" onClick={() => onDelete(lugar.id)} title="Eliminar">🗑️</button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;