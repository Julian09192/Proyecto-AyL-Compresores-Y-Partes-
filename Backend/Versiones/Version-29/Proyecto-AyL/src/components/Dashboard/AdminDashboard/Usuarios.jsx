import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../../../lib/api";
import { supabase } from "../../../lib/client";
import { 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiShield, 
  FiToggleLeft, 
  FiToggleRight, 
  FiRefreshCw,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUsers as FiUsersIcon
} from "react-icons/fi";
import { FaUserCircle, FaUserCheck, FaUserTimes } from "react-icons/fa";

function Usuarios() {
  const [listausuarioData, setListausuario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("todos");
  const [usuarioActualizando, setUsuarioActualizando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Colores de la empresa A&L Lubricantes
  const COLORS = {
    primary: "#1a237e",      // Azul oscuro
    secondary: "#f5a623",    // Amarillo/dorado
    accent: "#e53935",       // Rojo
    success: "#43a047",      // Verde
    background: "#f5f5f5",   // Fondo gris claro
    cardBg: "#ffffff",       // Blanco
    textPrimary: "#1a237e",  // Azul oscuro
    textSecondary: "#546e7a" // Gris azulado
  };

  const normalizarSuspendido = (valor, rol) => {
    if (valor === true || valor === 1 || valor === "true" || valor === "1") return true;
    if (rol === "deshabilitado") return true;
    return false;
  };

  const obtenerUsuarios = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await apiFetch("/usuarios");
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
      console.error("Error al obtener usuarios:", error);
      
      // Fallback a Supabase directo
      try {
        const { data, error: supabaseError } = await supabase
          .from("usuario")
          .select("*")
          .order("nombre");

        if (supabaseError) throw supabaseError;
        
        const usuariosNormalizados = (data || []).map(u => ({
          ...u,
          suspendido: normalizarSuspendido(u.suspendido, u.rol)
        }));
        setListausuario(usuariosNormalizados);
        
        if (usuariosNormalizados.length === 0) {
          setError("No hay usuarios registrados en el sistema");
        }
      } catch (fallbackError) {
        console.error("Error al obtener usuarios (fallback):", fallbackError);
        setError("No se pudieron cargar los usuarios. Por favor, intenta nuevamente.");
        Swal.fire({
          icon: "error",
          title: "Error al cargar usuarios",
          text: "No se pudieron cargar los usuarios. Verifica tu conexión.",
          confirmButtonColor: COLORS.secondary
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
      // Primero intentamos actualizar via API
      await apiFetch(`/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify({ rol: nuevoRol })
      });

      // Actualizar localmente
      setListausuario(prev => 
        prev.map(u => 
          u.id === id ? { ...u, rol: nuevoRol } : u
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Rol actualizado!",
        text: `El rol ha sido cambiado a ${nuevoRol}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: COLORS.cardBg,
        iconColor: COLORS.secondary
      });
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      
      // Si falla la API, intentamos directamente con Supabase
      try {
        const { error: supabaseError } = await supabase
          .from("usuario")
          .update({ 
            rol: nuevoRol,
            actualizado_en: new Date().toISOString()
          })
          .eq("id", id);

        if (supabaseError) throw supabaseError;

        // Actualizar localmente
        setListausuario(prev => 
          prev.map(u => 
            u.id === id ? { ...u, rol: nuevoRol } : u
          )
        );

        Swal.fire({
          icon: "success",
          title: "¡Rol actualizado!",
          text: `El rol ha sido cambiado a ${nuevoRol}`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
          background: COLORS.cardBg,
          iconColor: COLORS.secondary
        });
      } catch (fallbackError) {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar rol",
          text: "No se pudo cambiar el rol del usuario. Intenta nuevamente.",
          confirmButtonColor: COLORS.secondary
        });
      }
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
      html: `
        <div style="text-align: left;">
          <p><strong>Usuario:</strong> ${u.nombre || u.correo}</p>
          <p><strong>Estado actual:</strong> ${estaSuspendido ? "Deshabilitado" : "Activo"}</p>
          <p>¿Seguro que deseas ${accion} a este usuario?</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estaSuspendido ? COLORS.success : COLORS.accent,
      cancelButtonColor: "#6c757d",
      confirmButtonText: estaSuspendido ? "✅ Habilitar" : "❌ Deshabilitar",
      cancelButtonText: "Cancelar",
      background: COLORS.cardBg
    });

    if (!confirmacion.isConfirmed) return;

    setUsuarioActualizando(u.id);

    try {
      // Intentar actualizar via API
      try {
        await apiFetch(`/usuarios/${u.id}`, {
          method: "PUT",
          body: JSON.stringify({ suspendido: nuevoEstado })
        });
      } catch (apiError) {
        // Fallback a Supabase directo
        console.warn("Fallback a Supabase directo:", apiError);
        const { error: estadoError } = await supabase
          .from("usuario")
          .update({
            suspendido: nuevoEstado,
            actualizado_en: new Date().toISOString()
          })
          .eq("id", u.id);

        if (estadoError) throw estadoError;
      }

      // Actualizar estado local
      setListausuario(prev =>
        prev.map(usuario =>
          usuario.id === u.id 
            ? { ...usuario, suspendido: nuevoEstado, rol: nuevoEstado ? "deshabilitado" : usuario.rol }
            : usuario
        )
      );

      Swal.fire({
        icon: "success",
        title: estaSuspendido ? "✅ Usuario habilitado" : "⛔ Usuario deshabilitado",
        text: `El usuario ${u.nombre || u.correo} ha sido ${estaSuspendido ? "habilitado" : "deshabilitado"} correctamente.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: COLORS.cardBg,
        iconColor: COLORS.secondary
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cambiar estado",
        text: "No se pudo cambiar el estado del usuario. Intenta nuevamente.",
        confirmButtonColor: COLORS.secondary
      });
    } finally {
      setUsuarioActualizando(null);
    }
  };

  const obtenerColorRol = (rol) => {
    const colores = {
      admin: COLORS.primary,
      empleado: "#1565c0",
      cliente: COLORS.success,
      deshabilitado: COLORS.accent
    };
    return colores[rol] || "#6c757d";
  };

  const obtenerIconoRol = (rol) => {
    const iconos = {
      admin: "👑",
      empleado: "👤",
      cliente: "👥",
      deshabilitado: "🚫"
    };
    return iconos[rol] || "👤";
  };

  const filtrados = useMemo(() => {
    return listausuarioData.filter((u) => {
      const search = busqueda.toLowerCase().trim();
      if (!search) return true;
      
      const matchNombre = u.nombre?.toLowerCase().includes(search) || false;
      const matchCorreo = u.correo?.toLowerCase().includes(search) || false;
      const matchIdentificacion = u.num_identificacion?.toLowerCase().includes(search) || false;
      
      const matchBusqueda = matchNombre || matchCorreo || matchIdentificacion;
      
      // Aplicar filtros adicionales
      if (orden === "todos") return matchBusqueda;
      if (orden === "admin") return matchBusqueda && u.rol === "admin";
      if (orden === "empleado") return matchBusqueda && u.rol === "empleado";
      if (orden === "cliente") return matchBusqueda && u.rol === "cliente";
      if (orden === "activos") return matchBusqueda && !normalizarSuspendido(u.suspendido, u.rol);
      if (orden === "suspendidos") return matchBusqueda && normalizarSuspendido(u.suspendido, u.rol);
      
      return matchBusqueda;
    });
  }, [listausuarioData, busqueda, orden]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = listausuarioData.length;
    const activos = listausuarioData.filter(u => !normalizarSuspendido(u.suspendido, u.rol)).length;
    const suspendidos = listausuarioData.filter(u => normalizarSuspendido(u.suspendido, u.rol)).length;
    const admins = listausuarioData.filter(u => u.rol === "admin").length;
    const empleados = listausuarioData.filter(u => u.rol === "empleado").length;
    const clientes = listausuarioData.filter(u => u.rol === "cliente").length;
    
    return { total, activos, suspendidos, admins, empleados, clientes };
  }, [listausuarioData]);

  if (cargando && listausuarioData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh", background: COLORS.background }}>
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" style={{ width: "3rem", height: "3rem", color: COLORS.secondary }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: COLORS.background, minHeight: "100vh" }}>
      <style>{`
        .ayl-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(26, 35, 126, 0.05);
        }
        .ayl-card:hover {
          box-shadow: 0 4px 16px rgba(26, 35, 126, 0.12);
        }
        
        .ayl-badge {
          background: linear-gradient(135deg, ${COLORS.primary} 0%, #283593 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .ayl-stat-card {
          background: white;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(26, 35, 126, 0.08);
          cursor: default;
        }
        .ayl-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 20px rgba(26, 35, 126, 0.1);
          border-color: ${COLORS.secondary};
        }
        .ayl-stat-card .stat-number {
          font-size: 28px;
          font-weight: 700;
          margin: 4px 0;
        }
        .ayl-stat-card .stat-label {
          font-size: 13px;
          color: #546e7a;
          font-weight: 500;
        }
        .ayl-stat-card .stat-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }
        
        .ayl-filter-btn {
          border: 1.5px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #546e7a;
        }
        .ayl-filter-btn:hover {
          border-color: ${COLORS.secondary};
          color: ${COLORS.primary};
        }
        .ayl-filter-btn.active {
          background: ${COLORS.primary};
          color: white;
          border-color: ${COLORS.primary};
        }
        .ayl-filter-btn .badge-count {
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 1px 8px;
          font-size: 10px;
          margin-left: 6px;
        }
        .ayl-filter-btn.active .badge-count {
          background: rgba(255,255,255,0.25);
        }
        
        .ayl-table th {
          background: ${COLORS.background};
          color: ${COLORS.primary};
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid ${COLORS.secondary};
        }
        .ayl-table td {
          vertical-align: middle;
          padding: 12px 8px;
          border-bottom: 1px solid #f0f0f0;
        }
        .ayl-table tbody tr:hover {
          background: rgba(245, 166, 35, 0.04);
        }
        
        .ayl-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        .ayl-avatar.admin {
          background: linear-gradient(135deg, ${COLORS.primary} 0%, #283593 100%);
        }
        .ayl-avatar.empleado {
          background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
        }
        .ayl-avatar.cliente {
          background: linear-gradient(135deg, ${COLORS.success} 0%, #2e7d32 100%);
        }
        .ayl-avatar.suspendido {
          background: linear-gradient(135deg, ${COLORS.accent} 0%, #c62828 100%);
        }
        
        .ayl-status-badge {
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .ayl-status-badge.active {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }
        .ayl-status-badge.inactive {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }
        
        .ayl-select-role {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 13px;
          font-weight: 500;
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .ayl-select-role:focus {
          border-color: ${COLORS.secondary};
          box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.1);
          outline: none;
        }
        .ayl-select-role:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f5f5f5;
        }
        
        .ayl-action-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          border: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .ayl-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ayl-action-btn.enable {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .ayl-action-btn.enable:hover:not(:disabled) {
          background: #c8e6c9;
          transform: translateY(-1px);
        }
        .ayl-action-btn.disable {
          background: #ffebee;
          color: #c62828;
        }
        .ayl-action-btn.disable:hover:not(:disabled) {
          background: #ffcdd2;
          transform: translateY(-1px);
        }
        
        .ayl-search-input {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .ayl-search-input:focus {
          border-color: ${COLORS.secondary};
          box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.1);
          outline: none;
        }
        
        .ayl-header-title {
          color: ${COLORS.primary};
          font-weight: 700;
        }
        .ayl-header-subtitle {
          color: #546e7a;
          font-size: 14px;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="ayl-header-title d-flex align-items-center gap-2 mb-1">
              <FiUsers className="text-warning" size={28} />
              Gestión de Usuarios
            </h2>
            <p className="ayl-header-subtitle">
              Administra los roles y accesos de la plataforma
            </p>
          </div>
          <button 
            onClick={obtenerUsuarios} 
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            disabled={cargando}
            style={{ borderRadius: "8px" }}
          >
            <FiRefreshCw className={cargando ? "spin" : ""} size={14} />
            {cargando ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* Estadísticas */}
        <div className="row g-3 mb-4">
          <div className="col-md-2 col-sm-4 col-6">
            <div className="ayl-stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-label">Total</div>
              <div className="stat-number" style={{ color: COLORS.primary }}>{estadisticas.total}</div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-6">
            <div className="ayl-stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-label">Activos</div>
              <div className="stat-number" style={{ color: COLORS.success }}>{estadisticas.activos}</div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-6">
            <div className="ayl-stat-card">
              <div className="stat-icon">🚫</div>
              <div className="stat-label">Suspendidos</div>
              <div className="stat-number" style={{ color: COLORS.accent }}>{estadisticas.suspendidos}</div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-6">
            <div className="ayl-stat-card">
              <div className="stat-icon">👑</div>
              <div className="stat-label">Administradores</div>
              <div className="stat-number" style={{ color: COLORS.primary }}>{estadisticas.admins}</div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-6">
            <div className="ayl-stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-label">Empleados</div>
              <div className="stat-number" style={{ color: "#1565c0" }}>{estadisticas.empleados}</div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-6">
            <div className="ayl-stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-label">Clientes</div>
              <div className="stat-number" style={{ color: COLORS.success }}>{estadisticas.clientes}</div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="ayl-card p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="position-relative">
                <FiSearch className="position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  className="ayl-search-input w-100"
                  placeholder="Buscar por nombre, correo o identificación..."
                  style={{ paddingLeft: "36px" }}
                  onChange={(e) => setBusqueda(e.target.value)}
                  value={busqueda}
                />
                {busqueda && (
                  <button 
                    className="position-absolute btn btn-link text-muted"
                    style={{ right: "8px", top: "50%", transform: "translateY(-50%)", padding: "4px" }}
                    onClick={() => setBusqueda("")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-7">
              <div className="d-flex gap-2 flex-wrap">
                {["todos", "admin", "empleado", "cliente", "activos", "suspendidos"].map((o) => {
                  const counts = {
                    todos: estadisticas.total,
                    admin: estadisticas.admins,
                    empleado: estadisticas.empleados,
                    cliente: estadisticas.clientes,
                    activos: estadisticas.activos,
                    suspendidos: estadisticas.suspendidos
                  };
                  const labels = {
                    todos: "Todos",
                    admin: "Admin",
                    empleado: "Empleados",
                    cliente: "Clientes",
                    activos: "Activos",
                    suspendidos: "Suspendidos"
                  };
                  const icons = {
                    todos: "👥",
                    admin: "👑",
                    empleado: "👤",
                    cliente: "👥",
                    activos: "✅",
                    suspendidos: "🚫"
                  };
                  return (
                    <button
                      key={o}
                      className={`ayl-filter-btn ${orden === o ? "active" : ""}`}
                      onClick={() => setOrden(o)}
                    >
                      {icons[o]} {labels[o]}
                      <span className="badge-count">{counts[o]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="ayl-card p-0 overflow-hidden">
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          
          <div className="table-responsive">
            <table className="table ayl-table mb-0">
              <thead>
                <tr>
                  <th className="ps-4 py-3">Usuario</th>
                  <th className="py-3">Correo Electrónico</th>
                  <th className="py-3">Rol / Permisos</th>
                  <th className="py-3">Estado</th>
                  <th className="pe-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length > 0 ? (
                  filtrados.map((u) => {
                    const estaSuspendido = normalizarSuspendido(u.suspendido, u.rol);
                    const avatarClase = estaSuspendido 
                      ? "ayl-avatar suspendido" 
                      : u.rol === "admin" 
                        ? "ayl-avatar admin" 
                        : u.rol === "empleado" 
                          ? "ayl-avatar empleado" 
                          : "ayl-avatar cliente";

                    return (
                      <tr key={u.id} style={{ opacity: estaSuspendido ? 0.7 : 1 }}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className={avatarClase}>
                              {u.nombre ? u.nombre.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <div className="fw-semibold" style={{ color: COLORS.primary }}>
                                {u.nombre || "Sin nombre"}
                              </div>
                              {u.num_identificacion && (
                                <small className="text-muted d-block">ID: {u.num_identificacion}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span>{u.correo}</span>
                            {u.num_celular && (
                              <small className="text-muted">{u.num_celular}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span>{obtenerIconoRol(u.rol)}</span>
                            <select
                              className="ayl-select-role"
                              style={{ 
                                color: estaSuspendido ? "#6c757d" : obtenerColorRol(u.rol),
                                borderColor: estaSuspendido ? "#e0e0e0" : obtenerColorRol(u.rol)
                              }}
                              value={["admin", "empleado", "cliente", "deshabilitado"].includes(u.rol) ? u.rol : "cliente"}
                              onChange={(e) => actualizarRol(u.id, e.target.value)}
                              disabled={estaSuspendido || usuarioActualizando === u.id}
                            >
                              <option value="admin">👑 Administrador</option>
                              <option value="empleado">👤 Empleado</option>
                              <option value="cliente">👥 Cliente</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <span className={`ayl-status-badge ${estaSuspendido ? "inactive" : "active"}`}>
                            {estaSuspendido ? "🚫 Deshabilitado" : "✅ Activo"}
                          </span>
                        </td>
                        <td className="pe-4 text-center">
                          <button
                            className={`ayl-action-btn ${estaSuspendido ? "enable" : "disable"}`}
                            onClick={() => alternarEstadoUsuario(u)}
                            disabled={usuarioActualizando === u.id}
                          >
                            {usuarioActualizando === u.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span>Procesando...</span>
                              </>
                            ) : estaSuspendido ? (
                              <>
                                <FiToggleRight size={16} />
                                Habilitar
                              </>
                            ) : (
                              <>
                                <FiToggleLeft size={16} />
                                Deshabilitar
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="text-muted">
                        <FiUser className="mb-3" size={40} style={{ color: COLORS.secondary }} />
                        <p className="mb-0 fw-semibold">No se encontraron usuarios</p>
                        <small>Intenta ajustar los criterios de búsqueda</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="d-flex justify-content-between align-items-center p-3" style={{ background: COLORS.background, borderTop: "1px solid #e0e0e0" }}>
            <span className="text-muted small">
              Mostrando {filtrados.length} de {listausuarioData.length} usuarios
            </span>
            <span className="text-muted small">
              Última actualización: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;