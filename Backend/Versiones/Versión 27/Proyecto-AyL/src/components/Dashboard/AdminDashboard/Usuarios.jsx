import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../../../lib/api";
import { supabase } from "../../../lib/client";

function Usuarios() {
  const [listausuarioData, setListausuario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("todos");
  const [usuarioActualizando, setUsuarioActualizando] = useState(null);

  const normalizarSuspendido = (valor, rol) => (
    valor === true || valor === 1 || valor === "true" || rol === "deshabilitado"
  );

  const obtenerusuario = async () => {
    try {
      const data = await apiFetch("/usuarios");
      setListausuario(Array.isArray(data) ? data : []);
    } catch (error) {
      try {
        const { data, error: supabaseError } = await supabase
          .from("usuario")
          .select("*")
          .order("nombre");

        if (supabaseError) throw supabaseError;
        setListausuario((data || []).map((u) => ({
          ...u,
          suspendido: normalizarSuspendido(u.suspendido, u.rol)
        })));
      } catch (fallbackError) {
        console.error("Error al obtener usuarios:", fallbackError.message || error.message);
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      }
    }
  };

  useEffect(() => {
    obtenerusuario();
  }, []);

  const actualizarRol = async (id, nuevoRol) => {
    try {
      await apiFetch(`/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify({ rol: nuevoRol })
      });

      await obtenerusuario();
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

  const alternarEstadoUsuario = async (u) => {
  const estaSuspendido = normalizarSuspendido(u.suspendido, u.rol);
  const nuevoEstado = !estaSuspendido;
  const accion = estaSuspendido ? "habilitar" : "deshabilitar";

  const confirmacion = await Swal.fire({
    title: `${accion.charAt(0).toUpperCase()}${accion.slice(1)} usuario`,
    text: `¿Seguro que deseas ${accion} a ${u.nombre || u.correo}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: estaSuspendido ? "#198754" : "#dc3545",
    confirmButtonText: estaSuspendido ? "Habilitar" : "Deshabilitar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmacion.isConfirmed) return;

  setUsuarioActualizando(u.id);
  try {
    // 1. Enviamos el cambio al backend
    try {
      await apiFetch(`/usuarios/${u.id}`, {
        method: "PUT",
        body: JSON.stringify({ suspendido: nuevoEstado })
      });
    } catch {
      // Fallback directo a Supabase si falla la API comercial
      const { error: estadoError } = await supabase
        .from("usuario")
        .update({
          suspendido: nuevoEstado,
          actualizado_en: new Date().toISOString()
        })
        .eq("id", u.id);

      if (estadoError) throw estadoError;
    }

    // 2. RECOMENDADO: En lugar de llamar a obtenerusuario(), actualiza SOLO el estado local de forma segura
    setListausuario((usuarios) =>
      usuarios.map((usuario) =>
        usuario.id === u.id ? { ...usuario, suspendido: nuevoEstado } : usuario
      )
    );


    Swal.fire({
      icon: "success",
      title: estaSuspendido ? "Usuario habilitado" : "Usuario deshabilitado",
      timer: 1200,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error.message);
    Swal.fire("Error", "No se pudo cambiar el estado del usuario", "error");
  } finally {
    setUsuarioActualizando(null);
  }
};

  const filtrados = useMemo(() => {
    return listausuarioData.filter((u) => {
      const search = busqueda.toLowerCase();
      const match = u.nombre?.toLowerCase().includes(search) || u.correo?.toLowerCase().includes(search);

      if (orden === "todos") return match;
      if (["admin", "empleado", "cliente"].includes(orden)) return match && u.rol === orden;
      if (orden === "activos") return match && !normalizarSuspendido(u.suspendido, u.rol);
      if (orden === "suspendidos") return match && normalizarSuspendido(u.suspendido, u.rol);

      return match;
    });
  }, [listausuarioData, busqueda, orden]);

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <style>{`
        .filtro-btn { border: 1.5px solid #e0e0e0; background: #fff; border-radius: 20px; padding: 6px 16px; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .filtro-btn.activo { background: #121212; color: #fff; border-color: #121212; }
      `}</style>

      <div className="container bg-white shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-0">Gestion de usuarios</h2>
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
              {listausuarioData.length} Registrados
            </span>
          </div>
        </div>

        <div className="d-flex gap-2 mb-4 flex-wrap">
          {["todos", "admin", "empleado", "cliente", "activos", "suspendidos"].map((o) => (
            <button key={o} className={`filtro-btn ${orden === o ? "activo" : ""}`} onClick={() => setOrden(o)}>
              {o.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="table table-hover border-top">
            <thead>
              <tr className="text-secondary small text-uppercase">
                <th>Usuario</th>
                <th>Correo Electronico</th>
                <th>Rol / Permisos</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {filtrados.length > 0 ? (
                filtrados.map((u) => {
                  const estaSuspendido = normalizarSuspendido(u.suspendido, u.rol);

                  return (
                  <tr key={u.id} className={estaSuspendido ? "table-light text-muted" : ""}>
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
                        style={{ width: "160px", color: u.rol === "admin" ? "#F5A623" : "#495057" }}
                        value={["admin", "empleado", "cliente"].includes(u.rol) ? u.rol : "cliente"}
                        onChange={(e) => actualizarRol(u.id, e.target.value)}
                        disabled={estaSuspendido}
                      >
                        <option value="admin">Administrador</option>
                        <option value="empleado">Empleado</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${estaSuspendido ? "bg-danger-subtle text-danger border border-danger-subtle" : "bg-success-subtle text-success border border-success-subtle"}`}>
                        {estaSuspendido ? "Deshabilitado" : "Activo"}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className={`btn btn-sm border ${estaSuspendido ? "btn-outline-success" : "btn-outline-danger"}`}
                        onClick={() => alternarEstadoUsuario(u)}
                        disabled={usuarioActualizando === u.id}
                      >
                        <i className={`bi ${usuarioActualizando === u.id ? "bi-hourglass-split" : estaSuspendido ? "bi-check-circle" : "bi-slash-circle"} me-1`}></i>
                        {usuarioActualizando === u.id ? "Guardando..." : estaSuspendido ? "Habilitar" : "Deshabilitar"}
                      </button>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No se encontraron usuarios con esos filtros.</td>
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