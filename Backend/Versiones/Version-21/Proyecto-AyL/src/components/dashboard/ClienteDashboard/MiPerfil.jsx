import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function MiPerfil({ onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const datos = JSON.parse(usuarioGuardado);
      setUsuario(datos);
      setDatosEditados(datos);
    }
  }, []);

  const guardarCambios = async () => {
    try {
      const response = await fetch(`http://localhost:3001/usuarios/${usuario.id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEditados)
      });

      if (response.ok) {
        const usuarioActualizado = await response.json();
        setUsuario(usuarioActualizado);
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        setEditando(false);
        Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al guardar' });
    }
  };

  const manejarCerrarSesion = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F5A623',
      confirmButtonText: 'Sí, salir'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        if (onLogout) onLogout(); 
      }
    });
  };

  if (!usuario) return <div className="p-4">Cargando perfil...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "1.3rem" }}>Mi Perfil</h1>
          <p className="text-secondary mb-0" style={{ fontSize: "0.88rem" }}>
            Gestiona tu información de colaborador en A&L Compresores
          </p>
        </div>
        <button
          onClick={manejarCerrarSesion}
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
        >
          <i className="bi bi-door-open"></i> Cerrar Sesión
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="bg-white rounded-3 border p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
                  <i className="bi bi-person me-2"></i>Información Personal
                </h2>
              </div>
              {!editando ? (
                <button 
                  onClick={() => setEditando(true)}
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-pencil me-1"></i> Editar
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button onClick={guardarCambios} className="btn btn-success btn-sm">Guardar</button>
                  <button onClick={() => setEditando(false)} className="btn btn-light btn-sm border">Cancelar</button>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
                style={{ width: 64, height: 64, background: "#F5A623", fontSize: "1.5rem" }}
              >
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-bold fs-5">{usuario.nombre}</div>
                <div className="text-muted small">{usuario.email}</div>
                <span className="badge bg-primary mt-1 text-uppercase" style={{ fontSize: '0.65rem' }}>
                  {usuario.rol}
                </span>
              </div>
            </div>

            <div className="row g-3">
              {[
                { key: "nombre", label: "Nombre Completo" },
                { key: "email", label: "Correo Electrónico" },
                { key: "telefono", label: "Teléfono" },
                { key: "empresa", label: "Empresa / Sucursal" },
              ].map((campo) => (
                <div key={campo.key} className="col-md-6">
                  <label className="form-label text-secondary small fw-bold">{campo.label}</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${editando ? 'bg-white' : 'bg-light'}`}
                    value={datosEditados[campo.key] || ""}
                    readOnly={!editando}
                    onChange={(e) => setDatosEditados({...datosEditados, [campo.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-3 border p-4 h-100 shadow-sm">
            <h2 className="fw-bold mb-3" style={{ fontSize: "1rem" }}>
              <i className="bi bi-clock-history me-2"></i>Actividad Reciente
            </h2>
            <div className="d-flex flex-column gap-3">
              <div className="p-2 border-start border-primary border-3 bg-light rounded-end">
                <div className="fw-bold small">Último Login</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Hace unos instantes</div>
              </div>
              <p className="text-muted small text-center mt-3">Pronto: Historial completo de facturas y cargas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;