import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function ControlStock() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [movimientos, setMovimientos] = useState([]);

  // URL de tu servidor Node.js (Confirmado puerto 3001)
  const API_URL = "http://localhost:3001/movimientos-stock"; 

  useEffect(() => {
    cargarMovimientos();

    // ESCUCHADOR DE EVENTOS: Cuando se agregue un producto, esta función se activa
    const manejarActualizacion = () => {
      console.log("Evento detectado: Recargando movimientos...");
      cargarMovimientos();
    };

    window.addEventListener("nuevoProductoStock", manejarActualizacion);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener("nuevoProductoStock", manejarActualizacion);
    };
  }, []);

  const cargarMovimientos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        if (Array.isArray(data)) {
          setMovimientos(data);
        }
      })
      .catch((error) => console.error("Error al cargar:", error));
  };

  const eliminarMovimiento = (id) => {
    Swal.fire({
      title: "¿Eliminar?",
      text: "Se borrará del historial",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
          .then(() => {
            setMovimientos(movimientos.filter(m => m.id_movimiento !== id));
            Swal.fire("Eliminado", "", "success");
          });
      }
    });
  };

  const filtrados = movimientos.filter(m => {
    const nombre = m.nombre_producto || `ID: ${m.id_producto}`;
    const coincideBusqueda = nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === "Todos" ? true : m.tipo_movimiento === filtroTipo.toLowerCase();
    return coincideBusqueda && coincideTipo;
  });

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .table-custom { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
        .table-custom tr { background: #f9f9f9; border-radius: 12px; }
        .table-custom td { padding: 16px; border: none; vertical-align: middle; }
        .table-custom thead th { border: none; color: #aaa; font-size: 11px; text-transform: uppercase; }
        .btn-text-edit { background: #eef2ff; color: #4f46e5; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .btn-text-delete { background: #fff1f2; color: #e11d48; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .filtro-btn { border: 1.5px solid #eee; background: #fff; padding: 6px 16px; border-radius: 25px; font-size: 13px; cursor: pointer; }
        .filtro-btn.active { background: #121212; color: #fff; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-0">Control de Stock</h4>
          <p className="text-muted small mb-0">Historial de AYL Compresores</p>
        </div>
        <div className="d-flex gap-2">
          <input className="form-control bg-light border-0" placeholder="Buscar..." style={{ width: '220px' }} onChange={e => setBusqueda(e.target.value)} />
          <button className="btn btn-warning fw-bold">+ Nuevo</button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        {["Todos", "Entrada", "Salida"].map(t => (
          <button key={t} className={`filtro-btn ${filtroTipo === t ? "active" : ""}`} onClick={() => setFiltroTipo(t)}>{t}</button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th>Nota</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody className="small">
            {filtrados.length > 0 ? (
              filtrados.map((m) => (
                <tr key={m.id_movimiento}>
                  <td className="text-muted">{new Date(m.creado_en).toLocaleDateString()}</td>
                  <td className="fw-bold">{m.nombre_producto || `ID: ${m.id_producto}`}</td>
                  <td>
                    <span className={`badge border-0 rounded-pill px-3 py-2 ${m.tipo_movimiento === 'entrada' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {m.tipo_movimiento?.toUpperCase()}
                    </span>
                  </td>
                  <td className="fw-bold">{m.cantidad}</td>
                  <td>{m.nota || "Carga inicial"}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn-text-edit">EDITAR</button>
                      <button className="btn-text-delete" onClick={() => eliminarMovimiento(m.id_movimiento)}>ELIMINAR</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center text-muted py-5">No hay movimientos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ControlStock;