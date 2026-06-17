import { useState, useEffect, useMemo } from 'react';

export default function Bitacora() {
  const [bitacora, setBitacora] = useState([]);
  const [bitacoraFiltrada, setBitacoraFiltrada] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState('TODOS'); // TODOS, INSERT, UPDATE, ESTADOS

  const cargarBitacora = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/bitacora');
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setBitacora(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener la bitácora:', err.message || err);
      setError('No se pudieron obtener los datos de la bitácora. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // Carga automática al montar el componente
  useEffect(() => {
    cargarBitacora();
  }, []);

  // 2. Efecto único para manejar el filtrado reactivo y evitar ejecuciones dobles
  useEffect(() => {
    if (filtroActivo === 'TODOS') {
      setBitacoraFiltrada(bitacora);
    } else if (filtroActivo === 'ESTADOS') {
      setBitacoraFiltrada(bitacora.filter(item => item.accion === 'SUSPENDIDO' || item.accion === 'REACTIVADO'));
    } else {
      setBitacoraFiltrada(bitacora.filter(item => item.accion === filtroActivo));
    }
  }, [bitacora, filtroActivo]);

  // Contadores optimizados en memoria mediante useMemo
  const contadores = useMemo(() => {
    return {
      todos: bitacora.length,
      insert: bitacora.filter(i => i.accion === 'INSERT').length,
      update: bitacora.filter(i => i.accion === 'UPDATE').length,
      estados: bitacora.filter(i => i.accion === 'SUSPENDIDO' || i.accion === 'REACTIVADO').length,
    };
  }, [bitacora]);

  // Formateador de fecha con formato regional colombiano
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '---';
    return new Date(fechaString).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Estilos de insignias actualizados a estándares sutiles de Bootstrap 5
  const obtenerEstiloBadge = (accion) => {
    switch (accion) {
      case 'INSERT': return 'bg-success-subtle text-success border border-success-subtle';
      case 'UPDATE': return 'bg-warning-subtle text-dark border border-warning-subtle';
      case 'SUSPENDIDO': return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'REACTIVADO': return 'bg-info-subtle text-info-emphasis border border-info-subtle';
      default: return 'bg-secondary-subtle text-secondary';
    }
  };

  // 3. Renderizador inteligente de los detalles del cambio
  const renderizarDetalles = (detalles) => {
    if (!detalles) return <span className="text-muted small">Sin detalles</span>;

    if (detalles.includes('•')) {
      const partes = detalles.split(' se modificó: ');
      const encabezado = partes[0]; 
      const cuerpoCambios = partes[1] || '';
      const listaCambios = cuerpoCambios.split('•').filter(txt => txt.trim() !== '');

      return (
        <div>
          <div className="fw-semibold text-dark small mb-1">{encabezado}</div>
          <div className="d-flex flex-wrap gap-2 mt-1">
            {listaCambios.map((cambio, index) => {
              if (cambio.includes('➔')) {
                const [campo, valores] = cambio.split(':');
                const [antes, despues] = valores.split('➔');
                return (
                  <span key={index} className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 p-2 shadow-sm my-1" style={{ fontSize: '0.75rem' }}>
                    <strong className="text-secondary">{campo.trim()}:</strong>
                    <span className="text-danger text-decoration-line-through me-1">{antes.trim()}</span>
                    <span className="text-muted">➔</span>
                    <span className="text-success fw-bold ms-1">{despues.trim()}</span>
                  </span>
                );
              }
              return (
                <span key={index} className="badge bg-light text-dark border p-2 shadow-sm my-1" style={{ fontSize: '0.75rem' }}>
                  {cambio.trim()}
                </span>
              );
            })}
          </div>
        </div>
      );
    }

    if (detalles.includes('Suspendido') || detalles.includes('sacado de catálogo')) {
      return <span className="text-danger fw-medium small"><i className="bi bi-x-circle me-1"></i>{detalles}</span>;
    }
    if (detalles.includes('Reactivado') || detalles.includes('reincorporado')) {
      return <span className="text-info-emphasis fw-medium small"><i className="bi bi-check-circle me-1"></i>{detalles}</span>;
    }

    return <span className="text-muted small">{detalles}</span>;
  };

  return (
    <div className="container-fluid px-2 px-md-4 py-4">
      
      {/* Encabezado Principal */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "1.4rem", color: "#1e293b", letterSpacing: "-0.02em" }}>Bitácora de Movimientos</h1>
          <p className="text-muted small mb-0">Historial de cambios y auditoría general del sistema</p>
        </div>

        {/* Nuevo Botón Sincronizar Amarillo Corporativo */}
        <button
          className="btn btn-warning fw-bold btn-sm d-flex align-items-center gap-2 px-3 py-2 shadow-sm text-dark"
          onClick={cargarBitacora}
          disabled={cargando}
          style={{ backgroundColor: '#F5A623', borderColor: '#F5A623' }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            fill="currentColor" 
            className={`bi bi-arrow-clockwise ${cargando ? 'spin-animation' : ''}`} 
            viewBox="0 0 16 16" 
            style={{ 
              transform: cargando ? 'rotate(360deg)' : 'none', 
              transition: 'transform 1s linear' 
            }}
          >
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
          </svg>
          <span>{cargando ? 'Actualizando...' : 'Sincronizar'}</span>
        </button>
      </div>

      {/* Botonera de Filtros con Contadores */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-2 rounded-3 shadow-sm border gap-2">
        <div className="d-flex overflow-auto pb-1 pb-md-0 gap-1 w-100" style={{ whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
          <button 
            type="button" 
            className={`btn btn-sm px-3 rounded-2 fw-medium ${filtroActivo === 'TODOS' ? 'btn-dark' : 'btn-light border text-secondary'}`}
            onClick={() => setFiltroActivo('TODOS')}
          >
            Todos <span className="badge bg-secondary ms-1">{contadores.todos}</span>
          </button>
          <button 
            type="button" 
            className={`btn btn-sm px-3 rounded-2 fw-medium ${filtroActivo === 'INSERT' ? 'btn-success text-white' : 'btn-light border text-success'}`}
            onClick={() => setFiltroActivo('INSERT')}
          >
            Creaciones <span className="badge bg-opacity-25 bg-dark ms-1">{contadores.insert}</span>
          </button>
          <button 
            type="button" 
            className={`btn btn-sm px-3 rounded-2 fw-medium ${filtroActivo === 'UPDATE' ? 'btn-warning text-dark' : 'btn-light border text-warning-emphasis'}`}
            onClick={() => setFiltroActivo('UPDATE')}
          >
            Modificaciones <span className="badge bg-opacity-10 bg-dark ms-1">{contadores.update}</span>
          </button>
          <button 
            type="button" 
            className={`btn btn-sm px-3 rounded-2 fw-medium ${filtroActivo === 'ESTADOS' ? 'btn-danger text-white' : 'btn-light border text-danger'}`}
            onClick={() => setFiltroActivo('ESTADOS')}
          >
            Estados <span className="badge bg-opacity-25 bg-dark ms-1">{contadores.estados}</span>
          </button>
        </div>
        <div className="text-muted small px-2 text-nowrap align-self-end align-self-md-center">
          Mostrando <strong>{bitacoraFiltrada.length}</strong> de <strong>{bitacora.length}</strong>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 mb-4 small shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
        </div>
      )}

      {/* Vista de Datos en pantalla Vacía */}
      {bitacoraFiltrada.length === 0 ? (
        <div className="text-center py-5 bg-white border rounded-3 shadow-sm">
          <i className="bi bi-folder-x text-muted" style={{ fontSize: '2.5rem' }}></i>
          <h5 className="text-dark fw-bold mt-2 mb-1" style={{ fontSize: '1rem' }}>No se encontraron movimientos</h5>
          <p className="text-muted small mb-0">No existen registros bajo el criterio de "{filtroActivo}".</p>
        </div>
      ) : (
        <>
          {/* VISTA ESCRITORIO */}
          <div className="card shadow-sm border rounded-3 bg-white d-none d-md-block">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-secondary" style={{ fontSize: '0.78rem', letterSpacing: '0.03em' }}>
                    <tr>
                      <th style={{ width: '60px' }} className="ps-4">ID</th>
                      <th style={{ width: '180px' }}>Fecha y Hora</th>
                      <th style={{ width: '140px' }} className="text-center">Acción</th>
                      <th>Detalles del movimiento</th>
                      <th style={{ width: '130px' }}>Módulo</th>
                      <th style={{ width: '180px' }}>Usuario</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.85rem' }}>
                    {bitacoraFiltrada.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4 text-secondary font-monospace fw-bold">#{item.id}</td>
                        <td className="text-nowrap text-dark">{formatearFecha(item.created_at)}</td>
                        <td className="text-center">
                          <span className={`badge px-2 py-1.5 rounded-2 tracking-wide fw-bold text-uppercase ${obtenerEstiloBadge(item.accion)}`} style={{ fontSize: '0.7rem' }}>
                            {item.accion}
                          </span>
                        </td>
                        <td className="py-3 pe-3">
                          {renderizarDetalles(item.detalles)}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border px-2 py-1">{item.modulo}</span>
                        </td>
                        <td className="text-muted font-monospace text-truncate" style={{ maxWidth: '180px' }} title={item.usuario_email}>
                          {item.usuario_email || 'Sistema'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* VISTA MÓVIL */}
          <div className="d-flex flex-column gap-3 d-md-none">
            {bitacoraFiltrada.map((item) => (
              <div key={item.id} className="card shadow-sm border-1 rounded-3 bg-white">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted font-monospace fw-bold small">#{item.id}</span>
                    <span className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                      {formatearFecha(item.created_at)}
                    </span>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className={`badge px-2.5 py-1 rounded-2 text-uppercase fw-bold ${obtenerEstiloBadge(item.accion)}`} style={{ fontSize: '0.68rem' }}>
                      {item.accion}
                    </span>
                    <span className="badge bg-light text-dark border px-2 py-1" style={{ fontSize: '0.7rem' }}>
                      {item.modulo}
                    </span>
                  </div>

                  <div className="p-2 bg-light bg-opacity-50 border rounded-2 mb-2">
                    {renderizarDetalles(item.detalles)}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>Ejecutado por:</span>
                    <span className="text-dark font-monospace fw-medium" style={{ fontSize: '0.75rem' }}>
                      {item.usuario_email || 'Sistema'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}