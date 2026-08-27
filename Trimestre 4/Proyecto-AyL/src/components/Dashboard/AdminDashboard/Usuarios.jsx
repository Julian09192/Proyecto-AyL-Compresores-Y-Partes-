// src/components/Usuarios.jsx
import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { apiGet, apiPut } from "../../../lib/api";
import { FiRefreshCw, FiUsers } from "react-icons/fi";

import { UserStats } from "./compUsuarios/UserStats";
import { UserFilters } from "./compUsuarios/UserFilters";
import { UserTableRow } from "./compUsuarios/UserTableRow";

// Paleta corporativa
const COLORS = {
  primary: "#111111",
  secondary: "#f5a623",
  accent: "#e53935",
  success: "#43a047",
  background: "#f8f9fa",
  cardBg: "#ffffff",
};

function Usuarios() {
  const [listausuarioData, setListausuario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("todos");
  const [usuarioActualizando, setUsuarioActualizando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const normalizarSuspendido = (valor, rol) => {
    if (valor === true || valor === 1 || valor === "true" || valor === "1") return true;
    return rol === "deshabilitado";
  };

  const obtenerUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await apiGet("/usuarios");
      if (Array.isArray(data)) {
        const usuariosNormalizados = data.map(u => ({
          ...u,
          suspendido: normalizarSuspendido(u.suspendido, u.rol)
        }));
        setListausuario(usuariosNormalizados);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError(error.message || "Error al cargar los usuarios");
      
      // Si es error de sesión, mostrar mensaje específico
      if (error.message === 'Sesión expirada. Por favor, inicia sesión nuevamente.') {
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "Por favor, inicia sesión nuevamente para continuar.",
          confirmButtonColor: COLORS.primary
        }).then(() => {
          window.location.href = '/login';
        });
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const actualizarRol = async (id, nuevoRol) => {
    setUsuarioActualizando(id);
    try {
      await apiPut(`/usuarios/${id}`, { rol: nuevoRol });
      setListausuario(prev => prev.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
      mostrarToast("Rol actualizado exitosamente");
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo actualizar el rol",
        confirmButtonColor: COLORS.primary
      });
    } finally {
      setUsuarioActualizando(null);
    }
  };

  const alternarEstadoUsuario = async (u) => {
    const estaSuspendido = normalizarSuspendido(u.suspendido, u.rol);
    const nuevoEstado = !estaSuspendido;
    const accion = estaSuspendido ? "habilitar" : "deshabilitar";

    const confirmacion = await Swal.fire({
      title: `${accion.charAt(0).toUpperCase()}${accion.slice(1)} usuario`,
      text: `¿Estás seguro de que deseas cambiar el estado de ${u.nombre || u.correo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estaSuspendido ? COLORS.success : COLORS.accent,
      cancelButtonColor: "#6c757d",
      confirmButtonText: estaSuspendido ? "Habilitar" : "Deshabilitar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    setUsuarioActualizando(u.id);
    try {
      await apiPut(`/usuarios/${u.id}`, { suspendido: nuevoEstado });
      
      setListausuario(prev =>
        prev.map(user => user.id === u.id ? { 
          ...user, 
          suspendido: nuevoEstado, 
          rol: nuevoEstado ? "deshabilitado" : user.rol 
        } : user)
      );
      mostrarToast("Estado modificado con éxito");
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo cambiar el estado",
        confirmButtonColor: COLORS.primary
      });
    } finally {
      setUsuarioActualizando(null);
    }
  };

  const mostrarToast = (msg) => {
    Swal.fire({
      icon: "success",
      title: msg,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  };

  const obtenerColorRol = (rol) => {
    const colores = { 
      admin: COLORS.primary, 
      empleado: "#4b5563", 
      cliente: COLORS.success, 
      deshabilitado: COLORS.accent 
    };
    return colores[rol] || "#6c757d";
  };

  const filtrados = useMemo(() => {
    return listausuarioData.filter((u) => {
      const search = busqueda.toLowerCase().trim();
      const matchNombre = u.nombre?.toLowerCase().includes(search) || false;
      const matchCorreo = u.correo?.toLowerCase().includes(search) || false;
      const matchID = u.num_identificacion?.toLowerCase().includes(search) || false;
      const pasaBusqueda = !search || matchNombre || matchCorreo || matchID;

      const esSuspendido = normalizarSuspendido(u.suspendido, u.rol);
      let pasaOrden = true;

      if (orden === "admin") pasaOrden = u.rol === "admin";
      else if (orden === "empleado") pasaOrden = u.rol === "empleado";
      else if (orden === "cliente") pasaOrden = u.rol === "cliente";
      else if (orden === "activos") pasaOrden = !esSuspendido;
      else if (orden === "suspendidos") pasaOrden = esSuspendido;

      return pasaBusqueda && pasaOrden;
    });
  }, [listausuarioData, busqueda, orden]);

  const estadisticas = useMemo(() => {
    const total = listausuarioData.length;
    const activos = listausuarioData.filter(u => !normalizarSuspendido(u.suspendido, u.rol)).length;
    const suspendidos = total - activos;
    const admins = listausuarioData.filter(u => u.rol === "admin").length;
    const empleados = listausuarioData.filter(u => u.rol === "empleado").length;
    const clientes = listausuarioData.filter(u => u.rol === "cliente").length;
    return { total, activos, suspendidos, admins, empleados, clientes };
  }, [listausuarioData]);

  if (cargando && listausuarioData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" style={{ color: COLORS.primary }}></div>
          <p className="text-muted small">Cargando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: COLORS.background, minHeight: "100vh" }}>
      <style>{`
        .ayl-card { background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; }
        .ayl-stat-card { background: #ffffff; border-radius: 6px; padding: 16px; border: 1px solid #e0e0e0; text-align: center; }
        .ayl-stat-card .stat-number { font-size: 24px; font-weight: 700; margin-top: 4px; }
        .ayl-stat-card .stat-label { font-size: 12px; color: #546e7a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .ayl-filter-btn { border: 1px solid #d1d1d1; background: #ffffff; border-radius: 4px; padding: 6px 12px; font-size: 13px; font-weight: 500; color: #455a64; cursor: pointer; transition: all 0.2s; }
        .ayl-filter-btn:hover { border-color: ${COLORS.primary}; color: ${COLORS.primary}; }
        .ayl-filter-btn.active { background: ${COLORS.primary}; color: #ffffff; border-color: ${COLORS.primary}; }
        .ayl-filter-btn .badge-count { background: rgba(0,0,0,0.08); border-radius: 10px; padding: 1px 6px; font-size: 11px; margin-left: 6px; }
        .ayl-filter-btn.active .badge-count { background: rgba(255,255,255,0.2); color: #ffffff; }
        .ayl-table th { background: #f8f9fa; color: ${COLORS.primary}; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e0e0e0; }
        .ayl-table td { vertical-align: middle; font-size: 14px; color: #37474f; }
        .ayl-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; color: #ffffff; }
        .ayl-avatar.admin { background: ${COLORS.primary}; }
        .ayl-avatar.empleado { background: #4b5563; }
        .ayl-avatar.cliente { background: ${COLORS.success}; }
        .ayl-avatar.suspendido { background: ${COLORS.accent}; }
        .ayl-status-badge { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; }
        .ayl-status-badge.active { background: #e8f5e9; color: #2e7d32; }
        .ayl-status-badge.inactive { background: #ffebee; color: #c62828; }
        .ayl-select-role { border: 1px solid #d1d1d1; border-radius: 4px; padding: 4px 8px; font-size: 13px; background: #ffffff; }
        .ayl-action-btn { padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 500; border: 1px solid transparent; background: transparent; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
        .ayl-action-btn.enable { color: #2e7d32; border-color: #c8e6c9; background: #f1f8e9; }
        .ayl-action-btn.disable { color: #c62828; border-color: #ffcdd2; background: #fff5f5; }
        .ayl-search-input { border: 1px solid #d1d1d1; border-radius: 4px; padding: 6px 12px; font-size: 14px; }
        .ayl-search-input:focus { border-color: ${COLORS.primary}; outline: none; box-shadow: 0 0 0 2px rgba(17,17,17,0.15); }
      `}</style>

      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="text-dark fw-bold mb-1 d-flex align-items-center gap-2">
              <FiUsers size={24} /> Control de Usuarios
            </h3>
            <p className="text-muted small m-0">Ecosistema administrativo de roles y permisos</p>
          </div>
          <button 
            onClick={obtenerUsuarios} 
            className="btn btn-sm btn-light border d-flex align-items-center gap-2"
            disabled={cargando}
          >
            <FiRefreshCw size={14} className={cargando ? "spin" : ""} /> 
            {cargando ? "Cargando..." : "Sincronizar"}
          </button>
        </div>

        <UserStats estadisticas={estadisticas} colors={COLORS} />
        <UserFilters 
          busqueda={busqueda} 
          setBusqueda={setBusqueda} 
          orden={orden} 
          setOrden={setOrden} 
          estadisticas={estadisticas} 
        />

        <div className="ayl-card p-0 overflow-hidden">
          {error && (
            <div className="alert alert-danger m-3 py-2 small">
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-link ms-2"
                onClick={obtenerUsuarios}
              >
                Reintentar
              </button>
            </div>
          )}
          <div className="table-responsive">
            <table className="table ayl-table mb-0">
              <thead>
                <tr>
                  <th className="ps-4 py-3">Usuario</th>
                  <th className="py-3">Correo Electrónico</th>
                  <th className="py-3">Rol Asignado</th>
                  <th className="py-3">Estado de Cuenta</th>
                  <th className="pe-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length > 0 ? (
                  filtrados.map((u) => (
                    <UserTableRow
                      key={u.id}
                      usuario={u}
                      estaSuspendido={normalizarSuspendido(u.suspendido, u.rol)}
                      usuarioActualizando={usuarioActualizando}
                      actualizarRol={actualizarRol}
                      alternarEstadoUsuario={alternarEstadoUsuario}
                      colors={COLORS}
                      obtenerColorRol={obtenerColorRol}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted small">
                      {busqueda || orden !== "todos" 
                        ? "No se encontraron registros que coincidan con la selección actual." 
                        : "No hay usuarios registrados en el sistema."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;