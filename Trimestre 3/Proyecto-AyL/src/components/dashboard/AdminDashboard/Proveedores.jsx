import { useEffect, useMemo, useState } from "react";
import { proveedores } from "../../../data/appData";
import { createItem, patchItem, readCollection, removeItem, updateItem } from "../../../data/jsonApi";

const notesByProvider = {
  "Atlas Copco Colombia": "Proveedor principal de compresores y repuestos originales.",
  "Ingersoll Rand Andina": "Aliado para equipos industriales y soporte técnico.",
  "Distribuidora Industrial A&L": "Proveedor local para entregas rápidas en Bogotá.",
  "Shell Lubricantes Colombia": "Especialista en lubricantes y aceites industriales.",
  "Kaeser Compresores SAS": "Proveedor con catálogo reducido y estado pendiente de reactivación.",
};

function getInitialItems() {
  return proveedores.map((item) => ({
    ...item,
    ciudadSimple: item.ciudad.replace(", Colombia", ""),
    notas: item.notas ?? notesByProvider[item.proveedor] ?? "",
  }));
}

function normalizeItem(item) {
  const ciudadSimple = item.ciudadSimple ?? item.ciudad?.replace(", Colombia", "") ?? "Bogotá";

  return {
    ...item,
    ciudadSimple,
    ciudad: item.ciudad ?? `${ciudadSimple}, Colombia`,
    notas: item.notas ?? notesByProvider[item.proveedor] ?? "",
  };
}

function buildPayload(formData, currentItem = {}) {
  const ciudadSimple = formData.ciudadSimple?.trim() || currentItem.ciudadSimple || "Bogotá";
  const nitValue =
    formData.nit?.replace("NIT: ", "").trim() || currentItem.nit?.replace("NIT: ", "") || "000.000.000-0";

  return {
    ...currentItem,
    proveedor: formData.proveedor?.trim() || currentItem.proveedor || "Nuevo proveedor",
    nit: `NIT: ${nitValue}`,
    web: formData.web?.trim() || currentItem.web || "www.empresa.com",
    contacto: formData.contacto?.trim() || currentItem.contacto || "Sin contacto",
    email: formData.email?.trim() || currentItem.email || "correo@empresa.com",
    telefono: formData.telefono?.trim() || currentItem.telefono || "+57 000 000-0000",
    direccion: formData.direccion?.trim() || currentItem.direccion || "Dirección pendiente",
    ciudadSimple,
    ciudad: `${ciudadSimple}, Colombia`,
    productos: currentItem.productos ?? 0,
    estado: currentItem.estado ?? "Activo",
    ultimaOrden: currentItem.ultimaOrden ?? "2025-01-01",
    notas: formData.notas?.trim() || currentItem.notas || "",
  };
}

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatus(tone) {
  if (tone === "api") {
    return { className: "admin-module__status is-success", label: "Guardando en db.json" };
  }

  if (tone === "local") {
    return { className: "admin-module__status is-warning", label: "Modo local" };
  }

  return { className: "admin-module__status is-info", label: "Cargando datos..." };
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="col-xl-4">
      <div className="module-card h-100">
        <p className="fw-semibold mb-3">{title}</p>
        <div className="admin-summary-number">{value}</div>
        <p className="text-secondary mb-0">{subtitle}</p>
      </div>
    </div>
  );
}

