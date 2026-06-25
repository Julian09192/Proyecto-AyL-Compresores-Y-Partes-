import { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

// Componentes Layout Globales
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/Login/LoginModal";
import CTA from "../components/Home/CTA";

// Componentes y Datos Refactorizados del Módulo
import ContactoHero from "../components/Pages/Contacto/ContactoHero";
import { topicos } from "../components/Pages/Contacto/contactoData";

export default function ContactoPage({ setVista, usuario, login, logout }) {
  const [showModal, setShowModal] = useState(false);
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Enviando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    emailjs.sendForm('service_i16u9vm', 'template_aqqdq5c', form.current, 'sgFOZY5SPPk7ruthI')
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Mensaje enviado!',
          text: 'Un asesor técnico se pondrá en contacto contigo pronto.',
          confirmButtonColor: '#F5A623',
        });
        e.target.reset();
      }, () => {
        Swal.fire({
          icon: 'error',
          title: 'Error de envío',
          text: 'No pudimos enviar. Por favor intenta por WhatsApp.',
          confirmButtonColor: '#10142D',
        });
      });
  };

  return (
    <div style={{ backgroundColor: "#F0F2F5" }}>
      <Navbar vistaActual="contactos" {...{ setVista, usuario, logout }} onOpenLogin={() => setShowModal(true)} />

      <main>
        <ContactoHero />

        {/* Sección de Canales y Formulario */}
        <section className="py-5">
          <div className="container">
            <div 
              className="row g-0 overflow-hidden shadow-sm" 
              style={{ borderRadius: "16px", border: "1px solid #E0E0E0", backgroundColor: "#fff" }}
            >

              {/* Columna Izquierda: Formulario de Contacto */}
              <div className="col-lg-5 p-4 p-md-5 border-contacto-col">
                <h4 className="fw-bold mb-1" style={{ color: "#10142D" }}>Envíanos un mensaje</h4>
                <p className="text-muted small mb-4">Completa el formulario y te contactaremos pronto.</p>

                <form ref={form} onSubmit={sendEmail}>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label-custom">
                        Nombre <span className="text-danger">*</span>
                      </label>
                      <input type="text" name="first_name" required placeholder="Juan" className="form-input-custom" />
                    </div>
                    <div className="col-6">
                      <label className="form-label-custom">
                        Apellido <span className="text-danger">*</span>
                      </label>
                      <input type="text" name="last_name" required placeholder="Pérez" className="form-input-custom" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label-custom">
                      Correo electrónico <span className="text-danger">*</span>
                    </label>
                    <input type="email" name="email" required placeholder="nombre@empresa.com" className="form-input-custom" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label-custom">
                      Mensaje <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="message" required rows="4"
                      placeholder="Cuéntanos qué productos o servicios necesitas..."
                      className="form-input-custom"
                      style={{ resize: "none" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label-custom">
                      Empresa / Asunto
                    </label>
                    <input type="text" name="title" placeholder="Ej: Cotización Filtros Donaldson" className="form-input-custom" />
                  </div>

                  {/* Tratamiento de Datos (Habeas Data) */}
                  <div className="form-check mb-4 d-flex align-items-start gap-1">
                    <input 
                      className="form-check-input mt-1 flex-shrink-0" 
                      type="checkbox" 
                      id="habeasDataCheck" 
                      required 
                      style={{ cursor: "pointer" }}
                    />
                    <label className="form-check-label text-muted ms-1" htmlFor="habeasDataCheck" style={{ fontSize: "12px", lineHeight: "1.4", cursor: "pointer" }}>
                      Acepto el uso de mis datos según la Ley 1581 de 2012. Ver{" "}
                      <a 
                        href="#" 
                        className="fw-bold text-decoration-none" 
                        style={{ color: "#ffae00" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setVista("politica-privacidad");
                        }}
                      >
                        Política de Privacidad
                      </a>.
                    </label>
                  </div>

                  <button type="submit" className="btn-submit-contacto">
                    Enviar mensaje
                  </button>
                </form>
              </div>

              {/* Columna Derecha: Canales de Atención Directa */}
              <div className="col-lg-7 p-4 p-md-5">
                <h3 className="fw-bold mb-1" style={{ color: "#10142D", fontSize: "28px" }}>
                  ¿Cómo podemos ayudarte?
                </h3>
                <p className="text-muted mb-4" style={{ fontSize: "15px", maxWidth: "480px" }}>
                  Selecciona un canal de atención o usa el formulario para enviarnos tu consulta directamente.
                </p>

                <div className="d-flex flex-column">
                  {topicos.map((t, i) => (
                    <div key={i}>
                      {t.href ? (
                        <a
                          href={t.href}
                          target="_blank"
                          rel="noreferrer"
                          className="d-flex align-items-center gap-3 py-4 text-decoration-none canal-contacto-item"
                          style={{ color: "inherit" }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                            style={{ width: "44px", height: "44px", backgroundColor: t.bg }}
                          >
                            <i className={`${t.icon} fs-5`} style={{ color: t.color }}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p className="fw-bold mb-0" style={{ color: "#10142D", fontSize: "15px" }}>{t.titulo}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>{t.desc}</p>
                          </div>
                          <i className="bi bi-chevron-right text-muted icon-arrow-transition"></i>
                        </a>
                      ) : (
                        <div className="d-flex align-items-center gap-3 py-4">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                            style={{ width: "44px", height: "44px", backgroundColor: t.bg }}
                          >
                            <i className={`${t.icon} fs-5`} style={{ color: t.color }}></i>
                          </div>
                          <div>
                            <p className="fw-bold mb-0" style={{ color: "#10142D", fontSize: "15px" }}>{t.titulo}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>{t.desc}</p>
                          </div>
                        </div>
                      )}
                      {i < topicos.length - 1 && (
                        <div style={{ height: "1px", backgroundColor: "#F0F0F0" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bloque del Mapa de Google Maps */}
            <div className="mt-4 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E0E0E0" }}>
              <iframe
                title="Ubicación A&L"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d295.589034238723!2d-74.088718136957!3d4.601876557043105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99c551403a25%3A0x88ba3b03cd79d08!2sA%26P%20LUBRICANTES%20Y%20FILTROS%20SAS!5e0!3m2!1ses!2sco!4v1780238191290!5m2!1ses!2sco"
                width="100%" height="400"
                style={{ border: 0, display: "block", filter: "grayscale(0.1) contrast(1.05)" }}
                allowFullScreen="" loading="lazy"
              />
            </div>

          </div>
        </section>

        <CTA />
      </main>

      <Footer setVista={setVista} onAdminLogin={() => setShowModal(true)} />
      {showModal && <LoginModal login={login} onClose={() => setShowModal(false)} />}

      {/* Estilos CSS Limpios */}
      <style>{`
        .border-contacto-col { border-right: 1px solid #EBEBEB; }
        @media (max-width: 991.98px) {
          .border-contacto-col { border-right: none; border-bottom: 1px solid #EBEBEB; }
        }
        .form-label-custom {
          display: block;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
          color: #888;
          font-size: 11px;
        }
        .form-input-custom {
          border-radius: 8px;
          border: 1.5px solid #E0E0E0;
          background-color: #fff;
          padding: 11px 14px;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-input-custom:focus {
          border-color: #ffae00;
          box-shadow: 0 0 0 3px rgba(255, 174, 0, 0.15);
        }
        .btn-submit-contacto {
          width: 100%;
          font-weight: bold;
          padding: 14px;
          background-color: #ffae00;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .btn-submit-contacto:hover {
          background-color: #e09900;
        }
        .btn-submit-contacto:active {
          transform: scale(0.99);
        }
        .canal-contacto-item {
          transition: background-color 0.2s ease, padding-left 0.2s ease;
          border-radius: 8px;
          margin: 0 -8px;
          padding: 16px 8px !important;
        }
        .canal-contacto-item:hover {
          background-color: #F8F9FA;
          padding-left: 12px !important;
        }
        .icon-arrow-transition {
          transition: transform 0.2s ease;
        }
        .canal-contacto-item:hover .icon-arrow-transition {
          transform: translateX(4px);
          color: #10142D !important;
        }
      `}</style>
    </div>
  );
}