import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function ControlStock() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [movimientos, setMovimientos] = useState([]);

  const API_URL = "http://localhost:3001/movimientos";

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setMovimientos(data.reverse()))
      .catch((error) => console.error("Error:", error));
  };

  // --- ACTUALIZAR REGISTRO ---
  const editarMovimiento = async (movimiento) => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Registro",
      background: "#ffffff",
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      confirmButtonColor: "#121212",
      cancelButtonColor: "#efefef",
      customClass: {
        popup: "rounded-4 shadow",
        confirmButton: "rounded-3 px-4",
        cancelButton: "rounded-3 px-4 text-dark"
      },
      html: `
        <div style="text-align: left; display: flex; flex-direction: column; gap: 12px; padding: 10px;">
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase;">Producto</label>
            <input id="edit-prod" class="form-control mt-1" value="${movimiento.producto}">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase;">Tipo</label>
            <select id="edit-tipo" class="form-select mt-1">
              <option value="Entrada" ${movimiento.tipo === 'Entrada' ? 'selected' : ''}>Entrada (+)</option>
              <option value="Salida" ${movimiento.tipo === 'Salida' ? 'selected' : ''}>Salida (-)</option>
              <option value="Ajuste" ${movimiento.tipo === 'Ajuste' ? 'selected' : ''}>Ajuste (+/-)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase;">Motivo</label>
            <input id="edit-mot" class="form-control mt-1" value="${movimiento.motivo}">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase;">Referencia</label>
            <input id="edit-ref" class="form-control mt-1" value="${movimiento.detalleMotivo || ""}">
          </div>
        </div>
      `,
      preConfirm: () => ({
        producto: document.getElementById("edit-prod").value,
        tipo: document.getElementById("edit-tipo").value,
        motivo: document.getElementById("edit-mot").value,
        detalleMotivo: document.getElementById("edit-ref").value,
      })
    });

    if (formValues) {
      fetch(`${API_URL}/${movimiento.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues)
      })
      .then(res => res.json())
      .then(data => {
        setMovimientos(movimientos.map(m => m.id === data.id ? data : m));
        Swal.fire({ icon: "success", title: "Actualizado", showConfirmButton: false, timer: 1500 });
      });
    }
  };

  // --- BORRAR REGISTRO ---
  const eliminarMovimiento = (id) => {
    Swal.fire({
      title: "¿Eliminar?",
      text: "Se borrará permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: { popup: "rounded-4" }
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => {
          setMovimientos(movimientos.filter(m => m.id !== id));
          Swal.fire({ icon: "success", title: "Eliminado", showConfirmButton: false, timer: 1500 });
        });
      }
    });
  };

  // --- CREAR REGISTRO ---
  const abrirModalMovimiento = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Nuevo Registro",
      confirmButtonText: "Registrar",
      confirmButtonColor: "#121212",
      showCancelButton: true,
      html: `
        <div style="padding: 10px;">
          <input id="n-prod" class="form-control mb-2" placeholder="Producto">
          <select id="n-tipo" class="form-select mb-2">
            <option value="Entrada">Entrada (+)</option>
            <option value="Salida">Salida (-)</option>
          </select>
          <input id="n-cant" class="form-control mb-2" type="number" placeholder="Cantidad">
          <input id="n-mot" class="form-control mb-2" placeholder="Motivo">
          <input id="n-ref" class="form-control" placeholder="Cliente / Proveedor">
        </div>
      `,
      preConfirm: () => ({
        producto: document.getElementById("n-prod").value,
        tipo: document.getElementById("n-tipo").value,
        cantidad: document.getElementById("n-cant").value,
        motivo: document.getElementById("n-mot").value,
        detalleMotivo: document.getElementById("n-ref").value,
      })
    });

    if (formValues) {
      const nuevo = {
        fecha: new Date().toLocaleDateString('en-CA'),
        ...formValues,
        cantidad: formValues.tipo === "Salida" ? `-${formValues.cantidad}` : `+${formValues.cantidad}`,
        usuario: "Dilan Wilches"
      };
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
      })
      .then(res => res.json())
      .then(data => {
        setMovimientos([data, ...movimientos]);
        Swal.fire({ icon: "success", title: "Registrado", showConfirmButton: false, timer: 1500 });
      });
    }
  };

  const filtrados = movimientos
    .filter(m => m.producto.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(m => filtroTipo === "Todos" ? true : m.tipo === filtroTipo);

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .table-custom { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
        .table-custom tr { background: #f9f9f9; border-radius: 12px; }
        .table-custom td { padding: 16px; border: none; vertical-align: middle; }
        .table-custom thead th { border: none; color: #aaa; font-size: 11px; text-transform: uppercase; }
        
        /* BOTONES ESCRITOS */
        .btn-text-edit { 
          background: #eef2ff; color: #4f46e5; border: none; 
          padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; transition: 0.2s;
        }
        .btn-text-edit:hover { background: #4f46e5; color: #fff; }
        
        .btn-text-delete { 
          background: #fff1f2; color: #e11d48; border: none; 
          padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; transition: 0.2s;
        }
        .btn-text-delete:hover { background: #e11d48; color: #fff; }

        .filtro-btn { border: 1.5px solid #eee; background: #fff; padding: 6px 16px; border-radius: 25px; font-size: 13px; cursor: pointer; }
        .filtro-btn.active { background: #121212; color: #fff; }
      `}</style>

      {/* HEADER ORIGINAL */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-0">Control de Stock</h4>
          <p className="text-muted small mb-0">Gestión de inventario y movimientos</p>
        </div>
        <div className="d-flex gap-2">
          <input className="form-control bg-light border-0" placeholder="Buscar..." style={{ width: '220px' }} onChange={e => setBusqueda(e.target.value)} />
          <button className="btn btn-warning fw-bold" onClick={abrirModalMovimiento}>+ Nuevo</button>
        </div>
      </div>

      {/* FILTROS ORIGINALES */}
      <div className="d-flex gap-2 mb-4">
        {["Todos", "Entrada", "Salida", "Ajuste"].map(t => (
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
              <th>Cantidad</th>
              <th>Motivo / Referencia</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody className="small">
            {filtrados.map(m => (
              <tr key={m.id}>
                <td className="text-muted">{m.fecha}</td>
                <td className="fw-bold">{m.producto}</td>
                <td>
                  <span className={`badge border-0 rounded-pill px-3 py-2 ${m.tipo === 'Entrada' ? 'bg-success-subtle text-success' : m.tipo === 'Salida' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>
                    {m.tipo}
                  </span>
                </td>
                <td className="fw-bold">{m.cantidad}</td>
                <td>
                  <div className="fw-medium">{m.motivo}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>{m.detalleMotivo || "-"}</div>
                </td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn-text-edit" onClick={() => editarMovimiento(m)}>
                      EDITAR
                    </button>
                    <button className="btn-text-delete" onClick={() => eliminarMovimiento(m.id)}>
                      ELIMINAR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ControlStock;