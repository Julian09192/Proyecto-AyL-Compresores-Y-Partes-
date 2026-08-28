import { useEffect, useState } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import SkeletonLoader from "../components/UI/SkeletonLoader";

function Catalogoview({ setVista, setProductoSeleccionadoId }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros avanzados
  const [busqueda, setBusqueda] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [vistaCuadricula, setVistaCuadricula] = useState(true); // true = Grilla, false = Lista

  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        // Mantenemos tu endpoint actual
        const response = await fetch("http://localhost:3001/productos");
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar el catálogo:", err.message || err);
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, []);

  // 1. Obtener marcas únicas y calcular cuántos productos tiene cada una
  const conteoPorMarca = productos.reduce((acc, p) => {
    if (p.marca) acc[p.marca] = (acc[p.marca] || 0) + 1;
    return acc;
  }, {});

  const marcasDisponibles = Object.keys(conteoPorMarca).sort();

  // 2. Lógica de filtrado en tiempo real (por nombre/referencia y por marca)
  const productosFiltrados = productos.filter((p) => {
    const campoNombre = p.nombre || "";
    const campoRef = p.referencia_interna || p.codigo_interno || "";
    
    const coincideBusqueda = 
      campoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      campoRef.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideMarca = marcaSeleccionada === "" || p.marca === marcaSeleccionada;

    return coincideBusqueda && coincideMarca;
  });

  const verDetalleProducto = (id) => {
    setProductoSeleccionadoId(id);
    setVista("producto-detalle");
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column pagina-catalogo-global">
      <Navbar vistaActual="productos" setVista={setVista} />

      {/* Banner de Bienvenida Corporativo */}
      <div className="bg-dark text-white py-5 text-center position-relative banner-catalogo-industrial mb-4">
        <div className="container position-relative container-z-index">
          <h1 className="fw-extrabold text-uppercase tracking-wider mb-2">
            Catálogo Especializado
          </h1>
          <p className="text-warning mb-0 fw-bold small text-uppercase tracking-widest">
            A&L Compresores y Partes &bull; Soluciones Industriales
          </p>
        </div>
        <div className="banner-overlay-text text-uppercase font-monospace">A&L</div>
      </div>

      <main className="container flex-grow-1 pb-5">
        <div className="row g-4">
          
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA: SIDEBAR DE FILTROS */}
          {/* ========================================================= */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm p-4 rounded-4 sticky-md-top sidebar-filtros-contenedor" style={{ top: "100px" }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <h6 className="fw-bold text-dark mb-0 text-uppercase tracking-wide">
                  <i className="bi bi-funnel-fill text-warning me-2"></i>Filtros de Búsqueda
                </h6>
                {(busqueda || marcaSeleccionada) && (
                  <button 
                    className="btn btn-sm btn-link text-danger text-decoration-none p-0 extra-small-text fw-bold"
                    onClick={() => { setBusqueda(""); setMarcaSeleccionada(""); }}
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Filtro: Buscador de texto */}
              <div className="mb-4">
                <label className="form-label-catalogo">Buscar Pieza o Código</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-catalogo"
                    placeholder="Ej. Filtro, Separador, Aceite..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtro: Marcas Estilizadas */}
              <div className="mb-2">
                <label className="form-label-catalogo mb-2">Marcas Disponibles</label>
                <div className="d-flex flex-column gap-1 grupo-lista-marcas">
                  <button
                    className={`btn btn-sm text-start rounded-3 px-3 py-2 d-flex justify-content-between align-items-center border-0 ${marcaSeleccionada === "" ? 'bg-dark text-white fw-bold' : 'btn-light-custom text-secondary'}`}
                    onClick={() => setMarcaSeleccionada("")}
                  >
                    <span>Todas las Marcas</span>
                    <span className={`badge rounded-pill ${marcaSeleccionada === "" ? 'bg-warning text-dark' : 'bg-secondary-subtle text-dark'}`}>{productos.length}</span>
                  </button>
                  
                  {marcasDisponibles.map((marca) => (
                    <button
                      key={marca}
                      className={`btn btn-sm text-start rounded-3 px-3 py-2 d-flex justify-content-between align-items-center border-0 ${marcaSeleccionada === marca ? 'bg-dark text-white fw-bold' : 'btn-light-custom text-secondary'}`}
                      onClick={() => setMarcaSeleccionada(marca)}
                    >
                      <span className="text-truncate me-2">{marca}</span>
                      <span className={`badge rounded-pill ${marcaSeleccionada === marca ? 'bg-warning text-dark' : 'bg-secondary-subtle text-dark'}`}>{conteoPorMarca[marca]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA: RESULTADOS DEL CATÁLOGO */}
          {/* ========================================================= */}
          <div className="col-lg-9">
            
            {/* Barra de utilidades superior */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white px-4 py-3 rounded-4 shadow-sm">
              <div className="text-muted small fw-medium">
                Mostrando <span className="text-dark fw-bold">{productosFiltrados.length}</span> de <span className="text-dark fw-bold">{productos.length}</span> repuestos
              </div>
              
              {/* Selector de tipo de Vista (Grilla o Lista) */}
              <div className="btn-group border rounded-pill p-1 bg-light">
                <button 
                  className={`btn btn-sm rounded-pill px-3 py-1 border-0 ${vistaCuadricula ? 'btn-dark text-white shadow-sm' : 'text-secondary'}`}
                  onClick={() => setVistaCuadricula(true)}
                  title="Vista en Cuadrícula"
                >
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button 
                  className={`btn btn-sm rounded-pill px-3 py-1 border-0 ${!vistaCuadricula ? 'btn-dark text-white shadow-sm' : 'text-secondary'}`}
                  onClick={() => setVistaCuadricula(false)}
                  title="Vista en Lista"
                >
                  <i className="bi bi-list-task"></i>
                </button>
              </div>
            </div>

            {/* Renderizado Condicional de Contenido */}
            {loading ? (
              <SkeletonLoader />
            ) : productosFiltrados.length === 0 ? (
              <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-white animate-fade-in-up">
                <div className="display-4 text-warning mb-3"><i className="bi bi-search-heart"></i></div>
                <h5 className="fw-bold text-dark">No encontramos coincidencias</h5>
                <p className="text-muted small mb-0">Prueba ajustando los términos de búsqueda o cambiando la marca seleccionada.</p>
              </div>
            ) : vistaCuadricula ? (
              
              /* MODO 1: RENDER EN GRILLA DE TARJETAS */
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 animate-fade-in-up">
                {productosFiltrados.map((producto) => (
                  <div key={producto.id} className="col">
                    <div 
                      className="card h-100 border-0 shadow-sm tarjeta-producto-industrial text-decoration-none bg-white"
                      onClick={() => verDetalleProducto(producto.id)}
                    >
                      <div className="contenedor-imagen-catalogo p-3 bg-white d-flex align-items-center justify-content-center position-relative">
                        <img
                          src={producto.producto_imagenes?.[0]?.imagen_url || producto.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"}
                          alt={producto.nombre}
                          className="img-fluid image-zoom-effect"
                        />
                        <span className="badge-marca-flotante">{producto.marca}</span>
                      </div>

                      <div className="card-body d-flex flex-column justify-content-between p-3 pt-2">
                        <div>
                          <p className="text-muted extra-small-text font-monospace mb-1 text-truncate">
                            REF: {producto.referencia_interna || producto.codigo_interno || "N/A"}
                          </p>
                          <h6 className="card-title text-dark fw-bold text-truncate mb-3" title={producto.nombre}>
                            {producto.nombre}
                          </h6>
                        </div>

                        <div className="pt-2 border-top border-light d-flex align-items-center justify-content-between mt-auto">
                          <div className="d-flex flex-column">
                            <span className="text-muted extra-small-text text-uppercase fw-bold lh-1">Precio</span>
                            <span className="fs-6 fw-extrabold text-dark mt-0.5">
                              ${inputPrecioFormato(producto.precio)}
                            </span>
                          </div>
                          <span className="btn-flecha-ir"><i className="bi bi-chevron-right"></i></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              
              /* MODO 2: RENDER EN MODO LISTA EXTENDIDA */
              <div className="d-flex flex-column gap-3 animate-fade-in-up">
                {productosFiltrados.map((producto) => (
                  <div 
                    key={producto.id} 
                    className="card border-0 shadow-sm tarjeta-producto-lista-modo bg-white p-3 text-decoration-none"
                    onClick={() => verDetalleProducto(producto.id)}
                  >
                    <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
                      <div className="bg-white rounded-3 p-2 border text-center d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                        <img
                          src={producto.producto_imagenes?.[0]?.imagen_url || producto.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"}
                          alt={producto.nombre}
                          className="img-fluid"
                          style={{ maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="flex-grow-1 text-center text-sm-start min-w-0">
                        <span className="badge bg-light text-dark border me-2 text-uppercase extra-small-text fw-bold px-2 py-1">{producto.marca}</span>
                        <span className="text-muted font-monospace extra-small-text">REF: {producto.referencia_interna || producto.codigo_interno || "N/A"}</span>
                        <h6 className="text-dark fw-bold text-truncate mb-0 mt-1">{producto.nombre}</h6>
                      </div>
                      <div className="text-center text-sm-end flex-shrink-0 mt-2 mt-sm-0 ps-sm-3 d-flex flex-row flex-sm-column align-items-center align-items-sm-end gap-3 gap-sm-0">
                        <div className="mb-sm-1">
                          <span className="text-muted extra-small-text d-none d-sm-block">Precio Neto</span>
                          <span className="fs-5 fw-extrabold text-dark">${inputPrecioFormato(producto.precio)}</span>
                        </div>
                        <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold align-self-center">Cotizar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer setVista={setVista} />

      {/* ========================================================= */}
      {/* SECCIÓN DE HOJA DE ESTILOS CSS INYECTADA */}
      {/* ========================================================= */}
      <style>{`
        .pagina-catalogo-global {
          letter-spacing: -0.1px;
        }
        .fw-extrabold { font-weight: 800 !important; }
        .fw-extrabold { font-weight: 900 !important; }
        .extra-small-text { font-size: 0.75rem; }
        
        /* BANNER */
        .banner-catalogo-industrial {
          background: linear-gradient(135deg, #11142D 0%, #1A2040 100%) !important;
          overflow: hidden;
        }
        .container-z-index { z-index: 5; }
        .banner-overlay-text {
          position: absolute;
          bottom: -20px;
          right: 5%;
          font-size: 6rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.03);
          user-select: none;
          pointer-events: none;
        }

        /* FILTROS */
        .form-label-catalogo {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #6C757D;
          letter-spacing: 0.5px;
        }
        .form-control-catalogo {
          border-left: none !important;
          border-radius: 0 10px 10px 0 !important;
          font-size: 0.9rem;
          padding: 9px 12px;
          border-color: #dee2e6 !important;
        }
        .form-control-catalogo:focus {
          border-color: #FFC107 !important;
          box-shadow: none !important;
        }
        .sidebar-filtros-contenedor .input-group-text {
          border-radius: 10px 0 0 10px !important;
          border-color: #dee2e6 !important;
          padding-left: 12px;
        }
        .sidebar-filtros-contenedor .input-group:focus-within .input-group-text {
          border-color: #FFC107 !important;
        }
        .btn-light-custom {
          background-color: #F8F9FA;
          color: #495057;
          transition: all 0.2s;
        }
        .btn-light-custom:hover {
          background-color: #E9ECEF;
          color: #212529;
        }
        .grupo-lista-marcas {
          max-height: 280px;
          overflow-y: auto;
          padding-right: 4px;
        }

        /* TARJETAS MODO GRILLA */
        .tarjeta-producto-industrial {
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          border-radius: 16px;
          overflow: hidden;
        }
        .tarjeta-producto-industrial:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.08) !important;
        }
        .contenedor-imagen-catalogo {
          height: 180px;
          overflow: hidden;
        }
        .image-zoom-effect {
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .tarjeta-producto-industrial:hover .image-zoom-effect {
          transform: scale(1.06);
        }
        .badge-marca-flotante {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: rgba(33, 37, 41, 0.85);
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 50px;
          backdrop-filter: blur(4px);
        }
        .btn-flecha-ir {
          width: 28px;
          height: 28px;
          background-color: #F8F9FA;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #212529;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .tarjeta-producto-industrial:hover .btn-flecha-ir {
          background-color: #FFC107;
          color: #212529;
        }

        /* TARJETAS MODO LISTA */
        .tarjeta-producto-lista-modo {
          cursor: pointer;
          border-radius: 14px;
          transition: background-color 0.2s, box-shadow 0.2s;
        }
        .tarjeta-producto-lista-modo:hover {
          background-color: #FFFDF5 !important;
          box-shadow: 0 6px 15px rgba(0,0,0,0.04) !important;
        }

        /* ANIMACIONES */
        .animate-fade-in-up {
          animation: fadeInUpFrame 0.4s ease-out forwards;
        }
        @keyframes fadeInUpFrame {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* PERSONALIZACIÓN DE SCROLLBARS */
        .grupo-lista-marcas::-webkit-scrollbar,
        .contenedor-productos-checkout::-webkit-scrollbar {
          width: 4px;
        }
        .grupo-lista-marcas::-webkit-scrollbar-thumb,
        .contenedor-productos-checkout::-webkit-scrollbar-thumb {
          background-color: #DEE2E6;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

// Función auxiliar limpia para parsear precios de forma segura
function inputPrecioFormato(valor) {
  return Number(valor || 0).toLocaleString('es-CO', { minimumFractionDigits: 0 });
}

export default Catalogoview;