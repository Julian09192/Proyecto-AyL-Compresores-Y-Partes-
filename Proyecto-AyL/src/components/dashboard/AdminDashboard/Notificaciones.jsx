function Notificaciones({ productos, obtenerImagen }) {

  // 🔍 FILTRAR STOCK BAJO
  const stockBajo = productos.filter(p => p.Cantidad < 10);

  // ✅ MENSAJE SI NO HAY ALERTAS
  if (stockBajo.length === 0) {
    return (
      <div className="p-5 text-center">
        <h4 className="fw-bold">✅ Todo está en orden</h4>
        <p className="text-muted">No hay productos con stock bajo.</p>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3">

      <div className="alert alert-warning rounded-4 shadow-sm border-0">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0"><i className="bi bi-bell"></i> Notificaciones</h5>
          <span className="badge bg-dark">{stockBajo.length}</span>
        </div>

        <div className="row g-2">
          {stockBajo.map((p) => (
            <div key={p.id} className="col-md-4 col-lg-3">

              <div className="bg-white rounded-3 p-2 shadow-sm d-flex align-items-center gap-2">

                <img
                  src={obtenerImagen(p.imagen)}
                  alt={p.Nombre}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />

                <div style={{ minWidth: 0 }}>
                  <small className="fw-bold d-block text-truncate">
                    {p.Nombre}
                  </small>

                  <span className={`small ${p.Cantidad < 5 ? "text-danger fw-bold" : "text-warning"}`}>
                    Stock: {p.Cantidad}
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Notificaciones;