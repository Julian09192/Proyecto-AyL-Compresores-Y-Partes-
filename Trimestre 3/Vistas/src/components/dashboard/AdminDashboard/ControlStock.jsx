import React, { useState } from "react";
import Swal from "sweetalert2";

function ControlStock() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos"); 

  const movimientos = [
    {
      id: 1,
      fecha: "2024-12-20",
      producto: "Compresor Ingersoll Rand SSR",
      sku: "IR-SSR-004",
      tipo: "Entrada",
      cantidad: "+2",
      motivo: "Compra",
      detalleMotivo: "Proveedor: Ingersoll Rand",
      stockAnterior: 13,
      stockNuevo: 15,
      usuario: "Liliana Vesga",
    },
    {
      id: 2,
      fecha: "2024-12-20",
      producto: "Kit de Mantenimiento KM-500",
      sku: "KM-500-002",
      tipo: "Salida",
      cantidad: "-5",
      motivo: "Venta a cliente",
      detalleMotivo: "Cliente: Industrias XYZ",
      stockAnterior: 13,
      stockNuevo: 8,
      usuario: "Carlos Rodriguez",
    },
    {
      id: 3,
      fecha: "2024-12-19",
      producto: "Filtro Separador FS-200",
      sku: "FS-200-003",
      tipo: "Entrada",
      cantidad: "+20",
      motivo: "Compra",
      detalleMotivo: "Proveedor: Atlas Copco",
      stockAnterior: 5,
      stockNuevo: 25,
      usuario: "Liliana Vesga",
    },
    {
      id: 4,
      fecha: "2024-12-19",
      producto: "Aceite Mobil Rarus SHC 1025",
      sku: "MR-1025-004",
      tipo: "Salida",
      cantidad: "-3",
      motivo: "Venta a cliente",
      detalleMotivo: "Cliente: Cliente ABC",
      stockAnterior: 8,
      stockNuevo: 5,
      usuario: "Luis Morales",
    },
    {
      id: 5,
      fecha: "2024-12-19",
      producto: "Válvula Check VC-25",
      sku: "VC-25-005",
      tipo: "Ajuste",
      cantidad: "+- 2",
      motivo: "Ajuste de inventario",
      detalleMotivo: "Producto dañado durante manejo",
      stockAnterior: 3,
      stockNuevo: 1,
      usuario: "Liliana Vesga",
    },
  ];

  const estilosComprometidos = {
    badge: {
      Entrada: "bg-success-subtle text-success border-0 px-2",
      Salida: "bg-danger-subtle text-danger border-0 px-2",
      Ajuste: "bg-primary-subtle text-primary border-0 px-2",
    },
  };

  const movimientosFiltrados = movimientos
    .filter((m) =>
      m.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.sku.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((m) =>
      filtroTipo === "Todos" ? true : m.tipo === filtroTipo
    );

  const filtros = ["Todos", "Entrada", "Salida", "Ajuste"];

  const abrirModalMovimiento = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Nuevo Movimiento de Stock",
      width: 550,
      background: "#f9f9f9",
      showCancelButton: true,
      confirmButtonText: "Registrar Movimiento",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#121212",
      cancelButtonColor: "#e0e0e0",
      customClass: {
        popup: "rounded-4 shadow-lg",
        confirmButton: "rounded-3 fw-bold px-4",
        cancelButton: "rounded-3 fw-bold px-4 text-dark",
        title: "fs-5 fw-bold text-dark",
      },
      html: `
        <style>
          .swal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
          .swal-full { grid-column: 1 / -1; }
          .swal-field { display: flex; flex-direction: column; text-align: left; }
          .swal-field label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; margin-bottom: 4px; }
          .swal-field input, .swal-field select {
            border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 10px; font-size: 14px; outline: none;
          }
        </style>
        <div class="swal-grid">
          <div class="swal-field swal-full">
            <label>Producto</label>
            <input id="swal-prod" placeholder="Nombre del producto">
          </div>
          <div class="swal-field">
            <label>Tipo de Movimiento</label>
            <select id="swal-tipo">
              <option value="Entrada">Entrada (+)</option>
              <option value="Salida">Salida (-)</option>
              <option value="Ajuste">Ajuste (+/-)</option>
            </select>
          </div>
          <div class="swal-field">
            <label>Cantidad</label>
            <input id="swal-cant" type="number" placeholder="0">
          </div>
          <div class="swal-field">
            <label>Motivo</label>
            <input id="swal-mot" placeholder="Ej: Venta, Compra, Ajuste">
          </div>
          <div class="swal-field">
            <label>Referencia (Cliente/Proveedor)</label>
            <input id="swal-ref" placeholder="Nombre de entidad">
          </div>
        </div>
      `,
      preConfirm: () => {
        const producto = document.getElementById("swal-prod").value;
        const cantidad = document.getElementById("swal-cant").value;
        if (!producto || !cantidad) {
          Swal.showValidationMessage("⚠️ Producto y Cantidad son obligatorios");
          return false;
        }
        return {
          producto,
          tipo: document.getElementById("swal-tipo").value,
          cantidad: Number(cantidad),
          motivo: document.getElementById("swal-mot").value,
          detalleMotivo: document.getElementById("swal-ref").value,
        };
      }
    });

    if (formValues) {
      // Aquí creamos el objeto del nuevo movimiento
      const nuevoMov = {
        id: Date.now(), // ID temporal único
        fecha: new Date().toISOString().split('T'),
        producto: formValues.producto,
        sku: "N/A",
        tipo: formValues.tipo,
        cantidad: formValues.tipo === "Salida" ? `-${formValues.cantidad}` : `+${formValues.cantidad}`,
        motivo: formValues.motivo,
        detalleMotivo: formValues.detalleMotivo,
        stockAnterior: "--", 
        stockNuevo: formValues.cantidad,
        usuario: "Dilan Wilches" // Tu nombre de usuario
      };

      // Actualizamos el estado local para que se vea en la tabla inmediatamente
      setMovimientos([nuevoMov, ...movimientos]);

      Swal.fire({
        icon: "success",
        title: "¡Registrado!",
        text: "Movimiento de inventario guardado correctamente.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        /* ✅ REUTILIZACIÓN DE ESTILOS DE FILTRO DE PRODUCTOS.JSX */
        .filtro-btn {
          border: 1.5px solid #e0e0e0;
          background: #fff;
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .filtro-btn:hover {
          border-color: #121212;
          color: #121212;
        }
        .filtro-btn.activo {
          background: #121212;
          color: #fff;
          border-color: #121212;
        }
        
        /* ✅ ESTILOS ADICIONALES PARA TABLAS */
        .table-custom {
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .table-custom tbody tr {
          background-color: #f8f9fa;
          border-radius: 10px;
          transition: transform 0.2s;
        }
        .table-custom tbody tr:hover {
          transform: translateX(3px);
          background-color: #f3f4f6;
        }
        .table-custom td {
          border: none;
          padding: 14px 10px;
          vertical-align: middle;
        }
        .table-custom thead th {
          border: none;
          color: #888;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .table-custom td:first-child { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
        .table-custom td:last-child { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
      `}</style>

      {/* ✅ HEADER CONSISTENTE CON PRODUCTOS.JSX */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h3 className="fw-bold mb-0">
            Control de Stock
          </h3>
          <p className="text-muted small mb-0">Gestión de entradas, salidas y movimientos de inventario</p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ width: '280px' }}>
            <span className="input-group-text bg-light border-0" style={{ borderRadius: '10px 0 0 10px' }}>
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-light px-2"
              placeholder="Buscar por producto o SKU..."
              style={{ borderRadius: '0 10px 10px 0' }}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="btn btn-warning fw-bold" onClick={abrirModalMovimiento}>+ Nuevo Movimiento</button>
        </div>
      </div>

      {/* ✅ BARRA DE FILTROS REUTILIZANDO EL ESTILO DE PRODUCTOS.JSX */}
      <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
        <span className="text-muted small fw-semibold me-1">
          <i className="bi bi-funnel me-1"></i>Filtrar por tipo:
        </span>
        {filtros.map((tipo) => (
          <button
            key={tipo}
            className={`filtro-btn ${filtroTipo === tipo ? "activo" : ""}`}
            onClick={() => setFiltroTipo(tipo)}
          >
            {tipo}
          </button>
        ))}
        <span className="ms-auto text-muted small">
          {movimientosFiltrados.length} registro{movimientosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ✅ TABLA DE MOVIMIENTOS CON EL ESTILO ADAPTADO */}
      <div className="table-responsive">
        <table className="table table-custom table-borderless">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto / SKU</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th>Motivo / Referencia</th>
              <th>Stock Ant.</th>
              <th>Stock Nvo.</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody className="small">
            {movimientosFiltrados.map((m) => (
              <tr key={m.id}>
                <td className="text-muted text-nowrap">{m.fecha}</td>
                <td style={{ minWidth: '220px' }}>
                  <div className="fw-bold text-dark">{m.producto}</div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    <i className="bi bi-tag-fill me-1"></i>{m.sku}
                  </small>
                </td>
                <td>
                  <span className={`badge ${estilosComprometidos.badge[m.tipo]} p-2 rounded-2 fw-semibold`} style={{ fontSize: '0.7rem' }}>
                    {m.tipo === "Entrada" && <i className="bi bi-plus-lg me-1"></i>}
                    {m.tipo === "Salida" && <i className="bi bi-dash-lg me-1"></i>}
                    {m.tipo === "Ajuste" && <i className="bi bi-gear me-1"></i>}
                    {m.tipo}
                  </span>
                </td>
                <td className={`fw-bold ${m.tipo === "Entrada" ? "text-success" : m.tipo === "Salida" ? "text-danger" : "text-primary"}`}>
                  {m.cantidad}
                </td>
                <td>
                  <div className="text-dark fw-medium">{m.motivo}</div>
                  <div className="text-primary small" style={{ fontSize: '0.75rem' }}>
                    {m.detalleMotivo}
                  </div>
                </td>
                <td className="text-muted fs-6 fw-medium text-center">{m.stockAnterior}</td>
                <td className="text-dark fs-6 fw-bold text-center">{m.stockNuevo}</td>
                <td className="text-muted">
                  <i className="bi bi-person-circle me-1"></i> {m.usuario}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ ESTADO VACÍO SI NO HAY RESULTADOS */}
      {movimientosFiltrados.length === 0 && (
        <div className="text-center py-5 bg-light rounded-4 mt-3">
          <i className="bi bi-search text-muted display-4"></i>
          <h5 className="text-muted mt-3">No se encontraron movimientos</h5>
          <p className="text-muted small">Intenta cambiando los filtros o la búsqueda.</p>
        </div>
      )}
    </div>
  );
}

export default ControlStock;