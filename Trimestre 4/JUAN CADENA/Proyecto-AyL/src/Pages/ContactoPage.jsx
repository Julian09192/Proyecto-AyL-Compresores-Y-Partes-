import { useState, useRef } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/Login/LoginModal";
import CTA from "../components/Home/CTA";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const URL_FONDO = "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1780941575/Contactanos.avif";

const Hero = () => (
  <section
    className="position-relative d-flex align-items-center justify-content-center"
    style={{
      backgroundImage: `linear-gradient(rgba(16, 20, 45, 0.85), rgba(16, 20, 45, 0.85)), url(${URL_FONDO})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "380px"
    }}
  >
    <div className="container text-center position-relative" style={{ zIndex: 2 }}>
      <h1 className="display-3 fw-bold text-white mb-3">
        ESTAMOS PARA <span style={{ color: "#ffc107" }}>SERVIRTE</span>
      </h1>
      <p className="lead mx-auto col-lg-6" style={{ color: "rgba(255,255,255,0.6)" }}>
        ¿Necesitas una cotización o asesoría técnica? Te respondemos en menos de 24 horas.
      </p>
    </div>
  </section>
);

const topicos = [
  {
    icon: "bi bi-whatsapp",
    color: "#25D366",
    bg: "#EAF3DE",
    titulo: "WhatsApp Ventas",
    desc: "Cotiza de forma inmediata con nuestro equipo comercial.",
    href: "https://wa.me/573197273732"
  },
  {
    icon: "bi bi-envelope-at-fill",
    color: "#ffae00f5",
    bg: "#E6F1FB",
    titulo: "Correo Corporativo",
    desc: "comercial@ayplubricantes.com",
    href: "mailto:comercial@ayplubricantes.com"
  },
  {
    icon: "bi bi-pin-map-fill",
    color: "#854F0B",
    bg: "#FAEEDA",
    titulo: "Nuestra Ubicación",
    desc: "Diagonal 7 bis # 19 31 - Los Mártires, Bogotá D.C.",
    href: null
  },
  {
    icon: "bi bi-clock-fill",
    color: "#5F5E5A",
    bg: "#F1EFE8",
    titulo: "Horarios de Atención",
    desc: "Lun–Vie 8:00 AM–5:30 PM · Sáb 8:00 AM–1:00 PM",
    href: null
  },
];

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

  const inputStyle = {
    borderRadius: "8px",
    border: "1.5px solid #E0E0E0",
    backgroundColor: "#fff",
    padding: "11px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ backgroundColor: "#F0F2F5" }}>
      <Navbar vistaActual="contacto" {...{ setVista, usuario, logout }} />

      <main>
        <Hero />

        {/* SECCIÓN PRINCIPAL */}
        <section className="py-5">
          <div className="container">
            <div
              className="row g-0 overflow-hidden"
              style={{ borderRadius: "16px", border: "1px solid #E0E0E0", backgroundColor: "#fff" }}
            >

              {/* ── COLUMNA IZQUIERDA: FORMULARIO ── */}
              <div
                className="col-lg-5 p-4 p-md-5"
                style={{ borderRight: "1px solid #EBEBEB" }}
              >
                <h4 className="fw-bold mb-1" style={{ color: "#10142D" }}>Envíanos un mensaje</h4>
                <p className="text-muted small mb-4">Completa el formulario y te contactaremos pronto.</p>

                <form ref={form} onSubmit={sendEmail}>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px", color: "#888", fontSize: "11px" }}>
                        Nombre <span className="text-danger">*</span>
                      </label>
                      <input type="text" name="first_name" required placeholder="Juan" style={inputStyle} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px", color: "#888", fontSize: "11px" }}>
                        Apellido <span className="text-danger">*</span>
                      </label>
                      <input type="text" name="last_name" required placeholder="Pérez" style={inputStyle} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px", color: "#888", fontSize: "11px" }}>
                      Correo electrónico <span className="text-danger">*</span>
                    </label>
                    <input type="email" name="email" required placeholder="nombre@empresa.com" style={inputStyle} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px", color: "#888", fontSize: "11px" }}>
                      Mensaje <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="message" required rows="4"
                      placeholder="Cuéntanos qué productos o servicios necesitas..."
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px", color: "#888", fontSize: "11px" }}>
                      Empresa / Asunto
                    </label>
                    <input type="text" name="title" placeholder="Ej: Cotización Filtros Donaldson" style={inputStyle} />
                  </div>

                  {/* BLOQUE SUTIL DE TRATAMIENTO DE DATOS */}
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

                  <button
                    type="submit"
                    className="w-100 fw-bold py-3"
                    style={{
                      backgroundColor: "#ffae00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "15px",
                      cursor: "pointer",
                      letterSpacing: "0.3px"
                    }}
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>

              {/* ── COLUMNA DERECHA: TÓPICOS ── */}
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
                          className="d-flex align-items-center gap-3 py-4 text-decoration-none"
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
                          <i className="bi bi-chevron-right text-muted"></i>
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

            {/* MAPA */}
            <div className="mt-4" style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E0E0E0" }}>
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
    </div>
  );
}