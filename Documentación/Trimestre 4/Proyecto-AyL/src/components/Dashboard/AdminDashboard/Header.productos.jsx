import React from "react";

const Header = React.memo(({ busqueda, setBusqueda, onNuevoProducto }) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
      <div>
        <h4 className="fw-bold text-dark mb-1">Inventario General</h4>
        <p className="text-muted small mb-0">Control y administración global de productos en catálogo</p>
      </div>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
        <div className="position-relative">
          <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ fontSize: "0.85rem" }}></i>
          <input 
            type="text" 
            className="form-control ps-5 border" 
            placeholder="Buscar por nombre, marca o ref..." 
            style={{ 
              borderRadius: "8px", 
              minWidth: "280px", 
              height: "40px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              borderColor: "#cbd5e1"
            }} 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} 
          />
        </div>
        <button 
          className="btn btn-dark fw-semibold px-4 d-flex align-items-center justify-content-center gap-2" 
          style={{ 
            borderRadius: "8px", 
            fontSize: "14px",
            height: "40px",
            backgroundColor: "#121212",
            borderColor: "#121212"
          }} 
          onClick={onNuevoProducto}
        >
          <i className="bi bi-plus-lg"></i> Nuevo producto
        </button>
      </div>
    </div>
  );
});

export default Header;