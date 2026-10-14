import React from "react";

const Filtros = React.memo(({ filtroEstado, setFiltroEstado, filtroOrden, setFiltroOrden }) => {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted fw-bold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Estado:</span>
        <div className="bg-light p-1 rounded-3 d-flex gap-1 border">
          <button className={`btn btn-sm border-0 px-3 py-1 ${filtroEstado === 'todos' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroEstado("todos")}>Todos</button>
          <button className={`btn btn-sm border-0 px-3 py-1 ${filtroEstado === 'activos' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroEstado("activos")}>Activos</button>
          <button className={`btn btn-sm border-0 px-3 py-1 ${filtroEstado === 'suspendidos' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroEstado("suspendidos")}>Suspendidos</button>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <span className="text-muted fw-bold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Orden:</span>
        <div className="bg-light p-1 rounded-3 d-flex gap-1 border">
          <button className={`btn btn-sm border-0 px-3 py-1 ${filtroOrden === 'recientes' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroOrden("recientes")}>Recientes</button>
          <button className={`btn btn-sm border-0 px-3 py-1 ${filtroOrden === 'precio_menor' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroOrden("precio_menor")}>Precio menor</button>
          <button className={`btn btn-sm border-0 px-3 py-1 ${filtroOrden === 'precio_mayor' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroOrden("precio_mayor")}>Precio mayor</button>
        </div>
      </div>
    </div>
  );
});

export default Filtros;