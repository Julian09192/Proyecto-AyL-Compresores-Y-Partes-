import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import Features from "../components/Features";
import Products from "../components/Products";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

function Home({ setVista }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar onOpenLogin={() => setShowModal(true)} />
      <Hero />
      <StatsBar />
      <Features />
      <Products />
      <CTA />
      <Footer />
      
      {showModal && (
        <LoginModal 
          setVista={setVista} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}

export default Home;