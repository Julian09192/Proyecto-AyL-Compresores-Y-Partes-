import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../../../lib/client';

function MiPerfilAdmin({ usuario: usuarioProp }) {
  // Estado para controlar los datos reales del usuario logueado (Columnas de tu BD)
  const [datosEditados, setDatosEditados] = useState({
    id: '',
    nombre: '',
    num_celular: '',
    num_identificacion: '',
    correo: '',
    rol: 'Admin'
  });
  
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Función autónoma para traer la información real directamente desde Supabase Auth y BD
  const cargarUsuarioAutenticado = async () => {
    try {
      setCargando(true);
      
      // 1. Obtenemos el usuario activo desde la sesión local de Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) throw new Error("No hay una sesión activa de Supabase");

      // 2. Consultamos directamente tu tabla 'usuario' usando el UUID
      const { data: perfilData, error: dbError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError) throw dbError;

      if (perfilData) {
        setDatosEditados({
          id: perfilData.id || '',
          nombre: perfilData.nombre || '',
          num_celular: perfilData.num_celular || '',
          num_identificacion: perfilData.num_identificacion || '',
          correo: perfilData.correo || user.email || '', 
          rol: perfilData.rol || 'admin'
        });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error.message);
      
      // Respaldo por si falla la consulta directa
      if (usuarioProp) {
        setDatosEditados({
          id: usuarioProp.id || '',
          nombre: usuarioProp.nombre || '',
          num_celular: usuarioProp.num_celular || '',
          num_identificacion: usuarioProp.num_identificacion || '',
          correo: usuarioProp.correo || '',
          rol: usuarioProp.rol || 'Admin'
        });
      }
    } finally {
      setCargando(false);
    }
  };

  // Cargar datos al montar el componente o si cambia el prop
  useEffect(() => {
    cargarUsuarioAutenticado();
  }, [usuarioProp]);

  // Inicial para el Avatar circular dinámico
  const inicialNombre = datosEditados.nombre ? datosEditados.nombre.charAt(0).toUpperCase() : 'A';

  // Guardar cambios en Supabase (Incluyendo ID, Celular e Identificación)
  const guardarCambios = async () => {
    if (!datosEditados.id) {
      return Swal.fire({ icon: 'error', title: 'Error', text: 'ID de usuario no identificado.' });
    }
    
    if (!datosEditados.nombre.trim()) {
      return Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'El nombre completo no puede estar vacío.' });
    }

    setGuardando(true);
    try {
      const { data, error } = await supabase
        .from('usuario')
        .update({ 
          nombre: datosEditados.nombre, 
          num_celular: datosEditados.num_celular || null,
          num_identificacion: datosEditados.num_identificacion || null, // Guardamos la identificación editada
          actualizado_en: new Date().toISOString() // Columna de auditoría de tiempo
        })
        .eq('id', datosEditados.id)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setDatosEditados(prev => ({
          ...prev,
          nombre: data[0].nombre || '',
          num_celular: data[0].num_celular || '',
          num_identificacion: data[0].num_identificacion || ''
        }));
      }

      setEditando(false);
      Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error al actualizar:', error.message);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron guardar los cambios en la base de datos.' });
    } finally {
      setGuardando(false);
    }
  };

  // Cambiar contraseña usando Supabase Auth
  const cambiarPassword = async () => {
    const { value: newPassword } = await Swal.fire({
      title: 'Actualizar Contraseña',
      input: 'password',
      inputLabel: 'Digita tu nueva clave de acceso (Mínimo 6 caracteres)',
      showCancelButton: true,
      confirmButtonColor: '#F5A623',
      cancelButtonColor: '#6c757d',
      inputValidator: (v) => (!v || v.length < 6) && 'Debe contener al menos 6 caracteres'
    });

    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) Swal.fire({ icon: 'error', title: 'Error', text: error.message });
      else Swal.fire({ icon: 'success', title: 'Contraseña actualizada con éxito', timer: 1500, showConfirmButton: false });
    }
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando datos del perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-5 py-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Título */}
      <div className="mb-4">
        <h4 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.02em' }}>Configuración de Perfil</h4>
        <p className="text-muted small">Administra tus datos personales y credenciales de seguridad</p>
      </div>

      <div className="row g-4">
        
        {/* COLUMNA IZQUIERDA: Resumen */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 text-center p-4 h-100 bg-white">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm mb-3 font-monospace fw-bold text-dark"
                style={{ width: '85px', height: '85px', backgroundColor: '#F5A623', fontSize: '2.2rem' }}
              >
                {inicialNombre}
              </div>
              
              <h5 className="fw-bold text-dark mb-1 text-truncate w-100">{datosEditados.nombre || 'Administrador'}</h5>
              <span className="badge bg-dark-subtle text-dark border border-dark-subtle rounded-pill px-3 py-1.5 text-uppercase fw-bold mb-3" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                {datosEditados.rol}
              </span>
              
              <hr className="w-100 text-muted my-3 opacity-25" />
              
              <div className="w-100 text-start">
                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <i className="bi bi-envelope text-secondary"></i>
                  <span className="text-truncate">{datosEditados.correo || 'No disponible'}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-shield-lock text-secondary"></i>
                  <span>Cuenta activa protegida</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
            
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <div>
                <h5 className="fw-bold text-dark m-0">Información Personal</h5>
                <p className="text-muted small m-0 d-none d-sm-block">Actualiza los datos de contacto de tu cuenta corporativa</p>
              </div>
              
              {!editando ? (
                <button onClick={() => setEditando(true)} className="btn btn-light border btn-sm px-3 fw-semibold shadow-sm d-flex align-items-center gap-2">
                  <i className="bi bi-pencil-square"></i> Editar Perfil
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button onClick={guardarCambios} className="btn btn-dark btn-sm px-3 fw-bold shadow-sm" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button 
                    onClick={() => {
                      setEditando(false);
                      cargarUsuarioAutenticado(); // revierte los cambios restableciendo desde la BD
                    }} 
                    className="btn btn-link text-muted btn-sm text-decoration-none fw-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="row g-3">
              {/* Nombre Completo */}
              <div className="col-md-6">
                <label className="form-label small text-uppercase fw-bold text-secondary">Nombre Completo</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-person"></i></span>
                  <input 
                    className={`form-control border-start-0 ps-1 ${editando ? 'bg-white' : 'bg-light text-muted'}`} 
                    value={datosEditados.nombre} 
                    readOnly={!editando} 
                    onChange={(e) => setDatosEditados({...datosEditados, nombre: e.target.value})} 
                  />
                </div>
              </div>

              {/* Teléfono Celular */}
              <div className="col-md-6">
                <label className="form-label small text-uppercase fw-bold text-secondary">Teléfono Celular</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-phone"></i></span>
                  <input 
                    className={`form-control border-start-0 ps-1 ${editando ? 'bg-white' : 'bg-light text-muted'}`} 
                    value={datosEditados.num_celular} 
                    placeholder="Sin teléfono registrado"
                    readOnly={!editando} 
                    onChange={(e) => setDatosEditados({...datosEditados, num_celular: e.target.value})} 
                  />
                </div>
              </div>

              {/* Número de Identificación (¡Ya editable!) */}
              <div className="col-md-6">
                <label className="form-label small text-uppercase fw-bold text-secondary">Número de Identificación</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-card-text"></i></span>
                  <input 
                    className={`form-control border-start-0 ps-1 ${editando ? 'bg-white' : 'bg-light text-muted'}`} 
                    value={datosEditados.num_identificacion} 
                    placeholder="Sin documento registrado"
                    readOnly={!editando} 
                    onChange={(e) => setDatosEditados({...datosEditados, num_identificacion: e.target.value})} 
                  />
                </div>
              </div>

              {/* Correo Electrónico (Este se mantiene protegido por seguridad) */}
              <div className="col-md-6">
                <label className="form-label small text-uppercase fw-bold text-secondary">Correo Registrado</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope-check"></i></span>
                  <input className="form-control bg-light border-start-0 ps-1 text-muted" value={datosEditados.correo || 'No disponible'} disabled />
                </div>
              </div>
            </div>

          </div>

          {/* Bloque de Seguridad */}
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
              <div>
                <h6 className="fw-bold text-dark m-0">Seguridad y Credenciales</h6>
                <p className="text-muted small m-0">Para mantener la integridad, cambia tu clave periódicamente</p>
              </div>
              <button onClick={cambiarPassword} className="btn btn-outline-dark btn-sm px-4 fw-semibold shadow-sm text-nowrap">
                <i className="bi bi-key me-1"></i> Cambiar Contraseña
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MiPerfilAdmin;