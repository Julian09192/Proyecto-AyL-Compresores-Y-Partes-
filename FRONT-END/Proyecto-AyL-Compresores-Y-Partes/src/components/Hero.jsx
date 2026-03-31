

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bg-circle hero-bg-circle--top" />
      <div className="hero-bg-circle hero-bg-circle--bottom" />
      <div className="container hero-content">
        <h1 className="hero-title">A&L Compresores y Partes</h1>
        <p className="hero-subtitle">
          Soluciones profesionales en compresores industriales y herramientas neumáticas
        </p>
        <div className="hero-actions">
          <button className="hero-btn hero-btn--primary">Ver Productos <span>→</span></button>
          <button className="hero-btn hero-btn--secondary">Contáctanos</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;