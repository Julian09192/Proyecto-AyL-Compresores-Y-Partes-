import { useState, useEffect } from "react";

// Componente CartPanel con destructuración completa de props
function CartPanel({ carrito, cartOpen, setCartOpen, cambiarCantidad, eliminarDelCarrito, setVista, usuario, onOpenLogin }) {
  if (!cartOpen) return null;

  // --- LÓGICA DE TOTAL CORREGIDA ---
  const total = carrito.reduce((acc, item) => {
    // Buscamos el precio en la raíz o dentro del objeto anidado de Supabase
    const precioCrudo = item.precio || item.productos?.precio || item.producto?.precio || 0;

    // Verificamos si es un string o un número para evitar errores al formatear
    const precioBase = typeof precioCrudo === 'string' 
      ? parseInt(precioCrudo.replace(/\D/g, ""), 10) 
      : precioCrudo;

    const precioNumerico = isNaN(precioBase) ? 0 : precioBase;
    
    return acc + precioNumerico * (item.cantidad || item.amount || 1);
  }, 0);

  // Función para manejar el flujo hacia la pantalla de Checkout
  const handleIrAlCheckout = () => {
    if (!usuario) {
      setCartOpen(false);
      if (typeof onOpenLogin === "function") {
        onOpenLogin();
      } else if (typeof setVista === "function") {
        setVista("inicio");
      }
      return;
    }

    setCartOpen(false);
    if (typeof setVista === "function") {
      setVista("checkout");
    }
  };

  // Función para optimizar las miniaturas dinámicamente con Cloudinary
  const optimizarMiniatura = (url) => {
    if (!url) return null;
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_80,h_80,c_fill/");
    }
    return url;
  };

  return (
    <>
      {/* Fondo Oscuro con desenfoque (Backdrop) */}
      <div
        style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(16, 20, 45, 0.4)", 
          backdropFilter: "blur(2px)",
          zIndex: 10000 
        }}
        onClick={() => setCartOpen(false)}
      />

      {/* Panel Lateral Deslizante */}
      <div
        className="bg-white d-flex flex-column cart-panel-slide"
        style={{
          position: "fixed", top: 0, right: 0,
          width: "min(100vw, 420px)",
          height: "100vh", zIndex: 10001,
          boxShadow: "-8px 0 32px rgba(16, 20, 45, 0.08)",
        }}
      >
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
          <div>
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-dark"> 
              <i className="bi bi-bag-check-fill text-warning"></i> Tu Carrito
            </h5>
            <p className="text-muted mb-0 small mt-1">
              Tienes {carrito.length} producto{carrito.length !== 1 ? "s" : ""} seleccionado{carrito.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button 
            className="btn-close bg-white p-2 rounded-circle shadow-sm" 
            style={{ fontSize: "0.8rem" }} 
            onClick={() => setCartOpen(false)} 
          />
        </div>

        {/* Cuerpo del Carrito (Área con Scroll) */}
        <div className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: "#FAFAFB" }}>
          {carrito.length === 0 ? (
            <div className="text-center py-5 my-5">
              <div className="text-muted mb-3" style={{ fontSize: "3.5rem" }}>
                <i className="bi bi-cart-x animate-pulse"></i>
              </div>
              <h6 className="fw-bold text-dark">Tu carrito está vacío</h6>
              <p className="text-muted small px-4">¡Explora nuestro catálogo industrial y añade los repuestos o lubricantes que necesitas!</p>
              <button 
                className="btn btn-sm btn-outline-dark rounded-pill px-3 mt-2 fw-semibold"
                onClick={() => setCartOpen(false)}
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {carrito.map((item) => {
                
                // 🔍 EXTRACCIÓN SEGURA REFORZADA (Raíz + Objetos Anidados de Supabase)
                const urlImagen = 
                  item.imagen_url || 
                  item.Imagen_url ||
                  item.imagen || 
                  item.Imagen ||
                  item.productos?.imagen_url ||
                  item.productos?.imagen ||
                  item.producto?.imagen_url ||
                  item.producto?.imagen ||
                  (item.todas_las_imagenes && item.todas_las_imagenes[0]?.imagen_url) ||
                  (item.productos?.todas_las_imagenes && item.productos?.todas_las_imagenes[0]?.imagen_url);

                const nombreProducto = item.nombre || item.Nombre || item.productos?.nombre || item.producto?.nombre || "Producto";
                const codigoProducto = item.codigo_interno || item.productos?.codigo_interno || item.producto?.codigo_interno || "N/A";
                const precioOriginal = item.precio || item.productos?.precio || item.producto?.precio || 0;
                const cantidadActual = item.cantidad || item.amount || 1;
                
                return (
                  <div key={item.id} className="d-flex gap-3 bg-white border rounded-4 p-3 shadow-sm position-relative transition-all hover-card">
                    
                    {/* Contenedor de la Imagen */}
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 overflow-hidden border bg-light"
                      style={{ width: 70, height: 70 }}
                    >
                      {urlImagen ? (
                        <img 
                          src={optimizarMiniatura(urlImagen)} 
                          alt={nombreProducto} 
                          className="w-100 h-100"
                          style={{ objectFit: "contain", padding: "4px" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            // En caso de que el string de la URL esté roto o devuelva un 404, muestra un SVG limpio inline
                            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='1.5'><rect x='2' y='2' width='20' height='20' rx='2'/><path d='M8 16l4-4 4 4'/></svg>";
                          }}
                        />
                      ) : (
                        <i className="bi bi-box-seam text-secondary" style={{ fontSize: '1.4rem' }}></i>
                      )}
                    </div>

                    {/* Información y Controles del Producto */}
                    <div className="flex-grow-1 overflow-hidden d-flex flex-column justify-content-between">
                      <div>
                        <div className="fw-bold text-dark text-truncate pe-3" style={{ fontSize: "0.85rem", lineHeight: "1.2" }} title={nombreProducto}>
                          {nombreProducto} 
                        </div>
                        <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                          Ref: {codigoProducto}
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-2">
                        {/* Selector de Cantidad */}
                        <div className="d-flex align-items-center border rounded-pill bg-light p-1">
                          <button
                            className="btn btn-sm border-0 rounded-circle p-0 d-flex align-items-center justify-content-center bg-transparent text-secondary hover-dark"
                            style={{ width: 24, height: 24, fontSize: "0.8rem" }}
                            onClick={() => cambiarCantidad(item.id, cantidadActual - 1)}
                          >
                            {cantidadActual === 1 ? (
                              <i className="bi bi-trash-fill text-danger" style={{ fontSize: '0.75rem' }}></i>
                            ) : (
                              "−"
                            )}
                          </button>
                          
                          <span className="fw-bold text-dark px-2 text-center" style={{ fontSize: "0.82rem", minWidth: 24 }}>
                            {cantidadActual}
                          </span>
                          
                          <button
                            className="btn btn-sm border-0 rounded-circle p-0 d-flex align-items-center justify-content-center bg-transparent text-secondary hover-dark"
                            style={{ width: 24, height: 24, fontSize: "0.8rem" }}
                            onClick={() => cambiarCantidad(item.id, cantidadActual + 1)}
                          >
                            +
                          </button>
                        </div>

                        {/* Precio Unitario / Formateado */}
                        <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                          ${(typeof precioOriginal === 'number' ? precioOriginal : parseInt(precioOriginal?.replace(/\D/g, "") || 0)).toLocaleString("es-CO")}
                        </div>
                      </div>
                    </div>

                    {/* Botón Eliminar Absoluto (X superior derecha) */}
                    <button
                      className="btn p-0 position-absolute"
                      style={{ top: "12px", right: "12px", color: "#ced4da", transition: "0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#dc3545"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#ced4da"}
                      onClick={() => eliminarDelCarrito(item.id)}
                      title="Eliminar producto"
                    >
                      <i className="bi bi-x-circle-fill" style={{ fontSize: "1rem" }}></i>
                    </button>
                    
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer: Totales y Botón de Acción */}
        {carrito.length > 0 && (
          <div className="p-4 border-top bg-white shadow-lg" style={{ zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold text-secondary" style={{ fontSize: "0.95rem" }}>Total estimado:</span>
              <span className="fw-extrabold text-dark fs-4" style={{ letterSpacing: "-0.5px" }}>
                ${total.toLocaleString("es-CO")} <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>COP</span>
              </span>
            </div>
            
            <button
              className="w-100 border-0 rounded-pill fw-bold py-3 text-white d-flex align-items-center justify-content-center gap-2"
              style={{ 
                background: "linear-gradient(135deg, #F5A623 0%, #E8941A 100%)", 
                fontSize: "1rem", 
                cursor: "pointer", 
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(245, 166, 35, 0.25)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 166, 35, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 166, 35, 0.25)";
              }}
              onClick={handleIrAlCheckout}
            >
              Proceder al Pago <i className="bi bi-arrow-right-short fs-5"></i>
            </button>

            <div className="text-center mt-2">
              <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                <i className="bi bi-shield-check text-success me-1"></i> Transacción segura y protegida
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Estilos CSS Embebidos del Componente */}
      <style>{`
        .hover-card { transition: all 0.2s ease-in-out; }
        .hover-card:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.04) !important; border-color: #dee2e6 !important; }
        .hover-dark:hover { color: #212529 !important; background-color: #e9ecef !important; }
        .fw-extrabold { font-weight: 800; }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-pulse { animation: pulse 2s infinite ease-in-out; }
      `}</style>
    </>
  );
}

export default CartPanel;