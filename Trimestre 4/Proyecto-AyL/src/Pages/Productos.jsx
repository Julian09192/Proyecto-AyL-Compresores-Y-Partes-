import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/client";

// Componentes Globales
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/Login/LoginModal";

// Subcomponentes y Utilidades Locales Refactorizados
import MiniCarruselCatalog from "../components/Pages/Productos/MiniCarruselCatalog";
import { obtenerTipoPrincipal, obtenerSubtipo } from "../components/Pages/Productos/catalogUtils";

const TIPOS_PRINCIPALES = ["Todos", "Filtros", "Lubricantes", "Compresores", "Válvulas", "Herramientas", "Accesorios", "Otros"];

const SUBTIPOS_POR_TIPO = {
  Filtros: ["Todos", "Separador", "Aceite", "Aire", "Otros"],
  Lubricantes: ["Todos", "Cuarto", "Galon", "Garrafa", "Otros"]
};

function Productos({
  setVista,
  usuario,
  logout,
  login,
  setProductoSeleccionadoId,
  totalItems,
  setCartOpen,
  onOpenLogin
}) {
  const [showModal, setShowModal] = useState(false);
  const [marcaActiva, setMarcaActiva] = useState("");
  const [tipoActivo, setTipoActivo] = useState("Todos");
  const [subtipoActivo, setSubtipoActivo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState("Relevancia");
  const [productosApi, setProductosApi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("productos").select("*");
        if (error) throw error;

        // Estructuración dinámica a partir del string imagen_url de la DB
        const productosProcesados = (data || []).map(p => {
          const arrayDeImagenes = [];
          if (p.imagen_url) {
            arrayDeImagenes.push({
              imagen_url: p.imagen_url,
              cloudinary_imagen_public_id: p.cloudinary_imagen_public_id
            });
          }
          return {
            ...p,
            todas_las_imagenes: arrayDeImagenes
          };
        });

        setProductosApi(productosProcesados);
      } catch (err) {
        console.error("Error al cargar productos desde Supabase:", err.message);
        setProductosApi([]);
      } finally {
        setLoading(false);
      }
    }
    cargarProductos();
  }, []);

  const marcasDisponibles = Array.from(
    new Set(productosApi.map((p) => (p.marca || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

  const productosFiltradosYOrdenados = productosApi
    .filter((p) => {
      const estaActivo = p.suspendido === false || p.suspendido === null || !p.suspendido;
      if (!estaActivo) return false;

      const marcaProducto = (p.marca || "").trim();
      const tipoProducto = obtenerTipoPrincipal(p);
      const subtipoProducto = obtenerSubtipo(p, tipoProducto);

      const cumpleMarca = !marcaActiva || marcaActiva === marcaProducto;
      const cumpleTipo = tipoActivo === "Todos" || tipoProducto === tipoActivo;
      const cumpleSubtipo = subtipoActivo === "Todos" || subtipoProducto === subtipoActivo;

      const busquedaLimpia = busqueda.trim().toLowerCase();
      const cumpleBusqueda =
        busquedaLimpia === "" ||
        (p.nombre && p.nombre.toLowerCase().includes(busquedaLimpia)) ||
        (p.codigo_interno && p.codigo_interno.toLowerCase().includes(busquedaLimpia)) ||
        (p.caracteristicas && p.caracteristicas.toLowerCase().includes(busquedaLimpia));

      return cumpleMarca && cumpleTipo && cumpleSubtipo && cumpleBusqueda;
    })
    .sort((a, b) => {
      if (ordenamiento === "Menor precio") return Number(a.precio) - Number(b.precio);
      if (ordenamiento === "Mayor precio") return Number(b.precio) - Number(a.precio);
      return 0;
    });

  const handleVerDetalles = (id) => {
    setProductoSeleccionadoId(id);
    setVista("producto-detalle");
  };

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      {/* ✅ CORREGIDO: fetchPriority en lugar de fetchpriority */}
      <Helmet>
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/ddyrgkdxq/image/upload/f_auto,q_auto:eco,w_1920,h_600,c_fill/v1780240514/IMG_Productos.webp"
          // ✅ Ahora usa fetchPriority correctamente
          fetchPriority="high"
        />
        {/* Agregar también el preconnect para mejorar la carga */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
      </Helmet>

      <Navbar
        vistaActual="productos"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
        onOpenLogin={onOpenLogin || (() => setShowModal(true))}
      />

      <section
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(https://res.cloudinary.com/ddyrgkdxq/image/upload/f_auto,q_auto:eco,w_1920,h_600,c_fill/v1780240514/IMG_Productos.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "clamp(220px, 40vh, 500px)",
        }}
      >
        <div className="text-center px-3">
          <h1 className="text-white display-2 fw-bold" style={{ fontFamily: "Arial, sans-serif", letterSpacing: "3px", fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}>
            CATÁLOGO <span className="text-warning">INDUSTRIAL</span>
          </h1>
          <p className="text-white-50 lead mx-auto" style={{ maxWidth: "600px", fontSize: "clamp(0.9rem, 2vw, 1.1rem)" }}>
            Encuentra repuestos originales y lubricantes de alta gama para mantener tu maquinaria al 100%.
          </p>
        </div>
      </section>

      {/* Banner Principal - Optimizado con carga lazy */}
      {/* Grid del Contenedor de Catálogo */}
      <div className="container-fluid px-3 px-lg-5 py-4 py-lg-5">

        {/* ── FILTROS MÓVIL (visible solo en móviles) ── */}
        <div className="d-lg-none mb-4">
          <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "15px" }}>
            <button
              className="btn btn-sm btn-outline-dark w-100 fw-bold d-flex justify-content-between align-items-center"
              data-bs-toggle="collapse"
              data-bs-target="#filtrosMobile"
              aria-expanded="false"
            >
              <span><i className="bi bi-funnel me-2"></i>Filtrar productos</span>
              <i className="bi bi-chevron-down"></i>
            </button>
            <div className="collapse mt-3" id="filtrosMobile">
              <div className="mb-3">
                <label htmlFor="busquedaMobile" className="form-label small fw-bold text-muted text-uppercase">Buscador</label>
                <div className="input-group border rounded-pill overflow-hidden">
                  <span className="input-group-text bg-white border-0" aria-hidden="true"><i className="bi bi-search"></i></span>
                  <input
                    id="busquedaMobile"
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="¿Qué buscas?"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  {busqueda && (
                    <button className="btn btn-link text-muted border-0 bg-transparent pe-3 shadow-none text-decoration-none" onClick={() => setBusqueda("")} type="button">
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Marca</label>
                <select className="form-select" value={marcaActiva} onChange={(e) => setMarcaActiva(e.target.value)}>
                  <option value="">Todas las marcas</option>
                  {marcasDisponibles.map((marca) => <option key={marca} value={marca}>{marca}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Tipo</label>
                <select className="form-select" value={tipoActivo} onChange={(e) => { setTipoActivo(e.target.value); setSubtipoActivo("Todos"); }}>
                  {TIPOS_PRINCIPALES.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </div>
              {(tipoActivo === "Filtros" || tipoActivo === "Lubricantes") && (
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Subtipo</label>
                  <select className="form-select" value={subtipoActivo} onChange={(e) => setSubtipoActivo(e.target.value)}>
                    {SUBTIPOS_POR_TIPO[tipoActivo].map((subtipo) => <option key={subtipo} value={subtipo}>{subtipo}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4">

          {/* Sidebar de Filtros (Fijo en Escritorio) */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: "100px", borderRadius: "15px" }}>
              <h5 className="fw-bold mb-4">Filtrar por</h5>

              <div className="mb-4">
                <label htmlFor="busquedaInput" className="form-label small fw-bold text-muted text-uppercase">Buscador</label>
                <div className="input-group border rounded-pill overflow-hidden">
                  <span className="input-group-text bg-white border-0" aria-hidden="true"><i className="bi bi-search"></i></span>
                  <input
                    id="busquedaInput"
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="¿Qué buscas?"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    aria-label="Buscar productos"
                  />
                  {busqueda && (
                    <button
                      className="btn btn-link text-muted border-0 bg-transparent pe-3 y-0 shadow-none text-decoration-none"
                      onClick={() => setBusqueda("")}
                      style={{ fontSize: "0.85rem" }}
                      type="button"
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Marca</label>
                <select className="form-select" value={marcaActiva} onChange={(e) => setMarcaActiva(e.target.value)}>
                  <option value="">Todas las marcas</option>
                  {marcasDisponibles.map((marca) => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Tipo</label>
                <select
                  className="form-select"
                  value={tipoActivo}
                  onChange={(e) => {
                    setTipoActivo(e.target.value);
                    setSubtipoActivo("Todos");
                  }}
                >
                  {TIPOS_PRINCIPALES.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {(tipoActivo === "Filtros" || tipoActivo === "Lubricantes") && (
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Subtipo</label>
                  <select className="form-select" value={subtipoActivo} onChange={(e) => setSubtipoActivo(e.target.value)}>
                    {SUBTIPOS_POR_TIPO[tipoActivo].map((subtipo) => (
                      <option key={subtipo} value={subtipo}>{subtipo}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-light p-3 rounded-4 mt-4">
                <p className="small mb-0 text-dark">
                  <i className="bi bi-truck me-2 text-warning"></i>
                  Envío gratis en Bogotá por compras superiores a $500.000
                </p>
              </div>
            </div>
          </aside>

          {/* Listado Principal de Productos */}
          <main className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
              <p className="text-muted mb-0">Mostrando <b>{productosFiltradosYOrdenados.length}</b> productos</p>
              <select
                className="form-select w-auto border-0 shadow-sm rounded-pill"
                style={{ fontSize: "0.9rem" }}
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
              >
                <option value="Relevancia">Ordenar por: Relevancia</option>
                <option value="Menor precio">Menor precio</option>
                <option value="Mayor precio">Mayor precio</option>
              </select>
            </div>

            {loading ? (
              <div className="row g-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="col-6 col-md-4">
                    <div className="card border-0 placeholder-glow h-100 p-4" style={{ borderRadius: "16px", minHeight: "340px" }}>
                      <div className="placeholder col-12 mb-3 bg-secondary opacity-10" style={{ height: "160px", borderRadius: "12px" }}></div>
                      <div className="placeholder col-8 mb-2 bg-secondary opacity-15"></div>
                      <div className="placeholder col-5 bg-secondary opacity-15"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="row g-3 g-md-4">
                {productosFiltradosYOrdenados.map((p) => (
                  <div key={p.id} className="col-6 col-md-4 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm product-card transition-all"
                      style={{ borderRadius: "16px", overflow: "hidden", background: "#fff" }}>

                      <span className="position-absolute badge rounded-pill bg-dark mt-2 ms-2 z-1 text-uppercase"
                        style={{ fontSize: "0.60rem" }}>
                        {p.marca || "Industrial"}
                      </span>

                      <MiniCarruselCatalog
                        imagenes={p.todas_las_imagenes}
                        nombreProducto={p.nombre}
                      />

                      <div className="card-body p-2 p-md-3 d-flex flex-column">
                        <h6 className="fw-bold mb-1 text-truncate-2 text-dark" style={{ height: "40px", fontSize: "0.85rem" }}>
                          {p.nombre}
                        </h6>
                        <p className="text-muted small mb-2 text-truncate">Ref: {p.codigo_interno || "N/A"}</p>

                        <div className="mt-auto">
                          <div className="mb-2">
                            <span className="h6 fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                              ${Number(p.precio).toLocaleString('es-CO', { minimumFractionDigits: 0 })} COP
                            </span>
                          </div>
                          <button
                            className="btn btn-warning w-100 rounded-pill fw-bold btn-details d-flex align-items-center justify-content-center gap-1"
                            style={{ fontSize: "0.8rem", padding: "8px" }}
                            onClick={() => handleVerDetalles(p.id)}
                          >
                            Ver Detalles <i className="bi bi-arrow-right-short fs-6"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {productosFiltradosYOrdenados.length === 0 && !loading && (
              <div className="text-center py-5">
                <i className="bi bi-search display-1 text-muted"></i>
                <h4 className="mt-3">No encontramos productos</h4>
                <p className="text-muted">Prueba con otra categoría o palabra clave.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer setVista={setVista} onAdminLogin={() => setShowModal(true)} />
      {showModal && <LoginModal login={login} onClose={() => setShowModal(false)} setVista={setVista} />}

      {/* Estilos encapsulados */}
      <style>{`
        .product-card { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s; }
        .product-card:hover { transform: translateY(-6px); box-shadow: 0 15px 30px rgba(0,0,0,0.06) !important; }
        .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cursor-pointer { cursor: pointer; }
        .btn-details { transition: 0.2s; border: none; background-color: #ffc107; color: #212529; }
        .btn-details:hover { background-color: #10142D; color: white; }
        .btn-carrusel-nav {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            color: #10142D;
            font-size: 11px;
            transition: transform 0.2s ease, opacity 0.2s ease;
            opacity: 0;
            z-index: 3;
        }
        .group-carrusel:hover .btn-carrusel-nav { opacity: 1; }
        .btn-carrusel-nav:hover {
            background: #ffc107;
            color: #212529;
            transform: scale(1.08);
        }
      `}</style>
    </div>
  );
}

export default Productos;