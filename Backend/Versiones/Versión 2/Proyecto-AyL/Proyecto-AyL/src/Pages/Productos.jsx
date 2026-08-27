import { useState, useEffect } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import Swal from "sweetalert2";

// Solo mantenemos el Hero
import ImgProductos from "../assets/imgProductos/imgProductos.jpg"; 

const CATEGORIAS = ["Todos", "Compresores", "Filtros", "Lubricantes", "Válvulas", "Herramientas", "Accesorios"];
const API_URL = "http://localhost:3001/productos";

function Productos({ setVista, usuario, login, logout, carrito, totalItems, cartOpen, setCartOpen, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito }) {
  const [showModal, setShowModal] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [productosApi, setProductosApi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        const baseDatos = Array.isArray(data) ? data : (data.productos || []);
        const visibles = baseDatos.filter(p => !p.suspendido);
        
        setProductosApi(visibles);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = categoriaActiva === "Todos"
    ? productosApi
    : productosApi.filter((p) => p.Tipo?.toLowerCase() === categoriaActiva.toLowerCase());

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
    
    agregarAlCarrito({
      ...producto,
      id: producto.id, 
      nombre: producto.Nombre,  
      precio: precioFormateado, 
      categoria: producto.Tipo 
    });
  };

  const SkeletonCard = () => (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="card border-0 shadow-sm opacity-50" style={{ height: "350px", background: "#eee", borderRadius: "20px" }}></div>
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
                  transition: "all 0.3s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              productosFiltrados.map((producto) => (
                <div key={producto.id} className="col-sm-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-hover transition-card" style={{ borderRadius: "20px", overflow: "hidden" }}>
                    
                    <div className="position-relative overflow-hidden bg-light" style={{ height: "220px" }}>
                      {/* Ahora solo carga producto.ImagenUrl. Si no hay, el contenedor queda bg-light vacío */}
                      {producto.ImagenUrl && (
                        <img 
                          src={producto.ImagenUrl} 
                          alt={producto.Nombre} 
                          style={{ width: "100%", height: "100%", objectFit: "contain", padding: "30px" }}
                        />
                      )}
                    </div>

                    <div className="card-body p-4">
                      <small className="text-uppercase fw-bold text-muted" style={{ letterSpacing: "1px", fontSize: "0.7rem" }}>
                        {producto.Tipo}
                      </small>
                      <h5 className="fw-bold mt-1 mb-2">{producto.Nombre}</h5>
                      
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <span className="h4 fw-bold mb-0">
                          ${Number(producto.Precio).toLocaleString('es-CO')}
                        </span>
                      </div>
                      <button
                        className="btn btn-outline-dark w-100 mt-3 fw-bold py-2"
                        style={{ borderRadius: "12px" }}
                        onClick={() => handleAgregar(producto)}
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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