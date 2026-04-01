import { useState } from "react";

const LINKS = [
  { label: "Inicio",    vista: "inicio"    },
  { label: "Nosotros",  vista: "nosotros"  },
  { label: "Productos", vista: "productos" },
  { label: "Contactos", vista: "contactos" },
];

function Navbar({ onOpenLogin, vistaActual, setVista, usuario, logout, totalItems, setCartOpen }) {
  const [open, setOpen] = useState(false);

  const navegar = (v) => { setVista(v); setOpen(false); };

  return (
    <nav className="navbar-wrapper">
      <div className="container d-flex align-items-center justify-content-between">

        {/* Logo */}
        <a href="#" className="navbar-brand-logo text-decoration-none"
          onClick={(e) => { e.preventDefault(); navegar("inicio"); }}>
          <span className="brand-icon">⚙</span>
          A&L Compresores
        </a>

        {/* Hamburguesa */}
        <button className="navbar-hamburger" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>

        {/* Links */}
        <div className={`navbar-links ${open ? "navbar-links--open" : ""}`}>
          {LINKS.map((link) => (
            <a key={link.vista} href="#"
              className={`navbar-link ${vistaActual === link.vista ? "navbar-link--active" : ""}`}
              onClick={(e) => { e.preventDefault(); navegar(link.vista); }}>
              {link.label}
            </a>
          ))}

          {/* Móvil */}
          <div className="d-md-none mt-3 w-100 px-3">
            {usuario ? (
              <button className="btn btn-outline-light w-100" onClick={() => { setOpen(false); logout(); }}>
                Cerrar Sesión
              </button>
            ) : (
              <button className="btn btn-outline-light w-100"
                onClick={() => { setOpen(false); onOpenLogin(); }}>
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>

        {/* Escritorio — carrito + usuario */}
        <div className="navbar-auth d-none d-md-flex align-items-center gap-2">

          {/* Ícono carrito con badge */}
          <button
            className="btn btn-outline-light position-relative"
            onClick={() => setCartOpen(true)}
            style={{ fontSize: "1.1rem" }}
          >
            🛒
            {totalItems > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-white"
                style={{ background: "#F5A623", fontSize: "0.65rem" }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Si hay usuario logueado: muestra su nombre + cerrar sesión */}
          {usuario ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-white fw-semibold" style={{ fontSize: "0.88rem" }}>
                👤 {usuario.nombre}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={logout}>
                Salir
              </button>
            </div>
          ) : (
            <button className="btn btn-outline-dark ms-1" onClick={onOpenLogin}>
              Iniciar Sesión
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;