import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import Swal from "sweetalert2";

const CATEGORIAS = ["Todos", "Aceite", "Compresores", "Filtros", "Lubricantes", "Válvulas", "Herramientas", "Accesorios"];
const API_URL = "http://localhost:3001/productos";

// ─── Tarjeta de producto extraída como componente ─────────────────────────────
function ProductCard({ producto, onAgregar }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="col-sm-6 col-lg-4 mb-4" // Se agregó mb-4 para espaciado
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="card h-100 border-0"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.25s ease, transform 0.25s ease",
          transform: hovered ? "translateY(-4px)" : "none",
        }}
      >
        <div
          className="position-relative bg-white"
          style={{ height: "220px", overflow: "hidden" }}
        >
          {/* ✅ Ajuste: imagen_url en minúscula */}
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "24px",
                transition: "transform 0.3s ease",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center h-100 text-muted"
              style={{ fontSize: "2rem" }}
            >
              📦
            </div>
          )}

          {/* Badge de categoría - ✅ Ajuste: tipo en minúscula */}
          <span
            className="position-absolute top-0 start-0 m-2 badge"
            style={{
              backgroundColor: "#FFF3CD",
              color: "#856404",
              fontWeight: 600,
              fontSize: "0.7rem",
              borderRadius: "8px",
              padding: "4px 10px",
              textTransform: "capitalize"
            }}
          >
            {producto.tipo}
          </span>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px",
              background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.25s ease",
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            <button
              className="btn w-100 fw-bold"
              style={{
                backgroundColor: "#F5A623",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.85rem",
                padding: "8px",
              }}
              onClick={() => onAgregar(producto)}
            >
              + Añadir al carrito
            </button>
          </div>
        </div>

        <div className="card-body p-3" style={{ backgroundColor: "#fff" }}>
          {/* ✅ Ajuste: nombre en minúscula */}
          <p
            className="mb-1 text-truncate"
            title={producto.nombre}
            style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1a1a" }}
          >
            {producto.nombre}
          </p>

          <div className="d-flex align-items-center justify-content-between mt-2">
            {/* ✅ Ajuste: precio en minúscula */}
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a1a1a" }}>
              ${Number(producto.precio).toLocaleString("es-CO")}
            </span>
            <button
              className="btn btn-sm d-lg-none"
              style={{
                backgroundColor: "#F5A623",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.75rem",
              }}
              onClick={() => onAgregar(producto)}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton loader (Igual al anterior) ──────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div
        className="card border-0"
        style={{
          height: "320px",
          borderRadius: "16px",
          background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function Productos({
  setVista, usuario, login, logout,
  carrito, totalItems, cartOpen, setCartOpen,
  agregarAlCarrito, cambiarCantidad, eliminarDelCarrito,
}) {
  const [showModal, setShowModal] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("relevancia");
  const [productosApi, setProductosApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const baseDatos = Array.isArray(data) ? data : (data.productos || []);
        // ✅ Ajuste: suspendido en minúscula
        setProductosApi(baseDatos.filter((p) => Number(p.suspendido) === 0));
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No pudimos cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const productosFiltrados = useMemo(() => {
    // ✅ Ajuste: tipo en minúscula para el filtro
    let lista = categoriaActiva === "Todos"
      ? productosApi
      : productosApi.filter((p) => p.tipo?.toLowerCase() === categoriaActiva.toLowerCase());

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      // ✅ Ajuste: nombre y tipo en minúscula
      lista = lista.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(q) ||
          p.tipo?.toLowerCase().includes(q)
      );
    }

    // ✅ Ajuste: precio en minúscula
    if (orden === "menor") lista = [...lista].sort((a, b) => Number(a.precio) - Number(b.precio));
    if (orden === "mayor") lista = [...lista].sort((a, b) => Number(b.precio) - Number(a.precio));

    return lista;
  }, [productosApi, categoriaActiva, busqueda, orden]);

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

    agregarAlCarrito({
      ...producto,
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      categoria: producto.tipo,
    });
  };

  return (
    <div style={{ backgroundColor: "#F4F4F4", minHeight: "100vh" }}>
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="productos"
        {...{ setVista, usuario, logout, totalItems, setCartOpen }}
      />

      <section
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.68)),
            url(https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777133787/IMG_Productos.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "340px",
        }}
      >
        <div className="text-center px-3">
            <h1
              className="text-white fw-bold"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                letterSpacing: "3px",
              }}
            >
            CATÁLOGO <span style={{ color: "#F5A623" }}>INDUSTRIAL</span>
          </h1>
          <p className="text-white-50 lead mx-auto" style={{ maxWidth: "560px" }}>
            Repuestos originales y lubricantes de alta gama para mantener tu maquinaria al 100%.
          </p>
        </div>
      </section>

      <div className="container-fluid px-lg-5 py-5">
        <div className="row g-4">
          <aside className="col-lg-3 d-none d-lg-block">
            <div
              className="card border-0 sticky-top p-4"
              style={{ top: "100px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
            >
              <h5 className="fw-bold mb-4" style={{ fontSize: "1rem" }}>Filtrar por</h5>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Buscador</label>
                <div className="input-group border rounded-pill overflow-hidden">
                  <span className="input-group-text bg-white border-0">
                    <i className="bi bi-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="¿Qué buscas?"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  {busqueda && (
                    <button
                      className="btn btn-link border-0 text-muted pe-3"
                      onClick={() => setBusqueda("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Categorías</label>
                <div className="d-flex flex-column gap-1 mt-2">
                  {CATEGORIAS.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => setCategoriaActiva(cat)}
                      style={{
                        cursor: "pointer",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                        fontWeight: categoriaActiva === cat ? 600 : 400,
                        backgroundColor: categoriaActiva === cat ? "#FFF3CD" : "transparent",
                        color: categoriaActiva === cat ? "#856404" : "#555",
                        transition: "0.15s",
                        borderLeft: categoriaActiva === cat ? "3px solid #F5A623" : "3px solid transparent",
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-3 rounded-4 mt-2"
                style={{ backgroundColor: "#FFF8EC", border: "1px solid #FFE0A3" }}
              >
                <p className="small mb-0" style={{ color: "#7A4F00" }}>
                  <i className="bi bi-truck me-2" style={{ color: "#F5A623" }} />
                  Envío gratis en Bogotá por compras superiores a $500.000
                </p>
              </div>
            </div>
          </aside>

          <main className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4 px-1 flex-wrap gap-2">
              <p className="text-muted mb-0">
                Mostrando <b>{productosFiltrados.length}</b> productos
              </p>
              <select
                className="form-select w-auto border-0 shadow-sm rounded-pill"
                style={{ fontSize: "0.875rem" }}
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="relevancia">Ordenar: Relevancia</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>

            {error && (
              <div className="alert alert-warning d-flex align-items-center gap-2 rounded-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill" />
                {error}
              </div>
            )}

            <div className="row g-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                productosFiltrados.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} onAgregar={handleAgregar} />
                ))
              )}
            </div>

            {!loading && !error && productosFiltrados.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search display-1 text-muted" />
                <h4 className="mt-3">No encontramos productos</h4>
                <p className="text-muted">Prueba con otra categoría o palabra clave.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      <CartPanel
        {...{ setVista, carrito, cartOpen, setCartOpen, cambiarCantidad, eliminarDelCarrito }}
        usuario={usuario}
        onOpenLogin={() => setShowModal(true)}
      />

      {showModal && <LoginModal login={login} onClose={() => setShowModal(false)} />}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default Productos;