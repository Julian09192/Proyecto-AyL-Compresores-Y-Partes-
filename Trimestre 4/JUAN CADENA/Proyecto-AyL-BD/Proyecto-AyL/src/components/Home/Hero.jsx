import React from 'react';

const colors = {
  fondo: "#000000",
  azulReal: "#000000",
  plataAzulado: "#D1E4FF",
  doradoAmbar: "#FFC107",
  blancoMarfil: "#F4F4F4"
};

const SLIDES = [
  {
    titulo: "Filtros para Maquinaria Agrícola",
    subtitulo: "Protección máxima para tu cosecha",
    desc: "Soluciones de filtración diseñadas para resistir largas jornadas en el campo y proteger motores contra el polvo y la humedad.",
    accent: colors.doradoAmbar,
    img: "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777130278/IMG_Agricola.jpg",
    alt: "Filtros de aire y combustible instalados en un tractor agrícola de alta tecnología"
  },
  {
    titulo: "Filtros para Maquinaria Pesada",
    subtitulo: "Rendimiento imparable en la construcción",
    desc: "Componentes de alta resistencia que optimizan el ciclo de vida de excavadoras y retroexcavadoras bajo condiciones extremas.",
    accent: colors.doradoAmbar,
    img: "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777130859/IMG_Industrial.jpg",
    alt: "Filtros hidráulicos de alto flujo para maquinaria de construcción pesada"
  },
  {
    titulo: "Filtros para Transporte",
    subtitulo: "Eficiencia y ahorro en cada kilómetro",
    desc: "Gama completa para flotas de carga y pasajeros, enfocada en la reducción de emisiones y el ahorro de combustible.",
    accent: colors.doradoAmbar,
    img: "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777132446/IMG_Transporte.jpg",
    alt: "Filtros de aceite y separadores de agua para motores de camiones de carga pesada"
  },
  {
    titulo: "Filtros para Maquinaria Minera",
    subtitulo: "Resistencia absoluta en entornos críticos",
    desc: "Filtración especializada para equipos de minería de superficie y subterránea, garantizando operatividad en ambientes altamente abrasivos.",
    accent: colors.doradoAmbar,
    img: "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777132275/IMG_Minera.jpg",
    alt: "Sistemas de filtración reforzados para camiones mineros y palas mecánicas"
  },
  {
    titulo: "Repuestos y Accesorios",
    subtitulo: "Piezas originales siempre disponibles",
    desc: "Más de 500 referencias en stock con despacho en 48 horas a todo Colombia.",
    accent: colors.doradoAmbar,
    img: "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777133320/IMG_Repuestos.png",
    alt: "Repuestos originales para compresores industriales con envío a toda Colombia"
  }
];

function IconoCompresor({ color = colors.doradoAmbar, size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="30" width="44" height="28" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      <rect x="18" y="38" width="12" height="12" rx="2" fill={color} opacity="0.5" />
      <circle cx="54" cy="44" r="10" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
      <circle cx="54" cy="44" r="5" fill={color} />
      <line x1="54" y1="10" x2="54" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="58" x2="4" y2="64" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="54" y1="58" x2="54" y2="68" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="54" y1="68" x2="66" y2="68" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Hero({ setVista }) {

  return (
    <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="6000">
      {/* Indicadores Modernos: Barras en lugar de puntos */}
      <div className="carousel-indicators">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            style={{ width: "40px", height: "4px", borderRadius: "2px", margin: "0 5px" }}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {SLIDES.map((slide, i) => {
          const slideStyle = {
            // Gradiente más oscuro a la izquierda para facilitar la lectura del texto
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%), url(${slide.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "600px",
            color: "#fff",
            overflow: "hidden"
          };

          return (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`} style={slideStyle}>
              <div className="container h-100">
                <div className="row align-items-center h-100">
                  <div className="col-lg-8">

                    {/* Badge de Categoría con animación sutil */}
                    <div className="d-inline-block px-3 py-1 mb-3 rounded-pill"
                      style={{ backgroundColor: 'rgba(255,193,7,0.15)', border: `1px solid ${slide.accent}` }}>
                      <span className="fw-bold text-uppercase" style={{ color: slide.accent, fontSize: "0.75rem", letterSpacing: 2 }}>
                        A&L Calidad Industrial
                      </span>
                    </div>

                    <h1 className="display-3 mb-2" style={{
                      lineHeight: 1,
                      textShadow: "2px 2px 10px rgba(0,0,0,0.5)"
                    }}>
                      {slide.titulo}
                    </h1>

                    <h3 className="mb-3 fw-light" style={{ color: colors.plataAzulado, letterSpacing: 1 }}>
                      {slide.subtitulo}
                    </h3>

                    <p className="lead mb-5 d-none d-md-block shadow-text" style={{
                      maxWidth: "600px",
                      fontSize: "1.1rem",
                      opacity: 0.9,
                      fontWeight: 300
                    }}>
                      {slide.desc}
                    </p>

                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-lg px-4 py-3 shadow-sm border-0 transition-all"
                        style={{
                          background: colors.doradoAmbar,
                          color: "#000",
                          fontWeight: 700,
                          borderRadius: "8px"
                        }}
                        onClick={() => setVista && setVista("productos")}
                      >
                        EXPLORAR CATÁLOGO <i className="bi bi-arrow-right ms-2"></i>
                      </button>

                      <button
                        className="btn btn-lg btn-outline-light px-4 py-3"
                        style={{ borderRadius: "8px", borderWidth: "2px" }}
                        onClick={() => setVista && setVista("contactos")}
                      >
                        ASESORÍA TÉCNICA
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles con diseño circular minimalista */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <div className="bg-dark bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </div>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <div className="bg-dark bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </div>
      </button>

      {/* Estilos Extra para Animaciones */}
      <style>{`
        .carousel-item.active h1 {
          animation: fadeInUp 0.8s ease forwards;
        }
        .carousel-item.active p {
          animation: fadeInUp 1s ease forwards;
        }
        .carousel-item.active .btn {
          animation: fadeInUp 1.2s ease forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .transition-all:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
        .shadow-text {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
}

export default Hero;