function ProveedorModal({ title, submitLabel, formData, onChange, onClose, onSubmit }) {
  return (
    <div className="module-modal-backdrop">
      <div className="module-modal-dialog">
        <div className="module-modal-card">
          <div className="d-flex align-items-start justify-content-between gap-3">
            <div>
              <h2 className="h3 mb-1">{title}</h2>
              <p className="text-secondary mb-0">Completa la información del proveedor</p>
            </div>
            <button type="button" onClick={onClose} className="btn btn-light rounded-3">
              x
            </button>
          </div>

          <form className="mt-4" onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre de la empresa *</label>
                <input type="text" name="proveedor" required value={formData.proveedor} onChange={onChange} placeholder="Ej: Atlas Copco Colombia" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Persona de contacto *</label>
                <input type="text" name="contacto" required value={formData.contacto} onChange={onChange} placeholder="Ej: Roberto Mendoza" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Correo electrónico *</label>
                <input type="email" name="email" required value={formData.email} onChange={onChange} placeholder="ventas@empresa.com" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={onChange} placeholder="+57 1 234-5678" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">NIT</label>
                <input type="text" name="nit" value={formData.nit} onChange={onChange} placeholder="800.123.456-1" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Sitio web</label>
                <input type="text" name="web" value={formData.web} onChange={onChange} placeholder="www.empresa.com" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={onChange} placeholder="Calle 100 #11A-35" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Ciudad</label>
                <input type="text" name="ciudadSimple" value={formData.ciudadSimple} onChange={onChange} placeholder="Bogotá" className="form-control admin-soft-input" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Notas</label>
                <textarea rows="3" name="notas" value={formData.notas} onChange={onChange} placeholder="Información adicional del proveedor..." className="form-control admin-soft-input" />
              </div>
              <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                <button type="button" onClick={onClose} className="btn btn-outline-secondary rounded-3 px-4">Cancelar</button>
                <button type="submit" className="btn contact-btn-brand rounded-3 px-4">{submitLabel}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Proveedores() {
  const [items, setItems] = useState(getInitialItems);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");
  const [sourceType, setSourceType] = useState("loading");
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadItems() {
      try {
        const data = await readCollection("proveedores");
        if (!active) return;
        setItems(data.map(normalizeItem));
        setSourceType("api");
      } catch {
        if (active) setSourceType("local");
      }
    }

    loadItems();
    return () => {
      active = false;
    };
  }, []);

  const texto = busqueda.trim().toLowerCase();
  const resultados = useMemo(() => {
    return items.filter((item) => {
      const values = [item.proveedor, item.contacto, item.email, item.telefono].join(" ").toLowerCase();
      const coincideTexto = values.includes(texto);
      const coincideEstado = estadoFiltro === "Todos los estados" ? true : item.estado === estadoFiltro;
      return coincideTexto && coincideEstado;
    });
  }, [items, texto, estadoFiltro]);

  const activos = items.filter((item) => item.estado === "Activo").length;
  const totalProductos = items.reduce((total, item) => total + Number(item.productos || 0), 0);
  const ultimaOrden = items.reduce((latest, item) => {
    if (!item.ultimaOrden) return latest;
    if (!latest) return item.ultimaOrden;
    return item.ultimaOrden > latest ? item.ultimaOrden : latest;
  }, "");

  const status = getStatus(sourceType);

  const openCreateModal = () => {
    setEditingItem(null);
    setIsCreating(true);
    setFormData({ proveedor: "", contacto: "", email: "", telefono: "", nit: "", web: "", direccion: "", ciudadSimple: "Bogotá", notas: "" });
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData({
      proveedor: item.proveedor,
      contacto: item.contacto,
      email: item.email,
      telefono: item.telefono,
      nit: item.nit.replace("NIT: ", ""),
      web: item.web,
      direccion: item.direccion,
      ciudadSimple: item.ciudadSimple,
      notas: item.notas,
    });
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const saveItem = async (event) => {
    event.preventDefault();
    const payload = buildPayload(formData, editingItem ?? {});

    if (isCreating) {
      if (sourceType === "api") {
        try {
          const created = await createItem("proveedores", payload);
          setItems((current) => [normalizeItem(created), ...current]);
          closeModal();
          return;
        } catch {
          setSourceType("local");
        }
      }

      const newId = items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
      setItems((current) => [{ ...normalizeItem(payload), id: newId }, ...current]);
      closeModal();
      return;
    }

    if (sourceType === "api") {
      try {
        const updated = await updateItem("proveedores", editingItem.id, { ...payload, id: editingItem.id });
        setItems((current) => current.map((item) => (item.id === editingItem.id ? normalizeItem(updated) : item)));
        closeModal();
        return;
      } catch {
        setSourceType("local");
      }
    }

    setItems((current) => current.map((item) => (item.id === editingItem.id ? normalizeItem({ ...payload, id: editingItem.id }) : item)));
    closeModal();
  };

  const deleteItem = async (id) => {
    const item = items.find((current) => current.id === id);
    if (!item || !window.confirm(`Eliminar a ${item.proveedor}?`)) return;

    if (sourceType === "api") {
      try {
        await removeItem("proveedores", id);
      } catch {
        setSourceType("local");
      }
    }

    setItems((current) => current.filter((currentItem) => currentItem.id !== id));
  };

  const toggleEstado = async (id) => {
    const item = items.find((current) => current.id === id);
    if (!item) return;

    const nextEstado = item.estado === "Activo" ? "Inactivo" : "Activo";

    if (sourceType === "api") {
      try {
        const updated = await patchItem("proveedores", id, { estado: nextEstado });
        setItems((current) => current.map((currentItem) => (currentItem.id === id ? normalizeItem(updated) : currentItem)));
        return;
      } catch {
        setSourceType("local");
      }
    }

    setItems((current) => current.map((currentItem) => (currentItem.id === id ? { ...currentItem, estado: nextEstado } : currentItem)));
  };

  return (
    <section className="admin-module p-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Gestión de proveedores</h1>
          <p className="text-secondary mb-0">Administra la información de proveedores y contactos.</p>
          <div className="mt-3"><span className={status.className}>{status.label}</span></div>
        </div>
        <button type="button" onClick={openCreateModal} className="btn contact-btn-brand rounded-3 px-4 py-3">+ Agregar proveedor</button>
      </div>

      <div className="row g-4 mb-4">
        <StatCard title="Proveedores activos" value={activos} subtitle={`De ${items.length} proveedores`} />
        <StatCard title="Productos totales" value={totalProductos} subtitle="En catálogo de proveedores" />
        <StatCard title="Última orden" value={formatDate(ultimaOrden)} subtitle="Registro más reciente" />
      </div>

      <div className="module-card mb-4">
        <div className="row g-3">
          <div className="col-lg-9">
            <input type="text" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por nombre, contacto o correo..." className="form-control admin-soft-input" />
          </div>
          <div className="col-lg-3">
            <select value={estadoFiltro} onChange={(event) => setEstadoFiltro(event.target.value)} className="form-select admin-soft-input">
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="module-card">
        <h2 className="h5 mb-4">Proveedores ({resultados.length})</h2>

        <div className="admin-table-wrap">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Contacto</th>
                <th>Información</th>
                <th>Productos</th>
                <th>Estado</th>
                <th>Última orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-semibold">{item.proveedor}</div>
                    <div className="text-secondary">{item.nit}</div>
                    <a href={`https://${item.web}`} target="_blank" rel="noreferrer" className="text-decoration-none">{item.web}</a>
                  </td>
                  <td>
                    <div className="fw-semibold">{item.contacto}</div>
                    <div className="text-secondary">Email: {item.email}</div>
                    <div className="text-secondary">Tel: {item.telefono}</div>
                  </td>
                  <td>
                    <div>{item.direccion}</div>
                    <div className="text-secondary">{item.ciudad}</div>
                  </td>
                  <td><span className="admin-badge-soft">{item.productos} productos</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`admin-status-chip ${item.estado === "Activo" ? "is-active" : "is-inactive"}`}>{item.estado}</span>
                      <button type="button" onClick={() => toggleEstado(item.id)} className={`admin-switch ${item.estado === "Activo" ? "is-active" : ""}`}>
                        <span className="admin-switch__thumb" />
                      </button>
                    </div>
                  </td>
                  <td>{formatDate(item.ultimaOrden)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button type="button" onClick={() => openEditModal(item)} className="admin-action">✏️ Editar</button>
                      <button type="button" onClick={() => deleteItem(item.id)} className="admin-action is-delete">🗑️ Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {resultados.length === 0 ? <div className="alert alert-light mt-4 mb-0 rounded-4">No se encontraron proveedores.</div> : null}
      </div>

      {formData ? (
        <ProveedorModal
          title={isCreating ? "Agregar proveedor" : "Editar proveedor"}
          submitLabel={isCreating ? "Agregar proveedor" : "Guardar cambios"}
          formData={formData}
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={saveItem}
        />
      ) : null}
    </section>
  );
}

export default Proveedores;
