const STATS = [
  { label: "Total Productos",        valor: "1,247",      extra: "+12%",  extraLabel: "Desde el mes pasado",        icon: "⊙", positivo: true  },
  { label: "Stock Bajo",             valor: "23",         extra: "+3",    extraLabel: "Productos con stock mínimo", icon: "⚠", positivo: false },
  { label: "Valor Total Inventario", valor: "$2,847,392", extra: "+8.2%", extraLabel: "Valor actual del inventario",icon: "$", positivo: true  },
  { label: "Movimientos Hoy",        valor: "47",         extra: "+15",   extraLabel: "Entradas y salidas",         icon: "↗", positivo: true  },
];

const STOCK_BAJO = [
  { nombre: "Compresor Atlas Copco GA30", categoria: "Compresores", actual: 2, minimo: 5  },
  { nombre: "Filtro de Aire FA-500",      categoria: "Filtros",     actual: 8, minimo: 15 },
  { nombre: "Aceite Shell Corena S4 R46", categoria: "Lubricantes", actual: 3, minimo: 10 },
  { nombre: "Válvula de Seguridad 8 bar", categoria: "Válvulas",    actual: 1, minimo: 5  },
  { nombre: "Manguera Alta Presión 10m",  categoria: "Accesorios",  actual: 4, minimo: 8  },
];

const MOVIMIENTOS = [
  { producto: "Compresor Ingersoll Rand SSR", usuario: "Liliana Vesga",    fecha: "2024-12-20", tipo: "Entrada", cantidad: 2  },
  { producto: "Kit de Mantenimiento KM-500",  usuario: "Carlos Rodríguez", fecha: "2024-12-20", tipo: "Salida",  cantidad: 5  },
  { producto: "Filtro Separador FS-200",      usuario: "Liliana Vesga",    fecha: "2024-12-19", tipo: "Entrada", cantidad: 20 },
  { producto: "Aceite Mobil Rarus SHC 1025",  usuario: "Luis Morales",     fecha: "2024-12-19", tipo: "Salida",  cantidad: 3  },
  { producto: "Válvula Check VC-25",          usuario: "Liliana Vesga",    fecha: "2024-12-19", tipo: "Ajuste",  cantidad: 2  },
];

// Colores para los badges de movimientos
const BADGE_TIPO = {
  Entrada: { bg: "#F5A623", color: "#fff" },
  Salida:  { bg: "#e9ecef", color: "#495057" },
  Ajuste:  { bg: "#e9ecef", color: "#495057" },
};

function DashboardHome() {
  return (
    <div className="p-4" style={{ maxWidth: 1200 }}>

      {/* Encabezado */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ fontSize: "1.5rem" }}>Dashboard</h1>
        <p className="text-secondary mb-0" style={{ fontSize: "0.88rem" }}>
          Bienvenido/a de vuelta, Administrador. Aquí tienes un resumen de tu inventario.
        </p>
      </div>

      {/* Tarjetas de estadísticas — 4 columnas */}
      <div className="row g-3 mb-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="col-sm-6 col-xl-3">
            <div className="bg-white rounded-3 border p-3 h-100">

              {/* Etiqueta + ícono */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-secondary" style={{ fontSize: "0.82rem" }}>
                  {stat.label}
                </span>
                <span className="text-secondary">{stat.icon}</span>
              </div>

              {/* Valor grande */}
              <div className="fw-bold mb-2" style={{ fontSize: "1.6rem" }}>
                {stat.valor}
              </div>

              {/* Badge + descripción */}
              <div className="d-flex align-items-center gap-2">
                <span
                  className="rounded-pill px-2 fw-bold"
                  style={{
                    fontSize: "0.72rem",
                    background: stat.positivo ? "#e6f9f0" : "#fdecea",
                    color:      stat.positivo ? "#198754" : "#dc3545",
                  }}
                >
                  {stat.positivo ? "↑" : "↓"} {stat.extra}
                </span>
                <span className="text-secondary" style={{ fontSize: "0.78rem" }}>
                  {stat.extraLabel}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Paneles inferiores — Stock Bajo + Movimientos */}
      <div className="row g-3">

        {/* Panel Stock Bajo */}
        <div className="col-lg-6">
          <div className="bg-white rounded-3 border overflow-hidden h-100">

            {/* Header del panel */}
            <div className="px-3 pt-3 pb-2 border-bottom">
              <h2 className="fw-bold mb-1" style={{ fontSize: "0.95rem" }}>
                ⚠ Productos con Stock Bajo
              </h2>
              <p className="text-secondary mb-0" style={{ fontSize: "0.78rem" }}>
                Productos que necesitan reabastecimiento urgente
              </p>
            </div>

            {/* Filas de stock */}
            <div>
              {STOCK_BAJO.map((item, i) => {
                const porcentaje = Math.round((item.actual / item.minimo) * 100);
                return (
                  <div
                    key={item.nombre}
                    className={`d-flex align-items-center justify-content-between px-3 py-2 gap-3 ${i < STOCK_BAJO.length - 1 ? "border-bottom" : ""}`}
                  >
                    {/* Info del producto */}
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="fw-semibold text-truncate" style={{ fontSize: "0.88rem" }}>
                        {item.nombre}
                      </div>
                      <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
                        {item.categoria}
                      </div>
                    </div>

                    {/* Barra de progreso + badge */}
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      <div
                        className="rounded-pill overflow-hidden"
                        style={{ width: 80, height: 6, background: "#e9ecef" }}
                      >
                        <div
                          className="h-100 rounded-pill"
                          style={{ width: `${porcentaje}%`, background: "#F5A623" }}
                        />
                      </div>
                      <span
                        className="text-white rounded-pill text-center fw-bold"
                        style={{
                          background: "#dc3545",
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          minWidth: 44,
                        }}
                      >
                        {item.actual} / {item.minimo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel Movimientos Recientes */}
        <div className="col-lg-6">
          <div className="bg-white rounded-3 border overflow-hidden h-100">

            {/* Header del panel */}
            <div className="px-3 pt-3 pb-2 border-bottom">
              <h2 className="fw-bold mb-1" style={{ fontSize: "0.95rem" }}>
                📅 Movimientos Recientes
              </h2>
              <p className="text-secondary mb-0" style={{ fontSize: "0.78rem" }}>
                Últimas actividades del inventario
              </p>
            </div>

            {/* Filas de movimientos */}
            <div>
              {MOVIMIENTOS.map((mov, i) => (
                <div
                  key={i}
                  className={`d-flex align-items-center justify-content-between px-3 py-2 gap-3 ${i < MOVIMIENTOS.length - 1 ? "border-bottom" : ""}`}
                >
                  {/* Info del movimiento */}
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-semibold text-truncate" style={{ fontSize: "0.88rem" }}>
                      {mov.producto}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
                      {mov.usuario} • {mov.fecha}
                    </div>
                  </div>

                  {/* Badge tipo */}
                  <span
                    className="rounded-pill fw-bold flex-shrink-0"
                    style={{
                      background: BADGE_TIPO[mov.tipo]?.bg ?? "#e9ecef",
                      color:      BADGE_TIPO[mov.tipo]?.color ?? "#495057",
                      fontSize: "0.72rem",
                      padding: "3px 10px",
                    }}
                  >
                    {mov.tipo} {mov.cantidad}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;