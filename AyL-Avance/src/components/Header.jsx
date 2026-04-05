import { navLinks } from "../data/appData";

function Header({ currentPage, onOpenMenu, menuOpen }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#/contactos" className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-900">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
              <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 12v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          A&amp;L Compresores
        </a>

        <button
          type="button"
          onClick={onOpenMenu}
          className="ml-auto rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
        >
          {menuOpen ? "Cerrar" : "Menu"}
        </button>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = currentPage === link.key;

            return (
              <a
                key={link.key}
                href={link.href}
                className={
                  link.button
                    ? "rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                    : `text-lg transition ${active ? "font-semibold text-amber-500" : "text-slate-500 hover:text-slate-900"}`
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button className="px-4 py-2 text-base font-medium text-slate-900 transition hover:text-amber-500">
            Iniciar Sesion
          </button>
          <button className="rounded-xl bg-amber-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-amber-600">
            Registrarse
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const active = currentPage === link.key;

              return (
                <a
                  key={link.key}
                  href={link.href}
                  className={
                    link.button
                      ? "rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
                      : `rounded-xl px-3 py-2 text-sm font-semibold ${active ? "bg-amber-50 text-amber-600" : "text-slate-600"}`
                  }
                >
                  {link.label}
                </a>
              );
            })}
            <button className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
              Iniciar Sesion
            </button>
            <button className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white">Registrarse</button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export default Header;
