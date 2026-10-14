import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import CTA from "../components/Home/CTA";


const IMAGEN_QUIENES_SOMOS = "/images/Nosotros/mantenimiento.jpg";
const TOTAL_IMAGENES = 14;

const IMAGENES_CARRUSEL = Array.from({ length: TOTAL_IMAGENES }, (_, i) => ({
  id: i + 1,
  src: `/images/Nosotros/trabajo-${i + 1}.png`,
  alt: `Trabajo A&L ${i + 1}`
}));

const BENEFICIOS = [
  { title: "Experiencia Real", desc: "Más de 15 años de trayectoria técnica en el sector industrial colombiano." },
  { title: "Calidad Certificada", desc: "Suministramos repuestos y lubricantes de las marcas líderes a nivel mundial." },
  { title: "Respuesta Inmediata", desc: "Entendemos la urgencia de su planta; por eso optimizamos cada entrega." },
  { title: "Asesoría Técnica", desc: "No solo vendemos, acompañamos su proceso con personal altamente calificado." }
];



const URL_FONDO = "/images/Nosotros/somos.png";

const Hero = () => (
  <section
    className="position-relative overflow-hidden"
    style={{
      backgroundImage: `url(${URL_FONDO})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "500px"
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1
      }}
    />

    <div className="container text-center py-5 position-relative" style={{ zIndex: 2 }}>
      <p className="text-light mb-2" style={{ letterSpacing: "5px" }}>
        CONTACTO
      </p>

      <h1 className="display-1 fw-bold text-light">
        HABLEMOS
      </h1>

      <p className="lead text-light mx-auto mt-4 col-lg-8">
        Estamos listos para ayudarte con soluciones industriales a tu medida.
      </p>
    </div>
  </section>
);

const ContactSection = () => (
  <section className="py-5 bg-light">
    <div className="container">
      <div className="row g-5">

        <div className="col-lg-6">
          <h2 className="fw-bold mb-4">Envíanos un mensaje</h2>

          <form className="row g-3">
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Nombre" />
            </div>
            <div className="col-md-6">
              <input type="email" className="form-control" placeholder="Correo" />
            </div>
            <div className="col-12">
              <input type="text" className="form-control" placeholder="Asunto" />
            </div>
            <div className="col-12">
              <textarea className="form-control" rows="5" placeholder="Mensaje"></textarea>
            </div>
            <div className="col-12">
              <button className="btn btn-warning w-100 fw-bold">
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-6">
          <h2 className="fw-bold mb-4">Información de contacto</h2>

          <p className="mb-3">
            <i className="bi bi-geo-alt"></i>Dirección: Bogotá, Colombia
          </p>
          <p className="mb-3">
            <i className="bi bi-telephone"></i> Teléfono: +57 311 440 5432
          </p>
          <p className="mb-3">
            <i className="bi bi-envelope"></i> Email: comercial@aylcompresoresypartes.com
          </p>

          <div className="mt-4">
            <iframe
              title="mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.959010039047!2d-74.09307402418663!3d4.60136434250899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f991193952fcb%3A0xba0a4c6f267c24fc!2sA%20%26%20L%20COMPRESORES%20Y%20PARTES!5e0!3m2!1ses!2sco!4v1775711378226!5m2!1ses!2sco"
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  </section>
);


export default function ContactoPage({
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
    <div>
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="contacto"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />

      <main>
        <Hero />
        <ContactSection />
        <CTA />
      </main>

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
    </div>
  );
}