import React, { useState } from 'react';
import { LogOut, Sun, Moon, ShieldCheck, CheckCircle, XCircle, AlertTriangle, Bell, UserRound, Map } from 'lucide-react';
import WorkspaceScreen from '../components/shared/WorkspaceScreen';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.js';

function ModerationPanel() {
  const [reportes, setReportes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('pendiente');

  const fetchReportes = async (status) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reportes?status=${status}&limit=10`);
      setReportes(res.data.data || []);
    } catch { setReportes([]); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { fetchReportes(filter); }, [filter]);

  const handleAction = async (id, status) => {
    try {
      await api.patch(`/admin/reportes/${id}`, { status });
      fetchReportes(filter);
    } catch { /* silent */ }
  };

  const MOTIVO_LABELS = { spam: 'Spam', ofensivo: 'Ofensivo', falso: 'Falso', otro: 'Otro' };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ShieldCheck size={16} color="var(--amber)" strokeWidth={1.5} />
        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--amber)' }}>
          Moderación
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.8rem' }}>
        {['pendiente', 'resuelto', 'descartado'].map(s => (
          <button key={s} type="button"
            className={`chip${filter === s ? ' is-active' : ''}`}
            style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}
            onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-3)', fontSize: '0.8rem' }}>
          Cargando…
        </div>
      ) : reportes.length === 0 ? (
        <div className="empty-state" style={{ padding: '1rem 0' }}>
          <p>No hay reportes {filter === 'pendiente' ? 'pendientes' : filter + 's'}.</p>
        </div>
      ) : (
        <div>
          {reportes.map(r => (
            <div key={r.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--amber-border)',
              borderRadius: 'var(--r)', padding: '0.7rem 0.9rem', marginBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <AlertTriangle size={11} color="var(--warn)" strokeWidth={2} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--amber)' }}>
                      {MOTIVO_LABELS[r.motivo] || r.motivo}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>
                      · {r.resena?.lugar?.nombre || 'Lugar desconocido'}
                    </span>
                  </div>
                  {r.resena?.comentario && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', lineHeight: 1.4,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' }}>
                      "{r.resena.comentario}"
                    </p>
                  )}
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
                    Reportado por {r.usuario?.nombre || 'usuario'}
                    {' · '}{new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {filter === 'pendiente' && (
                  <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                    <button type="button" className="btn btn--icon"
                      style={{ width: 28, height: 28, background: 'rgba(16,185,129,0.12)',
                        borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}
                      onClick={() => handleAction(r.id, 'resuelto')} title="Resolver">
                      <CheckCircle size={13} strokeWidth={2} />
                    </button>
                    <button type="button" className="btn btn--icon"
                      style={{ width: 28, height: 28 }}
                      onClick={() => handleAction(r.id, 'descartado')} title="Descartar">
                      <XCircle size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityFeed() {
  const [items, setItems] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    api.get('/notificaciones').then(res => {
      setItems(res.data?.data?.slice(0, 5) || []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  if (!loaded) return null;
  if (items.length === 0) return (
    <div style={{ padding: '0.5rem 0', fontSize: '0.78rem', color: 'var(--text-3)' }}>
      Sin actividad reciente en tus lugares.
    </div>
  );

  return (
    <div>
      {items.map(n => (
        <div key={n.id} style={{
          padding: '0.55rem 0', borderBottom: '1px solid rgba(245,158,11,0.06)',
          fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.4
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{n.autor}</span>
          {' reseñó '}
          <span style={{ color: 'var(--amber)' }}>{n.lugarNombre}</span>
          {n.puntuacion && ` · ${'★'.repeat(n.puntuacion)}`}
          {n.comentario && (
            <span style={{ color: 'var(--text-3)', fontSize: '0.72rem', marginTop: '0.1rem',
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
              "{n.comentario}"
            </span>
          )}
          <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>
            {new Date(n.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

export default function ProfileScreen({ user, isAuthenticated, onLogout, onNavigate, onAuthSuccess, notifCount = 0 }) {
  const { isDark, toggleTheme } = useTheme();
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = tab === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({ nombre: form.nombre, email: form.email, password: form.password });
      if (response.success) {
        onAuthSuccess?.();
      } else {
        setError(response.message || 'Error al autenticarse');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al autenticarse');
    } finally {
      setLoading(false);
    }
  };

  const authContent = (
    <div className="workspace-grid workspace-grid--auth">
      <section className="workspace-panel workspace-panel--feature">
        <p className="eyebrow">Acceso opcional</p>
        <h2>Explora libremente. Inicia sesión solo para aportar.</h2>
        <p>
          El mapa permanece abierto sin registro. La cuenta desbloquea favoritos,
          reseñas, publicación de lugares y actividad de tus aportes.
        </p>
      </section>

      <section className="workspace-panel workspace-panel--form">
        <div className="auth-tabs">
          <button type="button" className={`auth-tab${tab === 'login' ? ' is-active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}>
            Iniciar sesión
          </button>
          <button type="button" className={`auth-tab${tab === 'register' ? ' is-active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}>
            Registrarse
          </button>
        </div>
        <form onSubmit={handleAuth}>
          {tab === 'register' && (
            <div className="form-field">
              <label>Nombre</label>
              <input type="text" required value={form.nombre} placeholder="Tu nombre"
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </div>
          )}
          <div className="form-field">
            <label>Email</label>
            <input type="email" required value={form.email} placeholder="tu@email.com"
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Contraseña</label>
            <input type="password" required value={form.password} placeholder="••••••••"
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          {error && <p style={{ fontSize: '0.78rem', color: 'var(--danger)', marginBottom: '0.7rem' }}>{error}</p>}
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Cargando…' : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </div>
  );

  const profileContent = !user ? null : (
    <div className="workspace-grid workspace-grid--profile">
      <section className="workspace-panel workspace-panel--account">
        <div className="profile-avatar">{initials(user?.nombre)}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-1)' }}>
            {user?.nombre}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginTop: '0.1rem' }}>{user?.email}</div>
        </div>
      </section>

      <section className="workspace-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Bell size={14} color="var(--amber)" strokeWidth={1.5} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--amber)' }}>
            Actividad reciente
          </span>
        </div>
        <ActivityFeed />
      </section>

      <section className="workspace-panel workspace-panel--actions">
        <button type="button" className="btn btn--ghost" onClick={toggleTheme}
          style={{ flex: 1, gap: '0.4rem' }}>
          {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <button type="button" className="btn btn--danger" onClick={onLogout}
          style={{ flex: 1, gap: '0.4rem' }}>
          <LogOut size={15} strokeWidth={1.5} /> Cerrar sesión
        </button>
      </section>

      {user?.rol === 'admin' && (
        <section className="workspace-panel workspace-panel--wide">
          <ModerationPanel />
        </section>
      )}
    </div>
  );

  return (
    <WorkspaceScreen
      activeView="perfil"
      eyebrow={isAuthenticated ? 'Cuenta' : 'Acceso'}
      title={isAuthenticated ? user?.nombre : 'Explora sin registro'}
      subtitle={isAuthenticated
        ? 'Administra tu actividad, tema y moderación desde un espacio más amplio.'
        : 'Inicia sesión solo cuando quieras publicar, guardar o reseñar.'}
      icon={UserRound}
      onNavigate={onNavigate}
      notifCount={notifCount}
      actions={(
        <button type="button" className="btn btn--primary" onClick={() => onNavigate('mapa')}>
          <Map size={15} strokeWidth={1.8} /> Explorar mapa
        </button>
      )}
    >
      {isAuthenticated ? profileContent : authContent}
    </WorkspaceScreen>
  );
}
