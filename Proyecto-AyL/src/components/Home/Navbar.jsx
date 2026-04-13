import { useState } from "react";
import logoMarca from "../../assets/Home/Navbar/logo-ayl.png";

const LINKS = [
  { label: "Inicio", vista: "inicio", icon: "bi-house-door" },
  { label: "Nosotros", vista: "nosotros", icon: "bi-info-circle" },
  { label: "Productos", vista: "productos", icon: "bi-tools" },
  { label: "Contactos", vista: "contactos", icon: "bi-envelope" },
];

function Navbar({ onOpenLogin, vistaActual, setVista, usuario, logout, totalItems, setCartOpen }) {
  const [open, setOpen] = useState(false);

  const navegar = (v) => { setVista(v); setOpen(false); };

  return (
    <nav className="navbar-wrapper shadow-sm py-2">
      <div className="container d-flex align-items-center justify-content-between">

        <a href="#" className="navbar-brand d-flex align-items-center text-decoration-none"
          onClick={(e) => { e.preventDefault(); navegar("inicio"); }}>

          <img
            src={logoMarca}
            alt="A&L Compresores"
            className="d-inline-block align-top me-2"
            style={{ height: "45px", width: "auto", objectFit: "contain" }}
          />

        </a>

        <button className="navbar-hamburger" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${open ? "navbar-links--open" : ""}`}>
          {LINKS.map((link) => (
            <a key={link.vista} href="#"
              className={`navbar-link ${vistaActual === link.vista ? "navbar-link--active" : ""}`}
              onClick={(e) => { e.preventDefault(); navegar(link.vista); }}>
              <i className={`bi ${link.icon} me-1`}></i> {link.label}
            </a>
          ))}
        </div>

        <div className="navbar-auth d-none d-md-flex align-items-center gap-3">
          <button
            className="btn btn-outline-dark border-0 position-relative p-2"
            onClick={() => setCartOpen(true)}
            style={{ fontSize: "1.3rem" }}
          >
            <i className="bi bi-cart3"></i>
            {totalItems > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-white"
                style={{ background: "#F5A623", fontSize: "0.65rem" }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {usuario ? (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-light d-flex align-items-center gap-2 rounded-pill px-3 py-2 border-0"
                onClick={() => setVista("perfil")}
                style={{ transition: "all 0.3s ease" }}
              >
                <i className="bi bi-person-circle fs-5"></i>
                <span className="fw-semibold" style={{ fontSize: "0.88rem" }}>
                  {usuario.nombre}
                </span>
              </button>
              
              <button className="btn btn-sm btn-dark rounded-pill px-3" onClick={logout}>
                <i className="bi bi-door-open me-1"></i> Cerrar Sesión
              </button>
            </div>
          ) : (
            <button className="btn btn-outline-dark rounded-pill px-3" onClick={onOpenLogin}>
              <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;