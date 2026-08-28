import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";

function Usuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("todos"); // "todos", "admin", "empleado", "cliente", "deshabilitados"
  const API_URL = "http://localhost:3001/usuarios";

  // Cargar los datos desde MySQL al iniciar
  const obtenerUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}?t=${Date.now()}`);
      const data = await res.json();
      setListaUsuarios(Array.isArray(data) ? [...data] : []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudo conectar con la base de datos", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Función para cambiar el rol (Uso de PUT como en productos)
  const actualizarRol = async (id_usuario, nuevoRol) => {
    try {
      const res = await fetch(`${API_URL}/${id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });

      if (res.ok) {
        await obtenerUsuarios();
        Swal.fire({
          icon: "success",
          title: "Rol actualizado",
          timer: 1000,
          showConfirmButton: false,
          toast: true,
          position: "top-end"
        });
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el rol", "error");
    }
  };

  // Función idéntica a alternarEstadoProducto pero mapeada para Usuarios
  const alternarEstadoUsuario = async (id_usuario, estaSuspendido) => {
    const res = await Swal.fire({
      title: estaSuspendido ? "¿Reactivar?" : "¿Suspender?",
      text: estaSuspendido ? "El usuario volverá a tener acceso al sistema." : "El usuario ya no podrá iniciar sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#121212",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });

    if (res.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/${id_usuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ suspendido: !estaSuspendido ? 1 : 0 })
        });

        if (!response.ok) throw new Error("Error en servidor");

        await obtenerUsuarios();
        Swal.fire({ title: "Actualizado", icon: "success", timer: 1000, showConfirmButton: false });
      } catch (err) {
        Swal.fire("Error", "No se pudo actualizar el estado", "error");
      }
    }
  };

  // Filtrados usando useMemo igual que en el apartado de Productos
  const filtrados = useMemo(() => {
    return listaUsuarios
      .filter((u) => {
        const search = busqueda.toLowerCase();
        const match = u.usuario?.toLowerCase().includes(search) || u.correo?.toLowerCase().includes(search);
        
        if (orden === "deshabilitados") return match && u.suspendido === 1;
        if (orden === "todos") return match;
        // Filtros opcionales por roles específicos si haces clic en los botones
        if (["admin", "empleado", "cliente"].includes(orden)) return match && u.rol === orden && u.suspendido === 0;
        
        return match && u.suspendido === 0;
      });
  }, [listaUsuarios, busqueda, orden]);

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <style>{`
        .usuario-suspendido { opacity: 0.5; filter: grayscale(1); }
        .filtro-btn { border: 1.5px solid #e0e0e0; background: #fff; border-radius: 20px; padding: 6px 16px; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .filtro-btn.activo { background: #121212; color: #fff; border-color: #121212; }
      `}</style>

      <div className="container bg-white shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-0">Gestión de Usuarios</h2>
            <p className="text-secondary small mb-0">Administra los roles y accesos de la plataforma en MySQL</p>
          </div>
          <div className="d-flex align-items-stretch gap-2" style={{ height: "45px" }}>
            <input
              type="text"
              className="form-control border-0 bg-light h-100 ps-3"
              placeholder="Buscar por usuario o correo..."
              style={{ borderRadius: "12px", minWidth: "250px" }}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="badge rounded-pill p-3 d-flex align-items-center" style={{ background: "#F5A623" }}>
              {listaUsuarios.length} Registrados
            </span>
          </div>
        </div>

        {/* Botonera de filtros idéntica a Productos */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {["todos", "admin", "empleado", "cliente", "deshabilitados"].map(o => (
            <button key={o} className={`filtro-btn ${orden === o ? 'activo' : ''}`} onClick={() => setOrden(o)}>
              {o.toUpperCase()}
            </button>
          ))}
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
              {filtrados.length > 0 ? (
                filtrados.map((u) => (
                  <tr key={u.id_usuario} className={u.suspendido === 1 ? "usuario-suspendido" : ""}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                          style={{ width: 35, height: 35, background: u.suspendido === 1 ? "#dc3545" : "#6c757d", fontSize: "0.8rem" }}
                        >
                          {u.usuario ? u.usuario.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <span className="fw-semibold d-block">{u.usuario}</span>
                          {u.suspendido === 1 && <span className="text-danger extra-small fw-bold" style={{ fontSize: "11px" }}>SUSPENDIDO</span>}
                        </div>
                      </div>
                    </td>
                    <td>{u.correo}</td>
                    <td>
                      <select 
                        className="form-select form-select-sm border-0 bg-light fw-bold"
                        style={{ width: "160px", color: u.rol === 'admin' ? '#F5A623' : '#495057' }}
                        value={u.rol}
                        disabled={u.suspendido === 1}
                        onChange={(e) => actualizarRol(u.id_usuario, e.target.value)}
                      >
                        <option value="admin">Administrador</option>
                        <option value="empleado">Empleado</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </td>
                    <td className="text-center">
                      <button 
                        className={`btn btn-sm ${u.suspendido === 1 ? 'btn-dark' : 'btn-outline-secondary'} border-0`}
                        onClick={() => alternarEstadoUsuario(u.id_usuario, u.suspendido === 1)}
                      >
                        Estado
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">No se encontraron usuarios con esos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;