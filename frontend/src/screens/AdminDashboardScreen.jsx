import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bookmark,
  CheckCircle,
  Eye,
  Map,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Star,
  XCircle,
} from 'lucide-react';
import WorkspaceScreen from '../components/shared/WorkspaceScreen';
import api from '../services/api.js';

const RANGE_OPTIONS = [
  { value: 30, label: '30 días' },
  { value: 7, label: '7 días' },
];

const MOTIVO_LABELS = { spam: 'Spam', ofensivo: 'Ofensivo', falso: 'Falso', otro: 'Otro' };

function formatNumber(value) {
  return new Intl.NumberFormat('es-CO').format(value || 0);
}

function formatRating(value) {
  return Number(value || 0).toFixed(1);
}

function MetricCard({ icon: Icon, label, value, helper }) {
  return (
    <section className="workspace-panel admin-stat-card">
      <span className="admin-stat-card__icon">
        {React.createElement(Icon, { size: 18, strokeWidth: 1.8 })}
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {helper && <small>{helper}</small>}
      </div>
    </section>
  );
}

function ModerationPanel() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pendiente');

  const fetchReportes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reportes?status=${filter}&limit=10`);
      setReportes(res.data.data || []);
    } catch {
      setReportes([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void fetchReportes();
  }, [fetchReportes]);

  const handleAction = async (id, status) => {
    try {
      await api.patch(`/admin/reportes/${id}`, { status });
      await fetchReportes();
    } catch {
      // Mantiene la moderación sin bloquear el resto del panel.
    }
  };

  return (
    <section className="workspace-panel workspace-panel--wide admin-moderation">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">Moderación</p>
          <h2>Reportes de reseñas</h2>
        </div>
        <div className="admin-range-toggle" aria-label="Filtrar reportes">
          {['pendiente', 'resuelto', 'descartado'].map((status) => (
            <button
              key={status}
              type="button"
              className={filter === status ? 'is-active' : ''}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Cargando reportes...</div>
      ) : reportes.length === 0 ? (
        <div className="empty-state admin-empty">
          <ShieldCheck size={34} strokeWidth={1.3} color="var(--amber)" />
          <h3>Sin reportes {filter === 'pendiente' ? 'pendientes' : filter + 's'}</h3>
          <p>No hay elementos para revisar en este estado.</p>
        </div>
      ) : (
        <div className="admin-report-list">
          {reportes.map((reporte) => (
            <article key={reporte.id} className="admin-report-card">
              <div className="admin-report-card__body">
                <div className="admin-report-card__meta">
                  <AlertTriangle size={13} strokeWidth={2} />
                  <strong>{MOTIVO_LABELS[reporte.motivo] || reporte.motivo}</strong>
                  <span>{reporte.resena?.lugar?.nombre || 'Lugar desconocido'}</span>
                </div>
                {reporte.resena?.comentario && (
                  <p>"{reporte.resena.comentario}"</p>
                )}
                <small>
                  Reportado por {reporte.usuario?.nombre || 'usuario'} ·{' '}
                  {new Date(reporte.createdAt).toLocaleDateString()}
                </small>
              </div>
              {filter === 'pendiente' && (
                <div className="admin-report-card__actions">
                  <button
                    type="button"
                    className="btn btn--icon admin-action-success"
                    onClick={() => handleAction(reporte.id, 'resuelto')}
                    title="Resolver"
                  >
                    <CheckCircle size={14} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="btn btn--icon"
                    onClick={() => handleAction(reporte.id, 'descartado')}
                    title="Descartar"
                  >
                    <XCircle size={14} strokeWidth={1.6} />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminDashboardScreen({ onNavigate, notifCount = 0 }) {
  const [range, setRange] = useState(30);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/metricas?range=${range}`);
      setMetrics(res.data.data);
    } catch (err) {
      const status = err.response?.status;
      setError(status === 403
        ? 'No tienes permisos para ver las métricas administrativas.'
        : 'No se pudieron cargar las métricas de visibilidad.');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  const lugares = useMemo(() => metrics?.lugares || [], [metrics]);
  const totals = metrics?.totals || {
    visitasPerfil: 0,
    resenas: 0,
    promedioCalificacion: 0,
    favoritos: 0,
  };

  const hasEventsInRange = useMemo(() => {
    return lugares.some((lugar) => lugar.visitasPerfil > 0 || lugar.resenas > 0);
  }, [lugares]);

  return (
    <WorkspaceScreen
      activeView="admin"
      eyebrow="Administrador"
      title="Métricas de visibilidad"
      subtitle="Monitorea visitas al perfil del lugar, reseñas, calificación y favoritos con datos reales del sistema."
      icon={BarChart3}
      onNavigate={onNavigate}
      notifCount={notifCount}
      actions={(
        <button type="button" className="btn btn--primary" onClick={() => onNavigate('mapa')}>
          <Map size={15} strokeWidth={1.8} /> Explorar mapa
        </button>
      )}
    >
      <div className="workspace-grid admin-dashboard">
        <section className="workspace-panel workspace-panel--wide admin-toolbar">
          <div>
            <p className="eyebrow">Rango temporal</p>
            <h2>Últimos {range} días</h2>
          </div>
          <div className="admin-toolbar__actions">
            <div className="admin-range-toggle" aria-label="Seleccionar rango de métricas">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={range === option.value ? 'is-active' : ''}
                  onClick={() => setRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={loadMetrics} disabled={loading}>
              <RefreshCw size={14} strokeWidth={1.8} /> Actualizar
            </button>
          </div>
        </section>

        {error && (
          <section className="workspace-panel workspace-panel--wide admin-error">
            {error}
          </section>
        )}

        <MetricCard
          icon={Eye}
          label="Visitas al perfil"
          value={formatNumber(totals.visitasPerfil)}
          helper={`Aperturas del detalle en ${range} días`}
        />
        <MetricCard
          icon={MessageSquare}
          label="Reseñas"
          value={formatNumber(totals.resenas)}
          helper={`Publicadas en ${range} días`}
        />
        <MetricCard
          icon={Star}
          label="Promedio"
          value={formatRating(totals.promedioCalificacion)}
          helper="Calificación actual"
        />
        <MetricCard
          icon={Bookmark}
          label="Favoritos"
          value={formatNumber(totals.favoritos)}
          helper="Guardados actuales"
        />

        <section className="workspace-panel workspace-panel--wide admin-ranking">
          <div className="admin-section-head">
            <div>
              <p className="eyebrow">Ranking</p>
              <h2>Lugares con mayor visibilidad</h2>
            </div>
            {metrics?.from && (
              <small>
                Desde {new Date(metrics.from).toLocaleDateString()} hasta{' '}
                {new Date(metrics.to).toLocaleDateString()}
              </small>
            )}
          </div>

          {loading ? (
            <div className="admin-loading">Cargando métricas...</div>
          ) : !hasEventsInRange ? (
            <div className="empty-state admin-empty">
              <Eye size={34} strokeWidth={1.3} color="var(--amber)" />
              <h3>Sin eventos en este rango</h3>
              <p>Abre algunos lugares en el mapa o cambia el rango temporal para ver actividad.</p>
            </div>
          ) : (
            <div className="admin-table" role="table" aria-label="Métricas por lugar">
              <div className="admin-table__row admin-table__head" role="row">
                <span>Lugar</span>
                <span>Visitas</span>
                <span>Reseñas</span>
                <span>Promedio</span>
                <span>Favoritos</span>
              </div>
              {lugares.map((lugar) => (
                <div key={lugar.id} className="admin-table__row" role="row">
                  <span>
                    <strong>{lugar.nombre}</strong>
                    <small>{lugar.categoria}</small>
                  </span>
                  <span>{formatNumber(lugar.visitasPerfil)}</span>
                  <span>{formatNumber(lugar.resenas)}</span>
                  <span>{formatRating(lugar.promedioCalificacion)}</span>
                  <span>{formatNumber(lugar.favoritos)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <ModerationPanel />
      </div>
    </WorkspaceScreen>
  );
}
