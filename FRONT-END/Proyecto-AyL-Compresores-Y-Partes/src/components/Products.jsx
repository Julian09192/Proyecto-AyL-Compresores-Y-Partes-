
const products = [
  { icon: "🏭", name: "Compresor Industrial 50HP", desc: "Compresor de tornillo rotativo de alta eficiencia para producción continua.", badge: "Destacado" },
  { icon: "⚙️", name: "Compresor Pistón 5HP", desc: "Ideal para talleres y aplicaciones de baja presión con bajo mantenimiento.", badge: null },
  { icon: "🔩", name: "Kit de Repuestos Universal", desc: "Conjunto completo de piezas de desgaste compatibles con múltiples marcas.", badge: "Nuevo" },
  { icon: "💨", name: "Herramienta Neumática Pro", desc: "Llave de impacto de alto torque para uso intensivo en líneas de producción.", badge: null },
  { icon: "🛢️", name: "Aceite Sintético 5W-40", desc: "Lubricante premium formulado para compresores de tornillo.", badge: "Oferta" },
  { icon: "📡", name: "Panel de Control Digital", desc: "Sistema de monitoreo inteligente con alertas y control remoto vía app.", badge: "Nuevo" },
];

function Products() {
  return (
    <section className="products-section" id="productos">
      <div className="container">
        <div className="products-header d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
          <div>
            <p className="products-eyebrow">Catálogo</p>
            <h2 className="products-title">Nuestros Productos</h2>
          </div>
          <button className="products-btn-all">Ver todo el catálogo →</button>
        </div>
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.name} className="col-12 col-sm-6 col-lg-4">
              <div className="product-card">
                <div className="product-card__img">
                  <span className="product-card__emoji">{p.icon}</span>
                  {p.badge && <span className="product-card__badge">{p.badge}</span>}
                </div>
                <div className="product-card__body">
                  <h6 className="product-card__name">{p.name}</h6>
                  <p className="product-card__desc">{p.desc}</p>
                  <button className="product-card__btn">Ver detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;