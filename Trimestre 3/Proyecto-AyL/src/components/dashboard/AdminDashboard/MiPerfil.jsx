import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function MiPerfilAdmin({ onLogout }) {
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
        const actualizado = await response.json();
        setUsuario(actualizado);
        localStorage.setItem("usuario", JSON.stringify(actualizado));
        setEditando(false);
        Swal.fire({ icon: 'success', title: 'Perfil de Admin actualizado', timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar el servidor' });
    }
  };

  const manejarCerrarSesion = () => {
    Swal.fire({
      title: '¿Cerrar sesión administrativa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F5A623',
      confirmButtonText: 'Cerrar Sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        if (onLogout) onLogout();
      }
    });
  };

  if (!usuario) return <div className="p-4 text-center">Cargando perfil de administrador...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "1.3rem" }}>Perfil de Administrador</h1>
          <p className="text-secondary mb-0" style={{ fontSize: "0.88rem" }}>
            Control total de tu cuenta y registros del sistema
          </p>
        </div>
        <button onClick={manejarCerrarSesion} className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2">
          <i className="bi bi-door-open"></i> Cerrar Sesión
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8 d-flex flex-column gap-4">
          <div className="bg-white rounded-3 border p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
                  <i className="bi bi-shield-check text-warning me-2"></i>Información Personal
                </h2>
                <p className="text-secondary mb-0" style={{ fontSize: "0.82rem" }}>
                  Datos de identidad del administrador
                </p>
              </div>
              {!editando ? (
                <button onClick={() => setEditando(true)} className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-pencil me-1"></i> Editar
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button onClick={guardarCambios} className="btn btn-warning btn-sm text-white fw-bold">Guardar</button>
                  <button onClick={() => setEditando(false)} className="btn btn-light btn-sm border">Cancelar</button>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
                style={{ width: 60, height: 60, background: "#F5A623", fontSize: "1.5rem" }}
              >
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.1rem" }}>{usuario.nombre}</div>
                <div className="text-secondary small">{usuario.email}</div>
                <span className="badge mt-1" style={{ background: "#F5A623" }}>{usuario.rol.toUpperCase()}</span>
              </div>
            </div>

            <div className="row g-3">
              {[
                { key: "nombre", label: "Nombre Completo" },
                { key: "email", label: "Correo de Administración" },
                { key: "telefono", label: "Teléfono Principal" },
                { key: "empresa", label: "Organización" },
              ].map((campo) => (
                <div key={campo.key} className="col-md-6">
                  <label className="form-label text-secondary fw-bold small">{campo.label}</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${editando ? 'bg-white' : 'bg-light border-0'}`}
                    value={datosEditados[campo.key] || ""}
                    readOnly={!editando}
                    onChange={(e) => setDatosEditados({...datosEditados, [campo.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3 border p-4 shadow-sm">
            <h2 className="fw-bold mb-3" style={{ fontSize: "1rem" }}>
              <i className="bi bi-lock me-2"></i>Seguridad
            </h2>
            <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold small">Contraseña Maestra</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Protegida por encriptación local</div>
              </div>
              <button className="btn btn-sm btn-dark">Actualizar</button>
            </div>
          </div>
        </div>


        <div className="col-lg-4">
          <div className="bg-white rounded-3 border p-4 h-100 shadow-sm">
            <h2 className="fw-bold mb-3" style={{ fontSize: "1rem" }}>
              <i className="bi bi-activity me-2"></i>Logs del Sistema
            </h2>
            <div className="d-flex flex-column gap-3">
              <div className="border-start border-warning border-3 ps-3 py-1">
                <div className="fw-bold small" style={{ fontSize: '0.85rem' }}>Acceso al Panel</div>
                <div className="text-muted small">Hoy, hace un momento</div>
                <div className="badge bg-light text-dark border mt-1" style={{ fontSize: '0.65rem' }}>IP: 192.168.1.1</div>
              </div>
              <div className="border-start border-secondary border-3 ps-3 py-1 opacity-75">
                <div className="fw-bold small" style={{ fontSize: '0.85rem' }}>Consulta de Inventario</div>
                <div className="text-muted small">Ayer, 18:45</div>
              </div>
              <p className="text-muted small text-center mt-4">
                <i className="bi bi-info-circle me-1"></i>
                Los logs se limpian automáticamente cada 30 días.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfilAdmin;