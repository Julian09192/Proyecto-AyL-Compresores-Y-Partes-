import { useState, useRef } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import CTA from "../components/Home/CTA";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const URL_FONDO = "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777133787/IMG_Productos.png";

const Hero = () => (
  <section
    className="position-relative d-flex align-items-center justify-content-center"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${URL_FONDO})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "450px"
    }}
  >
    <div className="container text-center position-relative" style={{ zIndex: 2 }}>
      <span className="badge bg-warning text-dark mb-3 px-3 py-2 text-uppercase fw-bold" style={{ letterSpacing: "2px" }}>
        Contacto Directo
      </span>
      <h1 className="display-2 fw-bold text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        ESTAMOS PARA <span className="text-warning">SERVIRTE</span>
      </h1>
      <p className="lead text-white-50 mx-auto mt-2 col-lg-7">
        ¿Necesitas una cotización formal o asesoría técnica? Nuestro equipo de expertos en aire comprimido te responderá en menos de 24 horas.
      </p>
    </div>
  </section>
);

export default function ContactoPage({
  setVista, usuario, login, logout, carrito, totalItems, cartOpen, setCartOpen, cambiarCantidad, eliminarDelCarrito
}) {
  const [showModal, setShowModal] = useState(false);
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'Enviando...',
      text: 'Estamos procesando tu solicitud',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    // Envío a EmailJS vinculado 
    emailjs.sendForm(
      'service_ecsbd4v', 
      'template_3ctxgvs', 
      form.current,
      'ZDygnYA16n4gwAS4p'
    )
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Mensaje enviado!',
          text: 'Hemos recibido tu solicitud. Un asesor técnico se pondrá en contacto contigo pronto.',
          confirmButtonColor: '#F5A623',
        });
        e.target.reset();
      }, (error) => {
        console.error("Error EmailJS:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de envío',
          text: 'No pudimos conectar con el servidor de correo. Por favor, intenta por WhatsApp.',
          confirmButtonColor: '#f5a623',
        });
      });
  };

  return (
    <div style={{ backgroundColor: "#F8F9FA" }}>
      <Navbar onOpenLogin={() => setShowModal(true)} vistaActual="contacto" {...{ setVista, usuario, logout, totalItems, setCartOpen }} />

      <main>
        <Hero />

        <section className="py-5">
          <div className="container">
            <div className="row g-5">

              {/* FORMULARIO */}
              <div className="col-lg-7">
                <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
                  <h3 className="fw-bold mb-4" style={{ color: "#f5a623" }}>Envíanos un mensaje</h3>
                  
                  <form ref={form} onSubmit={sendEmail} className="row g-3">
                    {/* Tag: {{title}} */}
                    <input type="hidden" name="title" value="Nueva Consulta Web" />

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Nombre Completo</label>
                      <input 
                        type="text" 
                        name="user_name" // Tag: {{user_name}}
                        className="form-control border-0 bg-light py-3" 
                        placeholder="Ej: Juan Pérez" 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Correo Electrónico</label>
                      <input 
                        type="email" 
                        name="user_email" // Tag: {{user_email}}
                        className="form-control border-0 bg-light py-3" 
                        placeholder="nombre@empresa.com" 
                        required 
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Asunto / Empresa</label>
                      <input 
                        type="text" 
                        name="subject" // Tag: {{subject}}
                        className="form-control border-0 bg-light py-3" 
                        placeholder="Ej: Cotización Filtros Donaldson" 
                        required 
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Tu Mensaje</label>
                      <textarea 
                        name="message" // Tag: {{message}}
                        className="form-control border-0 bg-light py-3" 
                        rows="4" 
                        placeholder="Cuéntanos qué repuestos o servicios necesitas..." 
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-warning w-100 fw-bold py-3 text-uppercase shadow" style={{ letterSpacing: "1px" }}>
                        Enviar Solicitud <i className="bi bi-send-fill ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/*CONTACTO */}
              <div className="col-lg-5">
                <div className="h-100 d-flex flex-column justify-content-center px-lg-4">
                  <h3 className="fw-bold mb-4" style={{ color: "#f5a623" }}>Canales de Atención</h3>

                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-warning p-3 rounded-3 text-white shadow-sm">
                        <i className="bi bi-geo-alt-fill fs-4"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Nuestra Ubicación</h6>
                        <p className="text-muted mb-0">Bogotá D.C., Colombia <br /> Zona Industrial</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-dark p-3 rounded-3 text-white shadow-sm">
                        <i className="bi bi-whatsapp fs-4"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">WhatsApp Ventas</h6>
                        <p className="text-muted mb-0">+57 311 440 5432</p>
                        <small className="text-success fw-bold">Atención inmediata</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-warning p-3 rounded-3 text-white shadow-sm">
                        <i className="bi bi-envelope-check-fill fs-4"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Correo Corporativo</h6>
                        <p className="text-muted mb-0 text-break">comercial@aylcompresoresypartes.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-4 bg-warning bg-opacity-10 rounded-4 border border-warning border-opacity-25">
                    <h6 className="fw-bold text-dark"><i className="bi bi-clock-fill me-2"></i>Horarios de Oficina</h6>
                    <p className="small mb-0 text-secondary">Lunes a Viernes: 8:00 AM - 5:30 PM</p>
                    <p className="small mb-0 text-secondary">Sábados: 8:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAPA */}
            <div className="row mt-5 pt-4">
              <div className="col-12">
                <div className="rounded-4 overflow-hidden shadow-lg border">
                  <iframe
                    title="Ubicación A&L"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.959010039047!2d-74.09307402418668!3d4.60136434250899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f991193952fcb%3A0xba0a4c6f267c24fc!2sA%20%26%20L%20COMPRESORES%20Y%20PARTES!5e0!3m2!1ses!2sco!4v1778123377631!5m2!1ses!2sco" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    width="100%"
                    height="450"
                    style={{ border: 0, filter: "grayscale(0.2) contrast(1.1)" }}
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
      <CartPanel {...{ setVista, carrito, cartOpen, setCartOpen, cambiarCantidad, eliminarDelCarrito }} />
      {showModal && <LoginModal login={login} onClose={() => setShowModal(false)} />}
    </div>
  );
}