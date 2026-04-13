import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './components/MapContainer';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import { RegisterForm } from './components/RegisterForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Configurar interceptor de axios para enviar el JWT
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function AppContent() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [lugares, setLugares] = useState([]);
  const [view, setView] = useState('mapa');
  const [categoriaSel, setCategoriaSel] = useState('Todos');
  const [busqueda, setBusqueda] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // --- ESTADOS PARA EL MODAL DE NUEVO LUGAR ---
  const [showModal, setShowModal] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nuevoLugar, setNuevoLugar] = useState({
    nombre: '',
    categoria: 'Restaurante',
    descripcion: ''
  });

  const fetchLugares = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lugares');
      setLugares(res.data);
    } catch (err) { console.error("❌ Error cargando datos:", err); }
  };

  // --- CARGA DE DATOS Y GPS ---
  useEffect(() => {
    fetchLugares();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (e) => console.warn(e.message),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>;
  }

  // --- FUNCIÓN DE REDIRECCIÓN (AUTH) ---
  const handleAuthSuccess = () => {
    setView('mapa'); // Te manda al mapa inmediatamente
  };

  const handleLogout = () => {
    logout();
    setView('perfil');
    setShowModal(false);
  };

  // --- LÓGICA DE FILTRADO ---
  const lugaresFiltrados = lugares.filter(l => {
    const cat = categoriaSel === 'Todos' || l.categoria.toLowerCase() === categoriaSel.toLowerCase();
    const bus = l.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return cat && bus;
  });

  // --- ACCIONES DEL MAPA ---
  const handleMapClick = (coords) => {
    setSelectedCoords(coords);
    setShowModal(true);
  };

  const guardarLugar = async (e) => {
    e.preventDefault();
    try {
      const datosParaEnviar = {
        ...nuevoLugar,
        latitud: selectedCoords.lat,
        longitud: selectedCoords.lng
      };
      await axios.post('http://localhost:3000/api/lugares', datosParaEnviar);
      setShowModal(false);
      setNuevoLugar({ nombre: '', categoria: 'Restaurante', descripcion: '' });
      fetchLugares();
      alert("✅ ¡Lugar guardado con éxito!");
    } catch (err) {
      alert("❌ Error al conectar con el servidor.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este lugar?")) {
      try {
        await axios.delete(`http://localhost:3000/api/lugares/${id}`);
        fetchLugares();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div className="app-container">
      {/* Navbar solo en mapa */}
      {view === 'mapa' && (
        <Navbar
          onFilter={setCategoriaSel}
          onSearch={setBusqueda}
          categoriaActiva={categoriaSel}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}

      <main className="main-content">
        {view === 'mapa' ? (
          <MapView
            lugares={lugaresFiltrados}
            userLocation={userLocation}
            onMapClick={handleMapClick}
            onDelete={handleDelete}
            onResena={(id) => alert("Reseñar lugar ID: " + id)}
          />
        ) : (
          <div className="perfil-section" style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            {isAuthenticated ? (
              <div className="user-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '50px' }}>👤</div>
                <h2>Hola, {user?.nombre || 'Explorador'}</h2>
                <p>Bienvenido a Zarzal Explorer</p>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                  style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', border: '1px solid red', color: 'red', background: 'none' }}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <RegisterForm onAuthSuccess={handleAuthSuccess} />
            )}
          </div>
        )}
      </main>

      {/* --- MODAL PARA AGREGAR LUGAR --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📍 Nuevo punto en Zarzal</h3>
            <form onSubmit={guardarLugar}>
              <label>Nombre:</label>
              <input
                type="text"
                required
                value={nuevoLugar.nombre}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, nombre: e.target.value })}
              />
              <label>Categoría:</label>
              <select
                value={nuevoLugar.categoria}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, categoria: e.target.value })}
              >
                <option value="Restaurante">🍴 Restaurante</option>
                <option value="Parque">🌳 Parque</option>
                <option value="Cultura">🎭 Cultura</option>
                <option value="Tienda">🛍️ Tienda</option>
                <option value="Servicio">🛠️ Servicio</option>
                <option value="Turismo">🏛️ Turismo</option>
              </select>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav activeTab={view} setActiveTab={setView} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}