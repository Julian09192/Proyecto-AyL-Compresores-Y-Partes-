import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/productos";

function Products() {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        // Verificamos qué está llegando exactamente
        console.log("Datos recibidos de la API:", data);

        // Ajuste de seguridad: si data no es un array directamente, 
        // buscamos si están dentro de data.productos o data.data
        const listaLimpia = Array.isArray(data) 
          ? data 
          : (data.productos || data.data || []);

        setProducts(listaLimpia);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <section className="py-5 bg-light" id="productos" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div className="container">
        
        <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
          <div>
            <p className="text-warning fw-bold mb-1 text-uppercase small" style={{ letterSpacing: '2px' }}>Catálogo</p>
            <h2 className="fw-bold text-dark h1">Nuestros Productos</h2>
          </div>
          <button className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm">
            Ver todo el catálogo →
          </button>
        </div>

        <div className="row g-4">
          {/* 
              ESTE ES EL CAMBIO CLAVE: 
              Filtramos y limitamos a 9 justo antes de hacer el map 
          */}
          {products
            .filter(p => p.suspendido === 0) 
            .slice(0, 9) 
            .map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                  
                  {p.stock < 5 && p.stock > 0 && (
                    <span className="badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm" 
                          style={{ backgroundColor: '#F5A623', zIndex: 1, fontSize: '0.7rem' }}>
                      ¡Últimas unidades!
                    </span>
                  )}

                  <div className="bg-white d-flex align-items-center justify-content-center p-3" 
                       style={{ height: '240px', overflow: 'hidden' }}>
                    <img 
                      src={p.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"} 
                      alt={p.nombre} 
                      className="img-fluid"
                      style={{ maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>

                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="fw-bold text-dark mb-1">{p.nombre}</h5>
                    <p className="text-warning small fw-bold mb-3" style={{ fontSize: '0.8rem' }}>
                      Ref: {p.codigo_interno}
                    </p>
                    <p className="text-muted small flex-grow-1" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                      {p.caracteristicas}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fw-bold text-dark fs-5">
                        ${Number(p.precio).toLocaleString('es-CO')}
                      </span>
                      <span className="badge bg-light text-muted border">{p.marca}</span>
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