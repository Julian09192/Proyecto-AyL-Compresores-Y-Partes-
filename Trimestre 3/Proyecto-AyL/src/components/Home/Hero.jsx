
import compresor1 from "../../assets/Home/Hero/compresor-1.jpg";
import compresor2 from "../../assets/Home/Hero/compresor-2.jpg";
import compresor3 from "../../assets/Home/Hero/compresor-3.jpg";

const SLIDES = [
  {
    titulo: "Compresores Industriales",
    subtitulo: "Potencia y confiabilidad para tu operación",
    desc: "Equipos de alta performance con garantía extendida y soporte técnico especializado.",
    accent: "#F5A623",
    img: compresor1,
  },
  {
    titulo: "Línea de servicios para compresores y plantas eléctricas",
    subtitulo: "Precisión en cada trabajo",
    desc: "Línea completa de herramientas profesionales para taller e industria.",
    bg: "#F5A623",
    accent: "#fefafa",
    img: compresor2,

  },
  {
    titulo: "Repuestos y Accesorios",
    subtitulo: "Piezas originales siempre disponibles",
    desc: "Más de 500 referencias en stock con despacho en 48 horas a todo Colombia.",
    bg: "#222831",
    accent: "#F5A623",
    img: compresor3,
  },
];

function IconoCompresor({ color = "#F5A623", size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="30" width="44" height="28" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
      <rect x="18" y="38" width="12" height="12" rx="2" fill={color} opacity="0.5"/>
      <circle cx="54" cy="44" r="10" fill={color} opacity="0.2" stroke={color} strokeWidth="2"/>
      <circle cx="54" cy="44" r="5" fill={color}/>
      <line x1="54" y1="10" x2="54" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="58" x2="4" y2="64" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="54" y1="58" x2="54" y2="68" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="54" y1="68" x2="66" y2="68" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function Hero({ setVista }) {
  return (
    <div
      id="heroCarousel"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-interval="5000"
    >
      <div className="carousel-indicators">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            style={{ background: "#F5A623", width: 10, height: 10, borderRadius: "50%", border: "none" }}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`carousel-item ${i === 0 ? "active" : ""}`}
            style={{ background: slide.bg || "#1a1a1a", minHeight: 480 }} // Agregué un fondo por defecto
          >
            <div className="container h-100">
              <div className="row align-items-center" style={{ minHeight: 480 }}>

                <div className="col-lg-7 py-5">
                  <p className="fw-bold mb-2 text-uppercase" style={{ color: slide.accent, fontSize: "0.8rem", letterSpacing: 3 }}>
                    A&L Compresores y Partes
                  </p>
                  <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#ffffff", lineHeight: 1.05, marginBottom: "1rem" }}>
                    {slide.titulo}
                  </h1>
                  <p className="fw-semibold mb-2" style={{ color: slide.accent, fontSize: "1.1rem" }}>
                    {slide.subtitulo}
                  </p>
                  <p className="mb-4" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.97rem", maxWidth: 480, fontWeight: 300 }}>
                    {slide.desc}
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    <button className="btn btn-warning fw-bold px-4 py-2 border-0" onClick={() => setVista && setVista("productos")}>
                      Ver Productos
                    </button>
                    <button className="btn btn-outline-light fw-bold px-4 py-2" onClick={() => setVista && setVista("contactos")}>
                      Contáctanos
                    </button>
                  </div>
                </div>

                <div className="col-lg-5 d-none d-lg-flex justify-content-center align-items-center py-5">
                  <div style={{ position: "relative", width: "100%", textAlign: "center" }}>

                    {slide.img ? (
                      <img 
                        src={slide.img} 
                        alt={slide.titulo} 
                        className="img-fluid rounded-4 shadow-lg" 
                        style={{ maxHeight: "350px", objectFit: "cover", border: `2px solid ${slide.accent}` }}
                      />
                    ) : (
                      <>
                        <div style={{
                          width: 280, height: 280, borderRadius: "50%",
                          border: `2px solid ${slide.accent}`, opacity: 0.15,
                          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"
                        }} />
                        <IconoCompresor color={slide.accent} size={120} />
                      </>
                    )}

                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
      </button>
    </div>
  );
}

export default Hero;