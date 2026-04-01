import { useState } from "react";
import DashboardHome from "./AdminDashboard/DashboardHome";
import MiPerfil from "./AdminDashboard/MiPerfil";

function SeccionVacia({ nombre }) {
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1">{nombre}</h2>
      <p className="text-secondary">Esta sección está en construcción.</p>
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

  function renderContenido() {
    switch (seccionActiva) {
      case "dashboard":      return <DashboardHome />;
      case "perfil":         return <MiPerfil />;
      case "productos":      return <SeccionVacia nombre="Productos" />;
      case "stock":          return <SeccionVacia nombre="Control de Stock" />;
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
        className="bg-white border-end d-flex flex-column p-3"
        style={{ width: 240, minWidth: 240, position: "sticky", top: 0, height: "100vh" }}
      >

        {/* Logo */}
        <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-2"
            style={{ width: 36, height: 36, background: "#F5A623", fontSize: "1.1rem", flexShrink: 0 }}
          >
            ⚙
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: "0.92rem", lineHeight: 1.2 }}>A&L Compresores</div>
            <div className="text-secondary" style={{ fontSize: "0.75rem" }}>Inventario</div>
          </div>
        </div>

        {/* Info del admin */}
        <div className="d-flex align-items-center gap-2 bg-light rounded-3 p-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 rounded-circle"
            style={{ width: 38, height: 38, fontSize: "1.1rem", flexShrink: 0 }}
          >
            👤
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: "0.88rem" }}>Administrador</div>
            <span
              className="text-white rounded-pill px-2 py-0"
              style={{ background: "#F5A623", fontSize: "0.7rem", fontWeight: 700 }}
            >
              Administrador
            </span>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="d-flex flex-column gap-1 flex-grow-1">
          {MENU_ITEMS.map((item) => {
            const isActive = seccionActiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSeccionActiva(item.id)}
                className="d-flex align-items-center gap-2 border-0 rounded-3 px-3 py-2 w-100 text-start fw-medium"
                style={{
                  background: isActive ? "#F5A623" : "transparent",
                  color: isActive ? "#ffffff" : "#495057",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "background 0.18s, color 0.18s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#fff8ed";
                    e.currentTarget.style.color = "#F5A623";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#495057";
                  }
                }}
              >
                <span style={{ width: 20, textAlign: "center", flexShrink: 0 }}>{item.emoji}</span>
                <span className="flex-grow-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="rounded-pill text-white text-center"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.3)" : "#dc3545",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "1px 6px",
                      minWidth: 20,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Botón cerrar sesión */}
        <button
          onClick={() => setVista("inicio")}
          className="d-flex align-items-center gap-2 border-0 rounded-3 px-3 py-2 w-100 text-start fw-semibold mt-2"
          style={{ background: "transparent", color: "#868e96", fontSize: "0.88rem", cursor: "pointer" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff0f0";
            e.currentTarget.style.color = "#dc3545";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#868e96";
          }}
        >
          <span>↩</span> Cerrar Sesión
        </button>

      </aside>

      {/* ── ÁREA DE CONTENIDO ── */}
      <main className="flex-grow-1 overflow-auto">
        {renderContenido()}
      </main>

    </div>
  );
}

export default AdminDashboard;