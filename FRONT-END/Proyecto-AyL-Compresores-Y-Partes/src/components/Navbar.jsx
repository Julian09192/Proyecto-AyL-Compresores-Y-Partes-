import { useState } from "react";

function Navbar({ onOpenLogin }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Inicio");
  const links = ["Inicio", "Nosotros", "Productos", "Contactos"];

  return (
    <nav className="navbar-wrapper">
      <div className="container d-flex align-items-center justify-content-between">
        <a href="#" className="navbar-brand-logo text-decoration-none">
          <span className="brand-icon">⚙</span>
          A&L Compresores
        </a>

        {/* Botón Hamburguesa */}
        <button className="navbar-hamburger" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>

        {/* Menú de Enlaces */}
        <div className={`navbar-links ${open ? "navbar-links--open" : ""}`}>
          {links.map((link) => (
            <a key={link} href="#"
              className={`navbar-link ${active === link ? "navbar-link--active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActive(link); setOpen(false); }}>
              {link}
            </a>
          ))}
          
          {/* BOTÓN LOGIN PARA MÓVIL (Solo se ve cuando el menú está abierto) */}
          <div className="d-md-none mt-3 w-100 px-3">
            <button 
              className="btn btn-outline-light w-100"
              data-bs-toggle="modal"
              data-bs-target="#modalLogin"
              onClick={() => setOpen(false)} // Cierra el menú al abrir el modal
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* BOTÓN LOGIN PARA ESCRITORIO */}
        <div className="navbar-auth d-none d-md-flex align-items-center gap-2">
          <button 
            className="btn btn-outline-light ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modalLogin"
            onClick={onOpenLogin}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;