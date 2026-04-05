import { adminSidebarLinks } from "../data/appData";

function SidebarLink({ item, active }) {
  return (
    <a
      href={`#/${item.key}`}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
        active ? "bg-amber-500 text-white" : "text-slate-800 hover:bg-slate-100"
      }`}
    >
      <span>{item.label}</span>
    </a>
  );
}

function getStatusClasses(tone) {
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function AdminShell({ currentPage, title, subtitle, status, actionLabel, onAction, children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-slate-900">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-sm font-bold text-white">
                A
              </div>
              <div>
                <p className="text-[1.05rem] font-bold text-slate-950">A&amp;L Compresores</p>
                <p className="text-sm text-slate-500">Inventario</p>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                AD
              </div>
              <div>
                <p className="text-[1.05rem] font-semibold text-slate-950">Administrador</p>
                <p className="text-sm text-slate-500">Cuenta principal</p>
              </div>
            </div>
          </div>

          <nav className="px-4 py-5">
            <div className="space-y-2">
              {adminSidebarLinks.map((item) => (
                <SidebarLink key={item.key} item={item} active={currentPage === item.key} />
              ))}
            </div>
          </nav>

          <div className="px-4 pb-4">
            <a
              href="#/contactos"
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Volver al sitio
            </a>
          </div>
        </aside>

        <main className="min-w-0 overflow-x-hidden px-5 py-6 md:px-6 lg:px-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-[1.05rem] font-medium text-slate-950">{title}</h1>
              <p className="mt-1 text-[15px] text-slate-500">{subtitle}</p>
              {status ? (
                <p
                  className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(status.tone)}`}
                >
                  {status.label}
                </p>
              ) : null}
            </div>

            {actionLabel ? (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                <span className="text-lg leading-none">+</span>
                {actionLabel}
              </button>
            ) : null}
          </div>

          <div className="pt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AdminShell;
