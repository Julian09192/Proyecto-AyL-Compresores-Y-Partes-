function ActionButtons({ producto }) {
  const enviarCotizacionWhatsApp = () => {
    const telefono = "573197273732";

    const lineas = [
      `Hola AYL Compresores Y Partes, deseo cotizar el siguiente producto:\n`,
      `📌 *Producto:* ${producto.nombre}`,
      producto.referencia_interna
        ? `🔢 *Referencia:* ${producto.referencia_interna}`
        : null,
      producto.marca
        ? `🏷️ *Marca:* ${producto.marca}`
        : null,
      producto.precio
        ? `💰 *Precio:* $${producto.precio.toLocaleString("es-CO")}`
        : null,
      `\n¿Tienen disponibilidad? ¿Cuál es el tiempo de entrega?`,
    ]
      .filter(Boolean)
      .join("\n");

    const mensaje = encodeURIComponent(lineas);

    window.open(
      `https://api.whatsapp.com/send?phone=${telefono}&text=${mensaje}`,
      "_blank"
    );
  };

  return (
    <div
      className="rounded-4 p-4 mb-4"
      style={{
        background: "#F8F9FA",
        border: "1px solid #E9ECEF",
      }}
    >
      <h6 className="fw-bold mb-3">
        Asesoría especializada
      </h6>

      <p className="text-secondary small mb-3">
        Nuestro equipo puede ayudarte con información
        sobre compatibilidad, disponibilidad y características
        técnicas del producto.
      </p>

      <div className="d-flex flex-column gap-3 small">
        <span>✓ Consulta disponibilidad</span>
        <span>✓ Solicita asesoría técnica</span>
        <span>✓ Recibe una cotización</span>
      </div>

      {/* Botón WhatsApp */}
      <button
        onClick={enviarCotizacionWhatsApp}

        className="btn btn-success btn-lg w-100 rounded-pill fw-bold py-3 d-flex align-items-center justify-content-center gap-2 mt-4"
      >
        <i className="bi bi-whatsapp"></i>
        Consultar por WhatsApp
      </button>
    </div >
  );
}

export default ActionButtons;