import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3001";

const Reportes = () => {
  const [tipoReporte, setTipoReporte] = useState("stock");
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    Promise.all([
      fetch(`${API_URL}/productos`).then((res) => res.json()),
      fetch(`${API_URL}/movimientos-stock`).then((res) => res.json()),
    ])
      .then(([productosData, movimientosData]) => {
        setProductos(Array.isArray(productosData) ? productosData : []);
        setMovimientos(Array.isArray(movimientosData) ? movimientosData : []);
      })
      .catch(() => {
        Swal.fire("Error", "No se pudieron cargar los datos del reporte", "error");
      });
  };

  const categorias = useMemo(() => {
    const unicas = productos
      .map((p) => p.tipo || p.Tipo || "Sin categoria")
      .filter(Boolean);
    return ["Todas", ...new Set(unicas)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const nombre = p.nombre || p.Nombre || "";
      const tipo = p.tipo || p.Tipo || "Sin categoria";
      const coincideCategoria = categoria === "Todas" || tipo === categoria;
      const coincideBusqueda = nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoria, busqueda]);

  const resumen = useMemo(() => {
    const stockTotal = productosFiltrados.reduce((acc, p) => acc + Number(p.stock || p.Stock || 0), 0);
    const valorTotal = productosFiltrados.reduce((acc, p) => {
      return acc + Number(p.precio || p.Precio || 0) * Number(p.stock || p.Stock || 0);
    }, 0);
    const bajoStock = productosFiltrados.filter((p) => Number(p.stock || p.Stock || 0) < 10).length;

    return {
      productos: productosFiltrados.length,
      stockTotal,
      valorTotal,
      bajoStock,
      entradas: movimientos.filter((m) => m.tipo_movimiento === "entrada").length,
      salidas: movimientos.filter((m) => m.tipo_movimiento === "salida").length,
    };
  }, [productosFiltrados, movimientos]);

  const stockPorCategoria = useMemo(() => {
    const grupos = productosFiltrados.reduce((acc, p) => {
      const tipo = p.tipo || p.Tipo || "Sin categoria";
      acc[tipo] = (acc[tipo] || 0) + Number(p.stock || p.Stock || 0);
      return acc;
    }, {});

    return Object.entries(grupos).map(([nombre, stock]) => ({ nombre, stock }));
  }, [productosFiltrados]);

  const maxStock = Math.max(...stockPorCategoria.map((item) => item.stock), 1);

  const imprimirReporte = () => {
    window.print();
  };

  const exportarCSV = () => {
    const filas = [
      ["Producto", "Categoria", "Stock", "Precio", "Valor inventario"],
      ...productosFiltrados.map((p) => {
        const stock = Number(p.stock || p.Stock || 0);
        const precio = Number(p.precio || p.Precio || 0);
        return [
          p.nombre || p.Nombre || "",
          p.tipo || p.Tipo || "Sin categoria",
          stock,
          precio,
          stock * precio,
        ];
      }),
    ];

    const csv = filas.map((fila) => fila.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reporte-inventario.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .report-card { background:#fff; border:1px solid #ececec; border-radius:12px; padding:20px; box-shadow:0 8px 24px rgba(0,0,0,0.03); }
        .report-stat { background:#f8f9fa; border:1px solid #eeeeee; border-radius:10px; padding:16px; min-height:105px; }
        .report-stat small { color:#777; font-weight:700; text-transform:uppercase; font-size:11px; }
        .report-stat strong { display:block; font-size:26px; margin-top:8px; color:#121212; }
        .form-label-custom { font-size:11px; font-weight:700; color:#888; text-transform:uppercase; margin-bottom:8px; display:block; }
        .form-select-custom, .form-input-custom { background:#f8f9fa; border:1.5px solid #eee; border-radius:10px; padding:10px 12px; font-size:14px; color:#333; width:100%; outline:none; }
        .bar-container { height:260px; display:flex; align-items:flex-end; gap:14px; padding:16px 0; border-bottom:1px dashed #ddd; }
        .bar-wrapper { flex:1; min-width:68px; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end; }
        .bar-item { width:100%; max-width:72px; background:#F5A623; border-radius:6px 6px 0 0; transition:0.2s; }
        .bar-label { font-size:11px; color:#666; margin-top:10px; text-align:center; font-weight:600; word-break:break-word; }
        .report-table th { color:#888; font-size:11px; text-transform:uppercase; border-bottom:1px solid #eee; padding:12px; }
        .report-table td { padding:12px; border-bottom:1px solid #f2f2f2; vertical-align:middle; }
        @media print {
          .no-print { display:none !important; }
          .report-card { border:none; box-shadow:none; }
          .bar-item { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <div>
          <h3 className="fw-bold mb-1">Reportes e Informes</h3>
          <p className="text-muted small mb-0">Resumen funcional de inventario, stock y movimientos.</p>
        </div>
        <button className="btn btn-warning fw-bold" onClick={cargarDatos}>
          Actualizar
        </button>
      </div>

      <div className="report-card mb-4 no-print">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label-custom">Tipo de reporte</label>
            <select className="form-select-custom" value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
              <option value="stock">Reporte de stock</option>
              <option value="valoracion">Reporte de valoracion</option>
              <option value="movimientos">Reporte de movimientos</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Categoria</label>
            <select className="form-select-custom" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categorias.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Buscar producto</label>
            <input className="form-input-custom" placeholder="Nombre del producto" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-light border fw-bold flex-fill" onClick={exportarCSV}>
              <i className="bi bi-file-earmark-spreadsheet me-2"></i>CSV
            </button>
            <button className="btn btn-dark fw-bold flex-fill" onClick={imprimirReporte}>
              <i className="bi bi-printer me-2"></i>Imprimir
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="report-stat"><small>Productos</small><strong>{resumen.productos}</strong></div></div>
        <div className="col-md-3"><div className="report-stat"><small>Stock total</small><strong>{resumen.stockTotal}</strong></div></div>
        <div className="col-md-3"><div className="report-stat"><small>Valor inventario</small><strong>{formatoMoneda(resumen.valorTotal)}</strong></div></div>
        <div className="col-md-3"><div className="report-stat"><small>Bajo stock</small><strong>{resumen.bajoStock}</strong></div></div>
      </div>

      <div className="report-card mb-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h6 className="fw-bold mb-1">{tipoReporte === "movimientos" ? "Movimientos recientes" : "Stock por categoria"}</h6>
            <small className="text-muted">Generado: {new Date().toLocaleDateString()}</small>
          </div>
          <div className="text-end small text-muted">
            Entradas: {resumen.entradas} | Salidas: {resumen.salidas}
          </div>
        </div>

        {tipoReporte === "movimientos" ? (
          <div className="table-responsive">
            <table className="w-100 report-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.slice(0, 10).map((m) => (
                  <tr key={m.id_movimiento}>
                    <td>{m.creado_en ? new Date(m.creado_en).toLocaleDateString() : "-"}</td>
                    <td className="fw-bold">{m.nombre_producto || `ID: ${m.id_producto}`}</td>
                    <td>{m.tipo_movimiento}</td>
                    <td>{m.cantidad}</td>
                    <td>{m.nota || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bar-container">
            {stockPorCategoria.length > 0 ? stockPorCategoria.map((item) => (
              <div className="bar-wrapper" key={item.nombre}>
                <div className="bar-item" style={{ height: `${Math.max((item.stock / maxStock) * 220, 12)}px` }} title={`${item.nombre}: ${item.stock}`}></div>
                <div className="bar-label">{item.nombre}<br />{item.stock}</div>
              </div>
            )) : (
              <div className="text-muted w-100 text-center pb-5">No hay datos para mostrar.</div>
            )}
          </div>
        )}
      </div>

      <div className="report-card">
        <h6 className="fw-bold mb-3">Detalle de productos</h6>
        <div className="table-responsive">
          <table className="w-100 report-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => {
                const stock = Number(p.stock || p.Stock || 0);
                const precio = Number(p.precio || p.Precio || 0);
                return (
                  <tr key={p.id}>
                    <td className="fw-bold">{p.nombre || p.Nombre}</td>
                    <td>{p.tipo || p.Tipo || "Sin categoria"}</td>
                    <td>{stock}</td>
                    <td>{formatoMoneda(precio)}</td>
                    <td>{formatoMoneda(stock * precio)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
