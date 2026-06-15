import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Home from "./Pages/Home";
import Nosotros from "./Pages/Nosotros";
import Productos from "./Pages/Productos";
import CheckoutPage from "./Pages/CheckoutPage";
import ContactoPage from "./Pages/ContactoPage";
import ProfilePage from "./Pages/ProfilePage";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import EmpleadoDashboard from "./components/dashboard/EmpleadoDashboard";
import LoginModal from "./components/Login/LoginModal";
import "./styles.css";

function App() {
  const [vista, setVista] = useState(localStorage.getItem("al_vista") || "inicio");
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("al_usuario");
    const carritoGuardado = localStorage.getItem("al_carrito");

    if (usuarioGuardado) {
      try {
        const user = JSON.parse(usuarioGuardado);
        setUsuario(user);
        // Si el usuario es admin y está en inicio, lo movemos al dashboard
        if (user.rol === "admin" && vista === "inicio") {
          setVista("admin");
        }
      } catch {
        localStorage.removeItem("al_usuario");
      }
    }
    if (carritoGuardado) {
      try { setCarrito(JSON.parse(carritoGuardado)); }
      catch { localStorage.removeItem("al_carrito"); }
    }
  }, []);

  // Sincronización con LocalStorage
  useEffect(() => {
    localStorage.setItem("al_carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem("al_vista", vista);
  }, [vista]);

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem("al_usuario", JSON.stringify(datosUsuario));

    // Redirección inmediata según el rol que ahora sí viene bien
    if (datosUsuario.rol === "admin") {
      setVista("admin");
    } else if (datosUsuario.rol === "empleado") {
      setVista("cliente");
    } else {
      setVista("inicio");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUsuario(null);
    setCarrito([]);
    setVista("inicio");
    window.location.reload();
  };

  // --- TUS FUNCIONES DE CARRITO ORIGINALES ---
  const agregarAlCarrito = (producto) => {
    if (!usuario) { setMostrarModal(true); return; }
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setCartOpen(true);
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) return eliminarDelCarrito(id);
    setCarrito((prev) =>
      prev.map((item) => item.id === id ? { ...item, cantidad } : item)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // --- CARGA DE ESTILOS BOOTSTRAP ---
  useEffect(() => {
    const links = [
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" }
    ];
    links.forEach(l => {
      const link = document.createElement("link");
      Object.assign(link, l);
      document.head.appendChild(link);
    });
    const bsScript = document.createElement("script");
    bsScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    bsScript.async = true;
    document.body.appendChild(bsScript);
  }, []);

  const propsComunes = {
    setVista, usuario, login, logout, carrito, 
    totalItems, cartOpen, setCartOpen, agregarAlCarrito,
    cambiarCantidad, eliminarDelCarrito,
    onLoginClick: () => setMostrarModal(true)
  };

  const seoConfig = useMemo(() => {
    const pageMap = {
      inicio: {
        title: "A&L Compresores y Partes | Inicio",
        description: "Tienda en línea de compresores, lubricantes y repuestos industriales con navegación rápida y carrito integrado."
      },
      nosotros: {
        title: "A&L Compresores y Partes | Nosotros",
        description: "Conoce la trayectoria, calidad y experiencia de A&L Compresores y Partes."
      },
      productos: {
        title: "A&L Compresores y Partes | Catálogo",
        description: "Explora productos industriales, filtros, lubricantes y repuestos con detalle y disponibilidad."
      },
      checkout: {
        title: "A&L Compresores y Partes | Checkout",
        description: "Proceso de compra seguro y resumen del carrito para tu pedido."
      },
      contactos: {
        title: "A&L Compresores y Partes | Contacto",
        description: "Ponte en contacto con el equipo de A&L para asesoría técnica y pedidos."
      },
      perfil: {
        title: "A&L Compresores y Partes | Mi Perfil",
        description: "Gestión del perfil del usuario y acceso a tu información."
      },
      admin: {
        title: "A&L Compresores y Partes | Admin",
        description: "Panel de administración para gestionar productos, usuarios y operaciones."
      },
      cliente: {
        title: "A&L Compresores y Partes | Empleado",
        description: "Panel del empleado para gestión de pedidos, stock y actividades."
      }
    };

    return pageMap[vista] || pageMap.inicio;
  }, [vista]);

  function renderPagina() {
    switch (vista) {
      case "inicio": return <Home {...propsComunes} />;
      case "nosotros": return <Nosotros {...propsComunes} />;
      case "productos": return <Productos {...propsComunes} />;
      case "checkout": return <CheckoutPage carrito={carrito} setVista={setVista} vaciarCarrito={() => setCarrito([])} />;
      case "contactos": return <ContactoPage {...propsComunes} />;
      case "perfil": return <ProfilePage usuario={usuario} setVista={setVista} />;
      case "admin": return <AdminDashboard setVista={setVista} logout={logout} />;
      case "cliente": return <EmpleadoDashboard setVista={setVista} logout={logout} />;
      default: return <Home {...propsComunes} />;
    }
  }

  return (
    <>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content={seoConfig.title} />
        <meta property="og:description" content={seoConfig.description} />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="app-container">
        {renderPagina()}
        {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} login={login} />}
      </div>
    </>
  );
}

export default App;