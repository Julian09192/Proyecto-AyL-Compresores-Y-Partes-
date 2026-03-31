import { useState, useEffect } from "react";
import Home from "./Pages/Home";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import "./styles.css";

function App() {
  const [vista, setVista] = useState("cliente");

  useEffect(() => {
    // 1. Cargar CSS de Bootstrap
    const bsLink = document.createElement("link");
    bsLink.rel = "stylesheet";
    bsLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    document.head.appendChild(bsLink);

    // 2. Cargar JS de Bootstrap (Vital para el modal)
    const bsScript = document.createElement("script");
    bsScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    bsScript.async = true;
    document.body.appendChild(bsScript);

    // 3. Cargar Fuentes
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(fontLink);

    return () => {
      if (document.head.contains(bsLink)) document.head.removeChild(bsLink);
      if (document.body.contains(bsScript)) document.body.removeChild(bsScript);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
    };
  }, []);

  // Lógica de renderizado
  return (
    <div className="app-container">
      {vista === "admin" ? (
        <AdminDashboard setVista={setVista} />
      ) : (
        /* Pasamos setVista a Home. 
           Como Home contiene la Navbar y el Modal, 
           el cambio de estado subirá hasta aquí. 
        */
        <Home setVista={setVista} />
      )}
    </div>
  );
}

export default App;