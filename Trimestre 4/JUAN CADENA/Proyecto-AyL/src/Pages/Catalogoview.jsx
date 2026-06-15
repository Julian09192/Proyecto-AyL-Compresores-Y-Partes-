import { useEffect, useState } from "react";
import { supabase } from "../lib/client";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import SkeletonLoader from "../components/UI/SkeletonLoader";

function Catalogoview({ setVista, setProductoSeleccionadoId }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros básicos
  const [busqueda, setBusqueda] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");

  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        // Consulta directa a tu tabla plana de Supabase
        const { data, error } = await supabase
          .from("productos")
          .select("id, nombre, marca, descripcion, referencia_interna, precio, imagen_url, suspendido")
          .eq("suspendido", false); // Solo traer productos activos

        if (error) throw error;
        setProductos(data || []);
      } catch (err) {
        console.error("Error al cargar el catálogo:", err.message);
      } {
        setLoading(false);
      }
    }

    cargarProductos();
  }, []);

  // 1. Obtener marcas únicas para el filtro dinámico del select
  const marcasDisponibles = [...new Set(productos.map((p) => p.marca))].filter(Boolean);

  // 2. Lógica de filtrado en tiempo real (por nombre/referencia y por marca)
  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.referencia_interna && p.referencia_interna.toLowerCase().includes(busqueda.toLowerCase()));
    
    const coincideMarca = marcaSeleccionada === "" || p.marca === marcaSeleccionada;

    return coincideBusqueda && coincideMarca;
  });

  // Función manejadora para ir al detalle del producto
  const verDetalleProducto = (id) => {
    setProductoSeleccionadoId(id);
    setVista("producto-detalle");
  };

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      <Navbar vistaActual="productos" setVista={setVista} />

      <main className="container py-5">
        <h2 className="fw-bold text-dark mb-4 text-center text-uppercase" style={{ letterSpacing: "1px" }}>
          Catálogo de Productos
        </h2>

        {/* Barra de Filtros y Búsqueda */}
        <div className="card border-0 shadow-sm p-4 mb-5" style={{ borderRadius: "12px" }}>
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o referencia interna..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={marcaSeleccionada}
                onChange={(e) => setMarcaSeleccionada(e.target.value)}
              >
                <option value="">Todas las Marcas</option>
                {marcasDisponibles.map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Zona de Productos */}
        {loading ? (
          <SkeletonLoader />
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No se encontraron productos que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="col">
                <div 
                  className="card h-100 border-0 shadow-sm card-hover text-decoration-none"
                  style={{ borderRadius: "16px", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => verDetalleProducto(producto.id)}
                >
                  {/* Imagen del Producto */}
                  <div 
                    className="bg-white d-flex align-items-center justify-content-center p-3" 
                    style={{ height: "200px" }}
                  >

                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="card-body d-flex flex-column justify-content-between p-3 bg-white">
                    <div>
                      <span className="badge bg-light text-secondary mb-2 border text-uppercase" style={{ fontSize: "0.75rem" }}>
                        {producto.marca}
                      </span>
                      <h6 className="card-title text-dark fw-bold text-truncate mb-1" title={producto.nombre}>
                        {producto.nombre}
                      </h6>
                      <p className="text-muted small mb-2 text-truncate">
                        Ref: {producto.referencia_interna || "N/A"}
                      </p>
                    </div>

                    <div className="mt-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="fs-5 fw-bold text-dark">
                          ${Number(producto.precio).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                        </span>
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            verDetalleProducto(producto.id);
                          }}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer setVista={setVista} />
    </div>
  );
}

export default Catalogoview;