import { useState, useEffect } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import Swal from "sweetalert2";
import ImgProductos from "../assets/ImgProductos.jpg";
import imagen from "../assets/herramienta.jpg";


const CATEGORIAS = ["Todos", "Compresores", "Filtros", "Lubricantes", "Válvulas", "Herramientas", "Accesorios"];

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
    : productosApi.filter((p) => p.categoria === categoriaActiva);

  const handleAgregar = (producto) => {
    if (!usuario) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesión primero",
        text: "Debes tener una cuenta para agregar productos al carrito.",
        confirmButtonColor: "#F5A623",
      }).then(() => setShowModal(true));
      return;
    }
    agregarAlCarrito(producto);
  };

  return (
    <>
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="productos"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />


      <section style={{backgroundImage:`url(${ImgProductos})`, backgroundSize: "cover", backgroundPosition: "center", padding: "100px 0"}}>
        <div className="container text-center">
          <p className="text-white fw-bold mb-2" style={{ fontSize: "0.8rem", letterSpacing: 2, textTransform: "uppercase", opacity: 0.85,color: "#000000" }}>
            CATÁLOGO
          </p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#000000", lineHeight: 1.05 }}>
            Nuestros Productos
          </h1>
        </div>
      </section>

      <section className="py-5" style={{ background: "#f8f8f8" }}>
        <div className="container">

          <div className="d-flex flex-wrap gap-2 mb-3">
            {CATEGORIAS.map((cat) => {
              const activo = categoriaActiva === cat;
              return (
                <button
                  key={cat}
                  className="border rounded-pill fw-semibold"
                  style={{
                    background: activo ? "#F5A623" : "#fff",
                    borderColor: activo ? "#F5A623" : "#dee2e6",
                    color: activo ? "#fff" : "#495057",
                    fontSize: "0.88rem",
                    padding: "0.45rem 1.1rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setCategoriaActiva(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-5">Cargando productos...</div>
          ) : (
            <>
              <p className="text-secondary mb-4" style={{ fontSize: "0.85rem" }}>
                Mostrando <strong>{productosFiltrados.length}</strong> producto{productosFiltrados.length !== 1 ? "s" : ""}
                {categoriaActiva !== "Todos" && ` en ${categoriaActiva}`}
              </p>

              <div className="row g-4">
                {productosFiltrados.map((producto) => (
                  <div key={producto.id} className="col-sm-6 col-lg-4">
                    <div className="product-card h-100 shadow-sm bg-white rounded-4 overflow-hidden border-0">
                      <div className="product-card__img p-4 text-center bg-light position-relative" style={{ fontSize: "3rem", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={imagen} alt="" />
                      </div>

                      <div className="product-card__body p-4">
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                          {producto.Categoria}
                        </p>
                        
                        <h3 className="h5 fw-bold text-dark mb-2">{producto.Nombre}</h3>
                        
                        <p className="fw-bold h5 mb-3" style={{ color: "#1a1a1a" }}>
                          $ {Number(producto.Precio).toLocaleString('es-CO')}
                        </p>

                        <button
                          className="w-100 border-0 rounded-3 fw-bold py-2 text-white"
                          style={{ background: "#1a1a1a", fontSize: "0.85rem", cursor: "pointer", transition: "background 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#F5A623"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#1a1a1a"}
                          onClick={() => handleAgregar(producto)}
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />

      <CartPanel
        setVista={setVista}
        carrito={carrito}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cambiarCantidad={cambiarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
      />

      {showModal && (
        <LoginModal
          login={login}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default Productos;