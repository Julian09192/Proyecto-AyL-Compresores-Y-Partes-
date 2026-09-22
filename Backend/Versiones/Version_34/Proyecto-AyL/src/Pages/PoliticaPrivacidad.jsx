
import React from 'react';


function PoliticaPrivacidad({ setVista }) {
  const handleRegresar = (e) => {
    e.preventDefault();
    if (setVista) {
      setVista("inicio"); // Cambia a "inicio" o "contactos" según lo prefieras
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  };


  return (
    <div className="container my-5" style={{ maxWidth: '900px', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Enlace Superior de Retorno al Inicio */}
      <div className="mb-4">
        <a
          href="#"
          onClick={handleRegresar}
          className="text-secondary text-decoration-none d-inline-flex align-items-center small fw-semibold"
          style={{ gap: '6px', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.target.style.color = '#212529'}
          onMouseLeave={(e) => e.target.style.color = '#6c757d'}
        >
          <i className="bi bi-arrow-left"></i> Volver al Inicio
        </a>
      </div>


      {/* Encabezado Principal según image_a96e67.png */}
      <header className="mb-5">
        <h1 className="display-5 text-dark fw-bold mb-2" style={{ letterSpacing: '-0.5px' }}>
          Política de Tratamiento de Datos Personales
        </h1>
        <p className="text-muted mb-3" style={{ fontSize: '15px' }}>
          En vigencia y de conformidad con la Ley 1581 de 2012 • Última actualización: 2026
        </p>
        {/* Línea decorativa amarilla de la marca */}
        <div style={{ width: '60px', height: '4px', backgroundColor: '#f2a900' }}></div>
      </header>


      {/* Cuerpo del Documento */}
      <main className="text-secondary row g-4" style={{ lineHeight: '1.7', fontSize: '15px' }}>
        <div className="col-12">
          <section className="mb-4">
            <h5 className="text-dark fw-bold mb-3">1. Identificación del Responsable</h5>
            <p>
              El responsable del tratamiento de sus datos personales es la organización <strong>A&L Compresores y Partes</strong>,
              con domicilio principal en la ciudad de Bogotá, Colombia. Los canales oficiales dispuestos para atender solicitudes,
              consultas o reclamos relacionados con la protección de datos personales son el correo electrónico:
              {' '}<a href="mailto:comercial@aylcompresoresypartes.com" className="text-warning text-decoration-none fw-semibold">comercial@aylcompresoresypartes.com</a>.
            </p>
          </section>


          <section className="mb-4">
            <h5 className="text-dark fw-bold mb-3">2. Finalidad del Tratamiento de Datos</h5>
            <p>
              Los datos personales recolectados en nuestros formularios (tales como Nombre, Apellido, Correo Electrónico, Empresa y Mensaje)
              serán tratados de manera segura con el fin de:
            </p>
            <ul className="ps-3 mb-0">
              <li className="mb-2">Gestionar, dar respuesta y realizar el seguimiento técnico y comercial a sus solicitudes de cotización sobre compresores industriales, herramientas neumáticas y repuestos.</li>
              <li className="mb-2">Establecer canales de comunicación directa para el envío de información relevante, actualizaciones de servicio o promociones autorizadas.</li>
              <li className="mb-2">Garantizar el cumplimiento de compromisos comerciales y contractuales derivados de la atención solicitada.</li>
            </ul>
          </section>


          <section className="mb-4">
            <h5 className="text-dark fw-bold mb-3">3. Derechos de los Titulares (Habeas Data)</h5>
            <p>
              Como titular de los datos personales, de acuerdo con la legislación colombiana vigente, usted tiene derecho a:
            </p>
            <ul className="ps-3 mb-0">
              <li className="mb-2">Conocer, actualizar y rectificar sus datos personales frente a los Responsables del Tratamiento en cualquier momento.</li>
              <li className="mb-2">Solicitar prueba de la autorización otorgada para el tratamiento de sus datos, salvo las excepciones legales.</li>
              <li className="mb-2">Ser informado por el Responsable, previa solicitud, respecto del uso que se les ha dado a sus datos.</li>
              <li className="mb-2">Revocar la autorización o solicitar la supresión total del dato cuando considere que no se respetan los principios, derechos y garantías constitucionales.</li>
            </ul>
          </section>


          <section className="mb-4">
            <h5 className="text-dark fw-bold mb-3">4. Canales de Atención para Ejercer sus Derechos</h5>
            <p>
              Para radicar cualquier solicitud de acceso, corrección o eliminación de información, puede enviar un mensaje detallado
              a las direcciones electrónicas <strong>comercial@aylcompresoresypartes.com</strong> o <strong>alfredvesga@hotmail.com</strong>.
              Su requerimiento será evaluado y resuelto bajo los tiempos estipulados por la ley.
            </p>
          </section>


          <section className="mb-4">
            <h5 className="text-dark fw-bold mb-3">5. Vigencia del Tratamiento</h5>
            <p className="mb-0">
              Esta política rige a partir de su publicación oficial. Los datos personales suministrados se conservarán en nuestras
              bases de datos seguras durante el periodo necesario para cumplir con las finalidades descritas, o según lo exijan los plazos
              legales y comerciales aplicables en Colombia.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}


export default PoliticaPrivacidad;
