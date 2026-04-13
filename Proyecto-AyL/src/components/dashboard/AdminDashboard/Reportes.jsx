import React from "react";
import Swal from "sweetalert2";

const Reportes = () => {
  const categorias = ["Todas las categorías", "Compresores", "Filtros", "Lubricantes", "Válvulas", "Accesorios", "Herramientas", "Repuestos"];
  const proveedores = ["Todos los proveedores", "Atlas Copco", "Ingersoll Rand", "Sullair", "Kaeser"];

  const imprimirReporte = () => {
    window.print();
  };

  const exportarArchivo = (formato) => {
    Swal.fire({
      title: `Exportando a ${formato}...`,
      text: "Generando el reporte detallado, por favor espere.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      willOpen: () => {
        Swal.showLoading();
      }
    });
  };

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .reporte-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .form-label-custom {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: block;
        }

        .form-select-custom, .form-input-custom {
          background-color: #f8f9fa;
          border: 1.5px solid #eee;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          color: #333;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-select-custom:focus { border-color: #121212; }

        .bar-container {
          height: 300px;
          display: flex;
          align-items: flex-end;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px dashed #ddd;
          margin-bottom: 10px;
        }

        .bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }

        .bar-item {
          width: 100%;
          max-width: 80px;
          background: #008cff;
          border-radius: 4px 4px 0 0;
          transition: transform 0.3s ease, background 0.2s;
          cursor: pointer;
        }

        .bar-item:hover {
          background: #0076d6;
          transform: scaleX(1.02);
        }

        .bar-label {
          font-size: 12px;
          color: #666;
          margin-top: 12px;
          text-align: center;
          font-weight: 500;
        }

        /* Ocultar elementos específicos al imprimir */
        @media print {
          .no-print { display: none !important; }
          .reporte-card { border: none; box-shadow: none; }
          .bar-item { -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div className="mb-4 no-print">
        <h3 className="fw-bold mb-1">Reportes e Informes</h3>
        <p className="text-muted small">Genera reportes detallados del inventario y movimientos</p>
      </div>

      <div className="reporte-card mb-4 no-print">
        <div className="d-flex align-items-center gap-2 mb-4">
          <h6 className="fw-bold mb-0">Configuración del Reporte</h6>
        </div>
        
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label-custom">Tipo de Reporte</label>
            <select className="form-select-custom">
              <option> Reporte de Stock</option>
              <option> Reporte de Movimientos</option>
              <option> Reporte de Valoración</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label-custom">Fecha Desde</label>
            <input type="date" className="form-input-custom" defaultValue="2024-12-01" />
          </div>
          <div className="col-md-2">
            <label className="form-label-custom">Fecha Hasta</label>
            <input type="date" className="form-input-custom" defaultValue="2024-12-31" />
          </div>
          <div className="col-md-2">
            <label className="form-label-custom">Categoría</label>
            <select className="form-select-custom">
              {categorias.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Proveedor</label>
            <select className="form-select-custom">
              {proveedores.map(prov => <option key={prov}>{prov}</option>)}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <span className="text-muted small">
            <i className="bi bi-funnel me-1"></i> Filtros aplicados: 0 categoría, 0 proveedor
          </span>
          <div className="d-flex gap-2">
            <button className="btn btn-light border fw-bold px-3 d-flex align-items-center gap-2 small" onClick={() => exportarArchivo('PDF')}>
              <i className="bi bi-file-earmark-pdf"></i> Exportar PDF
            </button>
            <button className="btn btn-light border fw-bold px-3 d-flex align-items-center gap-2 small" onClick={() => exportarArchivo('Excel')}>
              <i className="bi bi-file-earmark-excel"></i> Exportar Excel
            </button>
            <button className="btn btn-warning fw-bold px-4 d-flex align-items-center gap-2" onClick={imprimirReporte}>
              <i className="bi bi-printer"></i> Imprimir
            </button>
          </div>
        </div>
      </div>

      <div className="reporte-card">
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-box-seam text-dark"></i>
              <h6 className="fw-bold mb-0">Reporte de Stock</h6>
            </div>
            <small className="text-muted">Período: 2024-12-01 al 2024-12-31</small>
          </div>
          <div className="text-end">
            <div className="text-muted small fw-medium">Generado: 5/4/2026</div>
            <div className="text-muted small fw-medium">Usuario: Administrador</div>
          </div>
        </div>

        <div className="mt-4">
          <h6 className="fw-bold text-dark mb-1">Stock por Categoría</h6>
          <p className="text-muted small mb-4">Distribución actual del inventario</p>
          
          <div className="bar-container">
            {categorias.slice(1).map((cat, idx) => (
              <div key={idx} className="bar-wrapper">
                <div className="bar-item" style={{ height: `${Math.random() * 100 + 50}px` }}></div>
                <div className="bar-label">{cat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;