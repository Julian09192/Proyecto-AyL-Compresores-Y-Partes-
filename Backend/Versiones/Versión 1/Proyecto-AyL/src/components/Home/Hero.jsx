import React from "react"; // Opcional en versiones nuevas de React

// Definimos los colores constantes para evitar errores de referencia
const COLORS = {
  doradoAmbar: "#F5A623",
  oscuro: "#0b0b0b",
};

const SLIDES = [
  {
    titulo: "Compresores Industriales",
    subtitulo: "Potencia y confiabilidad para tu operación",
    desc: "Equipos de alta performance con garantía extendida y soporte técnico especializado.",
    accent: COLORS.doradoAmbar,
    img: "https://res.cloudinary.com/duvoqozcl/image/upload/v1777394648/compresor-1.jpg",
  },
  {
    titulo: "Línea de servicios para compresores y plantas eléctricas",
    subtitulo: "Precisión en cada trabajo",
    desc: "Línea completa de herramientas profesionales para taller e industria.",
    bg: COLORS.doradoAmbar,
    accent: "#fefafa",
    img: "https://res.cloudinary.com/duvoqozcl/image/upload/v1777394649/compresor-2.jpg",
  },
  {
    titulo: "Repuestos y Accesorios",
    subtitulo: "Piezas originales siempre disponibles",
    desc: "Más de 500 referencias en stock con despacho en 48 horas a todo Colombia.",
    bg: "#222831",
    accent: COLORS.doradoAmbar,
    img: "https://res.cloudinary.com/duvoqozcl/image/upload/v1777394649/compresor-3.jpg",
  },
];

function Hero({ setVista }) {
  return (
    <div
      id="heroCarousel"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-interval="5000"
    >
      {/* Indicadores */}
      <div className="carousel-indicators">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : "false"}
            aria-label={`Slide ${i + 1}`}
            style={{ 
                background: COLORS.doradoAmbar, 
                width: 10, 
                height: 10, 
                borderRadius: "50%", 
                border: "none" 
            }}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {SLIDES.map((slide, i) => {
          const slideStyle = {
            backgroundImage: `linear-gradient(rgba(6,8,15,0.55), rgba(6,8,15,0.55)), url(${slide.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "550px", // Es mejor usar strings con unidades
            color: "#fff",
            overflow: "hidden"
          };

          return (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`} style={slideStyle}>
              <div className="container h-100">
                <div className="row align-items-center h-100">
                  <div className="col-lg-7 py-5">
                    <p className="fw-bold mb-2 text-uppercase" style={{ color: slide.accent, fontSize: "0.8rem", letterSpacing: 3 }}>
                      A&P Lubricantes y Filtros
                    </p>
                    <h1 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                      color: "#ffffff",
                      lineHeight: 1.05,
                      marginBottom: "1rem"
                    }}>
                      {slide.titulo}
                    </h1>
                    <p className="fw-semibold mb-2" style={{ color: slide.accent, fontSize: "1.1rem" }}>
                      {slide.subtitulo}
                    </p>
                    <p className="mb-4" style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "0.97rem",
                      maxWidth: 520,
                      fontWeight: 300,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {slide.desc}
                    </p>
                    <div className="d-flex gap-3 flex-wrap">
                      <button 
                        className="btn" 
                        style={{ background: COLORS.doradoAmbar, color: COLORS.oscuro, fontWeight: 700 }} 
                        onClick={() => setVista && setVista("productos")}
                      >
                        Ver Productos
                      </button>
                      <button 
                        className="btn btn-outline-light fw-bold px-4 py-2" 
                        onClick={() => setVista && setVista("contactos")}
                      >
                        Contáctanos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}

export default Hero;