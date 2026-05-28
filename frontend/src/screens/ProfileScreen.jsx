import React, { useState } from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import PanelNav from '../components/shared/PanelNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
}

export default function ProfileScreen({ user, isAuthenticated, onLogout, onNavigate, onAuthSuccess }) {
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
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
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
    </div>
  );

  const profileContent = !user ? null : (
    <div style={{ padding: '0 1.2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 0 1.2rem' }}>
        <div className="profile-avatar">{initials(user?.nombre)}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-1)' }}>
            {user?.nombre}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', marginTop: '0.1rem' }}>{user?.email}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button type="button" className="btn btn--ghost" onClick={toggleTheme}
          style={{ flex: 1, gap: '0.4rem' }}>
          {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <button type="button" className="btn btn--danger" onClick={onLogout}
          style={{ flex: 1, gap: '0.4rem' }}>
          <LogOut size={15} strokeWidth={1.5} /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="map-layer" style={{ background: 'var(--bg-2)' }} />

      {/* MOBILE */}
      <div className="bottom-panel is-expanded" style={{ transform: 'translateY(0)', maxHeight: '100vh' }}>
        <PanelNav activeView="perfil" onNavigate={onNavigate} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {isAuthenticated ? profileContent : authContent}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="desktop-panel">
        <div className="panel-header">
          <div className="panel-brand">
            Perfil<br /><small>{isAuthenticated ? user?.nombre : 'no autenticado'}</small>
          </div>
        </div>
        <PanelNav activeView="perfil" onNavigate={onNavigate} />
        <div className="panel-content" style={{ overflowY: 'auto' }}>
          {isAuthenticated ? profileContent : authContent}
        </div>
      </div>
    </div>
  );
}
