import { useState } from "react";
import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import StatsBar from "../components/Home/StatsBar";
import Features from "../components/Home/Features";
import Marcas from "../components/Home/Marcas";
import Products from "../components/Home/Products";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";

function Home({ setVista, usuario, login, logout, carrito, totalItems, cartOpen, setCartOpen, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="inicio"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />

      <Hero setVista={setVista} />
      <StatsBar />
      <Features />
      <Marcas />
      <Products />
      <CTA setVista={setVista} />
      <Footer />

      <CartPanel
        carrito={carrito}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cambiarCantidad={cambiarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
      />

      {showModal && (
        <LoginModal login={login} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default Home;