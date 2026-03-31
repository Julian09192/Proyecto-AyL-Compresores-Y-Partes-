// Datos simulados — cuando tengas backend, estos vendrán de una API
// Por ahora los "quemamos" aquí igual que hiciste en LoginModal

const STATS = [
  { label: "Total Productos",        valor: "1,247", extra: "+12%", extraLabel: "Desde el mes pasado",  icon: "⊙",  positivo: true  },
  { label: "Stock Bajo",             valor: "23",    extra: "+3",   extraLabel: "Productos con stock mínimo", icon: "⚠", positivo: false },
  { label: "Valor Total Inventario", valor: "$2,847,392", extra: "+8.2%", extraLabel: "Valor actual del inventario", icon: "$", positivo: true },
  { label: "Movimientos Hoy",        valor: "47",    extra: "+15",  extraLabel: "Entradas y salidas",    icon: "↗",  positivo: true  },
];

const STOCK_BAJO = [
  { nombre: "Compresor Atlas Copco GA30",  categoria: "Compresores",  actual: 2,  minimo: 5  },
  { nombre: "Filtro de Aire FA-500",       categoria: "Filtros",      actual: 8,  minimo: 15 },
  { nombre: "Aceite Shell Corena S4 R46",  categoria: "Lubricantes",  actual: 3,  minimo: 10 },
  { nombre: "Válvula de Seguridad 8 bar",  categoria: "Válvulas",     actual: 1,  minimo: 5  },
  { nombre: "Manguera Alta Presión 10m",   categoria: "Accesorios",   actual: 4,  minimo: 8  },
];

const MOVIMIENTOS = [
  { producto: "Compresor Ingersoll Rand SSR", usuario: "Liliana Vesga",   fecha: "2024-12-20", tipo: "Entrada", cantidad: 2  },
  { producto: "Kit de Mantenimiento KM-500",  usuario: "Carlos Rodríguez",fecha: "2024-12-20", tipo: "Salida",  cantidad: 5  },
  { producto: "Filtro Separador FS-200",      usuario: "Liliana Vesga",   fecha: "2024-12-19", tipo: "Entrada", cantidad: 20 },
  { producto: "Aceite Mobil Rarus SHC 1025",  usuario: "Luis Morales",    fecha: "2024-12-19", tipo: "Salida",  cantidad: 3  },
  { producto: "Válvula Check VC-25",          usuario: "Liliana Vesga",   fecha: "2024-12-19", tipo: "Ajuste",  cantidad: 2  },
];

function DashboardHome() {
  return (
    <div className="dash-home">

      {/* Encabezado */}
      <div className="dash-home__header">
        <h1 className="dash-home__title">Dashboard</h1>
        <p className="dash-home__subtitle">
          Bienvenido/a de vuelta, Administrador. Aquí tienes un resumen de tu inventario.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="dash-stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="dash-stat-card">
            <div className="dash-stat-card__top">
              <span className="dash-stat-card__label">{stat.label}</span>
              <span className="dash-stat-card__icon">{stat.icon}</span>
            </div>
            <div className="dash-stat-card__valor">{stat.valor}</div>
            <div className="dash-stat-card__bottom">
              <span className={`dash-badge ${stat.positivo ? "dash-badge--green" : "dash-badge--red"}`}>
                {stat.positivo ? "↑" : "↓"} {stat.extra}
              </span>
              <span className="dash-stat-card__extra-label">{stat.extraLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fila inferior: Stock Bajo + Movimientos */}
      <div className="dash-bottom-grid">

        {/* Stock Bajo */}
        <div className="dash-panel">
          <div className="dash-panel__header">
            <div>
              <h2 className="dash-panel__title">⚠ Productos con Stock Bajo</h2>
              <p className="dash-panel__subtitle">Productos que necesitan reabastecimiento urgente</p>
            </div>
          </div>
          <div className="dash-panel__body">
            {STOCK_BAJO.map((item) => {
              // Calculamos el porcentaje para la barra de progreso
              const porcentaje = Math.round((item.actual / item.minimo) * 100);
              return (
                <div key={item.nombre} className="dash-stock-row">
                  <div className="dash-stock-row__info">
                    <span className="dash-stock-row__nombre">{item.nombre}</span>
                    <span className="dash-stock-row__cat">{item.categoria}</span>
                  </div>
                  <div className="dash-stock-row__right">
                    {/* Barra de progreso */}
                    <div className="dash-progress">
                      <div
                        className="dash-progress__bar"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    <span className="dash-stock-badge">
                      {item.actual} / {item.minimo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Movimientos Recientes */}
        <div className="dash-panel">
          <div className="dash-panel__header">
            <div>
              <h2 className="dash-panel__title">📅 Movimientos Recientes</h2>
              <p className="dash-panel__subtitle">Últimas actividades del inventario</p>
            </div>
          </div>
          <div className="dash-panel__body">
            {MOVIMIENTOS.map((mov, i) => (
              <div key={i} className="dash-mov-row">
                <div className="dash-mov-row__info">
                  <span className="dash-mov-row__nombre">{mov.producto}</span>
                  <span className="dash-mov-row__meta">{mov.usuario} • {mov.fecha}</span>
                </div>
                <span className={`dash-mov-badge dash-mov-badge--${mov.tipo.toLowerCase()}`}>
                  {mov.tipo} {mov.cantidad}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;
