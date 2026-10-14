// src/Pages/ContactoPage.jsx
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [politicaAceptada, setPoliticaAceptada] = useState(false);
  const form = useRef();


  // Validar variables de entorno de EmailJS
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_i16u9vm';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_aqqdq5c';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'sgFOZY5SPPk7ruthI';


  const sendEmail = async (e) => {
    e.preventDefault();


    if (!politicaAceptada) {
      Swal.fire({
        icon: 'warning',
        title: 'Acepta la política',
        text: 'Debes aceptar la Política de Privacidad antes de enviar el formulario.',
        confirmButtonColor: '#F5A623',
        confirmButtonText: 'Entendido'
      });
      return;
    }


    if (isSubmitting) return;
    setIsSubmitting(true);


    Swal.fire({
      title: 'Enviando mensaje...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    try {
      if (!form.current) {
        throw new Error('Formulario no disponible');
      }


      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form.current,
        EMAILJS_PUBLIC_KEY
      );


      if (result.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '¡Mensaje enviado!',
          text: 'Un asesor técnico se pondrá en contacto contigo pronto.',
          confirmButtonColor: '#F5A623',
          confirmButtonText: '¡Excelente!'
        });
        e.target.reset();
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de envío',
        text: 'No pudimos enviar tu mensaje. Por favor intenta por WhatsApp o llama a nuestras líneas de atención.',
        confirmButtonColor: '#10142D',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{ backgroundColor: "#F0F2F5" }}>
      <Navbar
        vistaActual="contactos"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        onOpenLogin={() => setShowModal(true)}
      />


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
                      <label className="form-label-custom" htmlFor="firstName">
                        Nombre <span className="text-danger">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="first_name"
                        required
                        placeholder="Juan"
                        className="form-input-custom"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label-custom" htmlFor="lastName">
                        Apellido <span className="text-danger">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="last_name"
                        required
                        placeholder="Pérez"
                        className="form-input-custom"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>


                  <div className="mb-3">
                    <label className="form-label-custom" htmlFor="email">
                      Correo electrónico <span className="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="nombre@empresa.com"
                      className="form-input-custom"
                      disabled={isSubmitting}
                    />
                  </div>


                  <div className="mb-3">
                    <label className="form-label-custom" htmlFor="message">
                      Mensaje <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="4"
                      placeholder="Cuéntanos qué productos o servicios necesitas..."
                      className="form-input-custom"
                      style={{ resize: "none" }}
                      disabled={isSubmitting}
                    />
                  </div>


                  <div className="mb-3">
                    <label className="form-label-custom" htmlFor="title">
                      Empresa / Asunto
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="Ej: Cotización Filtros Donaldson"
                      className="form-input-custom"
                      disabled={isSubmitting}
                    />
                  </div>


                  {/* Tratamiento de Datos (Habeas Data) */}
                  <div className="form-check mb-4 d-flex align-items-start gap-2">
                    <input
                      className={`form-check-input mt-1 flex-shrink-0 ${!politicaAceptada ? 'border-danger' : ''}`}
                      type="checkbox"
                      id="habeasDataCheck"
                      checked={politicaAceptada}
                      onChange={(e) => setPoliticaAceptada(e.target.checked)}
                      disabled={isSubmitting}
                      style={{ cursor: 'pointer' }}
                    />
                    <div>
                      <label className="form-check-label text-muted ms-1 d-block" htmlFor="habeasDataCheck" style={{ fontSize: '13px', lineHeight: '1.5', cursor: 'pointer' }}>
                        Acepto el uso de mis datos según la Ley 1581 de 2012. Ver{' '}
                        <a
                          href="#"
                          className="fw-bold text-decoration-none"
                          style={{ color: '#ffae00' }}
                          onClick={(e) => {
                            e.preventDefault();
                            setVista('politica');
                          }}
                        >
                          Política de Privacidad
                        </a>.
                      </label>
                      {!politicaAceptada && (
                        <p className="text-danger small mt-1 mb-0">Debes aceptar la Política de Privacidad para continuar.</p>
                      )}
                    </div>
                  </div>


                  <button
                    type="submit"
                    className="btn-submit-contacto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      'Enviar mensaje'
                    )}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2364.7119901057067!2d-74.09219802319623!3d4.601961987221489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f991193952fcb%3A0xba0a4c6f267c24fc!2sA%20%26%20L%20COMPRESORES%20Y%20PARTES!5e0!3m2!1ses!2sco!4v1782698759212!5m2!1ses!2sco"
                width="100%"
                height="400"
                style={{ border: 0, display: "block", filter: "grayscale(0.1) contrast(1.05)" }}
                allowFullScreen=""
                loading="lazy"
                fetchPriority="low"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>


          </div>
        </section>


        <CTA setVista={setVista} />


      </main>


      <Footer setVista={setVista} onAdminLogin={() => setShowModal(true)} />
     
      {/* ✅ CORREGIDO: PASAR setVista AL MODAL */}
      {showModal && (
        <LoginModal
          login={login}
          onClose={() => setShowModal(false)}
          setVista={setVista}  // ✅ ESTA ES LA LÍNEA QUE FALTABA
        />
      )}


      {/* Estilos CSS */}
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
        .form-input-custom:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }
        .form-check-input.border-danger {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.15rem rgba(220, 53, 69, 0.25);
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
        .btn-submit-contacto:hover:not(:disabled) {
          background-color: #e09900;
        }
        .btn-submit-contacto:active:not(:disabled) {
          transform: scale(0.99);
        }
        .btn-submit-contacto:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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
