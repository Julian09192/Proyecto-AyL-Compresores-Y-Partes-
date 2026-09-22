import React from "react";

export function UserStats({ estadisticas, colors }) {
  const cards = [
    { label: "Total", value: estadisticas.total, color: colors.primary },
    { label: "Activos", value: estadisticas.activos, color: colors.success },
    { label: "Suspendidos", value: estadisticas.suspendidos, color: colors.accent },
    { label: "Administradores", value: estadisticas.admins, color: colors.primary },
    { label: "Empleados", value: estadisticas.empleados, color: "#1565c0" },
    { label: "Clientes", value: estadisticas.clientes, color: colors.success },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card, idx) => (
        <div key={idx} className="col-md-2 col-sm-4 col-6">
          <div className="ayl-stat-card">
            <div className="stat-label">{card.label}</div>
            <div className="stat-number" style={{ color: card.color }}>
              {card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}