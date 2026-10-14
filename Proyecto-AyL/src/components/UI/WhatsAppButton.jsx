function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/573197273732?text=Hola,%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n"
      target="_blank"
      rel="noreferrer"
      aria-label="Contacto WhatsApp"
      title="Contactar por WhatsApp"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 62,
        height: 62,
        borderRadius: "50%",
        backgroundColor: "#25D366",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        boxShadow: "0 14px 30px rgba(37, 211, 102, 0.25)",
        zIndex: 1100,
      }}
    >
      <i className="bi bi-whatsapp" style={{ fontSize: "1.7rem" }} aria-hidden="true" />
      <span className="visually-hidden">Abrir chat en WhatsApp</span>
    </a>
  );
}

export default WhatsAppButton;
