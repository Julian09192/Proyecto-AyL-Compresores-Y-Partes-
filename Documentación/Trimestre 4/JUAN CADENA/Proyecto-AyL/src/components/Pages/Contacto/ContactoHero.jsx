import { URL_FONDO } from "./contactoData";

export default function ContactoHero() {
  return (
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
}