import compresor from "../../../assets/AdminDashboard/dashboard/Productos/compresor.jpg";
import motor from "../../../assets/AdminDashboard/dashboard/Productos/motor.jpg";
import herramienta from "../../../assets/AdminDashboard/dashboard/Productos/herramienta.jpg";
import industrial from "../../../assets/AdminDashboard/dashboard/Productos/industrial.jpg";

// 🔥 MAPEO DE IMÁGENES
const obtenerImagen = (tipo) => {
  switch (tipo) {
    case "compresor": return compresor;
    case "motor": return motor;
    case "herramienta": return herramienta;
    case "industrial": return industrial;
    default: return herramienta;
  }
};

// 🔥 DETECTOR AUTOMÁTICO
const detectarImagen = (nombre = "") => {
  const n = nombre.toLowerCase();

  if (n.includes("compresor")) return "compresor";
  if (n.includes("motor")) return "motor";
  if (n.includes("llave") || n.includes("taladro") || n.includes("herramienta")) return "herramienta";
  if (n.includes("filtro") || n.includes("valvula") || n.includes("bomba")) return "industrial";

  return "herramienta";
};

function Notificaciones({ productos }) {
  const stockBajo = productos.filter(p => p.Cantidad < 10);

  if (stockBajo.length === 0) {
    return (
      <div className="mb-4">
        <div
          className="rounded-4 p-4 d-flex align-items-center gap-3"
          style={{
            background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
            border: "1.5px solid #86efac"
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 48,
              height: 48,
              background: "#22c55e",
              flexShrink: 0
            }}
          >
            <i className="bi bi-check-lg text-white fs-5"></i>
          </div>

          <div>
            <p className="fw-bold mb-0 text-success">
              Todo el inventario está en orden
            </p>
            <small className="text-success opacity-75">
              No hay productos con stock bajo en este momento.
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4" style={{ overflow: "hidden" }}>
      <style>{`
        .notif-card {
          background: #fff;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1.5px solid #f3f4f6;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .notif-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .notif-img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .notif-badge-critico {
          background: #fee2e2;
          color: #dc2626;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .notif-badge-bajo {
          background: #fef9c3;
          color: #ca8a04;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .notif-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .notif-scroll::-webkit-scrollbar { display: none; }
        .notif-item {
          min-width: 220px;
          max-width: 220px;
        }
      `}</style>

      {/* HEADER */}
      <div
        className="rounded-4 p-3 px-4 mb-3 d-flex align-items-center justify-content-between"
        style={{
          background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
          border: "1.5px solid #fcd34d"
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 36,
              height: 36,
              background: "#f59e0b",
              flexShrink: 0
            }}
          >
            <i className="bi bi-bell-fill text-white" style={{ fontSize: 15 }}></i>
          </div>

          <div>
            <p className="fw-bold mb-0" style={{ fontSize: 15, color: "#92400e" }}>
              Alertas de Stock Bajo
            </p>
            <small style={{ color: "#b45309" }}>
              {stockBajo.filter(p => p.Cantidad < 5).length} críticos · {stockBajo.length} en total
            </small>
          </div>
        </div>

        <span
          className="fw-bold d-flex align-items-center justify-content-center"
          style={{
            width: 32,
            height: 32,
            background: "#121212",
            color: "#fff",
            borderRadius: "50%",
            fontSize: 13
          }}
        >
          {stockBajo.length}
        </span>
      </div>

      {/* CARDS */}
      <div className="notif-scroll">
        {stockBajo.map((p) => (
          <div key={p.id} className="notif-item">
            <div className="notif-card">
              
              <img
                src={obtenerImagen(detectarImagen(p.Nombre))}
                alt={p.Nombre}
                className="notif-img"
              />

              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  className="fw-bold mb-1 text-truncate"
                  style={{ fontSize: 13, color: "#111" }}
                >
                  {p.Nombre}
                </p>

                <div className="d-flex align-items-center justify-content-between gap-1">
                  <span className={p.Cantidad < 5 ? "notif-badge-critico" : "notif-badge-bajo"}>
                    {p.Cantidad < 5 ? "⚠ Crítico" : "↓ Bajo"}
                  </span>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: p.Cantidad < 5 ? "#dc2626" : "#ca8a04"
                    }}
                  >
                    {p.Cantidad} und.
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notificaciones;