import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Usuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const API_URL = "http://localhost:3001/usuarios";

  // Cargar los datos desde db.json al iniciar
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

  // Función para cambiar el rol (Uso de PATCH)
  const actualizarRol = async (id, nuevoRol) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });

      if (res.ok) {
        setListaUsuarios(listaUsuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
        Swal.fire({
          icon: "success",
          title: "Rol actualizado",
          timer: 1000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el rol", "error");
    }
  };

  // Función para eliminar usuario (Uso de DELETE)
  const eliminarUsuario = (id, nombre) => {
    Swal.fire({
      title: `¿Estás seguro?`,
      text: `Vas a eliminar permanentemente a ${nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F5A623",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (res.ok) {
            setListaUsuarios(listaUsuarios.filter((u) => u.id !== id));
            Swal.fire("Eliminado", "Usuario borrado correctamente", "success");
          }
        } catch (error) {
          Swal.fire("Error", "Hubo un problema al eliminar", "error");
        }
      }
    });
  };

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container bg-white shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Gestión de Usuarios</h2>
            <p className="text-secondary small">Administra los roles y accesos de la plataforma</p>
          </div>
          <div className="text-end">
            <span className="badge rounded-pill p-2 px-3" style={{ background: "#F5A623" }}>
              {listaUsuarios.length} Registrados
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover border-top">
            <thead>
              <tr className="text-secondary small text-uppercase">
                <th>Usuario</th>
                <th>Correo Electrónico</th>
                <th>Rol / Permisos</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {listaUsuarios.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                        style={{ width: 35, height: 35, background: "#6c757d", fontSize: "0.8rem" }}
                      >
                        {u.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-semibold">{u.nombre}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      className="form-select form-select-sm border-0 bg-light fw-bold"
                      style={{ width: "160px", color: u.rol === 'admin' ? '#F5A623' : '#495057' }}
                      value={u.rol}
                      onChange={(e) => actualizarRol(u.id, e.target.value)}
                    >
                      <option value="admin">Administrador</option>
                      <option value="empleado">Empleado</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-light text-danger border-0"
                      onClick={() => eliminarUsuario(u.id, u.nombre)}
                    >
                      <i className="bi bi-trash3-fill"></i> Eliminar
                    </button>
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