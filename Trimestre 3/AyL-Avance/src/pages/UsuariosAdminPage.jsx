import { useEffect, useState } from "react";
import AdminShellSimple from "../components/AdminShellSimple";
import { usuarios } from "../data/appData";

function getInitials(nombre) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function SummaryCard({ title, value, subtitle }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-[1.02rem] font-semibold text-slate-950">{title}</p>
      <p className="mt-8 text-[2.2rem] font-bold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </article>
  );
}

function UsuariosAdminPage() {
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos los roles");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");

  const texto = busqueda.trim().toLowerCase();
  const resultados = usuarios.filter((item) => {
    const values = [item.nombre, item.email, item.rol, item.estado, item.creadoPor].join(" ").toLowerCase();
    const matchTexto = values.includes(texto);
    const matchRol = rolFiltro === "Todos los roles" ? true : item.rol === rolFiltro;
    const matchEstado = estadoFiltro === "Todos los estados" ? true : item.estado === estadoFiltro;
    return matchTexto && matchRol && matchEstado;
  });

  const usuariosActivos = usuarios.filter((item) => item.estado === "Activo").length;
  const administradores = usuarios.filter((item) => item.rol === "Administrador").length;
  const auxiliares = usuarios.filter((item) => item.rol === "Auxiliar").length;

  const roleClass = (rol) =>
    rol === "Administrador"
      ? "bg-amber-500 text-white"
      : "border border-slate-200 bg-slate-100 text-slate-700";

  const statusClass = (estado) => (estado === "Activo" ? "bg-amber-500 text-white" : "bg-rose-600 text-white");

  return (
    <AdminShellSimple
      currentPage="usuarios"
      title="Gestion de Usuarios"
      subtitle="Consulta general de usuarios. Se conserva la interfaz, pero sin funciones de administracion."
    >
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-3">
          <SummaryCard title="Usuarios Activos" value={usuariosActivos} subtitle={`De ${usuarios.length} usuarios totales`} />
          <SummaryCard title="Administradores" value={administradores} subtitle="Con permisos completos" />
          <SummaryCard title="Auxiliares" value={auxiliares} subtitle="Usuarios con permisos limitados" />
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
                  <th className="px-2 py-4">Fecha Creacion</th>
                  <th className="px-2 py-4">Ultimo Acceso</th>
                  <th className="px-2 py-4">Creado Por</th>
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
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass(item.estado)}`}>
                        {item.estado}
                      </span>
                    </td>

                    <td className="px-2 py-4">{item.fechaCreacion}</td>
                    <td className="px-2 py-4">{item.ultimoAcceso}</td>
                    <td className="px-2 py-4">{item.creadoPor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {resultados.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No hay usuarios que coincidan con la busqueda.
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
          Se retiraron acciones como agregar, editar, eliminar y cambiar estado para que el modulo conserve el diseño, pero se vea mas basico.
        </section>
      </div>
    </AdminShellSimple>
  );
}

export default UsuariosAdminPage;
