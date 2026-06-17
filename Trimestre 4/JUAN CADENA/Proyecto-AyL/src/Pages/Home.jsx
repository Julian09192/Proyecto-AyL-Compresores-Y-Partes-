import { useState } from "react";
import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import StatsBar from "../components/Home/StatsBar";
import Features from "../components/Home/Features";
import Marcas from "../components/Home/Marcas";
import Products from "../components/Home/Products";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/Login/LoginModal";

function Home({ setVista, usuario, login, logout, totalItems, setCartOpen, setProductoSeleccionadoId }) {
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
      <Products setVista={setVista} setProductoSeleccionadoId={setProductoSeleccionadoId} />
      <CTA setVista={setVista} />
      <Footer setVista={setVista} />

      {showModal && (
        <LoginModal login={login} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default Home;