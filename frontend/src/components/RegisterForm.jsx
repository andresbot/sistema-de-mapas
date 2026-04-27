import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const RegisterForm = ({ onAuthSuccess }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Por defecto mostramos Login
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = isLogin ? await login(payload) : await register(payload);

      if (!response.success) {
        setErrorMsg(response.message || 'Error de autenticación');
        return;
      }

      onAuthSuccess?.(response.data.user);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Error de conexión");
    }
  };

  return (
    <div className="auth-card glass-card">
      <div className="auth-card__header">
        <div className="brand-mark brand-mark--big">MR</div>
        <div>
          <h2>Mapa de Reseñas</h2>
          <p>Your trusted city guide.</p>
        </div>
      </div>

      <nav className="auth-toggle" aria-label="Authentication modes">
        <button
          type="button"
          className={`auth-toggle__tab ${isLogin ? 'is-active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          className={`auth-toggle__tab ${!isLogin ? 'is-active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Crear cuenta
        </button>
      </nav>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <label className="field">
            Nombre
            <input
              placeholder="Camilo Triana"
              value={formData.nombre}
              onChange={(event) => setFormData({ ...formData, nombre: event.target.value })}
              required
            />
          </label>
        )}
        <label className="field">
          Email
          <input
            type="email"
            placeholder="jtriaha@gmail.com"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            required
          />
        </label>
        <label className="field">
          Contraseña
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            required
          />
        </label>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        <button type="submit" className="pill-button pill-button--primary pill-button--block auth-submit">
          {isLogin ? 'Entrar' : 'Registrarme'}
        </button>
      </form>

      <div className="auth-divider">
        <span />
        <small>O continúa con</small>
        <span />
      </div>

      <div className="social-row">
        <button type="button" className="social-button">Google</button>
        <button type="button" className="social-button">GitHub</button>
      </div>

      <p className="auth-switch">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya estás registrado?'}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
        </button>
      </p>
    </div>
  );
};