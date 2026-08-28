import { useState, useEffect } from "react";
import DashboardHome from "./AdminDashboard/DashboardHome";
import MiPerfil from "./AdminDashboard/MiPerfil";
import Productos from "./AdminDashboard/Productos";
import Notificaciones from "./AdminDashboard/Notificaciones";
import Reportes from "./AdminDashboard/Reportes";
import Usuarios from "./AdminDashboard/Usuarios";
import Bitacora from "./AdminDashboard/Bitacora";

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

const API_URL = "http://localhost:3001/api/productos";

function AdminDashboard({ logout }) {
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos del dashboard admin:", error);
      setProductos([]);
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
    { id: "usuario", label: "Usuario", icon: "bi-people", badge: null },
    { id: "reportes", label: "Reportes", icon: "bi-file-earmark-bar-graph", badge: null },
    { id: "notificaciones", label: "Notificaciones", icon: "bi-bell", badge: notificaciones },
    { id: "perfil", label: "Mi Perfil", icon: "bi-gear", badge: null },
  ];

  function renderContenido() {
    switch (seccionActiva) {
      case "dashboard": return <DashboardHome />;
      case "perfil": return <MiPerfil />;
      case "productos": return <Productos />;
      case "notificaciones":
        return (
          <div className="p-4">
            <Notificaciones productos={productos} obtenerImagen={obtenerImagen} />
          </div>
        );
      case "proveedores": return <SeccionVacia nombre="Proveedores" />;
      case "usuario": return <Usuarios />;
      case "reportes": return <Reportes />;
      case "bitacora": return <Bitacora />;
      default: return <DashboardHome />;
    }
  }

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* ── SIDEBAR ── */}
      <aside
        className="border-end d-flex flex-column p-3 shadow"
        style={{
          width: 260,
          minWidth: 260,
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 1000,
          backgroundColor: "#0b0c10", // Un negro ligeramente más suave y premium
          borderColor: "rgba(255,255,255,0.08)"
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
          <div className="ms-auto">
            <span className="text-warning fw-bold tracking-wider" style={{ fontSize: "0.65rem", letterSpacing: "1.5px" }}>
              PANEL ADMIN
            </span>
          </div>
        </div>

        {/* Info del Administrador (Modificado a dark para integrarse) */}
        <div className="d-flex align-items-center gap-3 rounded-3 p-3 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div
            className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle text-dark"
            style={{ width: 40, height: 40, fontSize: "1.1rem", flexShrink: 0 }}
          >
            <i className="bi bi-person-badge"></i>
          </div>
          <div className="overflow-hidden">
            <div className="fw-bold text-truncate text-white" style={{ fontSize: "0.85rem" }}>Admin A&L</div>
            <span
              className="badge rounded-pill mt-1"
              style={{ background: "#F5A623", color: "#000", fontSize: "0.6rem", fontWeight: 700 }}
            >
              Nivel Máster
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
                onClick={() => setSeccionActiva(item.id)}
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
      <main className="flex-grow-1 overflow-auto" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="animate-fade-in p-4">
          {renderContenido()}
        </div>
      </main>

      {/* ── ESTILOS ADICIONALES ── */}
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
      `}</style>

    </div>
  );
}

export default AdminDashboard;