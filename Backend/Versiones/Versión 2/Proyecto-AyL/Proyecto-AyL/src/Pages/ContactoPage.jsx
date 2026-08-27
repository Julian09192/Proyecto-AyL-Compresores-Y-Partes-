import { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import Swal from "sweetalert2"; // IMPORTANTE: Agregamos la importación
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import CTA from "../components/Home/CTA";

/* ============================================================
   CONFIGURACIÓN DE DATOS
   ============================================================ */
const URL_FONDO = "/images/Nosotros/somos.png";

/* ============================================================
   COMPONENTES INTERNOS
   ============================================================ */
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
      <p className="text-light mb-2" style={{ letterSpacing: "5px" }}>CONTACTO</p>
      <h1 className="display-1 fw-bold text-light">HABLEMOS</h1>
      <p className="lead text-light mx-auto mt-4 col-lg-8">
        Estamos listos para ayudarte con soluciones industriales a tu medida.
      </p>
    </div>
  </section>
);

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
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
  const form = useRef();

  const enviarEmail = (e) => {
    e.preventDefault();

    // 1. Mostrar alerta de carga
    Swal.fire({
      title: 'Enviando mensaje...',
      text: 'Por favor, espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    emailjs.sendForm(
      'service_ecsbd4v',   
      'template_3ctxgvs',  
      form.current,
      'ZDygnYA16n4gwAS4p'    
    )
    .then((result) => {
        console.log("CORS exitoso:", result.text);
        
        // 2. Alerta de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Enviado!',
          text: '¡I enviado con éxito a A&L Compresores!',
          confirmButtonColor: '#121212',
        });

        e.target.reset(); // Limpia el formulario
    }, (error) => {
        console.log("Fallo en la comunicación:", error.text);
        
        // 3. Alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar',
          text: 'No pudimos procesar tu mensaje. Inténtalo de nuevo más tarde.',
          confirmButtonColor: '#121212',
        });
    });
  };

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
        
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row g-5">
              
              {/* COLUMNA IZQUIERDA: FORMULARIO */}
              <div className="col-lg-6">
                <h2 className="fw-bold mb-4 text-uppercase">Envíanos un mensaje</h2>
                <form ref={form} onSubmit={enviarEmail} className="row g-3">
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted">Nombre</label>
                    <input type="text" name="user_name" className="form-control py-2" placeholder="Tu nombre completo" required />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted">Correo</label>
                    <input type="email" name="user_email" className="form-control py-2" placeholder="ejemplo@correo.com" required />
                  </div>
                  <div className="col-12">
                    <label className="small fw-bold text-muted">Asunto</label>
                    <input type="text" name="subject" className="form-control py-2" placeholder="¿En qué podemos ayudarte?" required />
                  </div>
                  <div className="col-12">
                    <label className="small fw-bold text-muted">Mensaje</label>
                    <textarea name="message" className="form-control" rows="5" placeholder="Escribe los detalles aquí..." required></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-warning w-100 fw-bold py-3 shadow-sm" style={{ borderRadius: '10px' }}>
                      ENVIAR MENSAJE
                    </button>
                  </div>
                </form>
              </div>

              {/* COLUMNA DERECHA: INFO Y MAPA */}
              <div className="col-lg-6">
                <h2 className="fw-bold mb-4 text-uppercase">Información de contacto</h2>
                
                <div className="mb-4 bg-white p-4 rounded-4 shadow-sm border">
                  <p className="mb-3 d-flex align-items-center">
                    <i className="bi bi-geo-alt-fill text-warning fs-4 me-3"></i>
                    <span><strong>Dirección:</strong> Bogotá, Colombia</span>
                  </p>
                  <p className="mb-3 d-flex align-items-center">
                    <i className="bi bi-telephone-fill text-warning fs-4 me-3"></i>
                    <span><strong>Teléfono:</strong> +57 311 440 5432</span>
                  </p>
                  <p className="mb-0 d-flex align-items-center">
                    <i className="bi bi-envelope-fill text-warning fs-4 me-3"></i>
                    <span><strong>Email:</strong> comercial@aylcompresoresypartes.com</span>
                  </p>
                </div>

                <div className="rounded-4 overflow-hidden shadow-sm border">
                  <iframe
                    title="Ubicación A&L Compresores"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.959010039047!2d-74.09307402418663!3d4.60136434250899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f991193952fcb%3A0xba0a4c6f267c24fc!2sA%20%26%20L%20COMPRESORES%20Y%20PARTES!5e0!3m2!1ses!2sco!4v1775711378226!5m2!1ses!2sco"
                    width="100%" 
                    height="300" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

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