import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { onAuthStateChange, obtenerPerfilUsuario, supabase } from "./lib/client"; // ¡Importante!
import Home from "./Pages/Home";
import Nosotros from "./Pages/Nosotros";
import Productos from "./Pages/Productos";
import CheckoutPage from "./Pages/CheckoutPage";
import ContactoPage from "./Pages/ContactoPage";
import ProfilePage from "./Pages/ProfilePage";
import ProductoDetalleview from "./Pages/ProductoDetalleview";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmpleadoDashboard from "./components/Dashboard/EmpleadoDashboard";
import ClienteDashboard from "./components/Dashboard/ClienteDashboard";
import CartPanel from "./components/Carrito/CartPanel";
import LoginModal from "./components/Login/LoginModal";
import ResetPasswordPage from "./components/Login/ResetPasswordPage";
import AuthCallback from "./components/Login/AuthCallback";
import "./styles.css";

function App() {
  const [vista, setVista] = useState(() => {
    const savedVista = localStorage.getItem("al_vista") || "inicio";
    return savedVista === "catalogo" ? "productos" : savedVista;
  });
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("al_carrito");
    if (carritoGuardado) {
      try { return JSON.parse(carritoGuardado); }
      catch { return []; }
    }
    return [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true); // Evita parpadeos de interfaz

  const pathname = window.location.pathname;
  const isSpecialRoute = pathname === '/reset-password' || pathname === '/auth/callback';

  // Cierre de sesión centralizado nativo (limpia también nuestro temporizador)
  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("al_hora_login"); // <-- Limpieza obligatoria
    setCarrito([]);
    setVista("inicio");
  };

  // 1. ESCUCHADOR EN TIEMPO REAL DE SUPABASE AUTH + TEMPORIZADOR DE 1 HORA
  useEffect(() => {
    const unaHora = 60 * 60 * 1000; // 1 hora exacta en milisegundos

    // Función auxiliar para forzar el deslogueo si expira el tiempo
    const chequearYForzarCierre = async () => {
      const horaLogin = localStorage.getItem("al_hora_login");
      if (horaLogin && (Date.now() - parseInt(horaLogin)) > unaHora) {
        await supabase.auth.signOut();
        localStorage.removeItem("al_hora_login");
        setUsuario(null);
        if (vista === "admin" || vista === "cliente" || vista === "perfil") {
          setVista("inicio");
        }
        return true; // Sesión expirada
      }
      return false; // Sesión válida o inexistente
    };

    // Ejecución preventiva inicial antes de que cargue la interfaz
    chequearYForzarCierre().then((expirado) => {
      if (expirado) setCargandoAuth(false);
    });

    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      setCargandoAuth(true);

      // Si hay una sesión activa, verificamos primero si ya caducó nuestro temporizador local
      if (session?.user) {
        const haExpirado = await chequearYForzarCierre();
        if (haExpirado) {
          setCargandoAuth(false);
          return;
        }
      }

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        // Si el usuario acaba de loguearse y no hay marca de tiempo, la grabamos de inmediato
        if (!localStorage.getItem("al_hora_login")) {
          localStorage.setItem("al_hora_login", Date.now().toString());
        }

        // Consultamos los datos reales en tu tabla 'usuario' vinculada por el Trigger
        const perfilDb = await obtenerPerfilUsuario(session.user.id);
        
        if (perfilDb) {
          setUsuario(perfilDb);
          
          // Enrutamiento inteligente automático por roles tras conectar
          if (perfilDb.rol === "admin" && (vista === "inicio" || vista === "admin")) {
            setVista("admin");
          } else if (perfilDb.rol === "empleado" && (vista === "inicio" || vista === "empleado")) {
            setVista("empleado");
          } else if (perfilDb.rol === "cliente" && (vista === "inicio" || vista === "cliente")) {
            setVista("cliente");
          }
        } else {
          // Fallback seguro en lo que la base de datos responde
          setUsuario({
            id: session.user.id,
            email: session.user.email,
            nombre: session.user.user_metadata?.nombre_completo || "Usuario",
            rol: "cliente"
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUsuario(null);
        localStorage.removeItem("al_hora_login"); // Nos aseguramos de limpiar el storage
        // Si estaba en un panel privado y sale, lo mandamos al inicio
        if (vista === "admin" || vista === "empleado" || vista === "cliente" || vista === "perfil") {
          setVista("inicio");
        }
      }
      
      setCargandoAuth(false);
    });

    // Vigilante en segundo plano: revisa cada 30 segundos por si el usuario deja la pestaña abierta
    const intervaloVigilante = setInterval(() => {
      chequearYForzarCierre();
    }, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(intervaloVigilante);
    };
  }, [vista]);


  // Sincronización del carrito con LocalStorage
  useEffect(() => {
    if (!isSpecialRoute) {
      localStorage.setItem("al_carrito", JSON.stringify(carrito));
    }
  }, [carrito, isSpecialRoute]);

  // Sincronización de la vista actual con LocalStorage
  useEffect(() => {
    if (!isSpecialRoute) {
      localStorage.setItem("al_vista", vista);
    }
  }, [vista, isSpecialRoute]);

  // Control del Scroll al cambiar de vista
  useEffect(() => {
    if (typeof window !== "undefined" && !isSpecialRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [vista, isSpecialRoute]);

  // Adaptación de función de login heredada para compatibilidad de componentes hijos
  const login = (datosUsuario) => {
    if (datosUsuario?.rol === "admin") setVista("admin");
    else if (datosUsuario?.rol === "empleado") setVista("empleado");
    else if (datosUsuario?.rol === "cliente") setVista("cliente");
    setMostrarModal(false);
  };

  // --- COMPORTAMIENTO DEL CARRITO ---
  const agregarAlCarrito = (producto) => {
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

  // --- CARGA ASÍNCRONA DE BOOTSTRAP Y FUENTES ---
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
    setProductoSeleccionadoId,
    onOpenLogin: () => setMostrarModal(true),
  };

  const seoConfig = useMemo(() => {
    const pageMap = {
      inicio: { title: "A&L Compresores y Partes | Inicio", description: "Tienda en línea de compresores industriales con carrito integrado." },
      nosotros: { title: "A&L Compresores y Partes | Nosotros", description: "Conoce la trayectoria y experiencia de A&L Compresores." },
      productos: { title: "A&L Compresores y Partes | Catálogo", description: "Explora productos industriales, filtros y lubricantes." },
      checkout: { title: "A&L Compresores y Partes | Checkout", description: "Proceso de compra seguro y resumen del carrito." },
      contactos: { title: "A&L Compresores y Partes | Contacto", description: "Ponte en contacto con el equipo de A&L." },
      perfil: { title: "A&L Compresores y Partes | Mi Perfil", description: "Gestión del perfil del usuario." },
      admin: { title: "A&L Compresores y Partes | Admin", description: "Panel de administración." },
      empleado: { title: "A&L Compresores y Partes | Empleado", description: "Panel del empleado para gestión de actividades." },
      cliente: { title: "A&L Compresores y Partes | Cliente", description: "Panel de control del cliente." }
    };
    return pageMap[vista] || pageMap.inicio;
  }, [vista]);

  function renderPagina() {
    switch (vista) {
      case "inicio": return <Home {...propsComunes} />;
      case "nosotros": return <Nosotros {...propsComunes} />;
      case "productos": return <Productos {...propsComunes} />;
      case "producto-detalle": return (
        <ProductoDetalleview
          productoId={productoSeleccionadoId}
          setVista={setVista}
          login={login}
          agregarAlCarrito={agregarAlCarrito}
          usuario={usuario}
          totalItems={totalItems}
          setCartOpen={setCartOpen}
          onOpenLogin={() => setMostrarModal(true)}
        />
      );
      case "checkout": return <CheckoutPage carrito={carrito} setVista={setVista} vaciarCarrito={() => setCarrito([])} />;
      case "contactos": return <ContactoPage {...propsComunes} />;
      case "perfil": return <ProfilePage usuario={usuario} setVista={setVista} />;
      case "admin": return <AdminDashboard setVista={setVista} logout={logout} usuario={usuario} />;
      case "empleado": return <EmpleadoDashboard setVista={setVista} logout={logout} usuario={usuario} />;
      case "cliente": return <ClienteDashboard setVista={setVista} logout={logout} usuario={usuario} />;
      default: return <Home {...propsComunes} />;
    }
  }

  if (isSpecialRoute) {
    if (pathname === '/reset-password') return <ResetPasswordPage />;
    if (pathname === '/auth/callback') return <AuthCallback />;
  }

  if (cargandoAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando plataforma...</span>
        </div>
      </div>
    );
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
        <CartPanel
          carrito={carrito}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          cambiarCantidad={cambiarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
          setVista={setVista}
          usuario={usuario}
          onOpenLogin={() => setMostrarModal(true)}
        />
        {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} login={login} />}
      </div>
    </>
  );
}

export default App;