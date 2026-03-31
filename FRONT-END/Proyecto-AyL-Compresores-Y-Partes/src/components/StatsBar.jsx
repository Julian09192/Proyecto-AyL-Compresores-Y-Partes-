
const stats = [
  { number: "500+", label: "Productos disponibles" },
  { number: "15+", label: "Años de experiencia" },
  { number: "2.000+", label: "Clientes satisfechos" },
  { number: "48h", label: "Entrega garantizada" },
];

function StatsBar() {
  return (
    <div className="statsbar-wrapper">
      <div className="container">
        <div className="row">
          {stats.map((s) => (
            <div key={s.label} className="col-6 col-md-3 statsbar-item">
              <div className="statsbar-number">{s.number}</div>
              <div className="statsbar-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsBar;