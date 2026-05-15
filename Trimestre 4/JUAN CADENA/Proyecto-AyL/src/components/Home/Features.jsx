// Iconos SVG inline — profesionales, sin emojis, sin instalar nada
const FEATURES = [
  {
    titulo: "Repuestos Originales",
    desc: "Piezas originales de los principales fabricantes del mercado industrial.",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    titulo: "Envío Rápido",
    desc: "Despachos a todo el país con seguimiento en tiempo real.",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    titulo: "Soporte Técnico",
    desc: "Expertos disponibles para asesorarte en la selección del equipo ideal.",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    titulo: "Garantía Total",
    desc: "Todos los productos con garantía del fabricante y respaldo postventa.",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section style={{ background: "#f8f8f8", padding: "5rem 0" }}>
      <div className="container">

        {/* Encabezado */}
        <div className="text-center mb-5">
          <p className="fw-bold text-uppercase mb-2" style={{ color: "#F5A623", fontSize: "0.8rem", letterSpacing: 2 }}>
            ¿Por qué elegirnos?
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1a1a1a", lineHeight: 1.1 }}>
            Comprometidos con la Calidad
          </h2>
          <p className="text-secondary mx-auto mt-2" style={{ maxWidth: 480, fontSize: "0.95rem" }}>
            Más de 15 años siendo el aliado estratégico de la industria colombiana.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="row g-4">
          {FEATURES.map((f) => (
            <div key={f.titulo} className="col-12 col-sm-6 col-lg-3">
              <div
                className="bg-white rounded-3 p-4 h-100 border"
                style={{
                  borderColor: "transparent",
                  transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#F5A623";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                {/* Ícono */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mb-4"
                  style={{ width: 56, height: 56, background: "#F5A623", color: "#fff" }}
                >
                  {f.svg}
                </div>
                <h5 className="fw-bold mb-2" style={{ fontSize: "1.05rem", color: "#1a1a1a" }}>
                  {f.titulo}
                </h5>
                <p className="mb-0 text-secondary" style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;