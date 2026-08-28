import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ControlStock() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [movimientos, setMovimientos] = useState([]);

  const API_URL = "http://localhost:3001/movimientos-stock";

  useEffect(() => {
    cargarMovimientos();

    const manejarActualizacion = () => cargarMovimientos();
    window.addEventListener("nuevoProductoStock", manejarActualizacion);

    return () => {
      window.removeEventListener("nuevoProductoStock", manejarActualizacion);
    };
  }, []);

  const cargarMovimientos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setMovimientos(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error al cargar:", error));
  };

  const nombreProducto = (movimiento) => movimiento.nombre_producto || `ID: ${movimiento.id_producto}`;

  const fechaMovimiento = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString();
  };

  const verInformacionMovimiento = (movimiento) => {
    Swal.fire({
      title: "Informacion de movimiento",
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#121212",
      customClass: {
        popup: "rounded-4 shadow",
        confirmButton: "rounded-3 px-4",
      },
      html: `
        <div style="text-align:left; display:grid; gap:12px; padding:8px;">
          <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
            <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Producto</div>
            <div style="font-weight:700;">${nombreProducto(movimiento)}</div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Fecha</div>
              <div>${movimiento.creado_en ? new Date(movimiento.creado_en).toLocaleString() : "-"}</div>
            </div>
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Tipo</div>
              <div>${movimiento.tipo_movimiento || "-"}</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Cantidad</div>
              <div style="font-weight:700;">${movimiento.cantidad || "-"}</div>
            </div>
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Referencia</div>
              <div>${movimiento.referencia || "-"}</div>
            </div>
          </div>
          <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
            <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Nota</div>
            <div>${movimiento.nota || "Carga inicial"}</div>
          </div>
        </div>
      `,
    });
  };

  const editarMovimiento = async (movimiento) => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar movimiento",
      showCancelButton: true,
      confirmButtonText: "Guardar cambios",
      confirmButtonColor: "#121212",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-4 shadow",
        confirmButton: "rounded-3 px-4",
        cancelButton: "rounded-3 px-4 text-dark",
      },
      html: `
        <div style="text-align:left; display:flex; flex-direction:column; gap:12px; padding:10px;">
          <div>
            <label style="font-size:11px; font-weight:700; color:#999; text-transform:uppercase;">Tipo</label>
            <select id="edit-tipo" class="form-select mt-1">
              <option value="entrada" ${movimiento.tipo_movimiento === "entrada" ? "selected" : ""}>Entrada</option>
              <option value="salida" ${movimiento.tipo_movimiento === "salida" ? "selected" : ""}>Salida</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#999; text-transform:uppercase;">Cantidad</label>
            <input id="edit-cantidad" class="form-control mt-1" type="number" value="${movimiento.cantidad || 0}">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#999; text-transform:uppercase;">Nota</label>
            <input id="edit-nota" class="form-control mt-1" value="${movimiento.nota || ""}">
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#999; text-transform:uppercase;">Referencia</label>
            <input id="edit-referencia" class="form-control mt-1" value="${movimiento.referencia || ""}">
          </div>
        </div>
      `,
      preConfirm: () => ({
        tipo_movimiento: document.getElementById("edit-tipo").value,
        cantidad: Number(document.getElementById("edit-cantidad").value),
        nota: document.getElementById("edit-nota").value,
        referencia: document.getElementById("edit-referencia").value,
      }),
    });

    if (!formValues) return;

    fetch(`${API_URL}/${movimiento.id_movimiento}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo actualizar");
        return res.json();
      })
      .then(() => {
        setMovimientos(movimientos.map((m) =>
          m.id_movimiento === movimiento.id_movimiento ? { ...m, ...formValues } : m
        ));
        Swal.fire({ icon: "success", title: "Actualizado", showConfirmButton: false, timer: 1500 });
      })
      .catch(() => Swal.fire("Error", "No se pudo actualizar el movimiento", "error"));
  };

  const eliminarMovimiento = (id) => {
    Swal.fire({
      title: "Eliminar?",
      text: "Se borrara del historial",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
          .then((res) => {
            if (!res.ok) throw new Error("No se pudo eliminar");
            setMovimientos(movimientos.filter((m) => m.id_movimiento !== id));
            Swal.fire("Eliminado", "", "success");
          })
          .catch(() => Swal.fire("Error", "No se pudo eliminar el movimiento", "error"));
      }
    });
  };

  const filtrados = movimientos.filter((m) => {
    const coincideBusqueda = nombreProducto(m).toLowerCase().includes(busqueda.toLowerCase());
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
        .btn-text-info { background: #fff7e6; color: #b77900; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .btn-text-info:hover { background: #f5a623; color: #fff; }
        .filtro-btn { border: 1.5px solid #eee; background: #fff; padding: 6px 16px; border-radius: 25px; font-size: 13px; cursor: pointer; }
        .filtro-btn.active { background: #121212; color: #fff; }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-0">Control de Stock</h4>
          <p className="text-muted small mb-0">Historial de AYL Compresores</p>
        </div>
        <div className="d-flex gap-2">
          <input className="form-control bg-light border-0" placeholder="Buscar..." style={{ width: "220px" }} onChange={(e) => setBusqueda(e.target.value)} />
          <button className="btn btn-warning fw-bold" onClick={cargarMovimientos}>Actualizar</button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        {["Todos", "Entrada", "Salida"].map((t) => (
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
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody className="small">
            {filtrados.length > 0 ? (
              filtrados.map((m) => (
                <tr key={m.id_movimiento}>
                  <td className="text-muted">{fechaMovimiento(m.creado_en)}</td>
                  <td className="fw-bold">{nombreProducto(m)}</td>
                  <td>
                    <span className={`badge border-0 rounded-pill px-3 py-2 ${m.tipo_movimiento === "entrada" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                      {m.tipo_movimiento?.toUpperCase()}
                    </span>
                  </td>
                  <td className="fw-bold">{m.cantidad}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2 flex-wrap">
                      <button className="btn-text-info" onClick={() => verInformacionMovimiento(m)}>INFORMACION DE MOVIMIENTO</button>
                      <button className="btn-text-edit" onClick={() => editarMovimiento(m)}>EDITAR</button>
                      <button className="btn-text-delete" onClick={() => eliminarMovimiento(m.id_movimiento)}>ELIMINAR</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center text-muted py-5">No hay movimientos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ControlStock;
