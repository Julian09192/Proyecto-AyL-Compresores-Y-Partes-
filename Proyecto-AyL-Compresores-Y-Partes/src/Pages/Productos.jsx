import { useState } from "react";

// 1. IMPORTACIÓN DE COMPONENTES EXTERNOS
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import Swal from "sweetalert2";

/* ============================================================
   CONFIGURACIÓN DE DATOS (Catálogo)
   ============================================================ */
const PRODUCTOS = [
  { id: 1,  nombre: "Compresor Atlas Copco GA30",    categoria: "Compresores",  precio: "$12.500.000", emoji: "🔧", badge: "Destacado" },
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

function Productos({ 
  setVista, 
  usuario, 
  login, 
  logout, 
  carrito, 
  totalItems, 
  cartOpen, 
  setCartOpen, 
  agregarAlCarrito, 
  cambiarCantidad, 
  eliminarDelCarrito 
}) {
  
  const [showModal, setShowModal] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  const productosFiltrados = categoriaActiva === "Todos"
    ? PRODUCTOS
    : PRODUCTOS.filter((p) => p.categoria === categoriaActiva);

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
    <div className="bg-white">
      
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="productos"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />

      <main>
        {/* 1. HERO - Quitamos fontFamily pero dejamos el letterSpacing y tamaños */}
        <section className="py-5 mt-5">
          <div className="container text-center py-5">
            <p className="fw-bold mb-2 text-warning" style={{ letterSpacing: "5px" }}>CATÁLOGO</p>
            <h1 className="display-1 fw-bold text-dark" style={{ lineHeight: "0.9" }}>
              NUESTROS PRODUCTOS
            </h1>
            <p className="lead text-secondary mx-auto mt-4" style={{ maxWidth: "800px" }}>
              Equipos de alta calidad y repuestos originales para optimizar su planta industrial.
            </p>
          </div>
        </section>

        {/* 2. FILTROS Y GRILLA */}
        <section className="py-5 bg-light">
          <div className="container">
            
            <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  className={`btn rounded-pill px-4 fw-bold ${categoriaActiva === cat ? 'btn-warning text-white' : 'btn-outline-secondary bg-white'}`}
                  onClick={() => setCategoriaActiva(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="row g-4">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="col-sm-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm transition-hover">
                    <div className="card-img-top bg-white d-flex align-items-center justify-content-center position-relative" style={{ height: "200px", fontSize: "4rem" }}>
                      {producto.emoji}
                      {producto.badge && (
                        <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-white">
                          {producto.badge}
                        </span>
                      )}
                    </div>
                    <div className="card-body p-4">
                      <p className="text-warning fw-bold mb-1 small text-uppercase">{producto.categoria}</p>
                      <h4 className="fw-bold mb-2">{producto.nombre}</h4>
                      <h5 className="text-dark fw-bold mb-3">{producto.precio}</h5>
                      <button
                        className="btn btn-dark w-100 fw-bold py-2"
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
      </main>

      <Footer />

      <CartPanel
        carrito={carrito}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cambiarCantidad={cambiarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
      />

      {showModal && (
        <LoginModal login={login} onClose={() => setShowModal(false)} />
      )}

      <style>{`
        .transition-hover:hover { transform: translateY(-10px); transition: 0.3s; box-shadow: 0 1rem 3rem rgba(0,0,0,.1)!important; }
      `}</style>
    </div>
  );
}

export default Productos;