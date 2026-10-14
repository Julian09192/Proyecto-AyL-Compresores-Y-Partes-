import { useState } from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";

const stats = [
  { value: "500+", label: "Productos disponibles" },
  { value: "15+", label: "Años de experiencia" },
  { value: "2.000+", label: "Clientes satisfechos" },
  { value: "48H", label: "Entrega garantizada" },
];

const infoCards = [
  {
    title: "Dirección",
    emoji: "📍",
    lines: ["Calle 67 # 11-50, Bogotá", "Zona Industrial", "Colombia"],
  },
  {
    title: "Teléfonos",
    emoji: "📞",
    lines: ["+57 (1) 234-5678", "+57 300 123 4567", "Línea de emergencias"],
  },
  {
    title: "Email",
    emoji: "✉️",
    lines: ["ventas@aylcompresores.com", "soporte@aylcompresores.com", "info@aylcompresores.com"],
  },
  {
    title: "Horarios",
    emoji: "🕒",
    lines: ["Lunes a viernes: 8:00 AM - 6:00 PM", "Sábados: 8:00 AM - 2:00 PM", "Domingos: cerrado"],
  },
];

const offices = [
  {
    city: "Bogotá",
    address: "Calle 67 # 11-50",
    phone: "+57 (1) 234-5678",
    manager: "Liliana Vesga",
  },
  {
    city: "Medellín",
    address: "Carrera 50 # 25-30",
    phone: "+57 (4) 345-6789",
    manager: "Carlos Mendoza",
  },
  {
    city: "Cali",
    address: "Avenida 3N # 15-45",
    phone: "+57 (2) 456-7890",
    manager: "Ana Rodríguez",
  },
];

function goToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function Contactos({
  setVista,
  usuario,
  login,
  logout,
  carrito,
  totalItems,
  cartOpen,
  setCartOpen,
  cambiarCantidad,
  eliminarDelCarrito,
}) {
  const [showModal, setShowModal] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setEnviado(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEnviado(true);
  };

  return (
    <>
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="contactos"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />

      <div className="contact-view">
        <section className="contact-hero py-5">
          <div className="contact-hero__circle contact-hero__circle--left" />
          <div className="contact-hero__circle contact-hero__circle--right" />

          <div className="container py-lg-5">
            <div className="contact-hero__text text-center py-4">
              <h1 className="display-title contact-hero__title">A&amp;L Compresores y Partes</h1>
              <p className="contact-hero__copy">
                Soluciones profesionales en compresores industriales y herramientas neumáticas.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4 pt-2">
                <button
                  type="button"
                  onClick={() => setVista("productos")}
                  className="btn btn-light btn-lg rounded-4 px-4 py-3"
                >
                  Ver productos
                </button>
                <button
                  type="button"
                  onClick={() => goToSection("contacto-formulario")}
                  className="btn contact-btn-outline btn-lg rounded-4 px-4 py-3"
                >
                  Contáctanos
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-metrics">
          <div className="container">
            <div className="row g-0">
              {stats.map((item) => (
                <div key={item.label} className="col-sm-6 col-lg-3">
                  <div className="contact-metric">
                    <div className="display-title contact-metric__value">{item.value}</div>
                    <div className="contact-metric__label">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto-formulario" className="contact-section py-5">
          <div className="container py-lg-4">
            <div className="text-center mb-5">
              <div className="contact-kicker">Contacto</div>
              <h2 className="display-title mt-3" style={{ fontSize: "clamp(2.8rem, 5vw, 4.3rem)" }}>
                Contáctanos
              </h2>
              <p className="lead text-secondary mx-auto mt-3" style={{ maxWidth: "52rem" }}>
                Estamos aquí para ayudarte con cotizaciones, soporte técnico o cualquier consulta sobre nuestros equipos.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="contact-card-box h-100">
                  <h3 className="fs-3 fw-semibold mb-4">Envíanos un mensaje</h3>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Nombre completo *</label>
                        <input
                          type="text"
                          name="nombre"
                          required
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Tu nombre completo"
                          className="form-control contact-soft-input"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          className="form-control contact-soft-input"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Teléfono</label>
                        <input
                          type="text"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="+57 300 123 4567"
                          className="form-control contact-soft-input"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Asunto</label>
                        <input
                          type="text"
                          name="asunto"
                          value={formData.asunto}
                          onChange={handleChange}
                          placeholder="¿En qué podemos ayudarte?"
                          className="form-control contact-soft-input"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Mensaje *</label>
                        <textarea
                          rows="5"
                          name="mensaje"
                          required
                          value={formData.mensaje}
                          onChange={handleChange}
                          placeholder="Describe tu consulta o requerimiento..."
                          className="form-control contact-soft-input"
                        />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn contact-btn-brand w-100 rounded-4 py-3">
                          Enviar mensaje
                        </button>
                      </div>
                    </div>
                  </form>

                  {enviado ? (
                    <div className="alert alert-success mt-4 mb-0 rounded-4">
                      Formulario listo. Luego puedes conectarlo con una API sin cambiar la vista.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="d-grid gap-4">
                  {infoCards.map((item) => (
                    <div key={item.title} className="contact-info-box">
                      <div className="d-flex align-items-start gap-3">
                        <span className="contact-icon-box">{item.emoji}</span>
                        <div>
                          <h3 className="h4 fw-semibold mb-3">{item.title}</h3>
                          {item.lines.map((line) => (
                            <p key={line} className="mb-1 text-secondary">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-5">
          <div className="container py-lg-4">
            <div className="text-center mb-5">
              <div className="contact-kicker">Cobertura</div>
              <h2 className="display-title mt-3" style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}>
                Nuestras oficinas
              </h2>
              <p className="lead text-secondary mx-auto mt-3" style={{ maxWidth: "42rem" }}>
                Encuentra la oficina más cercana y recibe atención personalizada en tu ciudad.
              </p>
            </div>

            <div className="row g-4">
              {offices.map((office) => (
                <div key={office.city} className="col-xl-4">
                  <div className="contact-office-box h-100">
                    <h3 className="contact-office-title mb-4">{office.city}</h3>
                    <p className="mb-2 text-secondary">📍 {office.address}</p>
                    <p className="mb-4 text-secondary">☎ {office.phone}</p>
                    <hr />
                    <p className="fw-semibold mb-1">Gerente</p>
                    <p className="mb-0 text-secondary">{office.manager}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white pb-5">
          <div className="container">
            <div className="contact-map-box">
              <div className="text-center mb-4">
                <div className="contact-kicker">Ubicación</div>
                <h2 className="display-title mt-3" style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}>
                  Ubicación principal
                </h2>
                <p className="lead text-secondary mx-auto mt-3" style={{ maxWidth: "42rem" }}>
                  Visítanos en nuestra oficina principal en Bogotá y conoce de cerca nuestros productos.
                </p>
              </div>

              <div className="overflow-hidden rounded-5 border bg-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.95901003902!2d-74.09307402564878!3d4.601364342512018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f991193952fcb%3A0xba0a4c6f267c24fc!2sA%20%26%20L%20COMPRESORES%20Y%20PARTES!5e0!3m2!1ses-419!2sco!4v1775179856287!5m2!1ses-419!2sco"
                  className="w-100 border-0"
                  style={{ height: "420px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa A&L Compresores y Partes"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="contact-cta py-5">
          <div className="contact-cta__circle" />
          <div className="container position-relative text-center py-3">
            <h2 className="display-title text-white" style={{ fontSize: "clamp(2.6rem, 5vw, 4.1rem)" }}>
              ¿Listo para potenciar tu producción?
            </h2>
            <p className="lead text-white-50 mx-auto mt-3" style={{ maxWidth: "48rem" }}>
              Habla con nuestros asesores y encuentra la solución perfecta para tu operación.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => goToSection("contacto-formulario")}
                className="btn btn-light btn-lg rounded-4 px-4 py-3"
              >
                Solicitar cotización
              </button>
              <button
                type="button"
                onClick={() => goToSection("contacto-formulario")}
                className="btn contact-btn-outline btn-lg rounded-4 px-4 py-3"
              >
                📞 Llamar ahora
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <CartPanel
        carrito={carrito}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cambiarCantidad={cambiarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
      />

      {showModal ? <LoginModal login={login} onClose={() => setShowModal(false)} /> : null}
    </>
  );
}

export default Contactos;
