import logoMarca from "../../assets/Home/Navbar/logo-ayl.png";
const navLinks = ["Inicio", "Nosotros", "Productos", "Contactos"];
const productLinks = ["Compresores de Tornillo", "Compresores de Pistón", "Herramientas Neumáticas", "Repuestos", "Aceites y Lubricantes"];
const contactInfo = [
  { icon: "bi-geo-alt", text: "Bogotá, Colombia" },
  { icon: "bi-telephone", text: "+57 311 440 5432" },
  { icon: "bi-envelope", text: "comercial@aylcompresoresypartes.com  alfredvesga@hotmail.com" },
  { icon: "bi-clock", text: "Lun–Vie: 8am – 6pm" },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <img src={logoMarca} alt="Logo A&L Compresores" className="footer__logo" style={{ maxWidth: "200px" }} />
            <p className="footer__desc">Especialistas en compresores industriales y herramientas neumáticas. Calidad, respaldo y experiencia al servicio de la industria colombiana.</p>
            <div className="footer__socials">
              <a href="https://www.facebook.com/share/1Bb32KbLgQ/" className="footer__social-btn" target="_blank">
                <i className="bi-facebook"></i>
              </a>
              <a href="https://www.tiktok.com/@alcompresores" className="footer__social-btn" target="_blank">
                <i className="bi-tiktok"></i>
              </a>
              <a href="https://api.whatsapp.com/send?phone=573114405432&text=" className="footer__social-btn" target="_blank">
                <i className="bi-whatsapp"></i>
              </a>
              <a href="https://www.instagram.com/distri.ayl?igsh=MWQ5b3N5d2Y5dnNpaw==" className="footer__social-btn" target="_blank">
                <i className="bi-instagram"></i>
              </a>
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
              {contactInfo.map((c, index) => (
                <li key={index} className="d-flex align-items-center mb-2">
                  <i className={`${c.icon} me-2 text-light`}></i>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">© 2026 A&L Compresores y Partes. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}

export default Footer;