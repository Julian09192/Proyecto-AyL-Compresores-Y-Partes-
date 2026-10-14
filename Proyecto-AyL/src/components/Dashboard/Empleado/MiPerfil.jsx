// src/components/MiPerfilEmpleado.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../../../lib/client';

function MiPerfilEmpleado() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({
    id: '',
    nombre: '',
    correo: '',
    telefono: '',
    num_identificacion: '',
    rol: 'empleado'
  });
  const [guardando, setGuardando] = useState(false);
  const [logsAcceso, setLogsAcceso] = useState([]);
  const [cargandoLogs, setCargandoLogs] = useState(true);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  // Traer logs de acceso directamente desde Supabase sin pasar por la API local
  const cargarLogsAutonomo = async (userId) => {
    try {
      setCargandoLogs(true);
      // Consultamos la tabla 'bitacoras' (o 'bitacora' según tu esquema) usando el UUID del usuario
      const { data, error } = await supabase
        .from('bitacoras') // 👈 Ajustado a plural según el error de tu consola 'public.bitacoras'
        .select('*')
        .eq('usuario_id', userId)
        .order('creado_en', { ascending: false }) // o 'created_at' si usas el estándar
        .limit(3);

      if (!error && data) {
        setLogsAcceso(data);
      } else {
        // Intento de respaldo si tu tabla se llama en singular en otra instancia
        const { data: dataSingular } = await supabase
          .from('bitacora')
          .select('*')
          .eq('usuario_id', userId)
          .limit(3);
        if (dataSingular) setLogsAcceso(dataSingular);
      }
    } catch (err) {
      console.error('Error al traer logs de acceso:', err);
    } finally {
      setCargandoLogs(false);
    }
  };

  // Cargar el perfil directamente desde la sesión activa de Supabase
  const cargarPerfilAutonomo = async () => {
    try {
      setCargandoPerfil(true);
      
      // 1. Obtener usuario de la sesión de Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("No hay sesión activa en Supabase Auth");

      // 2. Consultar los datos de la tabla 'usuario'
      const { data: perfilData, error: dbError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError) throw dbError;

      if (perfilData) {
        const datosUsuario = {
          id: perfilData.id,
          correo: perfilData.correo || user.email || '',
          nombre: perfilData.nombre || '',
          telefono: perfilData.num_celular || '',
          num_identificacion: perfilData.num_identificacion || '',
          rol: perfilData.rol || 'empleado'
        };
        
        setUsuario(datosUsuario);
        setDatosEditados(datosUsuario);
        
        // Cargar su bitácora de auditoría
        await cargarLogsAutonomo(perfilData.id);
      }
    } catch (error) {
      console.error('Error cargando perfil de empleado:', error.message);
      // Respaldo de emergencia con LocalStorage por si acaso
      const almacenado = localStorage.getItem('al_usuario');
      if (almacenado) {
        const local = JSON.parse(almacenado);
        setUsuario(local);
        setDatosEditados(local);
      }
    } finally {
      setCargandoPerfil(false);
    }
  };

  useEffect(() => {
    cargarPerfilAutonomo();
  }, []);

  // Guardar Cambios directamente en Supabase (Nombre, Teléfono y Cédula/Identificación)
  const guardarCambios = async () => {
    if (!datosEditados.nombre.trim()) {
      return Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'El nombre completo no puede estar vacío.' });
    }

    setGuardando(true);
    try {
      const { data, error } = await supabase
        .from('usuario')
        .update({
          nombre: datosEditados.nombre,
          num_celular: datosEditados.telefono || null,
          num_identificacion: datosEditados.num_identificacion || null, // 👈 Guardando identificación del empleado
          actualizado_en: new Date().toISOString()
        })
        .eq('id', usuario.id)
        .select();

      if (error) throw error;

      const actualizado = {
        ...usuario,
        nombre: datosEditados.nombre,
        telefono: datosEditados.telefono,
        num_identificacion: datosEditados.num_identificacion
      };

      setUsuario(actualizado);
      setEditando(false);
      Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
      
      // Sincronizar LocalStorage para el resto del Navbar/Layout de la app
      localStorage.setItem('al_usuario', JSON.stringify(actualizado));
      await cargarLogsAutonomo(usuario.id);

    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron guardar los cambios en Supabase.' });
    } finally {
      setGuardando(false);
    }
  };

  // Cambiar contraseña directo en Supabase Auth
  const cambiarPassword = async () => {
    const { value: newPassword } = await Swal.fire({
      title: 'Actualizar Contraseña',
      input: 'password',
      inputLabel: 'Digita tu nueva clave (Mínimo 6 caracteres)',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      inputValidator: (v) => (!v || v.length < 6) && 'Debe contener al menos 6 caracteres'
    });

    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) Swal.fire({ icon: 'error', title: 'Error', text: error.message });
      else Swal.fire({ icon: 'success', title: 'Contraseña actualizada con éxito', timer: 1500, showConfirmButton: false });
    }
  };

  if (cargandoPerfil) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
        <span className="text-muted small fw-medium">Sincronizando cuenta con Supabase...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      {/* Encabezado Principal */}
      <div className="mb-4 pb-3 border-bottom">
        <h1 className="fw-bold mb-1" style={{ fontSize: "1.4rem", color: "#1e293b", letterSpacing: "-0.02em" }}>Mi Perfil de Empleado</h1>
        <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>Gestiona tus credenciales y revisa los accesos recientes de tu cuenta corporativa.</p>
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
                  <p className="text-muted mb-0 small">Datos esenciales de identidad en el sistema.</p>
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
                  {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "E"}
                </div>
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{usuario?.nombre || 'Empleado A&L'}</div>
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <i className="bi bi-envelope"></i> {usuario?.correo}
                  </div>
                  <span className="badge bg-primary bg-opacity-10 text-primary border mt-1 px-2 py-1 text-uppercase fw-semibold" style={{ fontSize: '0.68rem' }}>
                    {usuario?.rol}
                  </span>
                </div>
              </div>

              {/* Formulario de Campos */}
              <div className="row g-3">
                {/* Nombre Completo */}
                <div className="col-md-6">
                  <label className="form-label text-dark fw-semibold small mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm py-2 ${editando ? 'bg-white border-primary shadow-sm' : 'bg-light text-muted'}`}
                    value={datosEditados.nombre}
                    readOnly={!editando}
                    onChange={(e) => setDatosEditados({...datosEditados, nombre: e.target.value})}
                  />
                </div>

                {/* Teléfono de Contacto */}
                <div className="col-md-6">
                  <label className="form-label text-dark fw-semibold small mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm py-2 ${editando ? 'bg-white border-primary shadow-sm' : 'bg-light text-muted'}`}
                    value={datosEditados.telefono}
                    placeholder="Sin teléfono registrado"
                    readOnly={!editando}
                    onChange={(e) => setDatosEditados({...datosEditados, telefono: e.target.value})}
                  />
                </div>

                {/* Número de Identificación (¡Ya Editable para Empleado!) */}
                <div className="col-md-6">
                  <label className="form-label text-dark fw-semibold small mb-1">Número de Identificación</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm py-2 ${editando ? 'bg-white border-primary shadow-sm' : 'bg-light text-muted'}`}
                    value={datosEditados.num_identificacion}
                    placeholder="Sin documento registrado"
                    readOnly={!editando}
                    onChange={(e) => setDatosEditados({...datosEditados, num_identificacion: e.target.value})}
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="col-md-6">
                  <label className="form-label text-dark fw-semibold small mb-1">Correo (No Editable)</label>
                  <input
                    type="email"
                    className="form-control form-control-sm py-2 bg-light text-muted"
                    value={datosEditados.correo}
                    disabled
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Tarjeta de Seguridad */}
          <div className="card border-1 shadow-sm rounded-3 bg-white">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-1" style={{ fontSize: "1.05rem", color: "#0f172a" }}>
                <i className="bi bi-shield-lock text-dark me-2"></i>Seguridad de la Cuenta
              </h5>
              <p className="text-muted mb-3 small">Mantén tus credenciales protegidas regularmente mediante el servidor de Supabase.</p>
              
              <div className="p-3 border rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 bg-light bg-opacity-25">
                <div>
                  <div className="fw-bold text-dark small d-flex align-items-center gap-1">
                    <i className="bi bi-key-fill text-secondary"></i> Contraseña de Acceso
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>Tu clave es encriptada y gestionada de forma externa y segura.</div>
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
              <p className="text-muted mb-4 small">Últimos movimientos registrados en auditoría.</p>
              
              <div className="d-flex flex-column gap-3 flex-grow-1">
                {cargandoLogs ? (
                  <div className="text-center py-4 my-auto">
                    <div className="spinner-border spinner-border-sm text-muted mb-2"></div>
                    <div className="text-muted small">Sincronizando bitácora...</div>
                  </div>
                ) : logsAcceso.length === 0 ? (
                  <div className="text-muted text-center small py-5 my-auto border border-dashed rounded-3 bg-light bg-opacity-50">
                    <i className="bi bi-hdd-stack d-block fs-3 mb-2 text-black-50"></i>
                    Sin registros en la tabla bitácora.
                  </div>
                ) : (
                  logsAcceso.map((log) => {
                    const esLogin = log.accion?.includes('LOGIN') || log.accion === 'UPDATE' || log.accion === 'REACTIVADO';
                    return (
                      <div key={log.id} className={`border-start border-3 ps-3 py-2 rounded-end ${esLogin ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-light'}`}>
                        <div className="fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                          {esLogin ? '🔹 ' + log.accion : '🔸 ' + log.accion}
                        </div>
                        <div className="text-secondary my-1" style={{ fontSize: '0.78rem', lineHeight: '1.2' }}>
                          {log.detalles || log.nota || 'Modificación de perfil'}
                        </div>
                        <div className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>
                          {new Date(log.creado_en || log.created_at).toLocaleString('es-CO', { 
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