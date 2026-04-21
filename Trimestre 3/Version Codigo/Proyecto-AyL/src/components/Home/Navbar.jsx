import { useState } from "react";
import logoMarca from "../../assets/Home/Navbar/logo-ayl.png";

const LINKS = [
  { label: "Inicio", vista: "inicio", icon: "bi-house-door" },
  { label: "Nosotros", vista: "nosotros", icon: "bi-info-circle" },
  { label: "Productos", vista: "productos", icon: "bi-tools" },
  { label: "Contactos", vista: "contactos", icon: "bi-envelope" },
];

function Navbar({
  onOpenLogin,
  vistaActual,
  setVista,
  usuario,
  logout,
  totalItems,
  setCartOpen,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navegar = (v) => {
    setVista(v);
    setIsOpen(false); // cierra el menú al navegar
  };

  return (
    <nav className="navbar navbar-expand-md bg-white shadow-sm py-2">
      <div className="container">

        {/* LOGO */}
        <a
          href="#"
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault();
            navegar("inicio");
          }}
        >
          <img src={logoMarca} alt="A&L" style={{ height: "45px" }} />
        </a>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENIDO COLAPSABLE */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarContent"
        >

          {/* LINKS */}
          <div className="navbar-nav mx-auto text-center gap-2">
            {LINKS.map((link) => (
              <a
                key={link.vista}
                href="#"
                className={`nav-link ${
                  vistaActual === link.vista ? "active fw-bold" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navegar(link.vista);
                }}
              >
                <i className={`bi ${link.icon} me-1`}></i>
                {link.label}
              </a>
            ))}
          </div>

          {/* DERECHA */}
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-2 mt-md-0">

            {/* CARRITO */}
            <button
              className="btn btn-outline-dark position-relative"
              onClick={() => setCartOpen(true)}
            >
              <i className="bi bi-cart3"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                  {totalItems}
                </span>
              )}
            </button>

            {/* AUTH */}
            {usuario ? (
              <>
                <button
                  className="btn btn-light"
                  onClick={() => navegar("perfil")}
                >
                  {usuario.nombre}
                </button>

                <button
                  className="btn btn-dark"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-dark"
                onClick={onOpenLogin}
              >
                Iniciar sesión
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;