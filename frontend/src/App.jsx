import React, { useEffect, useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import api from './services/api.js';
import { getLugares } from './services/placesService';
import {
  AddPlaceScreen,
  DetailScreen,
  ExplorerScreen,
  ProfileScreen,
  SavedScreen,
} from './components/ScreenViews';
import {
  FALLBACK_CENTER,
} from './data/demoContent';

/* eslint-disable react-hooks/set-state-in-effect */

// Nota: el interceptor JWT ya vive en services/api.js — no se duplica aquí.

const initialForm = {
  nombre: '',
  categoria: 'Restaurante',
  descripcion: '',
  review: '',
};

const parseCategory = (value = 'General') => value || 'General';

function AppContent() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [lugares, setLugares] = useState([]);
  const [view, setView] = useState('mapa');
  const [categoriaSel, setCategoriaSel] = useState('Todos');
  const [busqueda, setBusqueda] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [pendingAfterAuth, setPendingAfterAuth] = useState(null);

  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nuevoLugar, setNuevoLugar] = useState(initialForm);

  const fetchLugares = async () => {
    try {
      const data = await getLugares();
      setLugares(data);
    } catch (err) {
      console.error('❌ Error cargando lugares:', err);
    }
  };

  const places = lugares;

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = busqueda.trim().toLowerCase();
    return places.filter((place) => {
      const categoryMatch =
        categoriaSel === 'Todos' || parseCategory(place.categoria).toLowerCase() === categoriaSel.toLowerCase();
      const searchMatch =
        !normalizedSearch ||
        [place.nombre, place.descripcion, place.categoria, place.direccion]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);
      return categoryMatch && searchMatch;
    });
  }, [places, busqueda, categoriaSel]);

  const selectedPlace = useMemo(() => {
    return (
      places.find((place) => place.id === selectedPlaceId) ||
      filteredPlaces[0] ||
      places[0] ||
      null
    );
  }, [filteredPlaces, places, selectedPlaceId]);

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
    return (
      <div className="loading-screen">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
          <div className="brand-mark brand-mark--big" style={{ margin: '0 auto 0.8rem' }}>MR</div>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Cargando Mapa de Reseñas…</p>
        </div>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    if (pendingAfterAuth?.view === 'añadir') {
      setSelectedCoords(pendingAfterAuth.coords || userLocation || FALLBACK_CENTER);
      setView('añadir');
    } else {
      setView('perfil');
    }
    setPendingAfterAuth(null);
  };

  const handleLogout = () => {
    logout();
    setView('perfil');
    setPendingAfterAuth(null);
  };

  const requireAuth = (nextView, coords) => {
    if (isAuthenticated) {
      return true;
    }

    setPendingAfterAuth({ view: nextView, coords });
    setView('perfil');
    return false;
  };

  const handleMapClick = (coords) => {
    if (!requireAuth('añadir', coords)) {
      return;
    }

    setSelectedCoords(coords);
    setNuevoLugar(initialForm);
    setView('añadir');
  };

  const handleOpenAdd = () => {
    if (!requireAuth('añadir', selectedCoords || userLocation || FALLBACK_CENTER)) {
      return;
    }

    setSelectedCoords(selectedCoords || userLocation || FALLBACK_CENTER);
    setNuevoLugar(initialForm);
    setView('añadir');
  };

  const handleSelectPlace = (place) => {
    setSelectedPlaceId(place.id);
    setView('detalle');
  };

  const navigate = (target) => {
    if (target === 'añadir') {
      handleOpenAdd();
      return;
    }

    setView(target);
  };

  const guardarLugar = async (e) => {
    e.preventDefault();
    try {
      const coords = selectedCoords || userLocation || FALLBACK_CENTER;
      const datosParaEnviar = {
        ...nuevoLugar,
        latitud: coords.lat,
        longitud: coords.lng
      };
      const response = await api.post('/lugares', datosParaEnviar);
      const createdPlace = response.data?.data;

      setNuevoLugar(initialForm);
      setSelectedCoords(coords);
      await fetchLugares();

      if (createdPlace?.id) {
        setSelectedPlaceId(createdPlace.id);
      }
      setView('detalle');
    } catch {
      alert("❌ Error al conectar con el servidor.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este lugar?")) {
      try {
        await api.delete(`/lugares/${id}`);
        await fetchLugares();
        setSelectedPlaceId((current) => (current === id ? null : current));
        setView('mapa');
      } catch {
        alert("Error al eliminar");
      }
    }
  };

  const goToMap = () => setView('mapa');

  const handleAddReview = async (lugarId, reviewData) => {
    try {
      if (!isAuthenticated) {
        setPendingAfterAuth({ view: 'detalle' });
        setView('perfil');
        return;
      }
      await api.post(`/lugares/${lugarId}/resenas`, reviewData);
      await fetchLugares(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error al añadir reseña. Puede que ya hayas reseñado este lugar.");
    }
  };

  return (
    <div className="app-container">
      {view === 'mapa' && (
        <ExplorerScreen
          places={places}
          filteredPlaces={filteredPlaces}
          search={busqueda}
          setSearch={setBusqueda}
          category={categoriaSel}
          setCategory={setCategoriaSel}
          onSelectPlace={handleSelectPlace}
          onOpenAdd={handleOpenAdd}
          onNavigate={navigate}
          onMapClick={handleMapClick}
          userLocation={userLocation}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {view === 'detalle' && selectedPlace && (
        <DetailScreen
          place={selectedPlace}
          onBack={goToMap}
          onNavigate={navigate}
          onSelectPlace={handleSelectPlace}
          relatedPlaces={filteredPlaces}
          onOpenAdd={handleOpenAdd}
          onDelete={handleDelete}
          onAddReview={handleAddReview}
        />
      )}

      {view === 'añadir' && (
        <AddPlaceScreen
          values={nuevoLugar}
          setValues={setNuevoLugar}
          coords={selectedCoords || userLocation || FALLBACK_CENTER}
          onCoordsChange={setSelectedCoords}
          onSubmit={guardarLugar}
          onBack={goToMap}
          onUseCurrentLocation={() => setSelectedCoords(userLocation || FALLBACK_CENTER)}
          userLocation={userLocation}
          isAuthenticated={isAuthenticated}
          onNavigate={navigate}
        />
      )}

      {view === 'guardados' && (
        <SavedScreen
          onNavigate={navigate}
          places={filteredPlaces}
          onSelectPlace={handleSelectPlace}
        />
      )}

      {view === 'perfil' && (
        <ProfileScreen
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onNavigate={navigate}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}