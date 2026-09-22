// src/components/Dashboard/Empleado/EmpleadoDashboard.jsx
import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";
import DashboardHome from "./Empleado/DashboardHome";
import MiPerfil from "./Empleado/MiPerfil";
import Productos from "./Empleado/Productos";
import Notificaciones from "./Empleado/Notificaciones";
import Reportes from "./Empleado/Reportes";
import Bitacora from "./Empleado/Bitacora";

const logoMarca = "https://res.cloudinary.com/duvoqozcl/image/upload/v1777394217/logo-ayl.png";

function SeccionVacia({ nombre }) {
  return (
    <div className="p-5 text-center">
      <div className="display-1 opacity-25 mb-3">
        <i className="bi bi-gear"></i>
      </div>
      <h2 className="fw-bold mb-1">{nombre}</h2>
      <p className="text-secondary">Esta sección está en fase de desarrollo técnico.</p>
    </div>
  );
}

function EmpleadoDashboard({ logout, usuario }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // OBTENER PRODUCTOS DESDE LA API
  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/productos');
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos del dashboard empleado:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const notificaciones = productos.filter(p => !p.suspendido && Number(p.stock || 0) < 10).length;

  const obtenerImagen = (img) => {
    if (!img) return "/src/assets/compresor.jpg";
    return img.startsWith("http") ? img : `/src/assets/${img}`;
  };

  const MENU_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: "bi-speedometer2", badge: null },
    { id: "productos", label: "Productos", icon: "bi-archive", badge: null },
    { id: "bitacora", label: "Bitácora", icon: "bi-journal-text", badge: null },
    { id: "reportes", label: "Reportes", icon: "bi-file-earmark-bar-graph", badge: null },
    { id: "notificaciones", label: "Notificaciones", icon: "bi-bell", badge: notificaciones },
    { id: "perfil", label: "Mi Perfil", icon: "bi-gear", badge: null },
  ];

  function renderContenido() {
    switch (seccionActiva) {
      case "dashboard": return <DashboardHome />;
      case "perfil": return <MiPerfil usuario={usuario} />;
      case "productos": return <Productos />;
      case "notificaciones":
        return (
          <div className="p-4">
            <Notificaciones productos={productos} obtenerImagen={obtenerImagen} />
          </div>
        );
      case "bitacora": return <Bitacora />;
      case "reportes": return <Reportes />;
      default: return <DashboardHome />;
    }
  }

  return (
    <div className="d-flex min-vh-100 bg-light" style={{ position: "relative" }}>

      {/* ── OVERLAY MÓVIL ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1099,
            backdropFilter: "blur(2px)"
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className="border-end d-flex flex-column p-3 shadow empleado-sidebar"
        style={{
          width: 260,
          minWidth: 260,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1100,
          backgroundColor: "#0b0c10",
          borderColor: "rgba(255,255,255,0.08)",
          transition: "transform 0.3s ease"
        }}
      >
        {/* Logo Corporativo */}
        <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center justify-content-center rounded-3" style={{ height: 45 }}>
            <img
              src={logoMarca}
              alt="A&L Compresores"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            <span className="text-warning fw-bold" style={{ fontSize: "0.65rem", letterSpacing: "1.5px" }}>
              SISTEMA GESTIÓN
            </span>
            <button
              className="btn-close btn-close-white d-lg-none"
              style={{ fontSize: "0.65rem" }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            />
          </div>
        </div>

        {/* Info del Empleado */}
        <div className="d-flex align-items-center gap-3 rounded-3 p-3 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div
            className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle text-dark"
            style={{ width: 40, height: 40, fontSize: "1.1rem", flexShrink: 0 }}
          >
            <i className="bi bi-person-badge"></i>
          </div>
          <div className="overflow-hidden">
            <div className="fw-bold text-truncate text-white" style={{ fontSize: "0.85rem" }}>
              {usuario?.nombre || "Empleado A&L"}
            </div>
            <span
              className="badge rounded-pill mt-1"
              style={{ background: "#F5A623", color: "#000", fontSize: "0.6rem", fontWeight: 700 }}
            >
              {usuario?.rol || "Empleado"}
            </span>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="d-flex flex-column gap-1 flex-grow-1">
          {MENU_ITEMS.map((item) => {
            const isActive = seccionActiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSeccionActiva(item.id); setSidebarOpen(false); }}
                className={`sidebar-link d-flex align-items-center gap-3 border-0 rounded-3 px-3 py-2.5 w-100 text-start fw-medium ${isActive ? "active" : ""}`}
                style={{
                  background: isActive ? "#F5A623" : "transparent",
                  color: isActive ? "#000000" : "#E9ECEF",
                  boxShadow: isActive ? "0 4px 12px rgba(245, 166, 35, 0.25)" : "none"
                }}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: "1.1rem" }}></i>
                <span className="flex-grow-1" style={{ fontSize: "0.9rem" }}>{item.label}</span>

                {item.badge > 0 && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: isActive ? "rgba(0,0,0,0.15)" : "#dc3545",
                      color: isActive ? "#000" : "#fff",
                      fontSize: "0.65rem",
                      minWidth: 22
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Botón de Salida */}
        <div className="border-top border-secondary border-opacity-25 pt-3">
          <button
            onClick={() => logout()}
            className="btn-logout d-flex align-items-center gap-2 w-100 text-decoration-none fw-semibold border-0 bg-transparent"
          >
            <i className="bi bi-door-open"></i> Salir del Panel
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="flex-grow-1 overflow-auto empleado-main-content" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Topbar móvil */}
        <div
          className="d-flex d-lg-none align-items-center justify-content-between px-3 py-2 shadow-sm"
          style={{ background: "#0b0c10", position: "sticky", top: 0, zIndex: 900 }}
        >
          <button
            className="btn btn-sm border-0 text-white p-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
          </button>
          <img src={logoMarca} alt="A&L" style={{ height: 32, objectFit: "contain" }} />
          <span className="text-warning fw-bold" style={{ fontSize: "0.65rem", letterSpacing: "1.5px" }}>GESTIÓN</span>
        </div>

        <div className="animate-fade-in p-3 p-md-4">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
              <div className="spinner-border text-warning" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            renderContenido()
          )}
        </div>
      </main>

      {/* ── ESTILOS CSS ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .sidebar-link {
          transition: all 0.2s ease-in-out;
          padding-left: 16px;
        }
        .sidebar-link:not(.active):hover {
          background-color: rgba(255, 255, 255, 0.07) !important;
          color: #F5A623 !important;
          padding-left: 22px;
        }
        .btn-logout {
          color: #adb5bd; 
          font-size: 0.85rem; 
          transition: color 0.2s ease;
          padding: 8px 16px;
        }
        .btn-logout:hover {
          color: #dc3545 !important;
        }
        @media (min-width: 992px) {
          .empleado-sidebar {
            transform: translateX(0) !important;
            position: sticky !important;
          }
        }
        @media (max-width: 991.98px) {
          .empleado-sidebar {
            transform: translateX(-100%);
          }
          .empleado-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
}

export default EmpleadoDashboard;