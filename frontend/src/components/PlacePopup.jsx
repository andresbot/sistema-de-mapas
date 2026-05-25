import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getResenasPorLugar, crearResena, eliminarResena } from '../services/placesService';

/**
 * Popup de información básica de un lugar ampliado con gestión de Reseñas.
 */
const PlacePopup = ({ lugar, onOpenDetail, onDelete }) => {
  const { isAuthenticated, user } = useAuth(); // Extraemos 'user' para verificar la propiedad de la reseña (HS15)

  // Estados locales para el ciclo de vida de las reseñas
  const [showReviews, setShowReviews] = useState(false);
  const [resenas, setResenas] = useState([]);
  const [loadingResenas, setLoadingResenas] = useState(false);

  // Estados para el formulario de nueva reseña (HS13)
  const [ratingInput, setRatingInput] = useState(5); // Estado interactivo de estrellas (HS14)
  const [hoverRating, setHoverRating] = useState(0);  // Efecto visual hover para las estrellas
  const [comentarioInput, setComentarioInput] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const icon = lugar.categoriaIcono || '📍';
  const color = lugar.categoriaColor || '#007AFF';
  const stars = Math.round(lugar.puntuacionPromedio || 0);

  // Cargar reseñas cuando se despliega la sección (HS12)
  useEffect(() => {
    if (showReviews) {
      cargarResenas();
    }
  }, [showReviews, lugar.id]);

  const cargarResenas = async () => {
    setLoadingResenas(true);
    try {
      const data = await getResenasPorLugar(lugar.id);
      setResenas(data);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    } finally {
      setLoadingResenas(false);
    }
  };

  // Manejar el envío de reseña (HS13)
  const handleSubmitResena = async (e) => {
    e.preventDefault();
    setErrorForm('');
    try {
      await crearResena({
        lugarId: lugar.id,
        puntuacion: ratingInput,
        comentario: comentarioInput
      });
      setComentarioInput('');
      setRatingInput(5);
      cargarResenas(); // Recargar listado automáticamente
      // Nota: Idealmente refrescar el estado global del 'lugar' para actualizar su promedio visual externo
    } catch (error) {
      setErrorForm(error.response?.data?.message || "Error al enviar la reseña.");
    }
  };

  // Manejar eliminación de reseña (HS15)
  const handleDeleteResena = async (resenaId) => {
    if (window.confirm("¿Seguro que deseas eliminar tu reseña?")) {
      try {
        await eliminarResena(resenaId);
        cargarResenas(); // Recargar listado automáticamente
      } catch (error) {
        alert(error.response?.data?.message || "No se pudo eliminar la reseña.");
      }
    }
  };

  return (
    <div className="popup-card" style={{ maxHeight: '450px', overflowY: 'auto' }}>

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
          {lugar.horario    && <li><span className="detail-icon">🕐</span>{lugar.horario}</li>}
          {lugar.telefono   && <li><span className="detail-icon">📞</span>{lugar.telefono}</li>}
        </ul>
      )}

      {/* Puntuación Promedio */}
      <div 
        className="popup-rating" 
        style={{ cursor: 'pointer', margin: '10px 0' }}
        onClick={() => setShowReviews(!showReviews)}
      >
        <span className="popup-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < stars ? '#FFD60A' : '#ccc' }}>★</span>
          ))}
        </span>
        <span className="popup-rating-text" style={{ textDecoration: 'underline', marginLeft: '5px' }}>
          {lugar.totalResenas > 0 
            ? `${lugar.puntuacionPromedio.toFixed(1)} (${lugar.totalResenas} reseña${lugar.totalResenas !== 1 ? 's' : ''})`
            : "Sin reseñas aún (Ver/Añadir)"}
        </span>
      </div>

      {/* ======================================================= */}
      {/* SECCIÓN DESPLEGABLE DE RESEÑAS (HS12, HS13, HS14, HS15) */}
      {/* ======================================================= */}
      {showReviews && (
        <div className="popup-reviews-section" style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
          <h4>Reseñas de la comunidad</h4>
          
          {loadingResenas ? (
            <p style={{ fontSize: '12px', color: '#666' }}>Cargando opiniones...</p>
          ) : resenas.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>Nadie ha calificado este lugar aún.</p>
          ) : (
            <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
              {resenas.map((res) => (
                <div key={res.id} className="review-item" style={{ background: '#f9f9f9', padding: '8px', borderRadius: '6px', fontSize: '12px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{res.usuario?.nombre || 'Usuario'}</strong>
                    <span style={{ color: '#FFD60A' }}>
                      {'★'.repeat(res.puntuacion)}{'☆'.repeat(5 - res.puntuacion)}
                    </span>
                  </div>
                  {res.comentario && <p style={{ margin: '4px 0 0 0', color: '#444' }}>{res.comentario}</p>}
                  
                  {/* HS15: Botón para eliminar sólo visible para el autor de la reseña o admins */}
                  {isAuthenticated && user && (user.id === res.usuarioId || user.rol === 'admin') && (
                    <button 
                      onClick={() => handleDeleteResena(res.id)}
                      style={{ position: 'absolute', right: '4px', bottom: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px' }}
                      title="Eliminar mi reseña"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Formulario para Crear Reseña (HS13) */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitResena} style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#f5f5f5', padding: '8px', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Deja tu opinión:</span>
              
              {/* Selector interactivo de Estrellas (HS14) */}
              <div className="star-rating-selector" style={{ fontSize: '18px', cursor: 'pointer' }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <span
                      key={i}
                      onClick={() => setRatingInput(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ color: starValue <= (hoverRating || ratingInput) ? '#FFD60A' : '#ccc', transition: 'color 0.1s' }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>

              <textarea
                placeholder="Escribe un comentario opcional..."
                value={comentarioInput}
                onChange={(e) => setComentarioInput(e.target.value)}
                style={{ width: '100%', fontSize: '12px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                rows={2}
              />
              
              {errorForm && <p style={{ color: 'red', fontSize: '11px', margin: 0 }}>{errorForm}</p>}
              
              <button type="submit" style={{ background: '#007AFF', color: '#fff', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                Enviar Calificación
              </button>
            </form>
          ) : (
            <p style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>Inicia sesión para dejar una reseña.</p>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="popup-actions" style={{ marginTop: '15px' }}>
        <button
          className="btn-resena-main"
          onClick={() => onOpenDetail?.(lugar)}
          title="Ver detalle"
        >
          🔎 Ver detalle
        </button>

        {/* Eliminar Lugar — solo usuarios autenticados */}
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