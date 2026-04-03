const navLinks = ["Inicio", "Nosotros", "Productos", "Contactos"];
const productLinks = ["Compresores de Tornillo", "Compresores de Pistón", "Herramientas Neumáticas", "Repuestos", "Aceites y Lubricantes"];
const contactInfo = [
  { icon: "📍", text: "Bogotá, Colombia" },
  { icon: "📞", text: "+57 (1) 234-5678" },
  { icon: "✉", text: "info@alcompresores.com" },
  { icon: "🕐", text: "Lun–Vie: 8am – 6pm" },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="footer__brand">A&L Compresores</div>
            <p className="footer__desc">Especialistas en compresores industriales y herramientas neumáticas. Calidad, respaldo y experiencia al servicio de la industria colombiana.</p>
            <div className="footer__socials">
              <a href="#" className="footer__social-btn">in</a>
              <a href="#" className="footer__social-btn">f</a>
              <a href="#" className="footer__social-btn">✉</a>
            </div>
          </div>
          <div className="col-6 col-md-2">
            <h6 className="footer__heading">Empresa</h6>
            <ul className="footer__links">{navLinks.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="footer__heading">Productos</h6>
            <ul className="footer__links">{productLinks.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="col-12 col-md-3">
            <h6 className="footer__heading">Contacto</h6>
            <ul className="footer__links footer__links--contact">
              {contactInfo.map((c) => <li key={c.text}><span>{c.icon}</span>{c.text}</li>)}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">© 2026 A&L Compresores y Partes. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}

export default Footer;