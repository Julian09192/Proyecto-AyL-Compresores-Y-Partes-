import { useEffect, useState } from "react";

const API_URL = "https://69cdf09333a09f831b7caeb6.mockapi.io/productos/productos";

function DashboardHome() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerProductos = () => {
    setCargando(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProductos(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch(() => {
        setProductos([]);
        setCargando(false);
      });
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const totalProductos = productos.length;

  const totalStock = productos.reduce(
    (acc, p) => acc + Number(p.Cantidad || 0),
    0
  );

  const valorInventario = productos.reduce(
    (acc, p) =>
      acc + Number(p.Precio || 0) * Number(p.Cantidad || 0),
    0
  );

  const bajoStock = productos.filter(
    (p) => Number(p.Cantidad) < 10
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
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-0">Dashboard</h4>
          <span className="text-muted small">Resumen del inventario</span>
        </div>

        <button className="btn btn-light border" onClick={obtenerProductos}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary"></div>
        </div>
      ) : (
        <div className="row g-3">

          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Productos</span>
                <i className="bi bi-box icon"></i>
              </div>
              <div className="value mt-2">{totalProductos}</div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Stock total</span>
                <i className="bi bi-bar-chart icon"></i>
              </div>
              <div className="value mt-2">{totalStock}</div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Valor inventario</span>
                <i className="bi bi-currency-dollar icon"></i>
              </div>
              <div className="value mt-2">
                ${valorInventario.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card-minimal">
              <div className="d-flex justify-content-between">
                <span className="label">Bajo stock</span>
                <i className="bi bi-exclamation-circle icon"></i>
              </div>
              <div className="value mt-2">
                {bajoStock}
              </div>
              <small className="text-muted">menos de 10 unidades</small>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default DashboardHome;