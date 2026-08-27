import { useEffect, useState } from "react";
import { usuarios } from "../../../data/appData";
import { createItem, patchItem, readCollection, removeItem, updateItem } from "../../../data/jsonApi";

function getInitials(nombre) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value || value === "Sin acceso") {
    return value || "Sin fecha";
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

function buildPayload(formData, currentItem = {}) {
  return {
    ...currentItem,
    nombre: formData.nombre?.trim() || currentItem.nombre || "Nuevo usuario",
    email: formData.email?.trim() || currentItem.email || "usuario@empresa.com",
    rol: formData.rol || currentItem.rol || "Auxiliar",
    estado: formData.estado || currentItem.estado || "Activo",
    fechaCreacion: currentItem.fechaCreacion || getToday(),
    ultimoAcceso: currentItem.ultimoAcceso || "Sin acceso",
    creadoPor: currentItem.creadoPor || "Administrador",
  };
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

function UsuarioModal({ title, submitLabel, formData, onChange, onClose, onSubmit }) {
  return (
    <div className="module-modal-backdrop">
      <div className="module-modal-dialog">
        <div className="module-modal-card is-small">
          <div className="d-flex align-items-start justify-content-between gap-3">
            <div>
              <h2 className="h3 mb-1">{title}</h2>
              <p className="text-secondary mb-0">Completa la información del usuario</p>
            </div>
            <button type="button" onClick={onClose} className="btn btn-light rounded-3">
              x
            </button>
          </div>

          <form className="mt-4" onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre *</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={onChange} placeholder="Nombre completo" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Correo *</label>
                <input type="email" name="email" required value={formData.email} onChange={onChange} placeholder="correo@empresa.com" className="form-control admin-soft-input" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Rol</label>
                <select name="rol" value={formData.rol} onChange={onChange} className="form-select admin-soft-input">
                  <option>Administrador</option>
                  <option>Auxiliar</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Estado</label>
                <select name="estado" value={formData.estado} onChange={onChange} className="form-select admin-soft-input">
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
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

function Usuarios() {
  const [items, setItems] = useState(() => usuarios.map((item) => ({ ...item })));
  const [sourceType, setSourceType] = useState("loading");
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos los roles");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadItems() {
      try {
        const data = await readCollection("usuarios");
        if (!active) return;
        setItems(data);
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
  const resultados = items.filter((item) => {
    const values = [item.nombre, item.email, item.rol, item.estado, item.creadoPor].join(" ").toLowerCase();
    const coincideTexto = values.includes(texto);
    const coincideRol = rolFiltro === "Todos los roles" ? true : item.rol === rolFiltro;
    const coincideEstado = estadoFiltro === "Todos los estados" ? true : item.estado === estadoFiltro;
    return coincideTexto && coincideRol && coincideEstado;
  });

  const usuariosActivos = items.filter((item) => item.estado === "Activo").length;
  const administradores = items.filter((item) => item.rol === "Administrador").length;
  const auxiliares = items.filter((item) => item.rol === "Auxiliar").length;
  const status = getStatus(sourceType);

  const openCreateModal = () => {
    setEditingItem(null);
    setIsCreating(true);
    setFormData({ nombre: "", email: "", rol: "Auxiliar", estado: "Activo" });
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData({
      nombre: item.nombre,
      email: item.email,
      rol: item.rol,
      estado: item.estado,
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
          const created = await createItem("usuarios", payload);
          setItems((current) => [created, ...current]);
          closeModal();
          return;
        } catch {
          setSourceType("local");
        }
      }

      const newId = items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
      setItems((current) => [{ ...payload, id: newId }, ...current]);
      closeModal();
      return;
    }

    if (sourceType === "api") {
      try {
        const updated = await updateItem("usuarios", editingItem.id, { ...payload, id: editingItem.id });
        setItems((current) => current.map((item) => (item.id === editingItem.id ? updated : item)));
        closeModal();
        return;
      } catch {
        setSourceType("local");
      }
    }

    setItems((current) => current.map((item) => (item.id === editingItem.id ? { ...payload, id: editingItem.id } : item)));
    closeModal();
  };

  const deleteItem = async (id) => {
    const item = items.find((current) => current.id === id);
    if (!item || !window.confirm(`Eliminar a ${item.nombre}?`)) return;

    if (sourceType === "api") {
      try {
        await removeItem("usuarios", id);
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
        const updated = await patchItem("usuarios", id, { estado: nextEstado });
        setItems((current) => current.map((currentItem) => (currentItem.id === id ? updated : currentItem)));
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
          <h1 className="h4 mb-1">Gestión de usuarios</h1>
          <p className="text-secondary mb-0">Administra usuarios y sus roles en el sistema.</p>
          <div className="mt-3"><span className={status.className}>{status.label}</span></div>
        </div>
        <button type="button" onClick={openCreateModal} className="btn contact-btn-brand rounded-3 px-4 py-3">+ Agregar usuario</button>
      </div>

      <div className="row g-4 mb-4">
        <StatCard title="Usuarios activos" value={usuariosActivos} subtitle={`De ${items.length} usuarios`} />
        <StatCard title="Administradores" value={administradores} subtitle="Con permisos completos" />
        <StatCard title="Auxiliares" value={auxiliares} subtitle="Con permisos limitados" />
      </div>

      <div className="module-card mb-4">
        <div className="row g-3">
          <div className="col-lg-6">
            <input type="text" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por nombre o correo..." className="form-control admin-soft-input" />
          </div>
          <div className="col-lg-3">
            <select value={rolFiltro} onChange={(event) => setRolFiltro(event.target.value)} className="form-select admin-soft-input">
              <option>Todos los roles</option>
              <option>Administrador</option>
              <option>Auxiliar</option>
            </select>
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
        <h2 className="h5 mb-4">Usuarios ({resultados.length})</h2>

        <div className="admin-table-wrap">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th>Último acceso</th>
                <th>Creado por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-start gap-3">
                      <div className="module-avatar">{getInitials(item.nombre)}</div>
                      <div>
                        <div className="fw-semibold">{item.nombre}</div>
                        <div className="text-secondary">{item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`admin-role-chip ${item.rol === "Administrador" ? "is-admin" : ""}`}>{item.rol}</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`admin-status-chip ${item.estado === "Activo" ? "is-active" : "is-inactive"}`}>{item.estado}</span>
                      <button type="button" onClick={() => toggleEstado(item.id)} className={`admin-switch ${item.estado === "Activo" ? "is-active" : ""}`}>
                        <span className="admin-switch__thumb" />
                      </button>
                    </div>
                  </td>
                  <td>{formatDate(item.fechaCreacion)}</td>
                  <td>{formatDate(item.ultimoAcceso)}</td>
                  <td>{item.creadoPor}</td>
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

        {resultados.length === 0 ? <div className="alert alert-light mt-4 mb-0 rounded-4">No se encontraron usuarios.</div> : null}
      </div>

      {formData ? (
        <UsuarioModal
          title={isCreating ? "Agregar usuario" : "Editar usuario"}
          submitLabel={isCreating ? "Agregar usuario" : "Guardar cambios"}
          formData={formData}
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={saveItem}
        />
      ) : null}
    </section>
  );
}

export default Usuarios;
