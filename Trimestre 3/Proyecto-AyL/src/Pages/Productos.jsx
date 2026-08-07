import { useState, useEffect } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import Swal from "sweetalert2";

import ImgProductos from "../assets/imgProductos/imgProductos.jpg";
import imgHerramienta from "../assets/imgProductos/herramienta.jpg";
import imgCompresor from "../assets/imgProductos/compresor.jpg";
import imgAceiteSin from "../assets/imgProductos/Aceite sintetico 5W-40.jpg";
import imgFiltroAceite from "../assets/imgProductos/Filtro de Aceite W962.jpg";
import imgFiltroAire from "../assets/imgProductos/Filtro de Aire GA-30.jpg";
import imgFiltroSep from "../assets/imgProductos/Filtro Separador.jpg";
import imgLlaveTorque from "../assets/imgProductos/Llave de Torque Neumática.jpg";
import imgManguera from "../assets/imgProductos/Manguera de Alta Presión 10m.jpg";
import imgManometro from "../assets/imgProductos/Manómetro de Glicerina.jpg";
import imgPanel from "../assets/imgProductos/panel.jpg";
import imgSepAceite from "../assets/imgProductos/separador-de-aceite.jpg";
import imgSeparador from "../assets/imgProductos/Separador.jpg";
import imgValvulaAdm from "../assets/imgProductos/Válvula de Admisión IV-20.jpg";
import imgValvulaRet from "../assets/imgProductos/Válvula de Retención Térmica.jpg";

const CATEGORIAS = ["Todos", "Compresores", "Filtros", "Lubricantes", "Válvulas", "Herramientas", "Accesorios"];

const obtenerImagen = (nombre) => {
  if (!nombre) return imgHerramienta;
  const n = nombre.toLowerCase();
  if (n.includes("Aceite") && n.includes("Sintético")) return imgAceiteSin;
  if (n.includes("filtro") && n.includes("aceite")) return imgFiltroAceite;
  if (n.includes("filtro") && n.includes("aire")) return imgFiltroAire;
  if (n.includes("filtro") && n.includes("separador")) return imgFiltroSep;
  if (n.includes("separador") && n.includes("aceite")) return imgSepAceite;
  if (n.includes("separador")) return imgSeparador;
  if (n.includes("válvula") && n.includes("admisión")) return imgValvulaAdm;
  if (n.includes("válvula") && n.includes("retención")) return imgValvulaRet;
  if (n.includes("llave") && n.includes("torque")) return imgLlaveTorque;
  if (n.includes("manguera")) return imgManguera;
  if (n.includes("manómetro")) return imgManometro;
  if (n.includes("panel")) return imgPanel;
  if (n.includes("compresor")) return imgCompresor;
  if (n.includes("válvula") || n.includes("valvula")) return imgValvulaAdm;
  if (n.includes("filtro")) return imgFiltroSep;
  if (n.includes("herramienta") || n.includes("llave") || n.includes("taladro")) return imgHerramienta;

  return imgHerramienta;
};

function Productos({ setVista, usuario, login, logout, carrito, totalItems, cartOpen, setCartOpen, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito }) {
  const [showModal, setShowModal] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [productosApi, setProductosApi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://69cdf09333a09f831b7caeb6.mockapi.io/productos/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductosApi(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setLoading(false);
      });
  }, []);

  const productosFiltrados = categoriaActiva === "Todos"
    ? productosApi
    : productosApi.filter((p) => p.Categoria === categoriaActiva);

  const handleAgregar = (producto) => {
    if (!usuario) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Regístrate para gestionar tus compras.",
        confirmButtonColor: "#F5A623",
      }).then(() => setShowModal(true));
      return;
    }
    
    const precioFormateado = "$" + Number(producto.Precio).toLocaleString('es-CO');

    const productoNormalizado = {
      ...producto,
      id: producto.id, 
      nombre: producto.Nombre,  
      precio: precioFormateado, 
      categoria: producto.Categoria 
    };

    agregarAlCarrito(productoNormalizado);
  };

  const SkeletonCard = () => (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="card border-0 shadow-sm opacity-50" style={{ height: "350px", background: "#eee" }}></div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#fcfcfc", minHeight: "100vh" }}>
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="productos"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />

      <section style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${ImgProductos})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "120px 0",
      }}>
        <div className="container text-center">
          <span className="badge mb-3" style={{ background: "#F5A623", padding: "10px 18px", borderRadius: "20px" }}>
            CATÁLOGO 
          </span>
          <h1 className="text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "6.5rem", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
            Nuestros Productos
          </h1>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "50px",
                  border: "2px solid",
                  borderColor: categoriaActiva === cat ? "#F5A623" : "#e0e0e0",
                  backgroundColor: categoriaActiva === cat ? "#F5A623" : "transparent",
                  color: categoriaActiva === cat ? "#fff" : "#666",
                  fontWeight: "600",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: categoriaActiva === cat ? "0 4px 15px rgba(245, 166, 35, 0.3)" : "none"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="row">
              {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="row g-4">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="col-sm-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-hover transition-card" 
                       style={{ borderRadius: "20px", overflow: "hidden" }}>
                    
                    <div className="position-relative overflow-hidden bg-light" style={{ height: "220px" }}>
                      <img 
                        src={obtenerImagen(producto.Nombre)} 
                        alt={producto.Nombre} 
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "30px" }}
                      />
                    </div>

                    <div className="card-body p-4">
                      <small className="text-uppercase fw-bold text-muted" style={{ letterSpacing: "1px", fontSize: "0.7rem" }}>
                        {producto.Categoria}
                      </small>
                      <h5 className="fw-bold mt-1 mb-2">{producto.Nombre}</h5>
                      
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <span className="h4 fw-bold mb-0">
                          ${Number(producto.Precio).toLocaleString('es-CO')}
                        </span>
                      </div>
                      <button
                        className="btn btn-outline-dark w-100 mt-3 fw-bold py-2"
                        style={{ borderRadius: "12px", position: "relative", zIndex: 10 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAgregar(producto);
                        }}
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CartPanel {...{setVista, carrito, cartOpen, setCartOpen, cambiarCantidad, eliminarDelCarrito}} />
      {showModal && <LoginModal login={login} onClose={() => setShowModal(false)} />}

      <style>{`
        .shadow-hover:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important; }
        .transition-card { background: white; border: 1px solid #eee; transition: all 0.3s ease; }
      `}</style>
    </div>
  );
}

export default Productos;