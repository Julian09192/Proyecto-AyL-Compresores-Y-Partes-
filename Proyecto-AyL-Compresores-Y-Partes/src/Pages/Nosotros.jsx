import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useState } from "react";
import LoginModal from "../components/LoginModal";

// Datos simulados — cuando tengas backend esto vendrá de una API
const VALORES = [
  { emoji: "🏆", titulo: "Calidad",     desc: "Trabajamos solo con marcas certificadas y productos de primera línea industrial." },
  { emoji: "🤝", titulo: "Confianza",   desc: "Más de 15 años construyendo relaciones sólidas con nuestros clientes." },
  { emoji: "⚡", titulo: "Rapidez",     desc: "Entrega garantizada en 48 horas a toda Colombia." },
  { emoji: "🔧", titulo: "Experiencia", desc: "Equipo técnico especializado en compresores y herramientas neumáticas." },
];

const EQUIPO = [
  { nombre: "Andrés López",   cargo: "Fundador & Director General", emoji: "👨‍💼" },
  { nombre: "Liliana Vesga",  cargo: "Gerente de Inventario",       emoji: "👩‍💼" },
  { nombre: "Carlos Rodríguez", cargo: "Jefe Técnico",             emoji: "👨‍🔧" },
  { nombre: "Luis Morales",   cargo: "Asesor Comercial",            emoji: "👨‍💻" },
];

function Nosotros({ setVista }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="nosotros"
        setVista={setVista}
      />

      {/* ── HERO ── */}
      <section className="nosotros-hero">
        <div className="container text-center">
          <p className="nosotros-eyebrow">QUIÉNES SOMOS</p>
          <h1 className="nosotros-title">Más de 15 años<br />impulsando la industria</h1>
          <p className="nosotros-subtitle">
            Somos una empresa colombiana especializada en compresores industriales
            y herramientas neumáticas, comprometidos con la calidad y el servicio.
          </p>
        </div>
      </section>

      {/* ── HISTORIA ── */}
      <section className="nosotros-historia">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <p className="features-eyebrow">NUESTRA HISTORIA</p>
              <h2 className="features-title">Nacimos para<br />servir a la industria</h2>
              <p className="nosotros-historia__texto">
                A&L Compresores y Partes nació en 2009 con una misión clara: ofrecer
                soluciones confiables en equipos neumáticos e industriales a empresas
                de todos los tamaños en Colombia.
              </p>
              <p className="nosotros-historia__texto">
                Hoy contamos con más de 500 productos disponibles, 2.000 clientes
                satisfechos y un equipo humano apasionado por la excelencia técnica.
              </p>
            </div>
            <div className="col-md-6">
              {/* Tarjeta de estadísticas */}
              <div className="nosotros-stats-box">
                {[
                  { numero: "15+",    label: "Años de experiencia" },
                  { numero: "500+",   label: "Productos disponibles" },
                  { numero: "2.000+", label: "Clientes satisfechos" },
                  { numero: "48H",    label: "Entrega garantizada" },
                ].map((s) => (
                  <div key={s.label} className="nosotros-stat">
                    <span className="nosotros-stat__num">{s.numero}</span>
                    <span className="nosotros-stat__label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className="nosotros-valores">
        <div className="container">
          <div className="text-center mb-5">
            <p className="features-eyebrow">LO QUE NOS MUEVE</p>
            <h2 className="features-title">Nuestros valores</h2>
          </div>
          <div className="row g-4">
            {VALORES.map((v) => (
              <div key={v.titulo} className="col-sm-6 col-lg-3">
                <div className="feature-card text-center h-100">
                  <div className="feature-card__icon mx-auto">{v.emoji}</div>
                  <h3 className="feature-card__title">{v.titulo}</h3>
                  <p className="feature-card__desc">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="nosotros-equipo">
        <div className="container">
          <div className="text-center mb-5">
            <p className="features-eyebrow">LAS PERSONAS DETRÁS</p>
            <h2 className="features-title">Nuestro equipo</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {EQUIPO.map((persona) => (
              <div key={persona.nombre} className="col-sm-6 col-lg-3">
                <div className="nosotros-team-card">
                  <div className="nosotros-team-card__avatar">{persona.emoji}</div>
                  <h4 className="nosotros-team-card__nombre">{persona.nombre}</h4>
                  <p className="nosotros-team-card__cargo">{persona.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-circle cta-circle--top" />
        <div className="container cta-content">
          <h2 className="cta-title">¿Listo para trabajar con nosotros?</h2>
          <p className="cta-subtitle">Contáctanos y recibe una asesoría personalizada sin costo.</p>
          <div className="cta-actions">
            <button className="cta-btn cta-btn--primary" onClick={() => setVista("contactos")}>
              Contáctanos
            </button>
            <button className="cta-btn cta-btn--secondary" onClick={() => setVista("productos")}>
              Ver Productos
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {showModal && (
        <LoginModal setVista={setVista} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default Nosotros;
