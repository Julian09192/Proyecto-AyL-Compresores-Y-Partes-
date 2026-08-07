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
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '500px', 
      marginTop: '0',
    }}
  >

    <div className="overlay" style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', 
      zIndex: 1
    }}></div>

    <div className="container text-center py-5 position-relative" style={{ zIndex: 2 }}> 
      <p className=" mb-2 text-light" style={{ letterSpacing: "5px" }}>
        QUIÉNES SOMOS
      </p>

      <h1 className="display-1 fw-bold text-light" style={{ lineHeight: "0.9" }}>
        MÁS DE 15 AÑOS <br /> IMPULSANDO LA INDUSTRIA
      </h1>

      <p className="lead text-light mx-auto mt-4 col-lg-8">
        Somos una empresa colombiana especializada en compresores industriales y herramientas neumáticas,
        comprometidos con la calidad y el servicio.
      </p>
    </div>
  </section>
);

const InfoSeccion = () => (
  <section className="py-5 bg-light">
    <div className="container">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <div
            className="rounded shadow-lg"
            style={{
              minHeight: "450px",
              backgroundImage: `url(${IMAGEN_QUIENES_SOMOS})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#ccc'
            }}
          />
        </div>
        <div className="col-lg-6">
          <h2 className="display-4 fw-bold mb-4">NUESTRO COMPROMISO</h2>
          <div className="bg-warning mb-4" style={{ width: "60px", height: "5px" }}></div>
          <p className="fs-5 text-dark mb-4">
            <strong>A&L COMPRESORES Y PARTES S.A.S.</strong> es una empresa comprometida con sus clientes, dedicada a la comercialización de repuestos, filtros y lubricantes para maquinaria pesada e industrial, plantas y compresores.
          </p>
          <p className="fs-5 text-dark" >
            Brindamos un trato personalizado para cada uno de nuestros clientes con personal altamente calificado, suministrando mantenimientos en equipos neumáticos y plantas eléctricas de alta calidad ajustados a sus requerimientos.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const WhyChooseUs = () => (
  <section className="py-5">
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold">¿POR QUÉ ELEGIRNOS?</h2>
        <p className="text-muted">Excelencia y confianza en cada proceso</p>
      </div>
      <div className="row g-4">
        {BENEFICIOS.map((b, i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm p-4 text-center border-top border-warning border-4">
              <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                <span className="text-warning fw-bold fs-4">{i + 1}</span>
              </div>
              <h4 className="fw-bold mb-3">{b.title}</h4>
              <p className="text-muted small">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Carousel = () => {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const autoScroll = () => {
      if (trackRef.current && !isDragging.current) {
        trackRef.current.scrollLeft += 0.8;
        if (trackRef.current.scrollLeft >= trackRef.current.scrollWidth / 2) {
          trackRef.current.scrollLeft = 0;
        }
      }
      requestAnimationFrame(autoScroll);
    };
    const anim = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(anim);
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (

    <section className="py-5 bg-dark overflow-hidden">
      <div className="container mb-4 text-center">
        <h3 className="text-white fw-bold" style={{ letterSpacing: "2px" }}>NUESTRO TRABAJO EN CAMPO</h3>
      </div>

      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => isDragging.current = false}
        onMouseLeave={() => isDragging.current = false}
        className="d-flex align-items-center"
        style={{
          cursor: "grab",
          userSelect: "none",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        {[...IMAGENES_CARRUSEL, ...IMAGENES_CARRUSEL].map((img, idx) => (
          <div key={idx} className="px-3" style={{ flex: "0 0 18%", minWidth: "220px" }}>
            <div
              className="rounded-4 shadow-lg border border-secondary bg-white"
              style={{
                height: "180px", 
                backgroundImage: `url(${img.src})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                padding: '15px', 
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default 
  function Nosotros({ setVista, usuario, login, logout, carrito, totalItems, cartOpen, setCartOpen, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="nosotros-page">

      <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="nosotros"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}

      />

      <main>
        <Hero />
        <InfoSeccion />
        <WhyChooseUs />
        <Carousel />
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


      <style>{`
        .nosotros-page { background: #fff; }
        .card { transition: transform 0.3s ease; }
        .card:hover { transform: translateY(-10px); }
      `}</style>
    </div>
  );
}