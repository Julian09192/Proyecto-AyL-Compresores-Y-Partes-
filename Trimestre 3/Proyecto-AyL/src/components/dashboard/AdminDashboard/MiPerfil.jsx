const PERFIL = {
  nombre:   "Administrador",
  email:    "admin@alcompresores.com",
  rol:      "Administrador",
  telefono: "+57 300 000 0000",
  empresa:  "A&L Compresores y Partes",
  desde:    "2024-01-01T00:00:00.000Z",
};

const ACTIVIDAD = [
  { accion: "Inicio de sesión",                              fecha: "2024-12-20 10:30:00", ip: "192.168.1.100" },
  { accion: "Producto agregado: Compresor Atlas Copco GA30", fecha: "2024-12-20 09:15:00", ip: "192.168.1.100" },
  { accion: "Movimiento de stock registrado",                fecha: "2024-12-19 16:45:00", ip: "192.168.1.100" },
  { accion: "Reporte generado: Stock por categorías",        fecha: "2024-12-19 14:20:00", ip: "192.168.1.100" },
  { accion: "Inicio de sesión",                              fecha: "2024-12-19 08:00:00", ip: "192.168.1.100" },
];

function MiPerfil() {
  return (
    <div className="p-4">

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "1.3rem" }}>Mi Perfil</h1>
          <p className="text-secondary mb-0" style={{ fontSize: "0.88rem" }}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <button
          className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2"
        >
          <i className="bi bi-door-open"></i> Cerrar Sesión
        </button>
      </div>

      <div className="row g-4">

        {/* Columna izquierda */}
        <div className="col-lg-8 d-flex flex-column gap-4">

          {/* Tarjeta: Información Personal */}
          <div className="bg-white rounded-3 border p-4">

            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
                  <i className="bi bi-person"></i> Información Personal
                </h2>
                <p className="text-secondary mb-0" style={{ fontSize: "0.82rem" }}>
                  Actualiza tu información de perfil
                </p>
              </div>
              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                <i className="bi bi-pencil"></i> Editar
              </button>
            </div>

            {/* Avatar + nombre */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                style={{ width: 56, height: 56, background: "#F5A623", fontSize: "1.4rem", flexShrink: 0 }}
              >
                A
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1rem" }}>{PERFIL.nombre}</div>
                <div className="text-secondary" style={{ fontSize: "0.82rem" }}>{PERFIL.email}</div>
                <span
                  className="text-white rounded-pill px-2 mt-1 d-inline-block"
                  style={{ background: "#F5A623", fontSize: "0.72rem", fontWeight: 700 }}
                >
                  {PERFIL.rol}
                </span>
              </div>
            </div>

            {/* Campos en grid */}
            <div className="row g-3">
              {[
                { label: "Nombre Completo",   valor: PERFIL.nombre   },
                { label: "Correo Electrónico",valor: PERFIL.email    },
                { label: "Rol del Usuario",   valor: PERFIL.rol      },
                { label: "Fecha de Creación", valor: PERFIL.desde    },
              ].map((campo) => (
                <div key={campo.label} className="col-md-6">
                  <label className="form-label text-secondary fw-medium" style={{ fontSize: "0.82rem" }}>
                    {campo.label}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-light border"
                    value={campo.valor}
                    readOnly
                    style={{ fontSize: "0.88rem" }}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Tarjeta: Configuración de Seguridad */}
          <div className="bg-white rounded-3 border p-4">
            <h2 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
              <i className="bi bi-shield-lock"></i> Configuración de Seguridad
            </h2>
            <p className="text-secondary mb-4" style={{ fontSize: "0.82rem" }}>
              Gestiona la seguridad de tu cuenta
            </p>

            {/* Contraseña */}
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <div>
                <div className="fw-semibold" style={{ fontSize: "0.92rem" }}>Contraseña</div>
                <div className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Última actualización: Hace 30 días
                </div>
              </div>
              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                <i className="bi bi-key"></i> Cambiar Contraseña
              </button>
            </div>

            {/* Info de sesión */}
            <div>
              <div className="fw-semibold mb-3" style={{ fontSize: "0.92rem" }}>Información de Sesión</div>
              <div className="row g-2">
                {[
                  { label: "Último acceso:",  valor: "2024-12-20 10:30:00" },
                  { label: "IP Address:",     valor: "192.168.1.100"       },
                  { label: "Navegador:",      valor: "Chrome 120.0.0.0"    },
                  { label: "Sistema:",        valor: "Windows 11"          },
                ].map((info) => (
                  <div key={info.label} className="col-md-6">
                    <div className="text-secondary" style={{ fontSize: "0.8rem" }}>{info.label}</div>
                    <div className="fw-semibold" style={{ fontSize: "0.88rem" }}>{info.valor}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Columna derecha: Actividad Reciente */}
        <div className="col-lg-4">
          <div className="bg-white rounded-3 border p-4 h-100">
            <h2 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
              <i className="bi bi-clock-history"></i> Actividad Reciente
            </h2>
            <p className="text-secondary mb-4" style={{ fontSize: "0.82rem" }}>
              Registro de actividades en el sistema
            </p>

            <div className="d-flex flex-column gap-3">
              {ACTIVIDAD.map((act, i) => (
                <div key={i} className="d-flex gap-3">
                  {/* Punto naranja */}
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="rounded-circle"
                      style={{ width: 10, height: 10, background: "#F5A623", marginTop: 4 }}
                    />
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>{act.accion}</div>
                    <div className="text-secondary" style={{ fontSize: "0.75rem" }}>{act.fecha}</div>
                    <div className="text-secondary" style={{ fontSize: "0.75rem" }}>IP: {act.ip}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default MiPerfil;