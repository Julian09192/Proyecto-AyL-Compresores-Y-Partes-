function TechnicalSheet({ especificaciones }) {
  if (!especificaciones || especificaciones.length === 0) {
    return <p className="text-muted small italic">No hay especificaciones técnicas registradas para este modelo.</p>;
  }

  return (
    <div className="table-responsive">
      {especificaciones.map((spec, index) => (
        <div
          key={index}
          className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3"
        >
          <span className="fw-semibold text-secondary">
            {spec.clave}
          </span>

          <span className="fw-bold text-dark">
            {spec.valor}
          </span>
        </div>
      ))}
    </div>
  );
}

export default TechnicalSheet;