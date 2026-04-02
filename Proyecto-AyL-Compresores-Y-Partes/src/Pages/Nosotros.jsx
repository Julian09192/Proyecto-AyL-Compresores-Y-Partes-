import { useEffect, useRef } from "react";

// 1. IMPORTACIÓN DE COMPONENTES EXTERNOS
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/LoginModal";
import CartPanel from "../components/CartPanel";
import CTA from "../components/Home/CTA";
/* ============================================================
   CONFIGURACIÓN DE DATOS (Rutas de imágenes)
   ============================================================ */
const IMAGEN_QUIENES_SOMOS = "./assets/quienes-somos.jpg"; // Cambia por tu ruta

const IMAGENES_CARRUSEL = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  src: `./assets/trabajo-${i + 1}.jpg`, // Asegúrate que tus fotos se llamen trabajo-1.jpg, etc.
  alt: `Trabajo A&L ${i + 1}`
}));

const BENEFICIOS = [
  { title: "Experiencia Real", desc: "Más de 15 años de trayectoria técnica en el sector industrial colombiano." },
  { title: "Calidad Certificada", desc: "Suministramos repuestos y lubricantes de las marcas líderes a nivel mundial." },
  { title: "Respuesta Inmediata", desc: "Entendemos la urgencia de su planta; por eso optimizamos cada entrega." },
  { title: "Asesoría Técnica", desc: "No solo vendemos, acompañamos su proceso con personal altamente calificado." }
];

/* ============================================================
   COMPONENTES INTERNOS DE LA PÁGINA
   ============================================================ */

const Hero = () => (
 <section 
  className="py-5 mt-5"
  style={{
    background: "linear-gradient(135deg, #caae0e, #E8941A)"
  }}
>
  <div className="container text-center py-5">
    <p className=" mb-2 text-dark" style={{ letterSpacing: "5px" }}>
      QUIÉNES SOMOS
    </p>

    <h1 className="display-1 fw-bold text-dark" style={{ lineHeight: "0.9" }}>
      MÁS DE 15 AÑOS <br /> IMPULSANDO LA INDUSTRIA
    </h1>

    <p className="lead text-dark mx-auto mt-4">
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
          {/* Espacio para la imagen a la izquierda */}
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
        <h3 className="text-white fw-bold" style={{ letterSpacing: "2px" }}>NUESTROS MARCAS ALIADAS</h3>
      </div>
      <div 
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => isDragging.current = false}
        onMouseLeave={() => isDragging.current = false}
        className="d-flex" 
        style={{ cursor: "grab", userSelect: "none", overflowX: "hidden" }}
      >
        {[...IMAGENES_CARRUSEL, ...IMAGENES_CARRUSEL].map((img, idx) => (
          <div key={idx} className="px-2" style={{ flex: "0 0 25%", minWidth: "280px" }}>
            <div 
              className="rounded shadow-sm" 
              style={{ 
                height: "250px", 
                backgroundImage: `url(${img.src})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundColor: '#333'
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============================================================
   PÁGINA PRINCIPAL (Export)
   ============================================================ */
export default // ASEGÚRATE DE QUE TENGA LAS LLAVES { } Y EL NOMBRE setVista ADENTRO
function Nosotros({ setVista, usuario, login, logout, carrito, totalItems, cartOpen, setCartOpen, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito }) {
  
  // ... resto de tu código
  return (
    <div className="nosotros-page">
      {/* Fuentes externas */}
      
      {/* 1. Navegación */}
    <Navbar
        onOpenLogin={() => setShowModal(true)}
        vistaActual="nosotros"
        setVista={setVista}
        usuario={usuario}
        logout={logout}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
      />

      {/* 2. Contenido de la página */}
      <main>
        <Hero />
        <InfoSeccion />
        <WhyChooseUs />
        <Carousel />
        <CTA/>
      </main>

      {/* 3. Pie de página */}
      <Footer />

      {/* Estilos específicos para efectos suaves */}
      <style>{`
        .nosotros-page { background: #fff; }
        .card { transition: transform 0.3s ease; }
        .card:hover { transform: translateY(-10px); }
      `}</style>
    </div>
  );
}