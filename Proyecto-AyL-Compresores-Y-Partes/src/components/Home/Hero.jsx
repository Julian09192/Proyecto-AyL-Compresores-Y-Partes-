// Carrusel usando Bootstrap (ya lo tienes instalado, no necesitas nada más)
const SLIDES = [
  {
    titulo: "Compresores Industriales",
    subtitulo: "Potencia y confiabilidad para tu operación",
    desc: "Equipos de alta performance con garantía extendida y soporte técnico especializado.",
    bg: "#1a1a1a",
    accent: "#F5A623",
  },
  {
    titulo: "Herramientas Neumáticas",
    subtitulo: "Precisión en cada trabajo",
    desc: "Línea completa de herramientas profesionales para taller e industria.",
    bg: "#F5A623",
    accent: "#fefafa",
  },
  {
    titulo: "Repuestos y Accesorios",
    subtitulo: "Piezas originales siempre disponibles",
    desc: "Más de 500 referencias en stock con despacho en 48 horas a todo Colombia.",
    bg: "#222831",
    accent: "#F5A623",
  },
];

// Ícono SVG de compresor industrial
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
      {/* Indicadores */}
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

      {/* Slides */}
      <div className="carousel-inner">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`carousel-item ${i === 0 ? "active" : ""}`}
            style={{ background: slide.bg, minHeight: 480 }}
          >
            <div className="container h-100">
              <div className="row align-items-center" style={{ minHeight: 480 }}>

                {/* Texto */}
                <div className="col-lg-7 py-5">
                  <p
                    className="fw-bold mb-2 text-uppercase"
                    style={{ color: slide.accent, fontSize: "0.8rem", letterSpacing: 3 }}
                  >
                    A&L Compresores y Partes
                  </p>
                  <h1
                    style={{
                      fontSize: "clamp(2.8rem, 6vw, 5rem)",
                      color: "#ffffff",
                      lineHeight: 1.05,
                      marginBottom: "1rem",
                    }}
                  >
                    {slide.titulo}
                  </h1>
                  <p
                    className="fw-semibold mb-2"
                    style={{ color: slide.accent, fontSize: "1.1rem" }}
                  >
                    {slide.subtitulo}
                  </p>
                  <p
                    className="mb-4"
                    style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.97rem", maxWidth: 480, fontWeight: 300 }}
                  >
                    {slide.desc}
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    <button
                      className="border-0 rounded-2 fw-bold px-4 py-2 d-flex align-items-center gap-2"
                      style={{ background: slide.accent, color: slide.bg === "#F5A623" ? "#1a1a1a" : "#1a1a1a", fontSize: "0.95rem", cursor: "pointer" }}
                      onClick={() => setVista && setVista("productos")}
                    >
                      Ver Productos
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </button>
                    <button
                      className="border rounded-2 fw-bold px-4 py-2"
                      style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff", background: "transparent", fontSize: "0.95rem", cursor: "pointer" }}
                      onClick={() => setVista && setVista("contactos")}
                    >
                      Contáctanos
                    </button>
                  </div>
                </div>

                {/* Ilustración derecha */}
                <div className="col-lg-5 d-none d-lg-flex justify-content-center align-items-center py-5">
                  <div style={{ position: "relative" }}>
                    {/* Círculo decorativo */}
                    <div style={{
                      width: 280, height: 280,
                      borderRadius: "50%",
                      border: `2px solid ${slide.accent}`,
                      opacity: 0.15,
                      position: "absolute",
                      top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)"
                    }} />
                    <div style={{
                      width: 200, height: 200,
                      borderRadius: "50%",
                      background: `${slide.accent}`,
                      opacity: 0.08,
                      position: "absolute",
                      top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)"
                    }} />
                    <IconoCompresor color={slide.accent} size={120} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "50%", width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span className="carousel-control-prev-icon" />
        </span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "50%", width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span className="carousel-control-next-icon" />
        </span>
      </button>
    </div>
  );
}

export default Hero;