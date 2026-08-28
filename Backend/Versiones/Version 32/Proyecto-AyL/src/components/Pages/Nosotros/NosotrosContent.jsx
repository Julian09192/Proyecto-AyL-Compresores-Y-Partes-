const URL_FONDO = "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777131042/somos.png";
const IMAGEN_QUIENES_SOMOS = "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777131118/mantenimiento.jpg";

const BENEFICIOS = [
  { title: "Experiencia Real", desc: "Más de 15 años de trayectoria técnica en el sector industrial colombiano." },
  { title: "Calidad Certificada", desc: "Suministramos repuestos y lubricantes de las marcas líderes a nivel mundial." },
  { title: "Respuesta Inmediata", desc: "Entendemos la urgencia de su planta; por eso optimizamos cada entrega." },
  { title: "Asesoría Técnica", desc: "No solo vendemos, acompañamos su proceso con personal altamente calificado." }
];

export const Hero = () => (
  <section
    className="position-relative overflow-hidden d-flex align-items-center"
    style={{
      backgroundImage: `url(${URL_FONDO})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '600px',
      marginTop: '0',
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1
    }}></div>

    <div className="container text-center position-relative" style={{ zIndex: 2, paddingTop: '100px' }}>
      <p className="mb-2 text-light" style={{ letterSpacing: "5px" }}>QUIÉNES SOMOS</p>
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

export const InfoSeccion = () => (
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
            <strong>A&L Compresores Y Partes S.A.S.</strong> es una empresa comprometida con sus clientes, dedicada a la comercialización de repuestos, filtros y lubricantes para maquinaria pesada e industrial, plantas y compresores.
          </p>
          <p className="fs-5 text-dark">
            Brindamos un trato personalizado para cada uno de nuestros clientes con personal altamente calificado, suministrando mantenimientos en equipos neumáticos y plantas eléctricas de alta calidad ajustados a sus requerimientos.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export const WhyChooseUs = () => (
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