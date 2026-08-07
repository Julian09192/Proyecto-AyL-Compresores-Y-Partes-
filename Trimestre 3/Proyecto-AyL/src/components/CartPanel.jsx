
function CartPanel({ carrito, cartOpen, setCartOpen, cambiarCantidad, eliminarDelCarrito, setVista }) {
  if (!cartOpen) return null;

  const total = carrito.reduce((acc, item) => {
    const num = parseInt(item.precio.replace(/\D/g, ""), 10);
    return acc + num * item.cantidad;
  }, 0);

  const handleIrAlCheckout = () => {
    setCartOpen(false); 
    setVista("checkout");
  };

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 10000 }}
        onClick={() => setCartOpen(false)}
      />

      <div
        className="bg-white d-flex flex-column"
        style={{
          position: "fixed", top: 0, right: 0,
          width: "100%", maxWidth: 400,
          height: "100vh", zIndex: 10001,
          boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <div>
            <h2 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}> <i className="bi bi-cart"></i> Carrito</h2>
            <p className="text-secondary mb-0" style={{ fontSize: "0.8rem" }}>
              {carrito.length} producto{carrito.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="btn-close" onClick={() => setCartOpen(false)} />
        </div>

        <div className="flex-grow-1 overflow-auto p-3">
          {carrito.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "3rem" }}><i className="bi bi-cart"></i></div>
              <p className="text-secondary mt-2">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {carrito.map((item) => (
                <div key={item.id} className="d-flex gap-3 bg-light rounded-3 p-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{ width: 48, height: 48, background: "#fff", fontSize: "1.5rem", border: "1px solid #eee" }}
                  >
                    {item.emoji}
                  </div>

                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-semibold text-truncate" style={{ fontSize: "0.85rem" }}>
                      {item.nombre}
                    </div>
                    <div className="fw-bold" style={{ color: "#F5A623", fontSize: "0.88rem" }}>
                      {item.precio}
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button
                        className="btn btn-sm border rounded-2 px-2 py-0 fw-bold"
                        onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                      >−</button>
                      <span className="fw-semibold" style={{ fontSize: "0.88rem", minWidth: 20, textAlign: "center" }}>
                        {item.cantidad}
                      </span>
                      <button
                        className="btn btn-sm border rounded-2 px-2 py-0 fw-bold"
                        onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                      >+</button>
                    </div>
                  </div>

                  <button
                    className="btn-close flex-shrink-0 mt-1"
                    style={{ fontSize: "0.7rem" }}
                    onClick={() => eliminarDelCarrito(item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {carrito.length > 0 && (
          <div className="p-4 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold">Total:</span>
              <span className="fw-bold fs-5">
                ${total.toLocaleString("es-CO")}
              </span>
            </div>
            <button
              className="w-100 border-0 rounded-3 fw-bold py-2 text-white"
              style={{ background: "#F5A623", fontSize: "0.95rem", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#E8941A"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F5A623"}
              onClick={handleIrAlCheckout} 
            >
              Proceder al Pago →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPanel;