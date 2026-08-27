import { useEffect, useState } from "react";
// 1. Importar el cliente de Supabase



function DashboardHome() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      // 2. Cambiar fetch por consulta a Supabase
      const { data, error } = await supabase
        .from('productos')
        .select('*');
      
      if (error) throw error;
      setProductos(data || []);
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

  // 1. Total de productos (incluye suspendidos)
  const totalProductos = productos.length;

  // 2. Stock total (solo de productos activos)
  // Ajustado a: p.stock_total (minúsculas)
  const totalStock = productos.reduce(
    (acc, p) => acc + (!p.suspendido ? Number(p.stock_total || 0) : 0),
    0
  );

  // 3. Valor monetario del inventario (solo de productos activos)
  // Ajustado a: p.precio y p.stock_total (minúsculas)
  const valorInventario = productos.reduce(
    (acc, p) =>
      acc + (!p.suspendido ? Number(p.precio || 0) * Number(p.stock_total || 0) : 0),
    0
  );

  // 4. Productos con stock crítico (menos de 10 unidades, no suspendidos)
  // Ajustado a: p.stock_total
  const bajoStock = productos.filter(
    (p) => !p.suspendido && Number(p.stock_total) < 10
  ).length;

  return (
    <div className="p-4" style={{ background: "#f8f9fb", minHeight: "100vh" }}>
      <style>{`
        .card-minimal {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #eee;
          transition: 0.2s;
        }
        .card-minimal:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }
        .label {
          font-size: 13px;
          color: #888;
        }
        .value {
          font-size: 28px;
          font-weight: 600;
          color: #111;
        }
        .icon {
          font-size: 18px;
          color: #bbb;
        }
        .text-danger-custom {
          color: #dc3545;
          font-weight: bold;
        }
      `}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-0">Dashboard</h4>
          <span className="text-muted small">Resumen de operaciones en tiempo real (Supabase)</span>
        </div>

        <button className="btn btn-light border" onClick={obtenerProductos}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar datos
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary"></div>
          <p className="text-muted mt-2">Cargando inventario...</p>
        </div>
      ) : (
        <div className="row g-3">

          {/* TOTAL PRODUCTOS */}
          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Ítems Registrados</span>
                <i className="bi bi-box icon"></i>
              </div>
              <div className="value mt-2">{totalProductos}</div>
              <small className="text-muted">En base de datos</small>
            </div>
          </div>

          {/* STOCK TOTAL */}
          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Unidades en Stock</span>
                <i className="bi bi-archive icon"></i>
              </div>
              <div className="value mt-2">{totalStock}</div>
              <small className="text-muted">Solo productos activos</small>
            </div>
          </div>

          {/* VALOR INVENTARIO */}
          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Valor Total</span>
                <i className="bi bi-currency-dollar icon"></i>
              </div>
              <div className="value mt-2 text-success">
                ${valorInventario.toLocaleString()}
              </div>
              <small className="text-muted">Precio x Stock</small>
            </div>
          </div>

          {/* ALERTAS BAJO STOCK */}
          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Alertas de Stock</span>
                <i className="bi bi-exclamation-triangle icon text-warning"></i>
              </div>
              <div className={`value mt-2 ${bajoStock > 0 ? 'text-danger-custom' : ''}`}>
                {bajoStock}
              </div>
              <small className="text-muted">Menos de 10 unidades</small>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default DashboardHome;