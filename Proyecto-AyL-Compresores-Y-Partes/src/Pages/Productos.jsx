import { useState } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import Swal from "sweetalert2";

const PRODUCTOS = [
  { id: 1,  nombre: "Compresor Atlas Copco GA30",     categoria: "Compresores",  precio: "$12.500.000", emoji: "🔧", badge: "Destacado" },
  { id: 2,  nombre: "Compresor Ingersoll Rand SSR",    categoria: "Compresores",  precio: "$9.800.000",  emoji: "🔧", badge: null },
  { id: 3,  nombre: "Compresor Schulz MSV 6/30",       categoria: "Compresores",  precio: "$3.200.000",  emoji: "🔧", badge: "Oferta" },
  { id: 4,  nombre: "Filtro de Aire FA-500",           categoria: "Filtros",      precio: "$180.000",    emoji: "🔵", badge: null },
  { id: 5,  nombre: "Filtro Separador FS-200",         categoria: "Filtros",      precio: "$320.000",    emoji: "🔵", badge: "Destacado" },
  { id: 6,  nombre: "Filtro de Aceite FO-100",         categoria: "Filtros",      precio: "$145.000",    emoji: "🔵", badge: null },
  { id: 7,  nombre: "Aceite Shell Corena S4 R46",      categoria: "Lubricantes",  precio: "$420.000",    emoji: "🟡", badge: "Destacado" },
  { id: 8,  nombre: "Aceite Mobil Rarus SHC 1025",     categoria: "Lubricantes",  precio: "$380.000",    emoji: "🟡", badge: null },
  { id: 9,  nombre: "Lubricante Castrol Aircol PD 46", categoria: "Lubricantes",  precio: "$290.000",    emoji: "🟡", badge: null },
  { id: 10, nombre: "Válvula de Seguridad 8 bar",      categoria: "Válvulas",     precio: "$210.000",    emoji: "🔴", badge: null },
  { id: 11, nombre: "Válvula Check VC-25",             categoria: "Válvulas",     precio: "$175.000",    emoji: "🔴", badge: "Oferta" },
  { id: 12, nombre: "Válvula Solenoide VS-12",         categoria: "Válvulas",     precio: "$340.000",    emoji: "🔴", badge: null },
  { id: 13, nombre: 'Pistola de Impacto 1/2"',         categoria: "Herramientas", precio: "$650.000",    emoji: "⚙️", badge: "Destacado" },
  { id: 14, nombre: 'Llave Neumática 3/4"',            categoria: "Herramientas", precio: "$890.000",    emoji: "⚙️", badge: null },
  { id: 15, nombre: "Lijadora Orbital Neumática",      categoria: "Herramientas", precio: "$480.000",    emoji: "⚙️", badge: null },
  { id: 16, nombre: "Manguera Alta Presión 10m",       categoria: "Accesorios",   precio: "$195.000",    emoji: "🟠", badge: null },
  { id: 17, nombre: "Kit de Mantenimiento KM-500",     categoria: "Accesorios",   precio: "$520.000",    emoji: "🟠", badge: "Destacado" },
  { id: 18, nombre: 'Acople Rápido 1/4"',              categoria: "Accesorios",   precio: "$45.000",     emoji: "🟠", badge: "Oferta" },
];

const CATEGORIAS = ["Todos", "Compresores", "Filtros", "Lubricantes", "Válvulas", "Herramientas", "Accesorios"];

function Productos({ setVista, usuario, login, logout, carrito, totalItems, cartOpen, setCartOpen, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito }) {
  const [showModal, setShowModal] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  const productosFiltrados = categoriaActiva === "Todos"
    ? PRODUCTOS
    : PRODUCTOS.filter((p) => p.categoria === categoriaActiva);

  const handleAgregar = (producto) => {
    if (!usuario) {
      // Si no está logueado, abre el modal de login
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

      {/* Hero */}
      <section style={{ background: "#F5A623", padding: "4rem 0 3.5rem" }}>
        <div className="container text-center">
          <p className="text-white fw-bold mb-2" style={{ fontSize: "0.8rem", letterSpacing: 2, textTransform: "uppercase", opacity: 0.85 }}>
            CATÁLOGO
          </p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", lineHeight: 1.05 }}>
            Nuestros Productos
          </h1>
          <p className="text-white mb-0" style={{ opacity: 0.88, maxWidth: 500, margin: "0 auto", fontWeight: 300 }}>
            Compresores, herramientas y accesorios de las mejores marcas industriales.
          </p>
        </div>
      </section>

      {/* Filtros + productos */}
      <section className="py-5" style={{ background: "#f8f8f8" }}>
        <div className="container">

          {/* Botones de filtro — Bootstrap puro */}
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

          {/* Contador */}
          <p className="text-secondary mb-4" style={{ fontSize: "0.85rem" }}>
            Mostrando <strong>{productosFiltrados.length}</strong> producto{productosFiltrados.length !== 1 ? "s" : ""}
            {categoriaActiva !== "Todos" && ` en ${categoriaActiva}`}
          </p>

          {/* Grid de tarjetas */}
          <div className="row g-4">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="col-sm-6 col-lg-4">
                <div className="product-card h-100">
                  <div className="product-card__img">
                    <span className="product-card__emoji">{producto.emoji}</span>
                    {producto.badge && (
                      <span className="product-card__badge">{producto.badge}</span>
                    )}
                  </div>
                  <div className="product-card__body">
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                      {producto.categoria}
                    </p>
                    <h3 className="product-card__name">{producto.nombre}</h3>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 0 }}>
                      {producto.precio}
                    </p>
                    {/* Botón agregar al carrito */}
                    <button
                      className="w-100 border-0 rounded-2 fw-bold py-2 mt-3 text-white"
                      style={{ background: "#1a1a1a", fontSize: "0.85rem", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F5A623"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#1a1a1a"}
                      onClick={() => handleAgregar(producto)}
                    >
                      🛒 Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />

      {/* Panel carrito */}
      <CartPanel
        carrito={carrito}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cambiarCantidad={cambiarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
      />

      {/* Modal login */}
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