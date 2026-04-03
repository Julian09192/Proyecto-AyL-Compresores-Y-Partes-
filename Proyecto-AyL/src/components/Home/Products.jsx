import React from "react";
import Separador from "../../assets/Home/Products/separador.jpg";
import W962 from "../../assets/Home/Products/filtro-de-aceite-W-962.jpg";
import LB962 from "../../assets/Home/Products/LB-962-2.jpg";
import GA30 from "../../assets/Home/Products/FILTRO-DE-AIRE-2914930400.jpg";
import Aceite from "../../assets/Home/Products/5w40-castro-cuarto-1.jpg";
import KitatlasCopco from "../../assets/Home/Products/KIT-A-2-4KW-4000H-2YR.jpg";


const products = [
  { 
    name: "Separador",
    reference : "1622-0079-00 (Atlas Copco)", 
    desc: "Separador de aceite para compresores de tornillo.", 
    badge: "Destacado",
    img: Separador, 
  },
  { 
    name: "Filtro de Aceite", 
    reference: "W962 (Mann Filter)",
    desc: "Filtro de aceite de alta calidad para protección y rendimiento óptimo.", 
    badge: null,
    img: W962,
  },
  { 
    name: "Filtro Separador", 
    reference: "LB962/2 (Mann Filter)",
    desc: "Conjunto completo de piezas de desgaste compatibles con múltiples marcas.", 
    badge: "Nuevo",
    img: LB962,
  },
  { 
    name: "Filtro de Aire GA-30", 
    reference: "1613-9472-00 (Atlas Copco)",
    desc: "Filtro de alta eficiencia para protección de tornillos y motores.", 
    badge: null,
    img: GA30,
  },
  { 
    name: "Aceite Sintético 5W-40", 
    reference: "Castrol Premium",
    desc: "Lubricante premium formulado para compresores de tornillo.", 
    badge: "Oferta",
    img: Aceite,
  },
  { 
    name: "Panel de Control Digital", 
    reference: "SmartControl v2",
    desc: "Sistema de monitoreo inteligente con alertas y control remoto vía app.", 
    badge: "Nuevo",
    img: KitatlasCopco,

  },
  
];

function Products() {
  return (
    <section className="py-5 bg-light" id="productos" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <div className="container">
        
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
          <div>
            <p className="text-warning fw-bold mb-1 text-uppercase small" style={{ letterSpacing: '2px' }}>Catálogo</p>
            <h2 className="fw-bold text-dark h1">Nuestros Productos</h2>
          </div>
          <button className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm">
            Ver todo el catálogo →
          </button>
        </div>

        {/* Grid de Productos */}
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.name} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                
                {/* Badge (Destacado, Nuevo, etc.) */}
                {p.badge && (
                  <span className="badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm" 
                        style={{ backgroundColor: '#F5A623', zIndex: 1, fontSize: '0.7rem' }}>
                    {p.badge}
                  </span>
                )}

                {/* Contenedor de Imagen */}
                <div className="bg-white d-flex align-items-center justify-content-center p-3" 
                     style={{ height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className="img-fluid"
                    style={{ maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>

                {/* Cuerpo de la Card */}
                <div className="card-body p-4 d-flex flex-column">
                  <h5 className="fw-bold text-dark mb-1">{p.name}</h5>
                  {p.reference && (
                    <p className="text-warning small fw-bold mb-3" style={{ fontSize: '0.8rem' }}>
                      Ref: {p.reference}
                    </p>
                  )}
                  <p className="text-muted small flex-grow-1" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                    {p.desc}
                  </p>
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