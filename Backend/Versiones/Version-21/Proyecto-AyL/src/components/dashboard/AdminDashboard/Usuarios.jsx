import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../../lib/client"; 

function Usuarios() {
  const [listaUsuariosData, setListaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("todos"); // "todos", "admin", "empleado", "cliente"

  // 1. Obtener datos directamente usando solo las columnas reales de tu tabla
  const obtenerUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id, nombre, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en")
        .order("creado_en", { ascending: false });

      if (error) throw error;

      setListaUsuarios(data || []);
    } catch (error) {
      console.error("Error al obtener usuarios desde Supabase:", error.message);
      Swal.fire("Error", "No se pudieron cargar los usuarios de la base de datos", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 2. Cambiar el rol de un usuario directamente en Supabase
  const actualizarRol = async (id, nuevoRol) => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({ 
          rol: nuevoRol, 
          actualizado_en: new Date() // Se pasa un objeto Date nativo compatible con timestamptz
        })
        .eq("id", id);

      if (error) throw error;

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
      console.error("Error al actualizar rol:", error.message);
      Swal.fire("Error", "No se pudo cambiar el rol", "error");
    }
  };

  // 3. Modal para editar los campos reales de la tabla
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
          .swal-form-row label { width: 130px; font-weight: bold; font-size: 14px; color: #444; }
          .swal-form-row .swal2-input { flex: 1; margin: 0; height: 38px; font-size: 14px; }
        </style>
        <div id="modal-container" style="padding-top: 10px;">
          <div class="swal-form-row">
            <label>Usuario:</label>
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
          actualizado_en: new Date()
        };
      }
    });

    if (formValues) {
      Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const { error: dbError } = await supabase
          .from("usuarios")
          .update(formValues)
          .eq("id", u.id);

        if (dbError) throw dbError;

        await obtenerUsuarios();
        Swal.fire("Éxito", "Usuario modificado correctamente.", "success");
      } catch (error) {
        console.error("Error en la edición completa:", error.message);
        Swal.fire("Error", "No se pudieron guardar los cambios", "error");
      }
    }
  };

  // 4. Filtrado reactivo en memoria adaptado a los roles existentes
  const filtrados = useMemo(() => {
    return listaUsuariosData.filter((u) => {
      const search = busqueda.toLowerCase();
      const match = u.nombre?.toLowerCase().includes(search) || u.correo?.toLowerCase().includes(search);
      
      if (orden === "todos") return match;
      if (["admin", "empleado", "cliente"].includes(orden)) return match && u.rol === orden;
      
      return match;
    });
  }, [listaUsuariosData, busqueda, orden]);

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <style>{`
        .filtro-btn { border: 1.5px solid #e0e0e0; background: #fff; border-radius: 20px; padding: 6px 16px; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .filtro-btn.activo { background: #121212; color: #fff; border-color: #121212; }
      `}</style>

      <div className="container bg-white shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-0">Gestión de Usuarios</h2>
            <p className="text-secondary small mb-0">Administra los roles y accesos de la plataforma</p>
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
              {listaUsuariosData.length} Registrados
            </span>
          </div>
        </div>

        {/* Botonera de filtros reales (sin deshabilitados) */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {["todos", "admin", "empleado", "cliente"].map(o => (
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
                filtrados.map((u) => {
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                            style={{ width: 35, height: 35, background: "#6c757d", fontSize: "0.8rem" }}
                          >
                            {u.nombre ? u.nombre.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <span className="fw-semibold d-block">{u.nombre}</span>
                          </div>
                        </div>
                      </td>
                      <td>{u.correo}</td>
                      <td>
                        <select 
                          className="form-select form-select-sm border-0 bg-light fw-bold"
                          style={{ width: "160px", color: u.rol === 'admin' ? '#F5A623' : '#495057' }}
                          value={u.rol || "cliente"}
                          onChange={(e) => actualizarRol(u.id, e.target.value)}
                        >
                          <option value="admin">Administrador</option>
                          <option value="empleado">Empleado</option>
                          <option value="cliente">Cliente</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-light border"
                          onClick={() => abrirModalEditar(u)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
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