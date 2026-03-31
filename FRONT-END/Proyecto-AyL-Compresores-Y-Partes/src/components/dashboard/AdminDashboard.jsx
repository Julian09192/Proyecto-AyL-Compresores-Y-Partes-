import { useState } from "react";
import DashboardHome from "./Pages/DashboardHome";
import MiPerfil from "./Pages/MiPerfil";

// Secciones vacías — las iremos construyendo después
function SeccionVacia({ nombre }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontFamily: "'Barlow', sans-serif", color: "#1a1a1a" }}>
        {nombre}
      </h2>
      <p style={{ color: "#868e96" }}>Esta sección está en construcción.</p>
    </div>
  );
}

// Lista de ítems del menú lateral
// Cada uno tiene: id (para el estado), label (texto), emoji (ícono)
const MENU_ITEMS = [
  { id: "dashboard",      label: "Dashboard",         emoji: "⊞",  badge: null },
  { id: "productos",      label: "Productos",         emoji: "📦", badge: null },
  { id: "stock",          label: "Control de Stock",  emoji: "📈", badge: 3    },
  { id: "proveedores",    label: "Proveedores",       emoji: "🚚", badge: null },
  { id: "usuarios",       label: "Usuarios",          emoji: "👤", badge: null },
  { id: "reportes",       label: "Reportes",          emoji: "📋", badge: null },
  { id: "notificaciones", label: "Notificaciones",    emoji: "🔔", badge: 5    },
  { id: "perfil",         label: "Mi Perfil",         emoji: "⚙️", badge: null },
];

function AdminDashboard({ setVista }) {
  // Este estado decide QUÉ sección se muestra en el área de contenido
  // Funciona igual que tu isLogin en LoginModal, pero con más opciones
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  // Según la sección activa, retornamos el componente correcto
  // Cuando vayas construyendo cada página, reemplaza el <SeccionVacia> por el componente real
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
    <div className="adm-wrapper">

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">

        {/* Logo */}
        <div className="adm-sidebar__logo">
          <span className="adm-sidebar__logo-icon">⚙</span>
          <div>
            <div className="adm-sidebar__logo-name">A&L Compresores</div>
            <div className="adm-sidebar__logo-sub">Inventario</div>
          </div>
        </div>

        {/* Info del admin */}
        <div className="adm-sidebar__user">
          <div className="adm-sidebar__avatar">👤</div>
          <div>
            <div className="adm-sidebar__username">Administrador</div>
            <span className="adm-sidebar__role">Administrador</span>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="adm-sidebar__nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`adm-nav-item ${seccionActiva === item.id ? "adm-nav-item--active" : ""}`}
              onClick={() => setSeccionActiva(item.id)}
            >
              <span className="adm-nav-item__icon">{item.emoji}</span>
              <span className="adm-nav-item__label">{item.label}</span>
              {/* Badge de notificación (el numerito rojo) */}
              {item.badge && (
                <span className="adm-nav-item__badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Botón cerrar sesión — llama a setVista("cliente") para volver al Home */}
        <button className="adm-sidebar__logout" onClick={() => setVista("cliente")}>
          <span>↩</span> Cerrar Sesión
        </button>

      </aside>

      {/* ── ÁREA DE CONTENIDO ── */}
      {/* Aquí se renderiza la sección activa */}
      <main className="adm-main">
        {renderContenido()}
      </main>

    </div>
  );
}

export default AdminDashboard;
