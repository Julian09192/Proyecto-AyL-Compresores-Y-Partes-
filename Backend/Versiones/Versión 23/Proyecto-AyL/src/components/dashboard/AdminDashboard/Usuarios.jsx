import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

function Usuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const API_URL = "http://localhost:3001/usuarios";

  const token = localStorage.getItem("token");
  const usuarioActual = JSON.parse(localStorage.getItem("usuario") || localStorage.getItem("al_usuario") || "{}");
  const esAdministrador = usuarioActual.rol === "admin";
  const BITACORA_USUARIOS_KEY = "al_bitacora_usuarios";

  const leerRespuesta = async (res) => {
    const texto = await res.text();

    try {
      return texto ? JSON.parse(texto) : {};
    } catch {
      throw new Error(
        "El servidor no respondio en formato valido. Reinicia el backend en el puerto 3001 y vuelve a intentar."
      );
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}?t=${Date.now()}`);
      const data = await leerRespuesta(res);
      setListaUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudo conectar con la base de datos", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const guardarUsuario = async (idUsuario, datos) => {
    const res = await fetch(`${API_URL}/${idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });

    const data = await leerRespuesta(res);

    if (!res.ok) {
      throw new Error(data.error || "No se pudo actualizar el usuario");
    }

    return data;
  };

  const registrarEventoBitacora = (usuario, estaDeshabilitado) => {
    const accion = estaDeshabilitado ? "Usuario reactivado" : "Usuario deshabilitado";
    const nuevoRegistro = {
      id: `${Date.now()}-${usuario.id_usuario}`,
      accion,
      usuario: usuario.usuario || "Usuario",
      correo: usuario.correo || "",
      rol: usuario.rol || "",
      admin: usuarioActual.nombre || usuarioActual.usuario || usuarioActual.email || "Administrador",
      creado_en: new Date().toISOString(),
      detalle: estaDeshabilitado
        ? `${usuario.usuario || "El usuario"} fue reactivado y puede volver a iniciar sesion.`
        : `${usuario.usuario || "El usuario"} fue deshabilitado y no podra iniciar sesion.`,
    };

    try {
      const registros = JSON.parse(localStorage.getItem(BITACORA_USUARIOS_KEY) || "[]");
      const actualizados = [nuevoRegistro, ...(Array.isArray(registros) ? registros : [])].slice(0, 100);
      localStorage.setItem(BITACORA_USUARIOS_KEY, JSON.stringify(actualizados));
      window.dispatchEvent(new Event("bitacoraActualizada"));
    } catch (error) {
      console.error("No se pudo registrar en bitacora:", error);
    }
  };

  const abrirEditorUsuario = async (usuario) => {
    if (!esAdministrador) {
      Swal.fire("Acceso restringido", "Solo el administrador puede actualizar usuarios.", "warning");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Editar usuario",
      showCancelButton: true,
      confirmButtonText: "Guardar cambios",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#121212",
      customClass: {
        popup: "rounded-4 shadow",
        confirmButton: "rounded-3 px-4",
        cancelButton: "rounded-3 px-4 text-dark",
      },
      html: `
        <div style="text-align:left; display:flex; flex-direction:column; gap:12px; padding:10px;">
          <div>
            <label style="font-size:11px; font-weight:700; color:#888; text-transform:uppercase;">Nombre de usuario</label>
            <input id="edit-usuario" class="form-control mt-1" value="${usuario.usuario || ""}">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#888; text-transform:uppercase;">Correo</label>
            <input id="edit-correo" class="form-control mt-1" type="email" value="${usuario.correo || ""}">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:#888; text-transform:uppercase;">Identificacion</label>
              <input id="edit-identificacion" class="form-control mt-1" value="${usuario.num_identificacion || ""}">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#888; text-transform:uppercase;">Celular</label>
              <input id="edit-celular" class="form-control mt-1" value="${usuario.num_celular || ""}">
            </div>
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#888; text-transform:uppercase;">Rol</label>
            <select id="edit-rol" class="form-select mt-1">
              <option value="admin" ${usuario.rol === "admin" ? "selected" : ""}>Administrador</option>
              <option value="empleado" ${usuario.rol === "empleado" ? "selected" : ""}>Empleado / Auxiliar</option>
              <option value="cliente" ${usuario.rol === "cliente" ? "selected" : ""}>Cliente</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#888; text-transform:uppercase;">Nueva contrasena</label>
            <input id="edit-password" class="form-control mt-1" type="password" placeholder="Dejar vacia para no cambiar">
          </div>
        </div>
      `,
      preConfirm: () => {
        const usuarioValue = document.getElementById("edit-usuario").value.trim();
        const correoValue = document.getElementById("edit-correo").value.trim();

        if (!usuarioValue || !correoValue) {
          Swal.showValidationMessage("El nombre y el correo son obligatorios");
          return false;
        }

        const password = document.getElementById("edit-password").value.trim();
        const datos = {
          usuario: usuarioValue,
          correo: correoValue,
          num_identificacion: document.getElementById("edit-identificacion").value.trim(),
          num_celular: document.getElementById("edit-celular").value.trim(),
          rol: document.getElementById("edit-rol").value,
        };

        if (password) {
          datos.password_hash = password;
        }

        return datos;
      },
    });

    if (!formValues) return;

    try {
      const actualizado = await guardarUsuario(usuario.id_usuario, formValues);
      setListaUsuarios((usuarios) =>
        usuarios.map((u) => (u.id_usuario === usuario.id_usuario ? actualizado : u))
      );
      Swal.fire({ icon: "success", title: "Usuario actualizado", timer: 1400, showConfirmButton: false });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const cambiarEstadoUsuario = async (usuario) => {
    if (!esAdministrador) {
      Swal.fire("Acceso restringido", "Solo el administrador puede deshabilitar usuarios.", "warning");
      return;
    }

    const estaDeshabilitado = Number(usuario.suspendido) === 1;
    const confirmar = await Swal.fire({
      title: estaDeshabilitado ? "Reactivar usuario?" : "Deshabilitar usuario?",
      text: estaDeshabilitado
        ? `${usuario.usuario} podra volver a ingresar al sistema.`
        : `${usuario.usuario} no podra iniciar sesion, pero sus datos se conservaran.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estaDeshabilitado ? "#121212" : "#dc3545",
      confirmButtonText: estaDeshabilitado ? "Reactivar" : "Deshabilitar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${usuario.id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ suspendido: estaDeshabilitado ? 0 : 1 }),
      });

      const data = await leerRespuesta(res);

      if (!res.ok) {
        throw new Error(data.error || "No se pudo actualizar el estado del usuario");
      }

      setListaUsuarios((usuarios) =>
        usuarios.map((u) => (u.id_usuario === usuario.id_usuario ? data : u))
      );
      registrarEventoBitacora(usuario, estaDeshabilitado);
      Swal.fire({
        icon: "success",
        title: estaDeshabilitado ? "Usuario reactivado" : "Usuario deshabilitado",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const filtrados = useMemo(() => {
    return listaUsuarios.filter((u) => {
      const search = busqueda.toLowerCase();
      const texto = `${u.usuario || ""} ${u.correo || ""} ${u.num_identificacion || ""} ${u.num_celular || ""}`.toLowerCase();
      const coincideBusqueda = texto.includes(search);
      const coincideRol = filtroRol === "todos" || filtroRol === "deshabilitados" || u.rol === filtroRol;
      const coincideEstado = filtroRol === "deshabilitados" ? Number(u.suspendido) === 1 : true;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [listaUsuarios, busqueda, filtroRol]);

  const totales = useMemo(() => {
    return listaUsuarios.reduce((acc, usuario) => {
      acc.total += 1;
      if (Number(usuario.suspendido) === 1) acc.deshabilitados += 1;
      acc[usuario.rol] = (acc[usuario.rol] || 0) + 1;
      return acc;
    }, { total: 0, admin: 0, empleado: 0, cliente: 0, deshabilitados: 0 });
  }, [listaUsuarios]);

  const rolLabel = {
    admin: "Administrador",
    empleado: "Empleado / Auxiliar",
    cliente: "Cliente",
  };

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <style>{`
        .filtro-btn { border:1.5px solid #e0e0e0; background:#fff; border-radius:20px; padding:6px 16px; font-size:13px; cursor:pointer; transition:0.2s; }
        .filtro-btn.activo { background:#121212; color:#fff; border-color:#121212; }
        .usuario-stat { background:#fff; border:1px solid #eeeeee; border-radius:12px; padding:16px; }
        .usuario-stat small { color:#777; font-size:11px; font-weight:700; text-transform:uppercase; }
        .usuario-stat strong { display:block; font-size:24px; margin-top:6px; }
        .btn-user-edit { background:#eef2ff; color:#4f46e5; border:0; padding:7px 13px; border-radius:7px; font-size:12px; font-weight:700; }
        .btn-user-disable { background:#fff1f2; color:#e11d48; border:0; padding:7px 13px; border-radius:7px; font-size:12px; font-weight:700; }
        .btn-user-enable { background:#ecfdf3; color:#198754; border:0; padding:7px 13px; border-radius:7px; font-size:12px; font-weight:700; }
        .usuario-deshabilitado { opacity:0.55; filter:grayscale(0.4); }
      `}</style>

      <div className="container bg-white shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-0">Gestion de Usuarios</h2>
            <p className="text-secondary small mb-0">Solo el administrador puede actualizar datos y deshabilitar accesos.</p>
          </div>
          <div className="d-flex align-items-stretch gap-2" style={{ height: "45px" }}>
            <input
              type="text"
              className="form-control border-0 bg-light h-100 ps-3"
              placeholder="Buscar por nombre, correo, cedula o celular..."
              style={{ borderRadius: "12px", minWidth: "300px" }}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn btn-warning fw-bold px-3" onClick={obtenerUsuarios}>
              Actualizar
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3"><div className="usuario-stat"><small>Total</small><strong>{totales.total}</strong></div></div>
          <div className="col-md-3"><div className="usuario-stat"><small>Administradores</small><strong>{totales.admin}</strong></div></div>
          <div className="col-md-3"><div className="usuario-stat"><small>Empleados</small><strong>{totales.empleado}</strong></div></div>
          <div className="col-md-3"><div className="usuario-stat"><small>Deshabilitados</small><strong>{totales.deshabilitados}</strong></div></div>
        </div>

        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[
            ["todos", "Todos"],
            ["admin", "Administradores"],
            ["empleado", "Empleados"],
            ["cliente", "Clientes"],
            ["deshabilitados", "Deshabilitados"],
          ].map(([valor, texto]) => (
            <button key={valor} className={`filtro-btn ${filtroRol === valor ? "activo" : ""}`} onClick={() => setFiltroRol(valor)}>
              {texto}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="table table-hover border-top">
            <thead>
              <tr className="text-secondary small text-uppercase">
                <th>Usuario</th>
                <th>Correo</th>
                <th>Identificacion</th>
                <th>Celular</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {filtrados.length > 0 ? (
                filtrados.map((u) => (
                  <tr key={u.id_usuario} className={Number(u.suspendido) === 1 ? "usuario-deshabilitado" : ""}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                          style={{ width: 35, height: 35, background: u.rol === "admin" ? "#F5A623" : "#6c757d", fontSize: "0.8rem" }}
                        >
                          {u.usuario ? u.usuario.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="fw-semibold">{u.usuario || "-"}</span>
                      </div>
                    </td>
                    <td>{u.correo || "-"}</td>
                    <td>{u.num_identificacion || "-"}</td>
                    <td>{u.num_celular || "-"}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${u.rol === "admin" ? "bg-warning text-dark" : u.rol === "empleado" ? "bg-primary-subtle text-primary" : "bg-secondary-subtle text-secondary"}`}>
                        {rolLabel[u.rol] || u.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${Number(u.suspendido) === 1 ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}>
                        {Number(u.suspendido) === 1 ? "Deshabilitado" : "Activo"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn-user-edit" disabled={!esAdministrador} onClick={() => abrirEditorUsuario(u)}>
                          EDITAR
                        </button>
                        <button
                          className={Number(u.suspendido) === 1 ? "btn-user-enable" : "btn-user-disable"}
                          disabled={!esAdministrador}
                          onClick={() => cambiarEstadoUsuario(u)}
                        >
                          {Number(u.suspendido) === 1 ? "REACTIVAR" : "DESHABILITAR"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No se encontraron usuarios con esos filtros.</td>
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
