import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

function Bitacora() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [movimientos, setMovimientos] = useState([]);
  const [eventosUsuario, setEventosUsuario] = useState([]);
  const [eventosProducto, setEventosProducto] = useState([]);

  const API_URL = "http://localhost:3001/movimientos-stock";
  const BITACORA_USUARIOS_KEY = "al_bitacora_usuarios";
  const BITACORA_PRODUCTOS_KEY = "al_bitacora_productos";

  useEffect(() => {
    cargarBitacora();

    const manejarActualizacion = () => cargarBitacora();
    window.addEventListener("nuevoProductoStock", manejarActualizacion);
    window.addEventListener("bitacoraActualizada", manejarActualizacion);

    return () => {
      window.removeEventListener("nuevoProductoStock", manejarActualizacion);
      window.removeEventListener("bitacoraActualizada", manejarActualizacion);
    };
  }, []);

  const cargarBitacora = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setMovimientos(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error al cargar:", error));

    try {
      const guardados = JSON.parse(localStorage.getItem(BITACORA_USUARIOS_KEY) || "[]");
      setEventosUsuario(Array.isArray(guardados) ? guardados : []);
    } catch {
      setEventosUsuario([]);
    }

    try {
      const guardados = JSON.parse(localStorage.getItem(BITACORA_PRODUCTOS_KEY) || "[]");
      setEventosProducto(Array.isArray(guardados) ? guardados : []);
    } catch {
      setEventosProducto([]);
    }
  };

  const nombreProducto = (movimiento) => movimiento.nombre_producto || `ID: ${movimiento.id_producto}`;

  const fechaMovimiento = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString();
  };

  const registros = useMemo(() => {
    const registrosStock = movimientos.map((movimiento) => ({
      ...movimiento,
      id_registro: `stock-${movimiento.id_movimiento}`,
      categoria: "stock",
      fecha: movimiento.creado_en,
      titulo: nombreProducto(movimiento),
      detalle: movimiento.nota || "Movimiento de inventario",
      tipo: movimiento.tipo_movimiento || "stock",
      cantidad: movimiento.cantidad,
    }));

    const registrosUsuarios = eventosUsuario.map((evento) => ({
      ...evento,
      id_registro: `usuario-${evento.id}`,
      categoria: "usuario",
      fecha: evento.creado_en,
      titulo: evento.usuario || "Usuario",
      detalle: evento.detalle || evento.accion,
      tipo: evento.accion,
      cantidad: "-",
    }));

    const registrosProductos = eventosProducto.map((evento) => ({
      ...evento,
      id_registro: `producto-${evento.id}`,
      categoria: "producto",
      fecha: evento.creado_en,
      titulo: evento.producto || "Producto",
      detalle: evento.detalle || evento.accion,
      tipo: evento.accion,
      cantidad: "-",
    }));

    return [...registrosProductos, ...registrosUsuarios, ...registrosStock].sort((a, b) => {
      return new Date(b.fecha || 0) - new Date(a.fecha || 0);
    });
  }, [movimientos, eventosUsuario, eventosProducto]);

  const verInformacionRegistro = (registro) => {
    if (registro.categoria === "usuario") {
      Swal.fire({
        title: "Registro de usuario",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#121212",
        customClass: {
          popup: "rounded-4 shadow",
          confirmButton: "rounded-3 px-4",
        },
        html: `
          <div style="text-align:left; display:grid; gap:12px; padding:8px;">
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Accion</div>
              <div style="font-weight:700;">${registro.accion || "-"}</div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
                <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Usuario</div>
                <div>${registro.usuario || "-"}</div>
              </div>
              <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
                <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Correo</div>
                <div>${registro.correo || "-"}</div>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
                <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Fecha</div>
                <div>${registro.creado_en ? new Date(registro.creado_en).toLocaleString() : "-"}</div>
              </div>
              <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
                <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Administrador</div>
                <div>${registro.admin || "-"}</div>
              </div>
            </div>
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Detalle</div>
              <div>${registro.detalle || "-"}</div>
            </div>
          </div>
        `,
      });
      return;
    }

    if (registro.categoria === "producto") {
      const cambiosHtml = Array.isArray(registro.cambios) && registro.cambios.length > 0
        ? registro.cambios.map((cambio) => `
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">${cambio.campo}</div>
              <div><strong>Antes:</strong> ${cambio.anterior || "-"}</div>
              <div><strong>Ahora:</strong> ${cambio.nuevo || "-"}</div>
            </div>
          `).join("")
        : `<div style="padding:12px; background:#f8f9fa; border-radius:10px;">Sin cambios detallados.</div>`;

      Swal.fire({
        title: "Registro de producto",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#121212",
        customClass: {
          popup: "rounded-4 shadow",
          confirmButton: "rounded-3 px-4",
        },
        html: `
          <div style="text-align:left; display:grid; gap:12px; padding:8px;">
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Accion</div>
              <div style="font-weight:700;">${registro.accion || "-"}</div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
                <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Producto</div>
                <div>${registro.producto || "-"}</div>
              </div>
              <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
                <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Fecha</div>
                <div>${registro.creado_en ? new Date(registro.creado_en).toLocaleString() : "-"}</div>
              </div>
            </div>
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Detalle</div>
              <div>${registro.detalle || "-"}</div>
            </div>
            ${cambiosHtml}
          </div>
        `,
      });
      return;
    }

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
            <div style="font-weight:700;">${nombreProducto(registro)}</div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Fecha</div>
              <div>${registro.creado_en ? new Date(registro.creado_en).toLocaleString() : "-"}</div>
            </div>
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Tipo</div>
              <div>${registro.tipo_movimiento || "-"}</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Cantidad</div>
              <div style="font-weight:700;">${registro.cantidad || "-"}</div>
            </div>
            <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
              <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Referencia</div>
              <div>${registro.referencia || "-"}</div>
            </div>
          </div>
          <div style="padding:12px; background:#f8f9fa; border-radius:10px;">
            <div style="font-size:11px; color:#888; font-weight:700; text-transform:uppercase;">Nota</div>
            <div>${registro.nota || "Carga inicial"}</div>
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
      text: "Se borrara de la bitacora",
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

  const filtrados = registros.filter((registro) => {
    const search = busqueda.toLowerCase();
    const texto = `${registro.titulo || ""} ${registro.detalle || ""} ${registro.correo || ""} ${registro.tipo || ""}`.toLowerCase();
    const coincideBusqueda = texto.includes(search);
    const coincideTipo =
      filtroTipo === "Todos" ||
      (filtroTipo === "Usuarios" && registro.categoria === "usuario") ||
      (filtroTipo === "Productos" && registro.categoria === "producto") ||
      registro.tipo === filtroTipo.toLowerCase();

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
          <h4 className="fw-bold mb-0">Bitacora</h4>
          <p className="text-muted small mb-0">Movimientos de stock, productos y cambios de usuarios</p>
        </div>
        <div className="d-flex gap-2">
          <input
            className="form-control bg-light border-0"
            placeholder="Buscar..."
            style={{ width: "220px" }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-warning fw-bold" onClick={cargarBitacora}>Actualizar</button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        {["Todos", "Entrada", "Salida", "Productos", "Usuarios"].map((t) => (
          <button key={t} className={`filtro-btn ${filtroTipo === t ? "active" : ""}`} onClick={() => setFiltroTipo(t)}>{t}</button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Registro</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody className="small">
            {filtrados.length > 0 ? (
              filtrados.map((registro) => (
                <tr key={registro.id_registro}>
                  <td className="text-muted">{fechaMovimiento(registro.fecha)}</td>
                  <td>
                    <div className="fw-bold">{registro.titulo}</div>
                    <div className="text-muted">{registro.detalle}</div>
                  </td>
                  <td>
                    <span className={`badge border-0 rounded-pill px-3 py-2 ${
                      registro.categoria === "usuario"
                        ? "bg-warning-subtle text-warning"
                        : registro.categoria === "producto"
                          ? "bg-primary-subtle text-primary"
                        : registro.tipo === "entrada"
                          ? "bg-success-subtle text-success"
                          : "bg-danger-subtle text-danger"
                    }`}>
                      {registro.categoria === "usuario" ? "USUARIO" : registro.categoria === "producto" ? "PRODUCTO" : registro.tipo?.toUpperCase()}
                    </span>
                  </td>
                  <td className="fw-bold">{registro.cantidad}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2 flex-wrap">
                      <button className="btn-text-info" onClick={() => verInformacionRegistro(registro)}>INFORMACION</button>
                      {registro.categoria === "stock" && (
                        <>
                          <button className="btn-text-edit" onClick={() => editarMovimiento(registro)}>EDITAR</button>
                          <button className="btn-text-delete" onClick={() => eliminarMovimiento(registro.id_movimiento)}>ELIMINAR</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center text-muted py-5">No hay registros en la bitacora.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bitacora;
