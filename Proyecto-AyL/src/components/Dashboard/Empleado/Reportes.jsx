import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../../../lib/api";

const hoy = new Date().toISOString().slice(0, 10);

const Reportes = () => {
  const [filtros, setFiltros] = useState({
    tipo_reporte: "stock",
    fecha_inicio: "",
    fecha_fin: hoy,
    categoria: "todas",
    proveedor: "todos"
  });
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [filtroEstadoProducto, setFiltroEstadoProducto] = useState("todos");
  const [filtroOrdenProducto, setFiltroOrdenProducto] = useState("recientes");

  const cargarReporte = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams(
        Object.entries(filtros).filter(([, value]) => value)
      );
      const data = await apiFetch(`/queries/inventario?${params.toString()}`);
      setReporte(data);
    } catch (error) {
      console.error("Error al cargar reporte:", error.message);
      Swal.fire("Error", "No se pudo cargar el reporte", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  const categorias = useMemo(() => {
    const nombres = reporte?.categorias?.map((item) => item.categoria) || [];
    return ["todas", ...new Set(nombres)];
  }, [reporte]);

  const proveedores = useMemo(() => {
    return ["todos", ...(reporte?.proveedores || [])];
  }, [reporte]);

  const maxStock = Math.max(...(reporte?.categorias || []).map((item) => item.stock_total), 1);

  const productosFiltrados = useMemo(() => {
    return (reporte?.productos || [])
      .filter((producto) => {
        const search = busquedaProducto.toLowerCase();
        const match = producto.nombre?.toLowerCase().includes(search)
          || producto.marca?.toLowerCase().includes(search)
          || producto.codigo_interno?.toLowerCase().includes(search)
          || producto.tipo?.toLowerCase().includes(search);

        const estaSuspendido = producto.suspendido === true || producto.suspendido === 1;
        if (filtroEstadoProducto === "activos") return match && !estaSuspendido;
        if (filtroEstadoProducto === "suspendidos") return match && estaSuspendido;
        return match;
      })
      .sort((a, b) => {
        if (filtroOrdenProducto === "precio_menor") return Number(a.precio || 0) - Number(b.precio || 0);
        if (filtroOrdenProducto === "precio_mayor") return Number(b.precio || 0) - Number(a.precio || 0);
        if (filtroOrdenProducto === "stock_menor") return Number(a.stock_total || 0) - Number(b.stock_total || 0);
        if (filtroOrdenProducto === "stock_mayor") return Number(b.stock_total || 0) - Number(a.stock_total || 0);
        return Number(b.id || 0) - Number(a.id || 0);
      });
  }, [reporte, busquedaProducto, filtroEstadoProducto, filtroOrdenProducto]);

  const imprimirReporte = () => {
    window.print();
  };

  const exportarArchivo = (formato) => {
    Swal.fire({
      title: `Exportando a ${formato}...`,
      text: "Usa la opcion de impresion del navegador para guardar PDF. Excel queda pendiente de integracion.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      willOpen: () => {
        Swal.showLoading();
      }
    });
  };

  const actualizarFiltro = (campo, valor) => {
    setFiltros((actual) => ({ ...actual, [campo]: valor }));
  };

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .reporte-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .form-label-custom {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: block;
        }

        .form-select-custom, .form-input-custom {
          background-color: #f8f9fa;
          border: 1.5px solid #eee;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          color: #333;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-select-custom:focus, .form-input-custom:focus { border-color: #121212; }

        .bar-container {
          height: 300px;
          display: flex;
          align-items: flex-end;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px dashed #ddd;
          margin-bottom: 10px;
        }

        .bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
          min-width: 72px;
        }

        .bar-item {
          width: 100%;
          max-width: 80px;
          background: #008cff;
          border-radius: 4px 4px 0 0;
          transition: transform 0.3s ease, background 0.2s;
        }

        .bar-label {
          font-size: 12px;
          color: #666;
          margin-top: 12px;
          text-align: center;
          font-weight: 500;
        }

        .filtro-btn {
          border: 1.5px solid #e0e0e0;
          background: #fff;
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 13px;
          cursor: pointer;
          transition: 0.3s;
          font-weight: 500;
        }

        .filtro-btn.activo {
          background: #121212;
          color: #fff;
          border-color: #121212;
        }

        @media print {
          .no-print { display: none !important; }
          .reporte-card { border: none; box-shadow: none; }
          .bar-item { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="mb-4 no-print">
        <h3 className="fw-bold mb-1">Reportes e Informes</h3>
        <p className="text-muted small">Genera reportes detallados del inventario y movimientos</p>
      </div>

      <div className="reporte-card mb-4 no-print">
        <div className="d-flex align-items-center gap-2 mb-4">
          <h6 className="fw-bold mb-0">Configuracion del Reporte</h6>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label-custom">Tipo de Reporte</label>
            <select className="form-select-custom" value={filtros.tipo_reporte} onChange={(e) => actualizarFiltro("tipo_reporte", e.target.value)}>
              <option value="stock">Reporte de Stock</option>
              <option value="movimientos">Reporte de Movimientos</option>
              <option value="valoracion">Reporte de Valoracion</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label-custom">Fecha Desde</label>
            <input type="date" className="form-input-custom" value={filtros.fecha_inicio} onChange={(e) => actualizarFiltro("fecha_inicio", e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label-custom">Fecha Hasta</label>
            <input type="date" className="form-input-custom" value={filtros.fecha_fin} onChange={(e) => actualizarFiltro("fecha_fin", e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label-custom">Categoria</label>
            <select className="form-select-custom" value={filtros.categoria} onChange={(e) => actualizarFiltro("categoria", e.target.value)}>
              {categorias.map((cat) => <option key={cat} value={cat}>{cat === "todas" ? "Todas las categorias" : cat}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Proveedor</label>
            <select className="form-select-custom" value={filtros.proveedor} onChange={(e) => actualizarFiltro("proveedor", e.target.value)}>
              {proveedores.map((prov) => <option key={prov} value={prov}>{prov === "todos" ? "Todos los proveedores" : prov}</option>)}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top flex-wrap gap-3">
          <span className="text-muted small">
            <i className="bi bi-funnel me-1"></i> Productos: {reporte?.resumen?.total_productos || 0} | Stock: {reporte?.resumen?.stock_total || 0}
          </span>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-dark fw-bold px-3 d-flex align-items-center gap-2 small" onClick={cargarReporte} disabled={cargando}>
              <i className="bi bi-arrow-clockwise"></i> {cargando ? "Cargando..." : "Generar"}
            </button>
            <button className="btn btn-light border fw-bold px-3 d-flex align-items-center gap-2 small" onClick={() => exportarArchivo("PDF")}>
              <i className="bi bi-file-earmark-pdf"></i> Exportar PDF
            </button>
            <button className="btn btn-light border fw-bold px-3 d-flex align-items-center gap-2 small" onClick={() => exportarArchivo("Excel")}>
              <i className="bi bi-file-earmark-excel"></i> Exportar Excel
            </button>
            <button className="btn btn-warning fw-bold px-4 d-flex align-items-center gap-2" onClick={imprimirReporte}>
              <i className="bi bi-printer"></i> Imprimir
            </button>
          </div>
        </div>
      </div>

      <div className="reporte-card">
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-box-seam text-dark"></i>
              <h6 className="fw-bold mb-0">Reporte de Stock</h6>
            </div>
            <small className="text-muted">Periodo: {filtros.fecha_inicio || "inicio"} al {filtros.fecha_fin || hoy}</small>
          </div>
          <div className="text-end">
            <div className="text-muted small fw-medium">Generado: {new Date().toLocaleDateString("es-CO")}</div>
            <div className="text-muted small fw-medium">Valor inventario: ${Number(reporte?.resumen?.valor_total || 0).toLocaleString("es-CO")}</div>
          </div>
        </div>

        <div className="mt-4">
          <h6 className="fw-bold text-dark mb-1">Stock por Categoria</h6>
          <p className="text-muted small mb-4">Distribucion actual del inventario</p>

          <div className="bar-container overflow-auto">
            {(reporte?.categorias || []).length > 0 ? (
              reporte.categorias.map((item) => (
                <div key={item.categoria} className="bar-wrapper">
                  <div className="bar-item" title={`${item.stock_total} unidades`} style={{ height: `${Math.max((item.stock_total / maxStock) * 240, 12)}px` }}></div>
                  <div className="bar-label">{item.categoria}</div>
                </div>
              ))
            ) : (
              <div className="text-muted small w-100 text-center align-self-center">No hay datos para los filtros seleccionados.</div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-top">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
            <div>
              <h6 className="fw-bold text-dark mb-1">Productos del reporte</h6>
              <p className="text-muted small mb-0">Listado sin imagen para revisar valores, stock y estado.</p>
            </div>
            <input
              type="text"
              className="form-control border-0 bg-light ps-3"
              placeholder="Buscar por nombre, marca, codigo o tipo..."
              style={{ borderRadius: "12px", maxWidth: "360px", height: "42px" }}
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className="small fw-bold text-secondary me-2">Estado:</span>
            <button className={`filtro-btn ${filtroEstadoProducto === "todos" ? "activo" : ""}`} onClick={() => setFiltroEstadoProducto("todos")}>TODOS</button>
            <button className={`filtro-btn ${filtroEstadoProducto === "activos" ? "activo" : ""}`} onClick={() => setFiltroEstadoProducto("activos")}>ACTIVOS</button>
            <button className={`filtro-btn ${filtroEstadoProducto === "suspendidos" ? "activo" : ""}`} onClick={() => setFiltroEstadoProducto("suspendidos")}>SUSPENDIDOS</button>
          </div>

          <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
            <span className="small fw-bold text-secondary me-2">Orden:</span>
            <button className={`filtro-btn ${filtroOrdenProducto === "recientes" ? "activo" : ""}`} onClick={() => setFiltroOrdenProducto("recientes")}>RECIENTES</button>
            <button className={`filtro-btn ${filtroOrdenProducto === "precio_menor" ? "activo" : ""}`} onClick={() => setFiltroOrdenProducto("precio_menor")}>PRECIO MENOR</button>
            <button className={`filtro-btn ${filtroOrdenProducto === "precio_mayor" ? "activo" : ""}`} onClick={() => setFiltroOrdenProducto("precio_mayor")}>PRECIO MAYOR</button>
            <button className={`filtro-btn ${filtroOrdenProducto === "stock_menor" ? "activo" : ""}`} onClick={() => setFiltroOrdenProducto("stock_menor")}>STOCK MENOR</button>
            <button className={`filtro-btn ${filtroOrdenProducto === "stock_mayor" ? "activo" : ""}`} onClick={() => setFiltroOrdenProducto("stock_mayor")}>STOCK MAYOR</button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle border-top mb-0">
              <thead className="table-light">
                <tr className="text-secondary small text-uppercase">
                  <th>Producto</th>
                  <th>Codigo</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => {
                    const estaSuspendido = producto.suspendido === true || producto.suspendido === 1;
                    return (
                      <tr key={producto.id} className={estaSuspendido ? "table-light text-muted" : ""}>
                        <td className="fw-semibold">{producto.nombre}</td>
                        <td className="text-muted font-monospace small">{producto.codigo_interno || `REF-${producto.id}`}</td>
                        <td><span className="badge bg-light text-dark border">{producto.tipo || "Sin tipo"}</span></td>
                        <td>{producto.marca || "Sin marca"}</td>
                        <td className="text-end fw-bold text-success">${Number(producto.precio || 0).toLocaleString("es-CO")}</td>
                        <td className="text-center"><span className="badge bg-secondary">{producto.stock_total || 0} und.</span></td>
                        <td className="text-center">
                          <span className={`badge rounded-pill ${estaSuspendido ? "bg-danger-subtle text-danger border border-danger-subtle" : "bg-success-subtle text-success border border-success-subtle"}`}>
                            {estaSuspendido ? "Suspendido" : "Activo"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No hay productos con esos filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;