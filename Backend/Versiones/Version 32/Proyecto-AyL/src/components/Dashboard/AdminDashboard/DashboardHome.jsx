import { useEffect, useState } from "react";

function DashboardHome() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMetrico, setFiltroMetrico] = useState("todos"); // "todos", "activos", "critico"
  const [busqueda, setBusqueda] = useState("");

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch("http://localhost:3001/api/productos"); 
      if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
      const data = await respuesta.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ── CÁLCULO DE MÉTRICAS GLOBALES (Sobre todo el inventario real) ──
  const totalProductos = productos.length;
  
  const totalStock = productos.reduce(
    (acc, p) => acc + (!p.suspendido ? Number(p.stock_total || 0) : 0), 0
  );

  const valorInventario = productos.reduce(
    (acc, p) => acc + (!p.suspendido ? Number(p.precio || 0) * Number(p.stock_total || 0) : 0), 0
  );

  const bajoStock = productos.filter(
    (p) => !p.suspendido && Number(p.stock_total || 0) < 10
  ).length;

  // ── PROCESAMIENTO: ORDENAR POR ÚLTIMOS AGREGADOS Y LIMITAR A 10 ──
  const ultimosProductos = [...productos]
    .sort((a, b) => {
      // Intenta ordenar por fecha de creación, si no existe usa el ID descendente
      if (a.created_at && b.created_at) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return b.id - a.id; 
    })
    .slice(0, 10); // <--- Aquí garantizamos que nunca pasen más de 10 al render

  // ── FILTRADO OPERATIVO SOBRE LOS 10 SELECCIONADOS ──
  const productosFiltrados = ultimosProductos.filter(p => {
    const search = busqueda.toLowerCase().trim();
    const coincideBusqueda = 
      (p.nombre?.toLowerCase() || "").includes(search) || 
      (p.marca?.toLowerCase() || "").includes(search) ||
      (p.codigo_interno?.toLowerCase() || "").includes(search);
    
    if (!coincideBusqueda) return false;

    if (filtroMetrico === "critico") {
      return !p.suspendido && Number(p.stock_total || 0) < 10;
    }
    if (filtroMetrico === "activos") {
      return !p.suspendido;
    }
    return true;
  });

  return (
    <div className="p-1" style={{ background: "#f8f9fb" }}>
      <style>{`
        .card-metric {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .card-metric:hover {
          border-color: #121212;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .card-metric.active-filter {
          border-color: #F5A623;
          background: #fafafa;
        }
        .metric-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #121212;
        }
        .icon-box-dark {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          background-color: #121212;
          color: #ffffff;
        }
        .card-metric.active-filter .icon-box-dark {
          background-color: #F5A623;
          color: #121212;
        }
        .table-container-clean {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .badge-status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
        }
        .badge-optimo {
          background-color: #f1f5f9;
          color: #121212;
          border: 1px solid #cbd5e1;
        }
        .badge-critico {
          background-color: #121212;
          color: #F5A623;
          border: 1px solid #121212;
        }
        .badge-suspendido {
          background-color: #ffffff;
          color: #94a3b8;
          border: 1px solid #e2e8f0;
        }
      `}</style>

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Panel de Control</h4>
          <span className="text-muted small">Últimas novedades del inventario y estado global</span>
        </div>

        <button 
          className="btn btn-sm btn-dark d-flex align-items-center gap-2 px-3 py-2 fw-semibold" 
          style={{ backgroundColor: "#121212", borderColor: "#121212" }}
          onClick={obtenerProductos}
        >
          <i className="bi bi-arrow-clockwise"></i>
          Sincronizar
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#121212", width: "2.5rem", height: "2.5rem" }}></div>
          <p className="text-muted mt-3 small">Sincronizando registros...</p>
        </div>
      ) : (
        <>
          {/* TARJETAS MÉTRICAS INTERACTIVAS */}
          <div className="row g-3 mb-4">
            <div className="col-md-3" onClick={() => setFiltroMetrico("todos")}>
              <div className={`card-metric h-100 ${filtroMetrico === "todos" ? "active-filter" : ""}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="metric-label">Catálogo General</span>
                    <div className="metric-value mt-1">{totalProductos}</div>
                  </div>
                  <div className="icon-box-dark">
                    <i className="bi bi-box-seam"></i>
                  </div>
                </div>
                <div className="text-muted small mt-2" style={{ fontSize: "0.8rem" }}>Items totales en sistema</div>
              </div>
            </div>

            <div className="col-md-3" onClick={() => setFiltroMetrico("activos")}>
              <div className={`card-metric h-100 ${filtroMetrico === "activos" ? "active-filter" : ""}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="metric-label">Unidades Disponibles</span>
                    <div className="metric-value mt-1">{totalStock}</div>
                  </div>
                  <div className="icon-box-dark">
                    <i className="bi bi-layers"></i>
                  </div>
                </div>
                <div className="text-muted small mt-2" style={{ fontSize: "0.8rem" }}>Excluye suspendidos</div>
              </div>
            </div>

            <div className="col-md-3" style={{ cursor: "default" }}>
              <div className="card-metric h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="metric-label">Valor del Inventario</span>
                    <div className="metric-value mt-1" style={{ fontSize: "1.55rem", paddingTop: "5px" }}>
                      ${valorInventario.toLocaleString('es-CO')}
                    </div>
                  </div>
                  <div className="icon-box-dark">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>
                <div className="text-muted small mt-2" style={{ fontSize: "0.8rem" }}>Valoración total COP</div>
              </div>
            </div>

            <div className="col-md-3" onClick={() => setFiltroMetrico("critico")}>
              <div className={`card-metric h-100 ${filtroMetrico === "critico" ? "active-filter" : ""}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="metric-label">Alertas de Stock</span>
                    <div className="metric-value mt-1" style={{ color: bajoStock > 0 ? "#F5A623" : "#121212" }}>
                      {bajoStock}
                    </div>
                  </div>
                  <div className="icon-box-dark" style={{ backgroundColor: bajoStock > 0 ? "#F5A623" : "#121212", color: bajoStock > 0 ? "#121212" : "#ffffff" }}>
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                </div>
                <div className="text-muted small mt-2" style={{ fontSize: "0.8rem" }}>Menos de 10 unidades</div>
              </div>
            </div>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <div className="table-container-clean shadow-sm p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: "1.05rem" }}>
                  Últimos 10 productos agregados
                  {filtroMetrico === "critico" && " (Filtrado: Stock Crítico)"}
                  {filtroMetrico === "activos" && " (Filtrado: Operativos)"}
                </h5>
                <span className="text-muted small">Mostrando {productosFiltrados.length} resultados recientes</span>
              </div>
              
              {/* BUSCADOR */}
              <div className="position-relative" style={{ minWidth: "300px" }}>
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ fontSize: "0.85rem" }}></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-2 ps-5 border"
                  placeholder="Buscar en los últimos registros..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ height: "38px", borderColor: "#cbd5e1" }}
                />
              </div>
            </div>

            {productosFiltrados.length === 0 ? (
              <div className="text-center py-5 rounded-3 bg-light border border-dashed">
                <p className="text-secondary small mb-0 fw-medium">No hay coincidencias recientes para este filtro o término.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light text-secondary" style={{ fontSize: "0.8rem" }}>
                    <tr>
                      <th className="border-0 ps-3 text-uppercase">Descripción</th>
                      <th className="border-0 text-uppercase">Referencia</th>
                      <th className="border-0 text-uppercase">Precio Unitario</th>
                      <th className="border-0 text-uppercase">Existencia</th>
                      <th className="border-0 pe-3 text-end text-uppercase">Condición</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((p) => {
                      const esCritico = Number(p.stock_total || 0) < 10 && !p.suspendido;
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td className="ps-3">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={p.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"}
                                alt={p.nombre}
                                className="rounded border"
                                style={{ width: "40px", height: "40px", objectFit: "contain", background: "#fff" }}
                              />
                              <div>
                                <span className="fw-semibold text-dark d-block" style={{ fontSize: "0.875rem" }}>{p.nombre}</span>
                                <span className="text-muted" style={{ fontSize: "0.75rem" }}>{p.marca || p.tipo || "Compresores"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-secondary font-monospace small">{p.codigo_interno || "REF-"+p.id}</td>
                          <td className="text-dark fw-medium" style={{ fontSize: "0.9rem" }}>
                            ${Number(p.precio || 0).toLocaleString('es-CO')} COP
                          </td>
                          <td>
                            <span className={`fw-semibold ${esCritico ? "text-danger fw-bold" : "text-dark"}`} style={{ fontSize: "0.9rem" }}>
                              {p.stock_total || 0} und.
                            </span>
                          </td>
                          <td className="pe-3 text-end">
                            {p.suspendido ? (
                              <span className="badge-status badge-suspendido">
                                Suspendido
                              </span>
                            ) : esCritico ? (
                              <span className="badge-status badge-critico">
                                Stock Crítico
                              </span>
                            ) : (
                              <span className="badge-status badge-optimo">
                                Stock Disponible
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardHome;