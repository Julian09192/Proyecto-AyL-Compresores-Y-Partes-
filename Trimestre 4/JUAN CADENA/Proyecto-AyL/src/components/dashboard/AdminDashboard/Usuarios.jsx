import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";

const API = "http://localhost:3001/usuarios";

function Usuarios() {
  const [listaUsuariosData, setListaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("todos");
  const [cargando, setCargando] = useState(true);

  // 1. Obtener usuarios desde el backend
  const obtenerUsuarios = async () => {
    setCargando(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setListaUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios de la base de datos", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 2. Cambiar rol a través del backend
  const actualizarRol = async (id, nuevoRol) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol })
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await obtenerUsuarios();
      Swal.fire({
        icon: "success",
        title: "Rol actualizado",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
      });
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      Swal.fire("Error", "No se pudo cambiar el rol", "error");
    }
  };

  // 3. Modal para editar campos del usuario
  const abrirModalEditar = async (u) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Usuario",
      width: 500,
      showCancelButton: true,
      confirmButtonColor: "#121212",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      html: `
        <style>
          .swal-form-row { display: flex; align-items: center; margin-bottom: 12px; text-align: left; }
          .swal-form-row label { width: 130px; font-weight: bold; font-size: 14px; color: #444; flex-shrink: 0; }
          .swal-form-row .swal2-input { flex: 1; margin: 0; height: 38px; font-size: 14px; }
        </style>
        <div style="padding-top: 10px;">
          <div class="swal-form-row">
            <label>Nombre:</label>
            <input id="edit-nombre" class="swal2-input" value="${u.nombre || ""}">
          </div>
          <div class="swal-form-row">
            <label>Identificación:</label>
            <input id="edit-identificacion" class="swal2-input" value="${u.num_identificacion || ""}">
          </div>
          <div class="swal-form-row">
            <label>Celular:</label>
            <input id="edit-celular" class="swal2-input" value="${u.num_celular || ""}">
          </div>
        </div>
      `,
      preConfirm: () => {
        const nombreVal = document.getElementById("edit-nombre").value.trim();
        const identificacionVal = document.getElementById("edit-identificacion").value.trim();
        const celularVal = document.getElementById("edit-celular").value.trim();

        if (!nombreVal) {
          Swal.showValidationMessage("El nombre de usuario es obligatorio");
          return false;
        }

        return {
          nombre: nombreVal,
          num_identificacion: identificacionVal || null,
          num_celular: celularVal || null,
        };
      }
    });

    if (formValues) {
      Swal.fire({ title: "Guardando...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const res = await fetch(`${API}/${u.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        await obtenerUsuarios();
        Swal.fire("Éxito", "Usuario modificado correctamente.", "success");
      } catch (error) {
        console.error("Error al editar usuario:", error);
        Swal.fire("Error", "No se pudieron guardar los cambios", "error");
      }
    }
  };

  // 4. Filtrado reactivo
  const filtrados = useMemo(() => {
    return listaUsuariosData.filter((u) => {
      const search = busqueda.toLowerCase();
      const match = u.nombre?.toLowerCase().includes(search) || u.correo?.toLowerCase().includes(search);
      if (orden === "todos") return match;
      return match && u.rol === orden;
    });
  }, [listaUsuariosData, busqueda, orden]);

  // Color de badge por rol
  const colorRol = (rol) => {
    if (rol === "admin") return { background: "#F5A623", color: "#000" };
    if (rol === "empleado") return { background: "#0d6efd", color: "#fff" };
    return { background: "#6c757d", color: "#fff" };
  };

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <style>{`
        .filtro-btn { border: 1.5px solid #e0e0e0; background: #fff; border-radius: 20px; padding: 6px 16px; font-size: 13px; cursor: pointer; transition: 0.3s; font-weight: 500; }
        .filtro-btn.activo { background: #121212; color: #fff; border-color: #121212; }
        .filtro-btn:hover:not(.activo) { background: #f1f3f5; }
        .avatar-circle { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }
        .user-row:hover { background: #fafafa; }
        .user-row td { vertical-align: middle; padding: 14px 12px; }
      `}</style>

      <div className="container-fluid">
        {/* Header */}
        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-0" style={{ color: "#121212" }}>Gestión de Usuarios</h2>
              <p className="text-secondary small mb-0">Administra los roles y accesos de la plataforma</p>
            </div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="input-group" style={{ width: 260 }}>
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Buscar usuario o correo..."
                  style={{ borderRadius: "0 12px 12px 0" }}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <span className="badge rounded-pill px-3 py-2 fs-6" style={{ background: "#F5A623", color: "#000" }}>
                {listaUsuariosData.length} <span className="fw-normal">registrados</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {["todos", "admin", "empleado", "cliente"].map(o => (
            <button
              key={o}
              className={`filtro-btn ${orden === o ? "activo" : ""}`}
              onClick={() => setOrden(o)}
            >
              {o === "todos" ? "Todos" : o.charAt(0).toUpperCase() + o.slice(1)}
              {o !== "todos" && (
                <span className="ms-2 badge rounded-pill" style={{ background: orden === o ? "#fff" : "#e9ecef", color: orden === o ? "#121212" : "#495057", fontSize: "0.65rem" }}>
                  {listaUsuariosData.filter(u => u.rol === o).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-4 shadow-sm overflow-hidden">
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-3 text-muted">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr className="text-muted small text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                    <th className="ps-4 py-3">Usuario</th>
                    <th className="py-3">Correo Electrónico</th>
                    <th className="py-3">Identificación</th>
                    <th className="py-3">Celular</th>
                    <th className="py-3">Rol / Permisos</th>
                    <th className="py-3">Registrado</th>
                    <th className="py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length > 0 ? (
                    filtrados.map((u) => (
                      <tr key={u.id} className="user-row border-top">
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="avatar-circle"
                              style={colorRol(u.rol)}
                            >
                              {u.nombre ? u.nombre.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <span className="fw-semibold d-block" style={{ fontSize: "0.9rem" }}>{u.nombre || "Sin nombre"}</span>
                              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                {u.id?.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.9rem" }}>{u.correo}</td>
                        <td style={{ fontSize: "0.9rem" }}>{u.num_identificacion || <span className="text-muted">—</span>}</td>
                        <td style={{ fontSize: "0.9rem" }}>{u.num_celular || <span className="text-muted">—</span>}</td>
                        <td>
                          <select
                            className="form-select form-select-sm border-0 fw-bold"
                            style={{
                              width: "150px",
                              background: "#f8f9fa",
                              color: u.rol === "admin" ? "#F5A623" : u.rol === "empleado" ? "#0d6efd" : "#495057",
                              borderRadius: "8px"
                            }}
                            value={u.rol || "cliente"}
                            onChange={(e) => actualizarRol(u.id, e.target.value)}
                          >
                            <option value="admin">Administrador</option>
                            <option value="empleado">Empleado</option>
                            <option value="cliente">Cliente</option>
                          </select>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                          {u.creado_en ? new Date(u.creado_en).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            style={{ borderRadius: "8px" }}
                            onClick={() => abrirModalEditar(u)}
                          >
                            <i className="bi bi-pencil-square me-1"></i> Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="bi bi-people display-4 d-block mb-2 opacity-25"></i>
                        No se encontraron usuarios con esos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Usuarios;