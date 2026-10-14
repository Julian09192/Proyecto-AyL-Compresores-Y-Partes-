import React, { useState, useEffect } from "react";

// URL de tu API local
const API_URL = "http://localhost:3001/productos";

function Products() {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Petición de datos al cargar el componente
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // Filtramos para mostrar solo los que no estén suspendidos en el catálogo público
        const visibles = Array.isArray(data) ? data.filter(p => !p.suspendido) : [];
        setProducts(visibles);
      } catch (error) {
        console.error("Error al cargar productos:", error);
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
          <button className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm">
            Ver todo el catálogo →
          </button>
        </div>

        {/* Grid de Productos - Diseño Original */}
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id || p.Nombre} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                
                {/* Badge (Diseño Original - Se muestra si hay stock bajo o es nuevo) */}
                {p.Stock < 5 && p.Stock > 0 && (
                  <span className="badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm" 
                        style={{ backgroundColor: '#F5A623', zIndex: 1, fontSize: '0.7rem' }}>
                    ¡Últimas unidades!
                  </span>
                )}

                {/* Contenedor de Imagen - Diseño Original */}
                <div className="bg-white d-flex align-items-center justify-content-center p-3" 
                     style={{ height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={p.ImagenUrl || "https://placehold.co/400x400?text=Sin+Imagen"} 
                    alt={p.Nombre} 
                    className="img-fluid"
                    style={{ maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>

                {/* Cuerpo de la Card - Diseño Original */}
                <div className="card-body p-4 d-flex flex-column">
                  <h5 className="fw-bold text-dark mb-1">{p.Nombre}</h5>
                  
                  <p className="text-warning small fw-bold mb-3" style={{ fontSize: '0.8rem' }}>
                    Ref: {p.CodigoInterno || `REF-${p.id}`}
                  </p>
                  
                  <p className="text-muted small flex-grow-1" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                    {p.Caracteristicas || p.Tipo}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold text-dark fs-5">${p.Precio?.toLocaleString()}</span>
                    <span className="badge bg-light text-muted border">{p.Marca}</span>
                  </div>

                  <button className="btn btn-outline-dark w-100 fw-bold rounded-3 mt-3 py-2 border-2">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;