import { useState, useEffect } from "react";
import DashboardHome from "./Empleado/DashboardHome";
import MiPerfil from "./Empleado/MiPerfil";
import Productos from "./Empleado/Productos";
import Notificaciones from "./Empleado/Notificaciones";
import ControlStock from "./Empleado/ControlStock";
import Reportes from "./Empleado/Reportes";
import Bitacora from "./Empleado/Bitacora";

function SeccionVacia({ nombre }) {
  return (
    <div className="p-5 text-center">
      <div className="display-1 opacity-25 mb-3">
        <i className="bi bi-gear"></i></div>
      <h2 className="fw-bold mb-1">{nombre}</h2>
      <p className="text-secondary">Esta sección está en fase de desarrollo técnico.</p>
    </div>
  );
}

const logoMarca = "https://res.cloudinary.com/duvoqozcl/image/upload/v1777394217/logo-ayl.png";
const API_URL = "http://localhost:3001/productos";

function EmpleadoDashboard({ logout }) {
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos del dashboard empleado:", error);
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
    { id: "stock", label: "Control de Stock", icon: "bi-graph-up-arrow", badge: 3 },
    { id: "proveedores", label: "Proveedores", icon: "bi-truck", badge: null },
    { id: "bitacora", label: "Bitácora", icon: "bi-journal-text", badge: null },
    { id: "reportes", label: "Reportes", icon: "bi-file-earmark-bar-graph", badge: null },
    { id: "notificaciones", label: "Notificaciones", icon: "bi-bell", badge: notificaciones },
    { id: "perfil", label: "Mi Perfil", icon: "bi-gear", badge: null },
  ];

  // --- RENDERIZADO DINÁMICO ---
  function renderContenido() {
    switch (seccionActiva) {
      case "dashboard":
        return <DashboardHome />;

      case "perfil":
        return <MiPerfil />;

      case "productos":
        return <Productos />;

      case "stock":
        return <ControlStock />;

      case "notificaciones":
        return (
          <div className="p-4">
            <Notificaciones
              productos={productos}
              obtenerImagen={obtenerImagen}
            />
          </div>
        );

      case "proveedores": return <SeccionVacia nombre="Proveedores" />;
      case "bitacora": return <Bitacora />;

      case "reportes":
        return <Reportes />;
        
      default: return <DashboardHome />;
    }
  }

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* ── SIDEBAR ── */}
      <aside
        className="border-end d-flex flex-column p-3 shadow-sm"
        style={{ width: 260, minWidth: 260, position: "sticky", top: 0, height: "100vh", zIndex: 1000, backgroundColor: "#000000", borderColor: "rgba(255,255,255,0.08)" }}
      >

        {/* Logo Corporativo */}
        <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
          {/* Contenedor del Logo */}
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: "auto", height: 45, flexShrink: 0 }}
          >
            <img
              src={logoMarca}
              alt="A&L Compresores"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          </div>

          <div>
            <div className="text-warning fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
              SISTEMA DE GESTIÓN
            </div>
          </div>
        </div>

        {/* Info del Administrador */}
        <div className="d-flex align-items-center gap-2 bg-light rounded-4 p-3 mb-4">
          <div
            className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle text-dark"
            style={{ width: 42, height: 42, fontSize: "1.2rem", flexShrink: 0 }}
          >
            <i className="bi bi-person-badge"></i> {/* <--- Cambia el emoji por este icono */}
          </div>
          <div className="overflow-hidden">
            <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem" }}>Empleado A&L</div>
            <span
              className="badge rounded-pill"
              style={{ background: "#121212", fontSize: "0.6rem", fontWeight: 600 }}
            >
              Nivel de Acceso: 1
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
                className="d-flex align-items-center gap-3 border-0 rounded-3 px-3 py-2 w-100 text-start fw-semibold"
                style={{
                  background: isActive ? "#F5A623" : "transparent",
                  color: isActive ? "#10142D" : "#E9ECEF",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isActive ? "0 4px 12px rgba(245, 166, 35, 0.3)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#fff8ed";
                    e.currentTarget.style.color = "#F5A623";
                    e.currentTarget.style.paddingLeft = "20px";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#555";
                    e.currentTarget.style.paddingLeft = "16px";
                  }
                }}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: "1.1rem" }}></i>
                <span className="flex-grow-1">{item.label}</span>

                {/* 🔔 BADGE DINÁMICO */}
                {item.badge > 0 && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "#dc3545",
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
        <div className="border-top pt-3">
          <button
            onClick={() => logout()}
            className="btn btn-link d-flex align-items-center gap-2 w-100 text-decoration-none fw-bold"
            style={{ color: "#adb5bd", fontSize: "0.85rem", transition: "0.3s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#F5A623"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#adb5bd"}
          >
            <span><i className="bi bi-door-open"></i></span> Salir del Panel
          </button>
        </div>

      </aside>

      {/* ── CONTENIDO ── */}
      <main className="flex-grow-1 overflow-auto bg-white">
        <div className="animate-fade-in">
          {renderContenido()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

    </div>
  );
}

export default EmpleadoDashboard;