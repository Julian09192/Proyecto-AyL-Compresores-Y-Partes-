// src/Pages/Home.jsx
import { useState, useEffect } from "react";
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
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, []);

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}

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

      {/* ✅ PASAR setVista AL MODAL */}
      {showModal && (
        <LoginModal 
          login={login} 
          onClose={() => setShowModal(false)} 
          setVista={setVista}  // ✅ AGREGAR ESTA LÍNEA
        />
      )}
    </>
  );
}

export default Home;