import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Popup de información básica de un lugar.
 * Muestra: nombre, categoría, descripción, detalles y puntuación.
 * Permite eliminar si el usuario está autenticado.
 */
const PlacePopup = ({ lugar, onOpenDetail, onDelete }) => {
  const { isAuthenticated } = useAuth();

  const icon = lugar.categoriaIcono || '📍';
  const color = lugar.categoriaColor || '#007AFF';
  const stars = Math.round(lugar.puntuacionPromedio || 0);

  return (
    <div className="popup-card">

      {/* Cabecera: badge de categoría */}
      <span
        className="category-tag"
        style={{ background: color + '22', color }}
      >
        {icon} {lugar.categoria}
      </span>

      {/* Nombre */}
      <h3 className="popup-nombre">{lugar.nombre}</h3>

      {/* Descripción */}
      {lugar.descripcion && (
        <p className="popup-descripcion">{lugar.descripcion}</p>
      )}

      {/* Detalles */}
      {(lugar.direccion || lugar.horario || lugar.telefono) && (
        <ul className="popup-details">
          {lugar.direccion && <li><span className="detail-icon">📍</span>{lugar.direccion}</li>}
          {lugar.horario   && <li><span className="detail-icon">🕐</span>{lugar.horario}</li>}
          {lugar.telefono  && <li><span className="detail-icon">📞</span>{lugar.telefono}</li>}
        </ul>
      )}

      {/* Puntuación */}
      {lugar.totalResenas > 0 ? (
        <div className="popup-rating">
          <span className="popup-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ color: i < stars ? '#FFD60A' : '#ccc' }}>★</span>
            ))}
          </span>
          <span className="popup-rating-text">
            {lugar.puntuacionPromedio.toFixed(1)} ({lugar.totalResenas} reseña{lugar.totalResenas !== 1 ? 's' : ''})
          </span>
        </div>
      ) : (
        <p className="popup-sin-resenas">Sin reseñas aún</p>
      )}

      {/* Acciones */}
      <div className="popup-actions">
        <button
          className="btn-resena-main"
          onClick={() => onOpenDetail?.(lugar)}
          title="Ver detalle"
        >
          🔎 Ver detalle
        </button>

        {/* Eliminar — solo usuarios autenticados */}
        {isAuthenticated && onDelete && (
          <button
            id={`btn-delete-${lugar.id}`}
            className="btn-delete-place"
            onClick={() => onDelete(lugar.id)}
            title="Eliminar lugar"
          >
            🗑️ Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default PlacePopup;
