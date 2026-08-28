import { useState } from "react";

// Importación de Componentes Globales
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/Login/LoginModal";
import CartPanel from "../components/Carrito/CartPanel";
import CTA from "../components/Home/CTA";

// Importación de Componentes específicos de la Página (Refactorizados)
import { Hero, InfoSeccion, WhyChooseUs } from "../components/Pages/Nosotros/NosotrosContent";
import Carousel from "../components/Pages/Nosotros/Carousel";

export default function Nosotros({ 
  setVista, 
  usuario, 
  login, 
  logout, 
  carrito, 
  totalItems, 
  cartOpen, 
  setCartOpen, 
  cambiarCantidad, 
  eliminarDelCarrito 
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="nosotros-page">
      
      {/* 1. Navegación */}
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="nosotros"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />

      {/* 2. Contenido de la página */}
      <main>
        <Hero />
        <InfoSeccion />
        <WhyChooseUs />
        <Carousel />
        <CTA />
      </main>

      {/* 3. Footer y Modales */}
      <Footer setVista={setVista} />

      <CartPanel
        carrito={carrito}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cambiarCantidad={cambiarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
        setVista={setVista}
        usuario={usuario}
        onOpenLogin={() => setShowModal(true)}
      />

      {showModal && (
        <LoginModal login={login} onClose={() => setShowModal(false)} />
      )}

      {/* Estilos locales */}
      <style>{`
        .nosotros-page { background: #fff; }
        .card { transition: transform 0.3s ease; }
        .card:hover { transform: translateY(-10px); }
      `}</style>
    </div>
  );
}