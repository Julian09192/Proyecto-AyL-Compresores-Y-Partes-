const links = [
  { key: "inicio", label: "Inicio", section: "inicio-publico" },
  { key: "contactos", label: "Contactos", section: "contacto-publico" },
  { key: "proveedores", label: "Proveedores", href: "#/proveedores" },
  { key: "usuarios", label: "Usuarios", href: "#/usuarios" },
];

function goToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function Header({ currentPage, onOpenMenu, menuOpen }) {
  const handleSectionClick = (sectionId) => {
    goToSection(sectionId);

    if (menuOpen) {
      onOpenMenu();
    }
  };

  const closeMenu = () => {
    if (menuOpen) {
      onOpenMenu();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#/contactos" className="flex items-center gap-3 text-lg font-bold text-slate-950 md:text-[1.85rem]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-base text-white">⚙</span>
          <span>A&amp;L Compresores</span>
        </a>

        <button
          type="button"
          onClick={onOpenMenu}
          className="ml-auto rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
        >
          {menuOpen ? "Cerrar" : "Menú"}
        </button>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex lg:gap-10">
          {links.map((link) =>
            link.href ? (
              <a
                key={link.key}
                href={link.href}
                className="text-[1.02rem] font-medium text-slate-800 transition hover:text-amber-500"
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.key}
                type="button"
                onClick={() => handleSectionClick(link.section)}
                className={`text-[1.02rem] font-medium transition ${
                  currentPage === "contactos" && link.key === "contactos" ? "text-amber-500" : "text-slate-800 hover:text-amber-500"
                }`}
              >
                {link.label}
              </button>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <button className="text-[1.02rem] font-medium text-slate-900 transition hover:text-amber-500">Iniciar Sesión</button>
          <button className="rounded-xl bg-amber-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-amber-600">
            Registrarse
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) =>
              link.href ? (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.key}
                  type="button"
                  onClick={() => handleSectionClick(link.section)}
                  className={`rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                    currentPage === "contactos" && link.key === "contactos" ? "bg-amber-50 text-amber-600" : "text-slate-700"
                  }`}
                >
                  {link.label}
                </button>
              ),
            )}
            <button className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
              Iniciar Sesión
            </button>
            <button className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white">Registrarse</button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export default Header;
