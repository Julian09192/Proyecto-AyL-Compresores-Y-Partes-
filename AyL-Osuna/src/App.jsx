import { useEffect, useState } from "react";
import Header from "./components/Header";
import ContactoPage from "./pages/ContactoPage";
import ProveedoresAdminPage from "./pages/ProveedoresAdminPage";
import UsuariosAdminPage from "./pages/UsuariosAdminPage";

const validPages = ["contactos", "proveedores", "usuarios"];

function getPageFromHash() {
  const value = window.location.hash.replace(/^#\//, "").toLowerCase();
  return validPages.includes(value) ? value : "contactos";
}

function App() {
  const [currentPage, setCurrentPage] = useState("contactos");
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminPage = currentPage === "proveedores" || currentPage === "usuarios";

  useEffect(() => {
    // Cambiamos la vista con el hash para no depender de react-router.
    if (!window.location.hash) {
      window.location.hash = "/contactos";
    }

    const syncPage = () => {
      setCurrentPage(getPageFromHash());
      setMenuOpen(false);
    };

    syncPage();
    window.addEventListener("hashchange", syncPage);

    return () => window.removeEventListener("hashchange", syncPage);
  }, []);

  let content = <ContactoPage />;

  if (currentPage === "proveedores") {
    content = <ProveedoresAdminPage />;
  }

  if (currentPage === "usuarios") {
    content = <UsuariosAdminPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {!isAdminPage ? (
        <>
          <Header currentPage={currentPage} menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(!menuOpen)} />
          <main>{content}</main>
        </>
      ) : (
        <>
          <div className="border-b border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <div className="mx-auto flex max-w-7xl justify-end">
              <a href="#/contactos" className="rounded-lg bg-amber-500 px-3 py-1.5 font-medium text-white">
                Volver al sitio
              </a>
            </div>
          </div>
          <main>{content}</main>
        </>
      )}
    </div>
  );
}

export default App;
