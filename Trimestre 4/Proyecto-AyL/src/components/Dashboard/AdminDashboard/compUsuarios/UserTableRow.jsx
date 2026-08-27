import React from "react";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

export function UserTableRow({ 
  usuario, 
  estaSuspendido, 
  usuarioActualizando, 
  actualizarRol, 
  alternarEstadoUsuario, 
  colors,
  obtenerColorRol
}) {
  const avatarClase = estaSuspendido
    ? "ayl-avatar suspendido"
    : usuario.rol === "admin"
      ? "ayl-avatar admin"
      : usuario.rol === "empleado"
        ? "ayl-avatar empleado"
        : "ayl-avatar cliente";

  return (
    <tr style={{ opacity: estaSuspendido ? 0.65 : 1 }}>
      <td className="ps-4">
        <div className="d-flex align-items-center gap-3">
          <div className={avatarClase}>
            {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="fw-semibold" style={{ color: colors.primary }}>
              {usuario.nombre || "Sin nombre"}
            </div>
            {usuario.num_identificacion && (
              <small className="text-muted d-block">ID: {usuario.num_identificacion}</small>
            )}
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex flex-column">
          <span>{usuario.correo}</span>
          {usuario.num_celular && <small className="text-muted">{usuario.num_celular}</small>}
        </div>
      </td>
      <td>
        <select
          className="ayl-select-role"
          style={{
            color: estaSuspendido ? "#6c757d" : obtenerColorRol(usuario.rol),
            borderColor: estaSuspendido ? "#e0e0e0" : obtenerColorRol(usuario.rol)
          }}
          value={["admin", "empleado", "cliente"].includes(usuario.rol) ? usuario.rol : "cliente"}
          onChange={(e) => actualizarRol(usuario.id, e.target.value)}
          disabled={estaSuspendido || usuarioActualizando === usuario.id}
        >
          <option value="admin">Administrador</option>
          <option value="empleado">Empleado</option>
          <option value="cliente">Cliente</option>
        </select>
      </td>
      <td>
        <span className={`ayl-status-badge ${estaSuspendido ? "inactive" : "active"}`}>
          {estaSuspendido ? "Deshabilitado" : "Activo"}
        </span>
      </td>
      <td className="pe-4 text-center">
        <button
          className={`ayl-action-btn ${estaSuspendido ? "enable" : "disable"}`}
          onClick={() => alternarEstadoUsuario(usuario)}
          disabled={usuarioActualizando === usuario.id}
        >
          {usuarioActualizando === usuario.id ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Procesando...</span>
            </>
          ) : estaSuspendido ? (
            <>
              <FiToggleRight size={16} />
              <span>Habilitar</span>
            </>
          ) : (
            <>
              <FiToggleLeft size={16} />
              <span>Deshabilitar</span>
            </>
          )}
        </button>
      </td>
    </tr>
  );
}