import { useState, useEffect } from "react";
import Home from "./Pages/Home";
import Nosotros from "./Pages/Nosotros";
import Productos from "./Pages/Productos";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import "./styles.css";

function App() {
  const [vista, setVista] = useState(localStorage.getItem("al_vista") || "inicio");

  // ── USUARIO LOGUEADO ──
  // null = nadie logueado
  // { nombre, email, rol: "cliente" | "empleado" | "admin" }
  const [usuario, setUsuario] = useState(null);

  // ── CARRITO ──
  // Array de { ...producto, cantidad }
  const [carrito, setCarrito] = useState([]);

  // ── PANEL CARRITO ──
  const [cartOpen, setCartOpen] = useState(false);

  // ── CARGAR DATOS DEL localStorage AL INICIAR ──
  // Esto hace que si el usuario recarga la página, no pierda su sesión ni carrito
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("al_usuario");
    const carritoGuardado = localStorage.getItem("al_carrito");

    if (usuarioGuardado) {
      try { setUsuario(JSON.parse(usuarioGuardado)); }
      catch { localStorage.removeItem("al_usuario"); }
    }
    if (carritoGuardado) {
      try { setCarrito(JSON.parse(carritoGuardado)); }
      catch { localStorage.removeItem("al_carrito"); }
    }
  }, []);

  // ── GUARDAR CARRITO EN localStorage CADA VEZ QUE CAMBIA ──
  useEffect(() => {
    localStorage.setItem("al_carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem("al_vista", vista);
  }, [vista]);

  // ── FUNCIONES DE AUTENTICACIÓN ──

  // Login: recibe el objeto usuario desde LoginModal
  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem("al_usuario", JSON.stringify(datosUsuario));
    // Si es admin, va al dashboard
    if (datosUsuario.rol === "admin") setVista("admin");
  };

  // Logout: limpia todo
  const logout = () => {
    localStorage.removeItem("al_usuario");
    localStorage.removeItem("al_carrito");
    localStorage.removeItem("al_vista");
    setUsuario(null);
    setCarrito([]);
    window.location.href = "/"; // recarga la página para limpiar cualquier estado residual
  };

  // ── FUNCIONES DEL CARRITO ──

  // Agregar producto — si ya existe, aumenta cantidad
  const agregarAlCarrito = (producto) => {
    if (!usuario) return; // solo usuarios logueados pueden agregar
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setCartOpen(true); // abre el panel al agregar
  };

  // Cambiar cantidad
  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) return eliminarDelCarrito(id);
    setCarrito((prev) =>
      prev.map((item) => item.id === id ? { ...item, cantidad } : item)
    );
  };

  // Eliminar producto
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  // Total de ítems (para el badge del ícono)
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // ── BOOTSTRAP ──
  useEffect(() => {
    const bsLink = document.createElement("link");
    bsLink.rel = "stylesheet";
    bsLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    document.head.appendChild(bsLink);

    const bsScript = document.createElement("script");
    bsScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    bsScript.async = true;
    document.body.appendChild(bsScript);

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(fontLink);

    const iconsLink = document.createElement("link");
    iconsLink.rel = "stylesheet";
    iconsLink.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
    document.head.appendChild(iconsLink);

    return () => {
      if (document.head.contains(bsLink)) document.head.removeChild(bsLink);
      if (document.body.contains(bsScript)) document.body.removeChild(bsScript);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
      if (document.head.contains(iconsLink)) document.head.removeChild(iconsLink);
    };
  }, []);

  // Props comunes que necesitan todas las páginas públicas
  const propsComunes = {
    setVista,
    usuario,
    login,
    logout,
    carrito,
    totalItems,
    cartOpen,
    setCartOpen,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
  };

  function renderPagina() {
    switch (vista) {
      case "inicio":
        return <Home     {...propsComunes} />;
      case "nosotros":
        return <Nosotros {...propsComunes} />;
      case "productos":
        return <Productos {...propsComunes} />;
      // case "contactos": return <Contactos {...propsComunes} />;
      case "admin":
        return <AdminDashboard setVista={setVista} logout={logout} />;
      default:
        return <Home {...propsComunes} />;
    }
  }

  return (
    <div className="app-container">
      {renderPagina()}
    </div>
  );
}

export default App;