import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../../../lib/client';

function MiPerfilAdmin({ usuario: usuarioProp }) {
  // Inicializamos el estado con los nombres de campos de tu BD
  const [datosEditados, setDatosEditados] = useState({
    nombre: usuarioProp?.nombre || '',
    num_celular: usuarioProp?.num_celular || ''
  });
  
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Sincronizar campos en cuanto usuarioProp llega
  useEffect(() => {
    if (usuarioProp) {
      setDatosEditados({
        nombre: usuarioProp.nombre || '',
        num_celular: usuarioProp.num_celular || ''
      });
    }
  }, [usuarioProp]);

  const guardarCambios = async () => {
    if (!usuarioProp?.id) return;
    
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ 
          nombre: datosEditados.nombre, 
          num_celular: datosEditados.num_celular 
        })
        .eq('id', usuarioProp.id);

      if (error) throw error;
      
      setEditando(false);
      Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la información' });
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPassword = async () => {
    const { value: newPassword } = await Swal.fire({
      title: 'Nueva Contraseña',
      input: 'password',
      inputLabel: 'Mínimo 6 caracteres',
      showCancelButton: true,
      confirmButtonColor: '#121212',
      inputValidator: (v) => (!v || v.length < 6) && 'La contraseña debe tener al menos 6 caracteres'
    });

    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) Swal.fire({ icon: 'error', title: 'Error', text: error.message });
      else Swal.fire({ icon: 'success', title: 'Contraseña cambiada', timer: 1500, showConfirmButton: false });
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h3 className="fw-bold" style={{ color: "#1e293b" }}>Mi Perfil de Administrador</h3>
      </div>

      <div className="card shadow-sm border-0 p-4 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold m-0">Información Personal</h5>
          {!editando ? (
            <button onClick={() => setEditando(true)} className="btn btn-outline-secondary btn-sm px-4">Editar</button>
          ) : (
            <div className="d-flex gap-2">
              <button onClick={guardarCambios} className="btn btn-dark btn-sm px-4" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => setEditando(false)} className="btn btn-link text-muted btn-sm">Cancelar</button>
            </div>
          )}
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label small text-uppercase fw-bold text-muted">Nombre Completo</label>
            <input className="form-control" value={datosEditados.nombre} readOnly={!editando} 
                   onChange={(e) => setDatosEditados({...datosEditados, nombre: e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-uppercase fw-bold text-muted">Correo</label>
            <input className="form-control bg-light" value={usuarioProp?.correo || 'No disponible'} disabled />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-uppercase fw-bold text-muted">Teléfono</label>
            <input className="form-control" value={datosEditados.num_celular} readOnly={!editando} 
                   onChange={(e) => setDatosEditados({...datosEditados, num_celular: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4 rounded-4 mt-4">
        <h5 className="fw-bold mb-3">Seguridad</h5>
        <button onClick={cambiarPassword} className="btn btn-dark">Actualizar Contraseña</button>
      </div>
    </div>
  );
}

export default MiPerfilAdmin;