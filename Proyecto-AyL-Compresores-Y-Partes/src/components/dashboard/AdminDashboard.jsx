import { useState } from "react";
import DashboardHome from "./AdminDashboard/DashboardHome";
import MiPerfil from "./AdminDashboard/MiPerfil";
// Importamos el componente con el nombre exacto: Productos
import Productos from "./AdminDashboard/Productos"; 

function SeccionVacia({ nombre }) {
  return (
    <div className="p-5 text-center">
      <div className="display-1 opacity-25 mb-3">🛠️</div>
      <h2 className="fw-bold mb-1">{nombre}</h2>
      <p className="text-secondary">Esta sección está en fase de desarrollo técnico.</p>
    </div>
  );
}

const MENU_ITEMS = [
  { id: "dashboard",      label: "Dashboard",        emoji: "⊞",  badge: null },
  { id: "productos",      label: "Productos",        emoji: "📦", badge: null },
  { id: "stock",          label: "Control de Stock", emoji: "📈", badge: 3    },
  { id: "proveedores",    label: "Proveedores",      emoji: "🚚", badge: null },
  { id: "usuarios",       label: "Usuarios",         emoji: "👤", badge: null },
  { id: "reportes",       label: "Reportes",         emoji: "📋", badge: null },
  { id: "notificaciones", label: "Notificaciones",   emoji: "🔔", badge: 5    },
  { id: "perfil",         label: "Mi Perfil",        emoji: "⚙️", badge: null },
];

function AdminDashboard({ setVista }) {
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  // --- RENDERIZADO DINÁMICO ---
  function renderContenido() {
    switch (seccionActiva) {
      case "dashboard":      
        return <DashboardHome />;
      
      case "perfil":         
        return <MiPerfil />;
      
      case "productos":      
        // Usamos el componente Productos
        return <Productos />;
      
      case "stock":          
        // Reutilizamos Productos para el control de inventario
        return <Productos />;
      
      case "proveedores":    return <SeccionVacia nombre="Proveedores" />;
      case "usuarios":       return <SeccionVacia nombre="Usuarios" />;
      case "reportes":       return <SeccionVacia nombre="Reportes" />;
      case "notificaciones": return <SeccionVacia nombre="Notificaciones" />;
      default:               return <DashboardHome />;
    }
  }

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* ── SIDEBAR ── */}
      <aside
        className="bg-white border-end d-flex flex-column p-3 shadow-sm"
        style={{ width: 260, minWidth: 260, position: "sticky", top: 0, height: "100vh", zIndex: 1000 }}
      >

        {/* Logo Corporativo */}
        <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{ width: 40, height: 40, background: "#F5A623", fontSize: "1.2rem", flexShrink: 0 }}
          >
            ⚙
          </div>
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: "0.95rem", lineHeight: 1.2 }}>A&L Compresores</div>
            <div className="text-warning fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>SISTEMA ADMIN</div>
          </div>
        </div>

        {/* Info del Administrador */}
        <div className="d-flex align-items-center gap-2 bg-light rounded-4 p-3 mb-4">
          <div
            className="d-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle text-dark"
            style={{ width: 42, height: 42, fontSize: "1.2rem", flexShrink: 0 }}
          >
            👨‍🔧
          </div>
          <div className="overflow-hidden">
            <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem" }}>Admin A&L</div>
            <span
              className="badge rounded-pill"
              style={{ background: "#121212", fontSize: "0.6rem", fontWeight: 600 }}
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
                className="d-flex align-items-center gap-3 border-0 rounded-3 px-3 py-2 w-100 text-start fw-semibold"
                style={{
                  background: isActive ? "#F5A623" : "transparent",
                  color: isActive ? "#ffffff" : "#555",
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
                <span style={{ fontSize: "1.1rem" }}>{item.emoji}</span>
                <span className="flex-grow-1">{item.label}</span>
                {item.badge && (
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
            onClick={() => setVista("inicio")}
            className="btn btn-link d-flex align-items-center gap-2 w-100 text-decoration-none fw-bold"
            style={{ color: "#adb5bd", fontSize: "0.85rem", transition: "0.3s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#dc3545"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#adb5bd"}
          >
            <span>🚪</span> Salir del Panel
          </button>
        </div>

      </aside>

      {/* ── ÁREA DE CONTENIDO ── */}
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

export default AdminDashboard;