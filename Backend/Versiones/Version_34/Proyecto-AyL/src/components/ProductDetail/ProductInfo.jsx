function ProductInfo({ producto }) {
  const tieneOferta = producto.precio_oferta && producto.precio_oferta < producto.precio;
  const precioFinal = tieneOferta ? producto.precio_oferta : producto.precio;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-uppercase fw-bold text-warning small">{producto.marcas?.nombre}</span>
        <span className="badge bg-light text-dark border px-3 py-2">
          REF: {producto.referencia_interna || "N/A"}
        </span>
      </div>

      <h2 className="fw-bold text-dark mb-3" style={{ fontSize: "2.3rem", lineHeight: "1.2" }}>{producto.nombre}</h2>

      {/* Contenedor de Precios estructurado en Pesos Colombianos (COP) */}

      <div
        className="mb-4"
        style={{
          background: "#F8F9FA",
          border: "1px solid #E9ECEF",
          borderRadius: "18px",
          padding: "24px"
        }}
      >
        <small className="text-secondary d-block mb-2">
          Precio de referencia
        </small>

        <div className="d-flex align-items-baseline gap-2">
          <span className="h1 fw-bold text-dark mb-0">
            ${Number(precioFinal).toLocaleString("es-CO")}
          </span>
          <span className="text-muted small fw-semibold">COP</span>
        </div>
      </div>

    </div>
  );
}

export default ProductInfo;