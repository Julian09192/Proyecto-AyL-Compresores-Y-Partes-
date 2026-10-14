import React from "react";
import { FiSearch } from "react-icons/fi";

export function UserFilters({ busqueda, setBusqueda, orden, setOrden, estadisticas }) {
  const filterOptions = [
    { id: "todos", label: "Todos", count: estadisticas.total },
    { id: "admin", label: "Admin", count: estadisticas.admins },
    { id: "empleado", label: "Empleados", count: estadisticas.empleados },
    { id: "cliente", label: "Clientes", count: estadisticas.clientes },
    { id: "activos", label: "Activos", count: estadisticas.activos },
    { id: "suspendidos", label: "Suspendidos", count: estadisticas.suspendidos },
  ];

  return (
    <div className="ayl-card p-3 mb-4">
      <div className="row g-3 align-items-center">
        <div className="col-md-5">
          <div className="position-relative">
            <FiSearch className="position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              className="ayl-search-input w-100"
              placeholder="Buscar por nombre, correo o identificación..."
              style={{ paddingLeft: "36px" }}
              onChange={(e) => setBusqueda(e.target.value)}
              value={busqueda}
            />
            {busqueda && (
              <button
                className="position-absolute btn btn-link text-muted"
                style={{ right: "8px", top: "50%", transform: "translateY(-50%)", padding: "4px", textDecoration: "none" }}
                onClick={() => setBusqueda("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="col-md-7">
          <div className="d-flex gap-2 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                className={`ayl-filter-btn ${orden === opt.id ? "active" : ""}`}
                onClick={() => setOrden(opt.id)}
              >
                {opt.label}
                <span className="badge-count">{opt.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}