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
    setIsOpen(false);
  };

  // Estilos comunes para los links
  const linkStyle = (v) => ({
    color: vistaActual === v ? "#ffc107" : "#ffffff",
    fontWeight: "normal",
    transition: "color 0.3s ease",
    textDecoration: "none",
  });

  return (
    <nav className="navbar navbar-expand-md bg-black shadow-sm py-2">
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

        {/* BOTÓN HAMBURGUESA (Blanco para fondo negro) */}
        <button
          className="navbar-toggler border-0"
          type="button"
          style={{ filter: "invert(1)" }} // Esto hace que el icono hamburguesa sea blanco
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENIDO COLAPSABLE */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          
          {/* LINKS */}
          <div className="navbar-nav mx-auto text-center gap-2">
            {LINKS.map((link) => (
              <a
                key={link.vista}
                href="#"
                className="nav-link"
                style={linkStyle(link.vista)}
                // Simulación de Hover con JS
                onMouseEnter={(e) => (e.target.style.color = "#ffc107")}
                onMouseLeave={(e) =>
                  (e.target.style.color =
                    vistaActual === link.vista ? "#ffc107" : "#ffffff")
                }
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
              className="btn btn-outline-light position-relative"
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

                <button className="btn btn-outline-danger" onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-light"
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