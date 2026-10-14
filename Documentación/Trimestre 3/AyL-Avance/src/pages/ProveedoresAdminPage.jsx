import { useEffect, useMemo, useState } from "react";
import AdminShellSimple from "../components/AdminShellSimple";
import { proveedores } from "../data/appData";

function StatCard({ title, value, subtitle }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6">
      <div>
        <p className="text-[1.02rem] font-semibold text-slate-950">{title}</p>
        <p className="mt-8 text-[2.2rem] font-bold text-slate-950">{value}</p>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </article>
  );
}

function ProveedoresAdminPage() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");

  const texto = busqueda.trim().toLowerCase();
  const resultados = useMemo(() => {
    return proveedores.filter((item) => {
      const values = [item.proveedor, item.contacto, item.email, item.telefono].join(" ").toLowerCase();
      const matchTexto = values.includes(texto);
      const matchEstado = estadoFiltro === "Todos los estados" ? true : item.estado === estadoFiltro;
      return matchTexto && matchEstado;
    });
  }, [texto, estadoFiltro]);

  const activos = proveedores.filter((item) => item.estado === "Activo").length;
  const totalProductos = proveedores.reduce((total, item) => total + Number(item.productos || 0), 0);
  const pendientes = proveedores.filter((item) => item.estado === "Inactivo").length;

  const statusClass = (estado) => (estado === "Activo" ? "bg-amber-500 text-white" : "bg-rose-600 text-white");

  return (
    <AdminShellSimple
      currentPage="proveedores"
      title="Gestion de Proveedores"
      subtitle="Consulta general de proveedores. En esta version se mantiene el diseño, pero no se incluyen acciones de administracion."
    >
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-3">
          <StatCard title="Proveedores Activos" value={activos} subtitle={`De ${proveedores.length} proveedores totales`} />
          <StatCard title="Productos Totales" value={totalProductos} subtitle="En catalogo de proveedores" />
          <StatCard title="Pendientes" value={pendientes} subtitle="Sin herramientas de gestion en esta etapa" />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-base text-slate-500">Q</span>
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
          <div className="flex items-center gap-3">
            <h2 className="text-[1.1rem] font-medium text-slate-950">Proveedores ({resultados.length})</h2>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[15px] font-semibold text-slate-950">
                  <th className="px-2 py-4">Proveedor</th>
                  <th className="px-2 py-4">Contacto</th>
                  <th className="px-2 py-4">Informacion</th>
                  <th className="px-2 py-4">Productos</th>
                  <th className="px-2 py-4">Estado</th>
                  <th className="px-2 py-4">Ultima Orden</th>
                </tr>
              </thead>

              <tbody>
                {resultados.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 align-top text-sm text-slate-600">
                    <td className="px-2 py-4">
                      <p className="font-semibold text-slate-950">{item.proveedor}</p>
                      <p className="mt-1">{item.nit}</p>
                      <a href={`https://${item.web}`} className="mt-1 inline-block text-blue-700">
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
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass(item.estado)}`}>
                        {item.estado}
                      </span>
                    </td>

                    <td className="px-2 py-4">{item.ultimaOrden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {resultados.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No hay proveedores que coincidan con la busqueda.
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
          Acciones como agregar, editar, eliminar o cambiar estados se dejaron fuera para que el modulo se vea mas basico.
        </section>
      </div>
    </AdminShellSimple>
  );
}

export default ProveedoresAdminPage;
