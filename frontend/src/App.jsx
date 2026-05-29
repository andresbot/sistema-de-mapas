import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import api from './services/api.js';
import {
  getLugares,
  getFavoritos,
  toggleFavorito,
  recordPlaceVisit,
  getRecommendations,
  recordSearchBehavior,
} from './services/placesService';
import Toast from './components/Toast';
import LandingScreen       from './screens/LandingScreen';
import ExplorerScreen      from './screens/ExplorerScreen';
import DetailScreen        from './screens/DetailScreen';
import AddPlaceScreen      from './screens/AddPlaceScreen';
import SavedScreen         from './screens/SavedScreen';
import ProfileScreen       from './screens/ProfileScreen';
import PublicProfileScreen from './screens/PublicProfileScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import {
  FALLBACK_CENTER,
} from './data/demoContent';

// Nota: el interceptor JWT ya vive en services/api.js — no se duplica aquí.

const initialForm = {
  nombre: '',
  categoria: 'Restaurante',
  descripcion: '',
  direccion: '',
  horario: '',
  telefono: '',
  imagenes: [],
  review: '',
};

const parseCategory = (value = 'General') => value || 'General';

function getResetTokenFromUrl() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  return window.location.pathname.includes('reset-password') ? token : '';
}

function AppContent() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const initialResetToken = getResetTokenFromUrl();
  const [lugares, setLugares] = useState([]);
  const [view, setView] = useState(initialResetToken ? 'resetPassword' : 'landing');
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [categoriaSel, setCategoriaSel] = useState('Todos');
  const [busqueda, setBusqueda] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [pendingAfterAuth, setPendingAfterAuth] = useState(null);

  const [savedPlaces, setSavedPlaces] = useState([]);
  const [favoritoIds, setFavoritoIds] = useState(new Set());
  const [publicProfile, setPublicProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsMeta, setRecommendationsMeta] = useState({ hasPersonalization: false, rules: {} });
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nuevoLugar, setNuevoLugar] = useState(initialForm);
  const [toast, setToast] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const fetchLugares = useCallback(async () => {
    try {
      const data = await getLugares();
      setLugares(data);
    } catch (err) {
      console.error('❌ Error cargando lugares:', err);
    }
  }, []);

  const fetchFavoritos = useCallback(async () => {
    if (!isAuthenticated) { setSavedPlaces([]); setFavoritoIds(new Set()); return; }
    try {
      const data = await getFavoritos();
      setSavedPlaces(data);
      setFavoritoIds(new Set(data.map((p) => p.id)));
    } catch { /* silent */ }
  }, [isAuthenticated]);

  const fetchNotificaciones = useCallback(async () => {
    if (!isAuthenticated) { setNotifCount(0); return; }
    try {
      const res = await api.get('/notificaciones');
      setNotifCount(res.data?.total || 0);
    } catch { /* silent */ }
  }, [isAuthenticated]);

  const fetchRecommendations = useCallback(async () => {
    if (!isAuthenticated) {
      setRecommendations([]);
      setRecommendationsMeta({ hasPersonalization: false, rules: {} });
      setRecommendationsLoading(false);
      return;
    }

    setRecommendationsLoading(true);
    try {
      const data = await getRecommendations(6);
      setRecommendations(data.items || []);
      setRecommendationsMeta({
        hasPersonalization: Boolean(data.hasPersonalization),
        rules: data.rules || {},
      });
    } catch {
      setRecommendations([]);
      setRecommendationsMeta({ hasPersonalization: false, rules: {} });
    } finally {
      setRecommendationsLoading(false);
    }
  }, [isAuthenticated]);

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

  const handleOpenPublicProfile = useCallback(async (userId) => {
    try {
      const res = await api.get(`/usuarios/${userId}/perfil`);
      setPublicProfile(res.data);
      setView('publicProfile');
    } catch {
      showToast('No se pudo cargar el perfil', 'error');
    }
  }, [showToast]);

  const handleSharePlace = useCallback(async (place) => {
    const mapsUrl = `https://www.google.com/maps?q=${place.latitud},${place.longitud}`;
    const text = `${place.nombre} — ${place.categoria}${place.direccion ? ` · ${place.direccion}` : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: place.nombre, text, url: mapsUrl });
      } catch {
        // usuario canceló — silencioso
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${mapsUrl}`);
        showToast('Enlace copiado al portapapeles');
      } catch {
        showToast('No se pudo copiar el enlace', 'error');
      }
    }
  }, [showToast]);

  // --- CARGA DE DATOS Y GPS ---
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchLugares(),
        fetchFavoritos(),
        fetchNotificaciones(),
        fetchRecommendations(),
      ]);
    };

    void loadInitialData();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (e) => console.warn(e.message),
        { enableHighAccuracy: true }
      );
    }
  }, [fetchLugares, fetchFavoritos, fetchNotificaciones, fetchRecommendations]);

  useEffect(() => {
    const query = busqueda.trim();
    if (!isAuthenticated || query.length < 2) return undefined;

    const timer = window.setTimeout(() => {
      void recordSearchBehavior(query)
        .then(fetchRecommendations)
        .catch(() => {});
    }, 700);

    return () => window.clearTimeout(timer);
  }, [busqueda, fetchRecommendations, isAuthenticated]);

  const requireAuth = useCallback((nextView, coords) => {
    if (isAuthenticated) {
      return true;
    }

    setPendingAfterAuth({ view: nextView, coords });
    setView('perfil');
    return false;
  }, [isAuthenticated]);

  const handleReportReview = useCallback(async (lugarId, resenaId, motivo = 'otro') => {
    if (!isAuthenticated) { requireAuth('detalle'); return; }
    try {
      await api.post(`/lugares/${lugarId}/resenas/${resenaId}/reportes`, { motivo });
      showToast('Reseña reportada. Gracias por ayudarnos.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al reportar';
      showToast(msg, 'error');
    }
  }, [isAuthenticated, requireAuth, showToast]);

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
    void recordPlaceVisit(place.id)
      .then(fetchRecommendations)
      .catch(() => {});
  };

  const navigate = (target) => {
    if (target === 'landing') {
      setView('landing');
      return;
    }

    if (target === 'añadir') {
      handleOpenAdd();
      return;
    }

    if (target === 'admin') {
      setView(user?.rol === 'admin' ? 'admin' : 'perfil');
      return;
    }

    setView(target);
  };

  const handleResetComplete = () => {
    setResetToken('');
    if (window.location.pathname.includes('reset-password')) {
      window.history.replaceState(null, '', '/');
    }
    setView('perfil');
  };

  const guardarLugar = async (e, imagenes = []) => {
    e.preventDefault();
    try {
      const coords = selectedCoords || userLocation || FALLBACK_CENTER;
      const datosParaEnviar = {
        ...nuevoLugar,
        imagenes,
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
      showToast('Lugar publicado correctamente');
      return true;
    } catch {
      showToast('Error al conectar con el servidor', 'error');
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este lugar?")) {
      try {
        await api.delete(`/lugares/${id}`);
        await fetchLugares();
        setSelectedPlaceId((current) => (current === id ? null : current));
        setView('mapa');
        showToast('Lugar eliminado');
      } catch {
        showToast('Error al eliminar', 'error');
      }
    }
  };

  const handleToggleFavorito = async (lugarId) => {
    if (!isAuthenticated) { requireAuth('detalle'); return; }
    try {
      await toggleFavorito(lugarId);
      await fetchFavoritos();
      await fetchRecommendations();
    } catch { showToast('Error al actualizar favorito', 'error'); }
  };

  const goToMap = () => setView('mapa');

  const handleAddReview = async (lugarId, reviewData) => {
    try {
      if (!isAuthenticated) {
        setPendingAfterAuth({ view: 'detalle' });
        setView('perfil');
        return false;
      }
      await api.post(`/lugares/${lugarId}/resenas`, reviewData);
      await fetchLugares();
      await fetchRecommendations();
      showToast('Reseña publicada');
    } catch (err) {
      showToast(err.response?.data?.message || 'Ya has reseñado este lugar', 'error');
      return false;
    }
  };

  const handleDeleteReview = async (lugarId, resenaId) => {
    try {
      await api.delete(`/lugares/${lugarId}/resenas/${resenaId}`);
      await fetchLugares();
      await fetchRecommendations();
      showToast('Reseña eliminada');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al eliminar la reseña', 'error');
    }
  };

  return (
    <div className="app-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {view === 'landing' && (
        <LandingScreen
          places={places}
          onExplore={goToMap}
          onPublish={handleOpenAdd}
          onSelectPlace={handleSelectPlace}
        />
      )}

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
          user={user}
          isAuthenticated={isAuthenticated}
          recommendations={recommendations}
          recommendationsMeta={recommendationsMeta}
          recommendationsLoading={recommendationsLoading}
          onLogout={handleLogout}
          notifCount={notifCount}
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
          onDeleteReview={handleDeleteReview}
          currentUserId={user?.id}
          isFavorited={favoritoIds.has(selectedPlace?.id)}
          onToggleFavorito={handleToggleFavorito}
          onOpenPublicProfile={handleOpenPublicProfile}
          onSharePlace={handleSharePlace}
          onReportReview={handleReportReview}
          notifCount={notifCount}
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
          notifCount={notifCount}
        />
      )}

      {view === 'guardados' && (
        <SavedScreen
          onNavigate={navigate}
          savedPlaces={savedPlaces}
          onSelectPlace={handleSelectPlace}
          notifCount={notifCount}
        />
      )}

      {view === 'publicProfile' && publicProfile && (
        <PublicProfileScreen
          profile={publicProfile}
          onBack={() => { setPublicProfile(null); setView('detalle'); }}
          onSelectPlace={handleSelectPlace}
          onNavigate={navigate}
          isAuthenticated={isAuthenticated}
          notifCount={notifCount}
        />
      )}

      {view === 'admin' && user?.rol === 'admin' && (
        <AdminDashboardScreen
          onNavigate={navigate}
          notifCount={notifCount}
        />
      )}

      {['perfil', 'forgotPassword', 'resetPassword'].includes(view) && (
        <ProfileScreen
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onNavigate={navigate}
          onAuthSuccess={handleAuthSuccess}
          mode={view}
          resetToken={resetToken}
          onResetComplete={handleResetComplete}
          notifCount={notifCount}
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
