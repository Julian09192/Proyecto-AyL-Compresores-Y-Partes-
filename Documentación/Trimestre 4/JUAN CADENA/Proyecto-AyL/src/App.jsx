import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { onAuthStateChange, obtenerPerfilUsuario, supabase } from "./lib/client";
import Home from "./Pages/Home";
import Nosotros from "./Pages/Nosotros";
import Productos from "./Pages/Productos"; // Si tu catálogo usa Catalogoview internamente o es este mismo, recibirá los props comunes.
import CheckoutPage from "./Pages/CheckoutPage";
import ContactoPage from "./Pages/ContactoPage";
import ProfilePage from "./Pages/ProfilePage";
import ProductoDetalleview from "./Pages/ProductoDetalleview";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmpleadoDashboard from "./components/Dashboard/EmpleadoDashboard";
import CartPanel from "./components/Carrito/CartPanel";
import LoginModal from "./components/Login/LoginModal";
import ResetPasswordPage from "./components/Login/ResetPasswordPage";
import AuthCallback from "./components/Login/AuthCallback";
import WhatsAppButton from "./components/UI/WhatsAppButton";
import "./styles.css";

function App() {
  const [vista, setVista] = useState(() => {
    const savedVista = localStorage.getItem("al_vista") || "inicio";
    // Evitamos que se quede atrapado en estados administrativos viejos si era un cliente
    return savedVista === "catalogo" || savedVista === "cliente" ? "productos" : savedVista;
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
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(() => {
    return localStorage.getItem("al_producto_seleccionado_id") || null;
  });

  useEffect(() => {
  if (productoSeleccionadoId) {
    localStorage.setItem("al_producto_seleccionado_id", productoSeleccionadoId);
  } else {
    localStorage.removeItem("al_producto_seleccionado_id");
  }
}, [productoSeleccionadoId]);

  const [cargandoAuth, setCargandoAuth] = useState(true);

  const pathname = window.location.pathname;
  const isSpecialRoute = pathname === '/reset-password' || pathname === '/auth/callback';

  // --- LOGOUT CENTRALIZADO ---
  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("al_hora_login");
    localStorage.removeItem("al_login_fresco");
    localStorage.removeItem("usuario"); // Limpiamos los datos del perfil local
    setCarrito([]);
    setVista("inicio");
  };

  // --- 1. GESTIÓN DE SESIÓN Y ROLES ---
  useEffect(() => {
    const unaHora = 60 * 60 * 1000;

    const chequearYForzarCierre = async () => {
      const horaLogin = localStorage.getItem("al_hora_login");
      if (horaLogin && (Date.now() - parseInt(horaLogin, 10)) > unaHora) {
        await supabase.auth.signOut();
        localStorage.removeItem("al_hora_login");
        localStorage.removeItem("al_login_fresco");
        localStorage.removeItem("usuario");
        setUsuario(null);
        if (vista === "admin" || vista === "empleado" || vista === "perfil") {
          setVista("inicio");
        }
        return true;
      }
      return false;
    };

    chequearYForzarCierre().then((expirado) => {
      if (expirado) setCargandoAuth(false);
    });

    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      setCargandoAuth(true);

      if (session?.user) {
        const haExpirado = await chequearYForzarCierre();
        if (haExpirado) {
          setCargandoAuth(false);
          return;
        }
      }

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        if (!localStorage.getItem("al_hora_login")) {
          localStorage.setItem("al_hora_login", Date.now().toString());
        }

        const perfilDb = await obtenerPerfilUsuario(session.user.id);

        if (perfilDb) {
          setUsuario(perfilDb);
          localStorage.setItem("usuario", JSON.stringify(perfilDb)); // Guardamos en Storage para el Navbar

          // Enrutamiento inteligente según su rol
          if (perfilDb.rol === "admin" && (vista === "inicio" || vista === "admin")) {
            setVista("admin");
          } else if (perfilDb.rol === "empleado" && (vista === "inicio" || vista === "empleado")) {
            setVista("empleado");
          } else if (perfilDb.rol === "cliente") {
            // El usuario final solo es redirigido a productos de manera automática al loguearse de forma fresca
            if (localStorage.getItem("al_login_fresco") === "true") {
              localStorage.removeItem("al_login_fresco");
              setVista("productos");
            }
          }
        } else {
          // Mapeado al esquema usando la propiedad 'usuario' en vez de 'nombre'
          const fallbackUser = {
            id: session.user.id,
            email: session.user.email,
            usuario: session.user.user_metadata?.usuario || session.user.email.split("@")[0],
            rol: "cliente"
          };
          setUsuario(fallbackUser);
          localStorage.setItem("usuario", JSON.stringify(fallbackUser));
        }
      } else if (event === 'SIGNED_OUT') {
        setUsuario(null);
        localStorage.removeItem("al_hora_login");
        localStorage.removeItem("al_login_fresco");
        localStorage.removeItem("usuario");
        if (vista === "admin" || vista === "empleado" || vista === "perfil") {
          setVista("inicio");
        }
      }

      setCargandoAuth(false);
    });

    const intervaloVigilante = setInterval(() => {
      chequearYForzarCierre();
    }, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(intervaloVigilante);
    };
  }, [vista]);

  // --- SINCRONIZACIONES CON LOCALSTORAGE ---
  useEffect(() => {
    if (!isSpecialRoute) localStorage.setItem("al_carrito", JSON.stringify(carrito));
  }, [carrito, isSpecialRoute]);

  useEffect(() => {
    if (!isSpecialRoute) localStorage.setItem("al_vista", vista);
  }, [vista, isSpecialRoute]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isSpecialRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [vista, isSpecialRoute]);

  // --- MANEJO COMPATIBILIDAD MODAL LOGIN ---
  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    localStorage.setItem("al_login_fresco", "true"); // Colocamos la bandera para el enrutador inteligente

    if (datosUsuario?.rol === "admin") setVista("admin");
    else if (datosUsuario?.rol === "empleado") setVista("empleado");
    else setVista("productos"); // Al loguearse manualmente va directo al catálogo

    setMostrarModal(false);
  };

  // --- LÓGICA DEL CARRITO REFORZADA ---
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setCartOpen(true);
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) return eliminarDelCarrito(id);
    setCarrito((prev) => prev.map((item) => item.id === id ? { ...item, cantidad } : item));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

  // --- INYECCIÓN ASÍNCRONA DE ESTILOS ---
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

  // --- CONFIGURACIÓN DE PROPS Y SEO ---
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
      inicio: { title: "A&L Compresores y Partes | Inicio", description: "Tienda en línea de compresores industriales." },
      nosotros: { title: "A&L Compresores y Partes | Nosotros", description: "Conoce la trayectoria de A&L Compresores." },
      productos: { title: "A&L Compresores y Partes | Catálogo", description: "Explora productos industriales, filtros y lubricantes." },
      checkout: { title: "A&L Compresores y Partes | Checkout", description: "Proceso de compra seguro." },
      contactos: { title: "A&L Compresores y Partes | Contacto", description: "Ponte en contacto con nosotros." },
      perfil: { title: "A&L Compresores y Partes | Mi Perfil", description: "Gestión del perfil del usuario." },
      admin: { title: "A&L Compresores y Partes | Admin", description: "Panel de administración." },
      empleado: { title: "A&L Compresores y Partes | Empleado", description: "Panel del empleado." }
    };
    return pageMap[vista] || pageMap.inicio;
  }, [vista]);

  // --- RENDERIZADO DINÁMICO DE PÁGINAS ---
  function renderPagina() {
    switch (vista) {
      case "inicio": return <Home {...propsComunes} />;
      case "nosotros": return <Nosotros {...propsComunes} />;
      case "productos": return <Productos {...propsComunes} />; // Recibe los métodos y estados del carrito estructurados
      case "producto-detalle": return (
        <ProductoDetalleview
          {...propsComunes}
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
        <div className="spinner-border text-warning" role="status">
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
        <meta name="robots" content="index,follow" />
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

        <WhatsAppButton />
      </div>
    </>
  );
}

export default App;