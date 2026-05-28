import React from 'react';
import { Clock, MapPin, Phone, Search, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Popup de información básica de un lugar.
 * Muestra: nombre, categoría, descripción, detalles y puntuación.
 * Permite eliminar si el usuario está autenticado.
 */
const PlacePopup = ({ lugar, onOpenDetail, onDelete }) => {
  const { isAuthenticated } = useAuth();

  const color = lugar.categoriaColor || '#007AFF';
  const categoryStyle = {
    background: color.startsWith('#') ? `${color}22` : 'var(--amber-dim)',
    color,
  };
  const stars = Math.round(lugar.puntuacionPromedio || 0);

  return (
    <div className="popup-card">

      {/* Cabecera: badge de categoría */}
      <span
        className="category-tag"
        style={categoryStyle}
      >
        {lugar.categoriaIcono ? (
          <span className="category-tag__icon" aria-hidden="true">{lugar.categoriaIcono}</span>
        ) : (
          <MapPin size={13} strokeWidth={2} aria-hidden="true" />
        )}
        {lugar.categoria}
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
          {lugar.direccion && <li><MapPin size={14} strokeWidth={2} /><span>{lugar.direccion}</span></li>}
          {lugar.horario   && <li><Clock size={14} strokeWidth={2} /><span>{lugar.horario}</span></li>}
          {lugar.telefono  && <li><Phone size={14} strokeWidth={2} /><span>{lugar.telefono}</span></li>}
        </ul>
      )}

      {/* Puntuación */}
      {lugar.totalResenas > 0 ? (
        <div className="popup-rating">
          <span className="popup-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                strokeWidth={2}
                fill={i < stars ? 'currentColor' : 'none'}
                className={i < stars ? 'is-filled' : ''}
              />
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
          <Search size={14} strokeWidth={2} /> Ver detalle
        </button>

        {/* Eliminar — solo usuarios autenticados */}
        {isAuthenticated && onDelete && (
          <button
            id={`btn-delete-${lugar.id}`}
            className="btn-delete-place"
            onClick={() => onDelete(lugar.id)}
            title="Eliminar lugar"
          >
            <Trash2 size={14} strokeWidth={2} /> Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default PlacePopup;
