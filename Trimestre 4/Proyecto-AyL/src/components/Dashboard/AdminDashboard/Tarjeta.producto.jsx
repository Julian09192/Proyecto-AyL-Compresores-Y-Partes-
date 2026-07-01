import React from "react";

const ProductoCard = React.memo(({ producto, onEditar, onAlternarEstado }) => {
  const esCritico = Number(producto.stock_total || 0) < 10 && !producto.suspendido;

  return (
    <div className="col-sm-6 col-md-4 col-xl-3">
      <div className="product-card h-100 position-relative d-flex flex-column">
        
        <span className="brand-badge">
          {producto.marca || producto.tipo}
        </span>

        {producto.suspendido ? (
          <span className="status-badge-suspended">Suspendido</span>
        ) : esCritico ? (
          <span className="status-badge-critical">Stock Crítico</span>
        ) : null}

        <div className="d-flex align-items-center justify-content-center bg-white border-bottom" style={{ height: "200px", padding: "20px" }}>
          <img 
            src={producto.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"} 
            className="mw-100 mh-100" 
            style={{ objectFit: "contain", opacity: producto.suspendido ? 0.4 : 1 }} 
            alt={producto.nombre} 
          />
        </div>

        <div className="card-body p-3 d-flex flex-column justify-content-between flex-grow-1">
          <div className="mb-2">
            <h6 className="fw-bold text-dark mb-1 text-truncate-2" style={{ fontSize: "14px", lineHeight: "1.3", height: "36px" }} title={producto.nombre}>
              {producto.nombre}
            </h6>
            <div className="text-muted font-monospace mb-2" style={{ fontSize: "11px" }}>
              Ref: {producto.codigo_interno || "REF-" + producto.id}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="fw-bold text-dark" style={{ fontSize: "16px" }}>
                ${Number(producto.precio || 0).toLocaleString('es-CO')} COP
              </div>
              <span className={`small fw-semibold px-2 py-0.5 rounded ${esCritico ? 'bg-danger-subtle text-danger' : 'text-muted'}`} style={{ fontSize: "11px" }}>
                {producto.stock_total || 0} und.
              </span>
            </div>
          </div>

          <div className="d-flex flex-column gap-1.5 mt-2">
            <button 
              onClick={() => onEditar(producto)} 
              className="btn btn-edit-action w-100 py-2 d-flex align-items-center justify-content-center gap-1"
            >
              Editar Producto
            </button>
            <button 
              onClick={() => onAlternarEstado(producto.id, producto.suspendido === true)} 
              className={`btn btn-link text-decoration-none btn-sm py-1 fw-semibold ${producto.suspendido ? 'text-success' : 'text-secondary'}`}
              style={{ fontSize: "11px" }}
            >
              {producto.suspendido ? "Reactivar en Catálogo" : "Suspender de Catálogo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Evita re-renderizar la tarjeta si los datos críticos del producto no cambiaron
  return prevProps.producto.id === nextProps.producto.id && 
         prevProps.producto.suspendido === nextProps.producto.suspendido &&
         prevProps.producto.stock_total === nextProps.producto.stock_total &&
         prevProps.producto.nombre === nextProps.producto.nombre &&
         prevProps.producto.precio === nextProps.producto.precio &&
         prevProps.producto.imagen_url === nextProps.producto.imagen_url;
});

export default ProductoCard;