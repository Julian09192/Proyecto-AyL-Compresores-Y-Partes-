import React from "react";

function Notificaciones({ productos }) {
  // 1. Ajuste de filtros: p.stock_total en lugar de p.Stock (minúsculas)
  const stockBajo = productos.filter((p) => Number(p.stock_total) < 10 && !p.suspendido);

  // Si no hay productos con stock bajo, no renderizamos nada
  if (stockBajo.length === 0) return null;

  return (
    <div className="mb-5">
      <style>{`
        .notif-scroll { 
          display: flex; 
          gap: 16px; 
          overflow-x: auto; 
          padding: 10px 5px; 
          scrollbar-width: none; 
        }
        .notif-scroll::-webkit-scrollbar { display: none; }
        
        .card-bajo { 
          min-width: 260px; 
          background: #fff; 
          border-radius: 12px; 
          border: 1.5px solid #fee2e2; 
          display: flex; 
          align-items: center; 
          padding: 12px; 
          gap: 12px; 
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.05);
        }
        .img-bajo { 
          width: 50px; 
          height: 50px; 
          object-fit: contain; 
          border-radius: 8px; 
          background: #f9f9f9; 
          padding: 4px; 
        }
      `}</style>

      <div className="d-flex align-items-center gap-2 mb-3 text-danger">
        <i className="bi bi-exclamation-triangle-fill fs-5"></i>
        <h6 className="fw-bold mb-0" style={{ letterSpacing: '0.5px' }}>
          REABASTECIMIENTO INMEDIATO
        </h6>
      </div>

      <div className="notif-scroll">
        {stockBajo.map((p) => (
          <div key={`bajo-${p.id}`} className="card-bajo">
            <img 
              // 2. Ajuste de imagen: p.imagen_url (minúsculas)
              src={p.imagen_url || "https://placehold.co/100x100?text=Sin+Foto"} 
              className="img-bajo" 
              alt={p.nombre} 
            />
            <div className="text-truncate">
              <p className="fw-bold mb-0 text-truncate" style={{ fontSize: '14px' }}>
                {/* 3. Ajuste de nombre: p.nombre (minúsculas) */}
                {p.nombre}
              </p>
              <span className="text-danger fw-bold" style={{ fontSize: '12px' }}>
                {/* 4. Ajuste de stock: p.stock_total (minúsculas) */}
                {p.stock_total} unidades restantes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notificaciones;