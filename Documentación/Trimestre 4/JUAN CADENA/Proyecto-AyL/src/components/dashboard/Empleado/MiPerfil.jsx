// src/components/MiPerfilEmpleado.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:3001';

function MiPerfilEmpleado() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [logsAcceso, setLogsAcceso] = useState([]);
  const [cargandoLogs, setCargandoLogs] = useState(true);

  const cargarLogs = async (email) => {
    if (!email) {
      setLogsAcceso([]);
      setCargandoLogs(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/bitacora?usuario_email=${encodeURIComponent(email)}&accion=LOGIN_EXITOSO,LOGOUT_EXITOSO&limit=3`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setLogsAcceso(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al traer logs de acceso:', err);
      setLogsAcceso([]);
    } finally {
      setCargandoLogs(false);
    }
  };

  useEffect(() => {
    const cargarPerfil = async () => {
      const almacenado = localStorage.getItem('al_usuario');
      if (!almacenado) {
        setCargandoLogs(false);
        return;
      }

      let usuarioLocal;
      try {
        usuarioLocal = JSON.parse(almacenado);
      } catch {
        localStorage.removeItem('al_usuario');
        setCargandoLogs(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/usuario/${usuarioLocal.id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const datos = await res.json();
        const datosUsuario = {
          id: usuarioLocal.id,
          email: datos.correo || usuarioLocal.email,
          nombre: datos.usuario || usuarioLocal.nombre,
          telefono: datos.num_celular || usuarioLocal.telefono || '',
          empresa: usuarioLocal.empresa || 'A&L Compresores Y Partes',
          rol: datos.rol || usuarioLocal.rol || 'empleado'
        };
        setUsuario(datosUsuario);
        setDatosEditados(datosUsuario);
        await cargarLogs(datosUsuario.email);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setCargandoLogs(false);
      }
    };

    cargarPerfil();
  }, []);

  const guardarCambios = async () => {
    try {
      const { value: passwordConfirmacion } = await Swal.fire({
        title: 'Confirmar Cambios',
        input: 'password',
        inputLabel: 'Ingresa tu contraseña actual para autorizar los cambios',
        inputPlaceholder: 'Tu contraseña',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Confirmar y Guardar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) return 'Debes ingresar tu contraseña para autorizar';
        }
      });

      if (!passwordConfirmacion) return;

      setGuardando(true);

      const actualizar = {
        usuario: datosEditados.nombre,
        num_celular: datosEditados.telefono,
        current_password: passwordConfirmacion
      };

      try {
        const res = await fetch(`${API_BASE}/usuario/${usuario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actualizar)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Error al actualizar el perfil');

        const actualizado = {
          id: data.id_usuario || usuario.id,
          email: data.correo || usuario.email,
          nombre: data.usuario || datosEditados.nombre,
          telefono: data.num_celular || datosEditados.telefono,
          empresa: datosEditados.empresa,
          rol: data.rol || usuario.rol
        };

        setUsuario(actualizado);
        setDatosEditados({ ...datosEditados, nombre: actualizado.nombre, telefono: actualizado.telefono });
        localStorage.setItem('al_usuario', JSON.stringify({
          id: actualizado.id,
          nombre: actualizado.nombre,
          email: actualizado.email,
          rol: actualizado.rol,
          avatar_url: usuario.avatar_url || null,
          empresa: actualizado.empresa
        }));

        setEditando(false);
        Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
        await cargarLogs(actualizado.email);
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
      } finally {
        setGuardando(false);
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
      setGuardando(false);
    }
  };

  const cambiarPassword = async () => {
    try {
      const { value: passwordActual } = await Swal.fire({
        title: 'Validar Identidad',
        input: 'password',
        inputLabel: 'Ingresa tu contraseña ACTUAL',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
      });

      if (!passwordActual) return;

      const { value: passwordNueva } = await Swal.fire({
        title: 'Nueva Contraseña',
        input: 'password',
        inputLabel: 'Mínimo 6 caracteres',
        showCancelButton: true,
        confirmButtonColor: '#198754',
      });

      if (!passwordNueva) return;

      const res = await fetch(`${API_BASE}/usuario/${usuario.id}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: passwordActual, new_password: passwordNueva })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'No se pudo cambiar la contraseña');

      Swal.fire({ icon: 'success', title: 'Contraseña cambiada con éxito', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  };

  if (!usuario) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-secondary spinner-border-sm me-2" role="status"></div>
        <span className="text-muted small fw-medium">Cargando perfil de empleado...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      {/* Encabezado Principal */}
      <div className="mb-4 pb-3 border-bottom">
        <h1 className="fw-bold mb-1" style={{ fontSize: "1.4rem", color: "#1e293b", letterSpacing: "-0.02em" }}>Mi Perfil de Empleado</h1>
        <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>Gestiona tus credenciales y revisa los accesos recientes de tu cuenta.</p>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Información y Seguridad */}
        <div className="col-lg-8 d-flex flex-column gap-4">
          
          {/* Tarjeta de Información Personal */}
          <div className="card border-1 shadow-sm rounded-3 bg-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title fw-bold mb-1" style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                    <i className="bi bi-person-badge text-primary me-2"></i>Información Personal
                  </h5>
                  <p className="text-muted mb-0 small">Datos esenciales de identidad corporativa.</p>
                </div>
                {!editando ? (
                  <button onClick={() => setEditando(true)} className="btn btn-light border btn-sm px-3 fw-medium text-dark">
                    <i className="bi bi-pencil-square me-1"></i> Editar Perfil
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button onClick={guardarCambios} className="btn btn-primary btn-sm px-3 fw-semibold" disabled={guardando}>
                      {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button onClick={() => { setEditando(false); setDatosEditados(usuario); }} className="btn btn-light border btn-sm px-3" disabled={guardando}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar e Identificación Rápida */}
              <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 bg-light bg-opacity-50 border">
                <div className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm" 
                     style={{ width: 56, height: 56, background: "linear-gradient(135deg, #0d6efd, #0a58ca)", fontSize: "1.3rem" }}>
                  {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{usuario.nombre}</div>
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <i className="bi bi-envelope"></i> {usuario.email}
                  </div>
                  <span className="badge bg-dark bg-opacity-10 text-dark border mt-1 px-2 py-1 uppercase fw-semibold tracking-wider" style={{ fontSize: '0.68rem' }}>
                    {usuario.rol}
                  </span>
                </div>
              </div>

              {/* Formulario */}
              <div className="row g-3">
                {[
                  { key: "nombre", label: "Nombre Completo", type: "text", disabled: false },
                  { key: "email", label: "Correo de Administración (No Editable)", type: "email", disabled: true },
                  { key: "telefono", label: "Teléfono de Contacto", type: "text", disabled: false },
                  { key: "empresa", label: "Organización / Empresa", type: "text", disabled: false },
                ].map((campo) => (
                  <div key={campo.key} className="col-md-6">
                    <label className="form-label text-dark fw-semibold small mb-1">{campo.label}</label>
                    <input
                      type={campo.type}
                      className={`form-control form-control-sm py-2 ${editando && !campo.disabled ? 'bg-white border-primary shadow-sm' : 'bg-light text-muted'}`}
                      value={datosEditados[campo.key] || ""}
                      readOnly={!editando || campo.disabled}
                      onChange={(e) => setDatosEditados({...datosEditados, [campo.key]: e.target.value})}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tarjeta de Seguridad */}
          <div className="card border-1 shadow-sm rounded-3 bg-white">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-1" style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                <i className="bi bi-shield-lock text-dark me-2"></i>Seguridad de la Cuenta
              </h5>
              <p className="text-muted mb-3 small">Mantén tus credenciales protegidas regularmente.</p>
              
              <div className="p-3 border rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 bg-light bg-opacity-25">
                <div>
                  <div className="fw-bold text-dark small d-flex align-items-center gap-1">
                    <i className="bi bi-key-fill text-secondary"></i> Contraseña de Acceso
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>Tu contraseña está protegida y gestionada de forma local por el backend.</div>
                </div>
                <button onClick={cambiarPassword} className="btn btn-sm btn-dark px-3 py-2 fw-medium">
                  Actualizar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Bitácora de Accesos */}
        <div className="col-lg-4">
          <div className="card border-1 shadow-sm rounded-3 bg-white h-100">
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="card-title fw-bold mb-1" style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                <i className="bi bi-clock-history text-secondary me-2"></i>Accesos Recientes
              </h5>
              <p className="text-muted mb-4 small">Últimos movimientos registrados en el sistema.</p>
              
              <div className="d-flex flex-column gap-3 flex-grow-1">
                {cargandoLogs ? (
                  <div className="text-center py-4 my-auto">
                    <div className="spinner-border spinner-border-sm text-muted mb-2"></div>
                    <div className="text-muted small">Sincronizando bitácora...</div>
                  </div>
                ) : logsAcceso.length === 0 ? (
                  <div className="text-muted text-center small py-5 my-auto border border-dashed rounded-3 bg-light bg-opacity-50">
                    <i className="bi bi-hdd-stack d-block fs-3 mb-2 text-black-50"></i>
                    No hay registros de actividad guardados.
                  </div>
                ) : (
                  logsAcceso.map((log) => {
                    const esLogin = log.accion === 'LOGIN_EXITOSO';
                    return (
                      <div key={log.id} className={`border-start border-3 ps-3 py-2 rounded-end ${esLogin ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-light'}`}>
                        <div className="fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                          {esLogin ? '🟢 Sesión Iniciada' : '⚫ Sesión Cerrada'}
                        </div>
                        <div className="text-secondary my-1" style={{ fontSize: '0.78rem', lineHeight: '1.2' }}>
                          {log.detalles}
                        </div>
                        <div className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>
                          {new Date(log.created_at).toLocaleString('es-CO', { 
                            day: '2-digit', month: '2-digit', year: 'numeric', 
                            hour: '2-digit', minute: '2-digit', hour12: true 
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfilEmpleado;