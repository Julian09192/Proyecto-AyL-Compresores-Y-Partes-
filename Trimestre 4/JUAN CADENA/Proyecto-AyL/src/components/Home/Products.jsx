import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/client"; 

function Products({ setVista, setProductoSeleccionadoId }) {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Petición de datos con Supabase al cargar el componente
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Conexión directa a través de client.js
        const { data, error } = await supabase.from("productos").select("*");
        if (error) throw error;

        // 1. Filtrar solo los productos que NO estén suspendidos (0 o falso)
        const visibles = Array.isArray(data) ? data.filter(p => p.suspendido === 0 || !p.suspendido) : [];

        // 2. Ordenar por destacados primero, y luego por ID más reciente (Top 9)
        const destacadosTop9 = visibles
          .slice()
          .sort((a, b) => {
            const aDest = a.destacado === true || a.destacado === 1 || a.destacado === "1" ? 1 : 0;
            const bDest = b.destacado === true || b.destacado === 1 || b.destacado === "1" ? 1 : 0;
            if (aDest !== bDest) return bDest - aDest;
            return (b.id || 0) - (a.id || 0);
          })
          .slice(0, 9);

        setProducts(destacadosTop9);
      } catch (error) {
        console.error("Error al cargar productos con Supabase:", error);
        setProducts([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  if (cargando) {
    return <div className="text-center py-5">Cargando catálogo...</div>;
  }

  return (
    <section className="py-5 bg-light" id="productos" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div className="container">
        
        {/* Encabezado - Diseño Original */}
        <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
          <div>
            <p className="text-warning fw-bold mb-1 text-uppercase small" style={{ letterSpacing: '2px' }}>Catálogo</p>
            <h2 className="fw-bold text-dark h1">Nuestros Productos</h2>
          </div>
          <button
            className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm"
            onClick={() => setVista && setVista("productos")}
          >
            Ver todo el catálogo →
          </button>
        </div>

        {/* Grid de Productos - Diseño Original */}
        <div className="row g-4">
          {products.length > 0 ? (
            products.map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative" style={{ minHeight: '100%' }}>
                  
                  {/* Badge de Stock (Sincronizado con stock_total de Supabase) */}
                  {p.stock_total < 5 && p.stock_total > 0 && (
                    <span className="badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm" 
                          style={{ backgroundColor: '#F5A623', zIndex: 1, fontSize: '0.7rem' }}>
                      ¡Últimas unidades!
                    </span>
                  )}

                  {/* Contenedor de Imagen */}
                  <div className="bg-white d-flex align-items-center justify-content-center p-3" 
                       style={{ height: '240px', overflow: 'hidden' }}>
                    <img 
                      src={p.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"} 
                      alt={p.nombre || "Producto"} 
                      className="img-fluid"
                      style={{ maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                      onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                      onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
                    />
                  </div>

                  {/* Cuerpo de la Card */}
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="fw-bold text-dark mb-1">{p.nombre}</h5>
                    
                    <p className="text-warning small fw-bold mb-3" style={{ fontSize: '0.8rem' }}>
                      Ref: {p.codigo_interno || `REF-${p.id}`}
                    </p>
                    
                    <p className="text-muted small flex-grow-1" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                      {p.caracteristicas || p.tipo || "Sin descripción disponible"}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fw-bold text-dark fs-5">${Number(p.precio || 0).toLocaleString('es-CO')}</span>
                      <span className="badge bg-light text-muted border">{p.marca || "---"}</span>
                    </div>

                    <button
                      className="btn btn-outline-dark w-100 fw-bold rounded-3 mt-3 py-2 border-2"
                      onClick={() => {
                        if (setProductoSeleccionadoId) setProductoSeleccionadoId(p.id);
                        if (setVista) setVista("producto-detalle");
                      }}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">No hay productos destacados disponibles en este momento.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Products;