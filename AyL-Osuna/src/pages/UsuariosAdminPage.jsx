import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { usuarios } from "../data/appData";
import { createItem, patchItem, readCollection, removeItem, updateItem } from "../data/jsonApi";

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

function StatCard({ title, value, subtitle }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-[1.02rem] font-semibold text-slate-950">{title}</p>
      <p className="mt-8 text-[2.2rem] font-bold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </article>
  );
}

function UsuarioModal({ title, submitLabel, formData, onChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-4 py-8">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[1.7rem] font-semibold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">Completa la información del usuario</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100">
            x
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Nombre *</span>
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={onChange}
                placeholder="Nombre completo"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:ring-amber-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Correo *</span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                placeholder="correo@empresa.com"
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Rol</span>
              <select
                name="rol"
                value={formData.rol}
                onChange={onChange}
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              >
                <option>Administrador</option>
                <option>Auxiliar</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-950">Estado</span>
              <select
                name="estado"
                value={formData.estado}
                onChange={onChange}
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </label>
          </div>

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

function UsuariosAdminPage() {
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

        if (!active) {
          return;
        }

        setItems(data);
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
      nombre: "",
      email: "",
      rol: "Auxiliar",
      estado: "Activo",
    });
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

    if (!item) {
      return;
    }

    if (!window.confirm(`Eliminar a ${item.nombre}?`)) {
      return;
    }

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

    if (!item) {
      return;
    }

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

  const roleClass = (rol) =>
    rol === "Administrador"
      ? "bg-amber-500 text-white"
      : "border border-slate-200 bg-slate-100 text-slate-700";

  const statusClass = (estado) => (estado === "Activo" ? "bg-amber-500 text-white" : "bg-rose-600 text-white");

  return (
    <AdminShell
      currentPage="usuarios"
      title="Gestión de Usuarios"
      subtitle="Administra usuarios y sus roles en el sistema"
      status={status}
      actionLabel="Agregar Usuario"
      onAction={openCreateModal}
    >
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-3">
          <StatCard title="Usuarios activos" value={usuariosActivos} subtitle={`De ${items.length} usuarios`} />
          <StatCard title="Administradores" value={administradores} subtitle="Con permisos completos" />
          <StatCard title="Auxiliares" value={auxiliares} subtitle="Con permisos limitados" />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <input
              type="text"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            />

            <select
              value={rolFiltro}
              onChange={(event) => setRolFiltro(event.target.value)}
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option>Todos los roles</option>
              <option>Administrador</option>
              <option>Auxiliar</option>
            </select>

            <select
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value)}
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="text-[1.1rem] font-medium text-slate-950">Usuarios ({resultados.length})</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[15px] font-semibold text-slate-950">
                  <th className="px-2 py-4">Usuario</th>
                  <th className="px-2 py-4">Rol</th>
                  <th className="px-2 py-4">Estado</th>
                  <th className="px-2 py-4">Fecha de creación</th>
                  <th className="px-2 py-4">Último acceso</th>
                  <th className="px-2 py-4">Creado por</th>
                  <th className="px-2 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {resultados.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 align-top text-sm text-slate-600">
                    <td className="px-2 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-900">
                          {getInitials(item.nombre)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">{item.nombre}</p>
                          <p className="mt-1 text-slate-500">{item.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-2 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${roleClass(item.rol)}`}>
                        {item.rol}
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
                          aria-label={`Cambiar estado de ${item.nombre}`}
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

                    <td className="px-2 py-4">{formatDate(item.fechaCreacion)}</td>
                    <td className="px-2 py-4">{formatDate(item.ultimoAcceso)}</td>
                    <td className="px-2 py-4">{item.creadoPor}</td>

                    <td className="px-2 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          title="Editar usuario"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                          title="Eliminar usuario"
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
              No se encontraron usuarios.
            </div>
          ) : null}
        </section>
      </div>

      {formData ? (
        <UsuarioModal
          title={isCreating ? "Agregar usuario" : "Editar usuario"}
          submitLabel={isCreating ? "Agregar Usuario" : "Guardar Cambios"}
          formData={formData}
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={saveItem}
        />
      ) : null}
    </AdminShell>
  );
}

export default UsuariosAdminPage;
