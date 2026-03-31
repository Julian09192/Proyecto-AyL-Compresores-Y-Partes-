
const features = [
  { icon: "🔧", title: "Repuestos Originales", desc: "Piezas originales de los principales fabricantes del mercado industrial." },
  { icon: "🚚", title: "Envío Rápido", desc: "Despachos a todo el país con seguimiento en tiempo real." },
  { icon: "🛠️", title: "Soporte Técnico", desc: "Expertos disponibles para asesorarte en la selección del equipo ideal." },
  { icon: "✅", title: "Garantía Total", desc: "Todos los productos con garantía del fabricante y respaldo postventa." },
];

function Features() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-header text-center mb-5">
          <p className="features-eyebrow">¿Por qué elegirnos?</p>
          <h2 className="features-title">Comprometidos con la Calidad</h2>
          <p className="features-desc">Más de 15 años siendo el aliado estratégico de la industria colombiana.</p>
        </div>
        <div className="row g-4">
          {features.map((f) => (
            <div key={f.title} className="col-12 col-sm-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h5 className="feature-card__title">{f.title}</h5>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;