import { useEffect, useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import { proveedores } from "../data/appData";
import { createItem, patchItem, readCollection, removeItem, updateItem } from "../data/jsonApi";

const notasPorDefecto = {
  "Atlas Copco Colombia": "Proveedor principal de compresores y repuestos originales",
  "Ingersoll Rand Andina": "Aliado para equipos industriales y soporte técnico",
  "Distribuidora Industrial A&L": "Proveedor local para entregas rápidas en Bogotá",
  "Shell Lubricantes Colombia": "Especialista en lubricantes y aceites industriales",
  "Kaeser Compresores SAS": "Proveedor con catálogo reducido y estado pendiente de reactivación",
};

function getInitialItems() {
  return proveedores.map((item) => ({
    ...item,
    ciudadSimple: item.ciudad.replace(", Colombia", ""),
    notas: item.notas ?? notasPorDefecto[item.proveedor] ?? "",
  }));
}

function normalizeItem(item) {
  const ciudadSimple = item.ciudadSimple ?? item.ciudad?.replace(", Colombia", "") ?? "Bogotá";

  return {
    ...item,
    ciudadSimple,
    ciudad: item.ciudad ?? `${ciudadSimple}, Colombia`,
    notas: item.notas ?? notasPorDefecto[item.proveedor] ?? "",
  };
}

function buildPayload(formData, currentItem = {}) {
  const ciudadSimple = formData.ciudadSimple?.trim() || currentItem.ciudadSimple || "Bogotá";
  const nitValue = formData.nit?.replace("NIT: ", "").trim() || currentItem.nit?.replace("NIT: ", "") || "000.000.000-0";

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

function StatCard({ title, value, subtitle }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-[1.02rem] font-semibold text-slate-950">{title}</p>
      <p className="mt-8 text-[2.2rem] font-bold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </article>
  );
}

function ProveedorModal({ title, submitLabel, formData, onChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[1.7rem] font-semibold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">Completa la información del proveedor</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100">
            x
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Nombre de la empresa *</span>
              <input
                type="text"
                name="proveedor"
                required
                value={formData.proveedor}
                onChange={onChange}
                placeholder="Ej: Atlas Copco Colombia"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:ring-amber-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Persona de contacto *</span>
              <input
                type="text"
                name="contacto"
                required
                value={formData.contacto}
                onChange={onChange}
                placeholder="Ej: Roberto Mendoza"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Correo electrónico *</span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                placeholder="ventas@empresa.com"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Teléfono</span>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={onChange}
                placeholder="+57 1 234-5678"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">NIT</span>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={onChange}
                placeholder="800.123.456-1"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Sitio web</span>
              <input
                type="text"
                name="web"
                value={formData.web}
                onChange={onChange}
                placeholder="www.empresa.com"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Dirección</span>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={onChange}
                placeholder="Calle 100 #11A-35"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Ciudad</span>
              <input
                type="text"
                name="ciudadSimple"
                value={formData.ciudadSimple}
                onChange={onChange}
                placeholder="Bogotá"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-950">Notas</span>
            <textarea
              rows="3"
              name="notas"
              value={formData.notas}
              onChange={onChange}
              placeholder="Información adicional del proveedor..."
              className="resize-none rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
            />
          </label>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
              Cancelar
            </button>
            <button type="submit" className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProveedoresAdminPage() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");
  const [items, setItems] = useState(getInitialItems);
  const [sourceType, setSourceType] = useState("loading");
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadItems() {
      try {
        const data = await readCollection("proveedores");

        if (!active) {
          return;
        }

        setItems(data.map(normalizeItem));
        setSourceType("api");
      } catch {
        if (active) {
          setSourceType("local");
        }
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
    if (!item.ultimaOrden) {
      return latest;
    }

    if (!latest) {
      return item.ultimaOrden;
    }

    return item.ultimaOrden > latest ? item.ultimaOrden : latest;
  }, "");

  const status =
    sourceType === "api"
      ? { tone: "success", label: "Guardando en db.json" }
      : sourceType === "local"
        ? { tone: "warning", label: "Modo local" }
        : { tone: "info", label: "Cargando datos..." };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsCreating(true);
    setFormData({
      proveedor: "",
      contacto: "",
      email: "",
      telefono: "",
      nit: "",
      web: "",
      direccion: "",
      ciudadSimple: "Bogotá",
      notas: "",
    });
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
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
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

    if (!item) {
      return;
    }

    if (!window.confirm(`Eliminar a ${item.proveedor}?`)) {
      return;
    }

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

    if (!item) {
      return;
    }

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

  const statusClass = (estado) => (estado === "Activo" ? "bg-amber-500 text-white" : "bg-rose-600 text-white");

  return (
    <AdminShell
      currentPage="proveedores"
      title="Gestión de Proveedores"
      subtitle="Administra la información de proveedores y contactos"
      status={status}
      actionLabel="Agregar Proveedor"
      onAction={openCreateModal}
    >
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-3">
          <StatCard title="Proveedores activos" value={activos} subtitle={`De ${items.length} proveedores`} />
          <StatCard title="Productos totales" value={totalProductos} subtitle="En catálogo de proveedores" />
          <StatCard title="Última orden" value={formatDate(ultimaOrden)} subtitle="Registro más reciente" />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Buscar</span>
              <input
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por nombre, contacto o correo..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </label>

            <select
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value)}
              className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="text-[1.1rem] font-medium text-slate-950">Proveedores ({resultados.length})</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[15px] font-semibold text-slate-950">
                  <th className="px-2 py-4">Proveedor</th>
                  <th className="px-2 py-4">Contacto</th>
                  <th className="px-2 py-4">Información</th>
                  <th className="px-2 py-4">Productos</th>
                  <th className="px-2 py-4">Estado</th>
                  <th className="px-2 py-4">Última orden</th>
                  <th className="px-2 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {resultados.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 align-top text-sm text-slate-600">
                    <td className="px-2 py-4">
                      <p className="font-semibold text-slate-950">{item.proveedor}</p>
                      <p className="mt-1">{item.nit}</p>
                      <a href={`https://${item.web}`} target="_blank" rel="noreferrer" className="mt-1 inline-block text-blue-700">
                        {item.web}
                      </a>
                    </td>

                    <td className="px-2 py-4">
                      <p className="font-semibold text-slate-950">{item.contacto}</p>
                      <p className="mt-1">Email: {item.email}</p>
                      <p className="mt-1">Tel: {item.telefono}</p>
                    </td>

                    <td className="px-2 py-4">
                      <p>{item.direccion}</p>
                      <p className="mt-1">{item.ciudad}</p>
                    </td>

                    <td className="px-2 py-4">
                      <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-950">
                        {item.productos} productos
                      </span>
                    </td>

                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass(item.estado)}`}>
                          {item.estado}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleEstado(item.id)}
                          aria-label={`Cambiar estado de ${item.proveedor}`}
                          className={`relative h-6 w-11 rounded-full transition ${
                            item.estado === "Activo" ? "bg-amber-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                              item.estado === "Activo" ? "left-[22px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </td>

                    <td className="px-2 py-4">{formatDate(item.ultimaOrden)}</td>

                    <td className="px-2 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          title="Editar proveedor"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                          title="Eliminar proveedor"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {resultados.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No se encontraron proveedores.
            </div>
          ) : null}
        </section>
      </div>

      {formData ? (
        <ProveedorModal
          title={isCreating ? "Agregar proveedor" : "Editar proveedor"}
          submitLabel={isCreating ? "Agregar Proveedor" : "Guardar Cambios"}
          formData={formData}
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={saveItem}
        />
      ) : null}
    </AdminShell>
  );
}

export default ProveedoresAdminPage;
