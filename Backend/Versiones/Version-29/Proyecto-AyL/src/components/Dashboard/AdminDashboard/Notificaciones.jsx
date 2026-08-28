import { useState, useEffect } from 'react';

export default function NotificacionesView() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const [cargando, setCargando] = useState(true);

  const API_URL = "http://localhost:3001/api/notificaciones";

  const cargarNotificaciones = async () => {
    try {
      const url = filtro === 'no-leidas' ? `${API_URL}/no-leidas` : API_URL;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error cargando notificaciones");
      const data = await response.json();
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener alertas en Notificaciones.jsx:", error);
    } finally {
      setCargando(false);
    }
  };

  const marcarLeida = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/leer`, { method: "PUT" });
      if (!response.ok) throw new Error("No se pudo marcar como leída");
      setNotificaciones(prev => 
        prev.map(n => n.id === id ? { ...n, leido: true } : n)
      );
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      const response = await fetch(`${API_URL}/marcar-todas`, { method: "PUT" });
      if (!response.ok) throw new Error("No se pudieron actualizar las alertas");
      setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })));
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  const eliminarNotificacion = async (id, e) => {
    e.stopPropagation();
    if (!confirm("¿Deseas eliminar esta alerta permanentemente?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el registro");
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error al eliminar la notificación:", error);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 15000); 
    return () => clearInterval(intervalo);
  }, [filtro]);

  const totalNoLeidas = notificaciones.filter(n => !n.leido).length;
  const imagenPorDefecto = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23a0aec0' stroke-width='2' viewBox='0 0 24 24' width='40' height='40'><path stroke-linecap='round' stroke-linejoin='round' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4'/></svg>";

  return (
    <div style={styles.container}>
      {/* Encabezado Principal */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Centro de Notificaciones</h2>
          <p style={styles.subtitle}>Alertas de stock crítico en AyL Compresores y partes</p>
        </div>
        {totalNoLeidas > 0 && (
          <button onClick={marcarTodasLeidas} style={styles.actionBtn}>
            ✓ Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Selectores de navegación superiores con la línea amarilla */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => setFiltro('todas')}
          style={{
            ...styles.tab, 
            fontWeight: filtro === 'todas' ? 'bold' : 'normal', 
            borderBottom: filtro === 'todas' ? '3px solid #f2a900' : '3px solid transparent', 
            color: filtro === 'todas' ? '#2d3748' : '#718096'
          }}
        >
          Historial Completo
        </button>
        <button 
          onClick={() => setFiltro('no-leidas')}
          style={{
            ...styles.tab, 
            fontWeight: filtro === 'no-leidas' ? 'bold' : 'normal', 
            borderBottom: filtro === 'no-leidas' ? '3px solid #f2a900' : '3px solid transparent', 
            color: filtro === 'no-leidas' ? '#2d3748' : '#718096'
          }}
        >
          Sin Revisar ({totalNoLeidas})
        </button>
      </div>

      {/* Contenedor del listado */}
      <div style={styles.listContainer}>
        {cargando ? (
          <p style={{ textAlign: 'center', color: '#718096', fontSize: '14px' }}>Sincronizando inventario...</p>
        ) : notificaciones.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ margin: 0 }}>No se encontraron alertas de stock bajo en esta sección.</p>
          </div>
        ) : (
          notificaciones.map((alerta) => (
            <div 
              key={alerta.id}
              onClick={() => !alerta.leido && marcarLeida(alerta.id)}
              style={{
                ...styles.card,
                backgroundColor: !alerta.leido ? '#fffdf5' : 'white',
                borderLeft: !alerta.leido ? '5px solid #f2a900' : '5px solid #cbd5e0'
              }}
            >
              {/* Contenedor miniatura de imagen */}
              <div style={styles.imgWrapper}>
                <img 
                  src={alerta.imagen_url && alerta.imagen_url !== "NULL" ? alerta.imagen_url : imagenPorDefecto} 
                  alt={alerta.nombre_producto} 
                  style={styles.productImg}
                  onError={(e) => { e.target.src = imagenPorDefecto; }}
                />
              </div>

              {/* Contenido descriptivo técnico */}
              <div style={styles.infoWrapper}>
                <div style={styles.metaRow}>
                  <span style={styles.productCode}>SKU ID: #{alerta.producto_id}</span>
                  <span style={styles.dateText}>
                    {new Date(alerta.creado_en).toLocaleString()}
                  </span>
                </div>
                <h4 style={styles.productName}>{alerta.nombre_producto}</h4>
                <p style={styles.alertMessage}>
                  Estado crítico: Solo quedan <span style={styles.highlightStock}>{alerta.stock_registrado}</span> unidades en inventario total.
                </p>
              </div>

              {/* Indicadores y Acciones */}
              <div style={styles.actionsColumn}>
                {!alerta.leido && <span style={styles.unreadBadge}>Nueva</span>}
                <button onClick={(e) => eliminarNotificacion(alerta.id, e)} style={styles.deleteBtn}>
                  Borrar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', width: '100%', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #edf2f7', paddingBottom: '15px' },
  title: { margin: 0, fontSize: '22px', color: '#1a202c', fontFamily: 'sans-serif' },
  subtitle: { margin: '4px 0 0 0', fontSize: '13px', color: '#718096', fontFamily: 'sans-serif' },
  actionBtn: { backgroundColor: '#2d3748', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' },
  tabsContainer: { display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0' },
  tab: { background: 'none', border: 'none', padding: '10px 5px', cursor: 'pointer', fontSize: '14px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', boxSizing: 'border-box' },
  imgWrapper: { backgroundColor: '#f7fafc', border: '1px solid #edf2f7', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  productImg: { width: '55px', height: '55px', objectFit: 'cover' },
  infoWrapper: { flex: 1, minWidth: 0 },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  productCode: { fontSize: '11px', color: '#a0aec0', fontWeight: '600' },
  dateText: { fontSize: '11px', color: '#a0aec0' },
  productName: { margin: 0, fontSize: '15px', color: '#2d3748', fontWeight: '600', fontFamily: 'sans-serif' },
  alertMessage: { margin: '4px 0 0 0', fontSize: '13px', color: '#e53e3e', fontFamily: 'sans-serif' },
  highlightStock: { fontWeight: 'bold' },
  actionsColumn: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 },
  unreadBadge: { backgroundColor: '#f2a900', color: '#1a202c', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' },
  deleteBtn: { background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' },
  emptyState: { padding: '40px', color: '#a0aec0', fontSize: '14px', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '6px', backgroundColor: '#f7fafc', fontFamily: 'sans-serif' }
};