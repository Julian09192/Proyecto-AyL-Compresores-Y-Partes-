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

  const agregarUsuario = async () => {
    const { value: formValues } = await mostrarModalUsuario("Registro de Personal", "CREAR PERFIL");
    if (formValues) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formValues, rol: 'empleado', activo: true }),
        });
        if (res.ok) {
          obtenerUsuarios(); 
          Swal.fire({ icon: "success", title: "Registrado", showConfirmButton: false, timer: 1500 });
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo registrar", "error");
      }
    }
  };

  const editarUsuario = async (u) => {
    const { value: formValues } = await mostrarModalUsuario("Actualizar Datos", "GUARDAR CAMBIOS", u);
    if (formValues) {
      try {
        const res = await fetch(`${API_URL}/${u.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        if (res.ok) {
          obtenerUsuarios();
          Swal.fire({ icon: "success", title: "Actualizado", showConfirmButton: false, timer: 1500 });
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar", "error");
      }
    }
  };

  const mostrarModalUsuario = async (titulo, botonTexto, datos = {}) => {
    return await Swal.fire({
      title: '',
      html: `
        <div style="font-family: 'Poppins', sans-serif; max-width: 400px; margin: 0 auto; text-align: center;">
          <h2 style="font-weight: 700; color: #212529; margin-bottom: 5px;">${titulo}</h2>
          <p style="color: #6c757d; font-size: 0.85rem; margin-bottom: 25px;">Complete la información técnica del personal</p>
          <div style="text-align: left;">
            <label style="font-size: 0.7rem; font-weight: 800; color: #adb5bd; text-transform: uppercase; letter-spacing: 1px;">Información Básica</label>
            <input id="swal-input-name" class="swal2-input custom-input" placeholder="Nombre completo" value="${datos.nombre || ''}">
            <input id="swal-input-id" class="swal2-input custom-input" placeholder="Documento de identidad" value="${datos.num_identificacion || ''}">
            <div style="margin-top: 15px;">
               <label style="font-size: 0.7rem; font-weight: 800; color: #adb5bd; text-transform: uppercase; letter-spacing: 1px;">Contacto y Acceso</label>
               <input id="swal-input-phone" class="swal2-input custom-input" placeholder="Celular" value="${datos.num_celular || ''}">
               <input id="swal-input-email" class="swal2-input custom-input" placeholder="Email corporativo" value="${datos.email || ''}">
            </div>
            ${!datos.id ? `
            <div style="margin-top: 15px;">
               <input id="swal-input-pass" type="password" class="swal2-input custom-input" placeholder="Contraseña">
               <input id="swal-input-conf-pass" type="password" class="swal2-input custom-input" placeholder="Confirmar contraseña">
            </div>
            ` : ''}
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: botonTexto,
      cancelButtonText: 'VOLVER',
      confirmButtonColor: '#212529',
      cancelButtonColor: '#dee2e6',
      customClass: { confirmButton: 'btn-confirm', cancelButton: 'btn-cancel', popup: 'modal-radius' },
      preConfirm: () => {
        const nombre = document.getElementById('swal-input-name').value;
        const num_identificacion = document.getElementById('swal-input-id').value;
        const num_celular = document.getElementById('swal-input-phone').value;
        const email = document.getElementById('swal-input-email').value;

        if (!nombre || !num_identificacion || !email) {
          Swal.showValidationMessage('Complete los campos obligatorios');
          return false;
        }

        const values = { nombre, num_identificacion, num_celular, email };
        if (!datos.id) {
          const password = document.getElementById('swal-input-pass').value;
          const conf = document.getElementById('swal-input-conf-pass').value;
          if (password !== conf) {
            Swal.showValidationMessage('Contraseñas no coinciden');
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
      }
    } catch (error) {}
  };

  const toggleEstado = (id, nombre, activo) => {
    Swal.fire({
      title: activo ? `¿Desactivar a ${nombre}?` : `¿Activar a ${nombre}?`,
      text: "Este cambio afectará el acceso al sistema",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: activo ? "#343a40" : "#F5A623",
      confirmButtonText: "SÍ, CONTINUAR"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${API_URL}/${id}`, { 
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: !activo }) 
          });
          obtenerUsuarios();
        } catch (error) {}
      }
    });
  };

  const usuariosFiltrados = listaUsuarios.filter(u => u.rol === 'admin' || u.rol === 'empleado');
  const clientesFiltrados = listaUsuarios.filter(u => u.rol === 'cliente');

  return (
    <div className="p-4" style={{ backgroundColor: "#FDFDFD", minHeight: "100vh", color: "#212529" }}>
      <style>{`
        .modal-radius { border-radius: 15px !important; }
        .custom-input { width: 100% !important; margin: 5px 0 !important; border-radius: 8px !important; font-size: 0.9rem !important; border: 1px solid #e9ecef !important; box-shadow: none !important; }
        .btn-confirm { border-radius: 8px !important; padding: 12px !important; font-weight: 600 !important; font-size: 0.8rem !important; }
        .btn-cancel { border-radius: 8px !important; padding: 12px !important; font-weight: 600 !important; font-size: 0.8rem !important; color: #6c757d !important; }
        .table-custom thead { background-color: #f8f9fa; }
        .btn-action { color: #6c757d; transition: 0.2s; text-decoration: none; border: none; background: none; }
        .btn-action:hover { color: #212529; }
        .avatar-circle { width: 32px; height: 32px; background: #212529; color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-weight: bold; font-size: 0.75rem; margin-right: 12px; }
      `}</style>

      <div className="container bg-white border border-light shadow-sm rounded-4 p-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h3 className="fw-bold m-0" style={{ letterSpacing: "-0.5px" }}>Control de Personal</h3>
            <p className="text-muted small m-0">Administración de acceso y perfiles de trabajo</p>
          </div>
          {rolUsuarioActual === "admin" && (
            <button className="btn btn-dark fw-bold py-2 px-4 shadow-sm" onClick={agregarUsuario} style={{ borderRadius: "8px", fontSize: "0.85rem" }}>
              NUEVO REGISTRO
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle table-custom">
            <thead>
              <tr className="text-muted small">
                <th className="border-0 pb-3">COLABORADOR</th>
                <th className="border-0 pb-3">IDENTIFICACIÓN</th>
                <th className="border-0 pb-3">CONTACTO</th>
                <th className="border-0 pb-3">ROL</th>
                <th className="border-0 pb-3">ESTADO</th>
                <th className="border-0 pb-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} style={{ opacity: u.activo === false ? 0.5 : 1 }}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle">{u.nombre ? u.nombre.charAt(0).toUpperCase() : "?"}</div>
                      <span className="fw-bold" style={{ color: "#343a40" }}>{u.nombre}</span>
                    </div>
                  </td>
                  <td className="text-muted small">{u.num_identificacion}</td>
                  <td className="small">
                    <div className="fw-semibold">{u.num_celular}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{u.correo}</div>
                  </td>
                  <td>
                    <select 
                      disabled={u.activo === false || rolUsuarioActual !== "admin"}
                      className="form-select form-select-sm border-0 bg-light fw-bold"
                      style={{ width: "120px", fontSize: "0.75rem", color: u.rol === 'admin' ? '#F5A623' : '#495057' }}
                      value={u.rol}
                      onChange={(e) => actualizarRol(u.id, e.target.value)}
                    >
                      <option value="admin">ADMIN</option>
                      <option value="empleado">EMPLEADO</option>
                    </select>
                  </td>
                  <td>
                    <span className="small fw-bold" style={{ color: u.activo === false ? '#adb5bd' : '#28a745' }}>
                       {u.activo === false ? '● INACTIVO' : '● ACTIVO'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-3 justify-content-center">
                      <button className="btn btn-sm btn-action p-0 fw-bold" style={{ fontSize: '0.7rem' }} onClick={() => editarUsuario(u)}>EDITAR</button>
                      <button className="btn btn-sm btn-action p-0 fw-bold" style={{ fontSize: '0.7rem', color: u.activo === false ? '#28a745' : '#dc3545' }} 
                              onClick={() => toggleEstado(u.id, u.nombre, u.activo !== false)}>
                        {u.activo === false ? 'ACTIVAR' : 'DESACTIVAR'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container bg-white border border-light shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h3 className="fw-bold m-0" style={{ letterSpacing: "-0.5px" }}>Directorio de Clientes</h3>
            <p className="text-muted small m-0">Consulta de información externa (Solo Lectura)</p>
          </div>
          <div className="text-end me-2">
               <span className="badge bg-light text-dark border rounded-1 fw-bold" style={{ fontSize: '0.7rem' }}>{clientesFiltrados.length} REGISTRADOS</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle table-custom">
            <thead>
              <tr className="text-muted small">
                <th className="border-0 pb-3">CLIENTE</th>
                <th className="border-0 pb-3">IDENTIFICACIÓN</th>
                <th className="border-0 pb-3">CONTACTO</th>
                <th className="border-0 pb-3 text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle">{c.nombre ? c.nombre.charAt(0).toUpperCase() : "?"}</div>
                      <span className="fw-bold" style={{ color: "#343a40" }}>{c.nombre}</span>
                    </div>
                  </td>
                  <td className="text-muted small">{c.num_identificacion}</td>
                  <td className="small">
                    <div className="fw-semibold">{c.num_celular}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{c.correo}</div>
                  </td>
                  <td className="text-center">
                    <span className="small fw-bold" style={{ color: c.activo === false ? '#adb5bd' : '#6c757d' }}>
                       {c.activo === false ? '● CUENTA INACTIVA' : '● CLIENTE VIGENTE'}
                    </span>
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