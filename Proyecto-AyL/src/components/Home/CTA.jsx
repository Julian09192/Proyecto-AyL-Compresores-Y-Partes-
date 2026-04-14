function CTA({ setVista }) {
  return (
    <section style={{ background: "#1a1a1a", padding: "5rem 0", position: "relative", overflow: "hidden" }}>

      {/* Círculos decorativos */}
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 300, height: 300, borderRadius: "50%",
        border: "60px solid rgba(245,166,35,0.06)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -40,
        width: 240, height: 240, borderRadius: "50%",
        background: "rgba(245,166,35,0.04)",
        pointerEvents: "none",
      }} />

      <div className="container text-center" style={{ position: "relative", zIndex: 1 }}>

        {/* Ícono SVG decorativo */}
        <div
          className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
          style={{ width: 64, height: 64, background: "rgba(245,166,35,0.12)", color: "#F5A623" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.71 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.86 5.86l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>

        <p className="fw-bold text-uppercase mb-2" style={{ color: "#F5A623", fontSize: "0.8rem", letterSpacing: 3 }}>
          ¿Listo para empezar?
        </p>
        <h2 style={{  color: "#ffffff", marginBottom: "0.75rem" }}>
          ¿Listo para potenciar tu producción?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", fontWeight: 300, marginBottom: "2.5rem", maxWidth: 520, margin: "0 auto 2rem" }}>
          Habla con nuestros asesores y encuentra la solución perfecta para tu operación.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className="border-0 rounded-2 fw-bold px-4 py-2 d-flex align-items-center gap-2"
            style={{ background: "#F5A623", color: "#1a1a1a", fontSize: "0.97rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(245,166,35,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            onClick={() => setVista && setVista("contactos")}
          >
            Solicitar Cotización
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            className="rounded-2 fw-bold px-4 py-2 d-flex align-items-center gap-2"
            style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: "0.97rem", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F5A623"; e.currentTarget.style.background = "rgba(245,166,35,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.71 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.86 5.86l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Llamar Ahora
          </button>
        </div>

      </div>
    </section>
  );
}

export default CTA;