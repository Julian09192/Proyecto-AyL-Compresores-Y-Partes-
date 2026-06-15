import { useState, useEffect } from "react";

const LINKS = [
  { label: "Inicio", vista: "inicio" },
  { label: "Nosotros", vista: "nosotros" },
  { label: "Productos", vista: "productos" },
  { label: "Contactos", vista: "contactos" },
];

function Navbar({
  setVista,
  vistaActual,
  usuario,
  logout,
  onOpenLogin,
  forceSolid = false,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarSolid = forceSolid || isScrolled;

  const navbarStyle = {
    backgroundColor: navbarSolid
      ? "#000000"
      : "rgba(0, 0, 0, 0.88)",
    backdropFilter: navbarSolid ? "blur(10px)" : "none",
    borderBottom: navbarSolid
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid transparent",
    boxShadow: navbarSolid
      ? "0 4px 20px rgba(0,0,0,.15)"
      : "none",
    transition: "background-color .35s ease, padding .35s ease, transform .35s ease, opacity .35s ease",
    padding: navbarSolid ? "12px 0" : "15px 0", // Reducido ligeramente para dar balance al logo que sobresale
  };

  const mobileMenuStyle = {
    backgroundColor: "rgba(16, 20, 45, 0.98)",
    backdropFilter: "blur(14px)",
    borderRadius: "16px",
    padding: "15px",
    marginTop: "10px",
  };

  const navegar = (vista) => {
    setVista(vista);
    setIsOpen(false);
  };

  return (
    <header style={{ position: "relative", zIndex: 1100 }}>
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={navbarStyle}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="container" style={{ position: "relative" }}>
          
          {/* LOGO CONTAINER */}
          <div className="logo-container">
            <a
              className="navbar-brand d-flex align-items-center"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navegar("inicio");
              }}
              aria-label="Ir al inicio"
            >
              <img
                src="https://res.cloudinary.com/ddyrgkdxq/image/upload/f_auto,q_auto,w_250,dpr_auto/v1780288151/LOGO-SIN-FONDO.webp"
                alt="A&P Lubricantes"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                className="navbar-logo"
                width={180}
                height={118}
              />
            </a>
          </div>

          {/* BOTÓN HAMBURGUESA */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="main-navbar-collapse"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <i
              className={`bi ${isOpen ? "bi-x-lg" : "bi-list"}`}
              style={{
                fontSize: "2rem",
                color: "#FFFFFF",
              }}
            ></i>
          </button>

          {/* MENÚ */}
          <div
            id="main-navbar-collapse"
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            style={isOpen ? mobileMenuStyle : {}}
          >
            {/* LINKS */}
            <div
              className="navbar-nav mx-auto align-items-center"
              style={{
                gap: "2.5rem",
              }}
            >
              {LINKS.map((link) => (
                <a
                  key={link.vista}
                  href="#"
                  className="nav-link"
                  style={{
                    color:
                      vistaActual === link.vista
                        ? "#FFFFFF"
                        : "#F3F4F6",
                    fontSize: "1.05rem",
                    fontWeight: "500",
                    padding: "8px 0",
                    borderBottom:
                      vistaActual === link.vista
                        ? "3px solid #FFC107"
                        : "3px solid transparent",
                    transition: "all .25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      vistaActual === link.vista
                        ? "#FFFFFF"
                        : "#F3F4F6";
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navegar(link.vista);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* DERECHA */}
            <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-3 mt-lg-0">
              {usuario ? (
                <>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => navegar("perfil")}
                  >
                    {usuario.nombre}
                  </button>

                  <button
                    className="btn btn-outline-light"
                    onClick={logout}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                onOpenLogin && (
                  <button
                    className="btn btn-outline-light"
                    onClick={onOpenLogin}
                  >
                    Iniciar sesión
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

{/* CSS RESPONSIVE & MEGA LOGO TRICK */}
      <style>{`
          /* El contenedor le miente al navbar diciendo que mide solo 50px */
          .logo-container {
            position: relative;
            height: 50px; 
            width: 150px; /* Espacio horizontal reservado para que no encime los links */
            display: flex;
            align-items: center;
          }

          .navbar-logo {
            width: 150px; /* ¡Mucho más grande! (Antes 110px) */
            height: auto;
            object-fit: contain;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%) scale(1.1); /* Centrado y un toque de esteroides */
            transition: all .3s ease;
            filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.2)); /* Le da profundidad al sobresalir */
          }

          /* Efecto opcional: se encoge un poquito al hacer scroll para no tapar contenido */
          .navbar-logo:hover {
            transform: translateY(-50%) scale(1.15);
          }

          @media (max-width: 991px) {
            .logo-container {
              height: 45px;
              width: 120px;
            }
            
            .navbar-logo {
              width: 125px; /* Más grande en móviles también */
              transform: translateY(-50%);
            }

            .navbar-nav {
              gap: 0 !important;
              margin-top: 15px;
            }

            .navbar-nav .nav-link {
              width: 100%;
              text-align: center;
              padding: 14px 0 !important;
              border-bottom: none !important;
            }
          }
        `}
      </style>
    </header>
  );
}

export default Navbar;