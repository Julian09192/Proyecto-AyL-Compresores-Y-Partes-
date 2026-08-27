import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Usuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const rolUsuarioActual = "admin"; 
  const API_URL = "http://localhost:3001/usuarios";

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setListaUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudo conectar con la base de datos", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // --- FUNCIÓN PARA AGREGAR TRABAJADOR ---
  const agregarUsuario = async () => {
    const { value: formValues } = await mostrarModalUsuario("Registro de Personal", "Crear perfil laboral");

    if (formValues) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formValues, rol: 'empleado', activo: true }),
        });
        if (res.ok) {
          obtenerUsuarios(); 
          Swal.fire("Éxito", "Usuario registrado correctamente", "success");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo registrar", "error");
      }
    }
  };

  // --- FUNCIÓN PARA EDITAR TRABAJADOR (NUEVA) ---
  const editarUsuario = async (u) => {
    const { value: formValues } = await mostrarModalUsuario("Actualizar Datos", "Guardar cambios", u);

    if (formValues) {
      try {
        const res = await fetch(`${API_URL}/${u.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        if (res.ok) {
          obtenerUsuarios();
          Swal.fire("Actualizado", "Los datos han sido modificados", "success");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar", "error");
      }
    }
  };

  // --- MODAL REUTILIZABLE (AGREGAR/EDITAR) ---
  const mostrarModalUsuario = async (titulo, botonTexto, datos = {}) => {
    return await Swal.fire({
      title: '',
      html: `
        <div style="font-family: 'Poppins', sans-serif; max-width: 400px; margin: 0 auto; text-align: center;">
          <h2 style="font-weight: 700; color: #1a1a1a; margin-bottom: 5px;">${titulo}</h2>
          <p style="color: #6c757d; font-size: 0.9rem; margin-bottom: 30px;">Gestión de información del colaborador</p>
          
          <div style="text-align: left; margin-bottom: 20px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: #adb5bd; text-transform: uppercase; margin-left: 5px;">Datos del Perfil</label>
            <input id="swal-input-name" class="swal2-input custom-swal-input" placeholder="Nombre Completo" value="${datos.nombre || ''}">
            <input id="swal-input-id" class="swal2-input custom-swal-input" placeholder="Identificación (Cédula)" value="${datos.num_identificacion || ''}">
            <input id="swal-input-phone" class="swal2-input custom-swal-input" placeholder="Número de Celular" value="${datos.num_celular || ''}">
            <input id="swal-input-email" class="swal2-input custom-swal-input" placeholder="Correo Corporativo" value="${datos.correo || ''}">
            
            ${!datos.id ? `
            <label style="font-size: 0.75rem; font-weight: 700; color: #adb5bd; text-transform: uppercase; margin-left: 5px; margin-top: 15px; display: block;">Credenciales</label>
            <input id="swal-input-pass" type="password" class="swal2-input custom-swal-input" placeholder="Contraseña Temporal">
            <input id="swal-input-conf-pass" type="password" class="swal2-input custom-swal-input" placeholder="Confirmar Contraseña">
            ` : ''}
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: botonTexto,
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#ffc107',
      customClass: { confirmButton: 'custom-swal-confirm-btn', popup: 'custom-swal-popup' },
      preConfirm: () => {
        const nombre = document.getElementById('swal-input-name').value;
        const num_identificacion = document.getElementById('swal-input-id').value;
        const num_celular = document.getElementById('swal-input-phone').value;
        const correo = document.getElementById('swal-input-email').value;

        if (!nombre || !num_identificacion || !correo) {
          Swal.showValidationMessage('Los campos básicos son obligatorios');
          return false;
        }

        const values = { nombre, num_identificacion, num_celular, correo };

        if (!datos.id) { // Solo validar contraseña si es nuevo usuario
          const password = document.getElementById('swal-input-pass').value;
          const confPassword = document.getElementById('swal-input-conf-pass').value;
          if (password !== confPassword) {
            Swal.showValidationMessage('Las contraseñas no coinciden');
            return false;
          }
          values.password_hash = password;
        }

        return values;
      }
    });
  };

  const actualizarRol = async (id, nuevoRol) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      if (res.ok) {
        setListaUsuarios(listaUsuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
        Swal.fire({ icon: "success", title: "Rol actualizado", timer: 800, showConfirmButton: false, toast: true, position: 'top-end' });
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el rol", "error");
    }
  };

  const toggleEstadoUsuario = (id, nombre, estadoActual) => {
    const nuevoEstado = !estadoActual;
    Swal.fire({
      title: nuevoEstado ? `¿Reactivar?` : `¿Inhabilitar a ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#28a745" : "#dc3545",
      confirmButtonText: "Confirmar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id}`, { 
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: nuevoEstado }) 
          });
          if (res.ok) {
            setListaUsuarios(listaUsuarios.map(u => u.id === id ? { ...u, activo: nuevoEstado } : u));
            Swal.fire("Actualizado", "Estado modificado", "success");
          }
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema", "error");
        }
      }
    });
  };

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <style>{`
        .custom-swal-popup { border-radius: 25px !important; padding: 40px !important; }
        .custom-swal-input { width: 100% !important; margin: 8px 0 !important; border-radius: 12px !important; font-size: 0.95rem !important; padding: 15px !important; height: auto !important; box-sizing: border-box !important; }
        .custom-swal-confirm-btn { width: 100% !important; border-radius: 12px !important; padding: 15px !important; font-weight: 700 !important; text-transform: uppercase !important; color: #000 !important; margin-top: 10px !important; }
      `}</style>

      <div className="container bg-white shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="fw-bold mb-0">Gestión de Usuarios</h2>
            <p className="text-secondary small">Panel administrativo de control de personal</p>
          </div>
          <div className="text-end">
            <div className="mb-3">
              <span className="badge rounded-pill p-2 px-3 bg-dark me-2">Total: {listaUsuarios.length}</span>
              <span className="badge rounded-pill p-2 px-3 text-dark" style={{ background: "#F5A623" }}>
                Activos: {listaUsuarios.filter(u => u.activo !== false).length}
              </span>
            </div>
            {rolUsuarioActual === "admin" && (
              <button className="btn btn-success fw-bold px-4" onClick={agregarUsuario} style={{ borderRadius: "10px" }}>
                + Nuevo Registro
              </button>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover border-top align-middle">
            <thead>
              <tr className="text-secondary small text-uppercase">
                <th>Colaborador</th>
                <th>Identificación</th>
                <th>Contacto</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaUsuarios.map((u) => (
                <tr key={u.id} style={{ opacity: u.activo === false ? 0.6 : 1 }}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                        style={{ width: 35, height: 35, background: u.activo === false ? "#adb5bd" : "#6c757d", fontSize: "0.8rem" }}>
                        {u.nombre ? u.nombre.charAt(0).toUpperCase() : "?"}
                      </div>
                      <span className={u.activo === false ? "text-muted text-decoration-line-through" : "fw-semibold"}>{u.nombre}</span>
                    </div>
                  </td>
                  <td className="small">{u.num_identificacion || 'N/A'}</td>
                  <td className="small">{u.num_celular}<br/><span className="text-muted">{u.correo}</span></td>
                  <td>
                    <select 
                      disabled={u.activo === false || rolUsuarioActual !== "admin"}
                      className="form-select form-select-sm border-0 bg-light fw-bold"
                      style={{ width: "130px", color: u.rol === 'admin' ? '#F5A623' : '#495057' }}
                      value={u.rol}
                      onChange={(e) => actualizarRol(u.id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="empleado">Empleado</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge border ${u.activo === false ? 'text-danger border-danger' : 'text-success border-success'}`} style={{background: 'none'}}>
                      {u.activo === false ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <button className="btn btn-sm text-primary border-0 fw-bold" onClick={() => editarUsuario(u)}>
                        Editar
                      </button>
                      <button 
                        className={`btn btn-sm border-0 fw-bold ${u.activo === false ? 'text-success' : 'text-danger'}`}
                        onClick={() => toggleEstadoUsuario(u.id, u.nombre, u.activo !== false)}
                      >
                        {u.activo === false ? 'Reactivar' : 'Inhabilitar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;