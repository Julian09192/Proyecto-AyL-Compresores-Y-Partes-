// Marcas simuladas con SVG de texto elegante
// Cuando tengas imágenes reales, reemplaza cada item por un <img src="..." />
const MARCAS = [
  "Atlas Copco", "Ingersoll Rand", "Shell", "Mobil", "Schulz", "Festo",
];


function Marcas() {
  return (
    <section style={{ background: "#ffffff", padding: "3.5rem 0", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
      <div className="container">

        <p className="text-center fw-bold text-uppercase mb-4" style={{ color: "#adb5bd", fontSize: "0.78rem", letterSpacing: 2 }}>
          Marcas que trabajamos
        </p>

        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
          {MARCAS.map((marca) => (
            <div
              key={marca}
              className="px-4 py-2 rounded-2 border fw-bold text-uppercase"
              style={{
                color: "#adb5bd",
                borderColor: "#eeeeee",
                fontSize: "0.85rem",
                letterSpacing: 1.5,
                background: "#fafafa",
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F5A623";
                e.currentTarget.style.borderColor = "#F5A623";
                e.currentTarget.style.background = "#fff8ed";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#adb5bd";
                e.currentTarget.style.borderColor = "#eeeeee";
                e.currentTarget.style.background = "#fafafa";
              }}
            >
              {marca}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Marcas;