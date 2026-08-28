import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../lib/client";

// ==========================================
// COMPONENTE: PASO 1 - DATOS DE ENVÍO
// ==========================================
function PasoDatos({ nombre, setNombre, direccion, setDireccion, ciudad, setCiudad, telefono, setTelefono, setPaso }) {
  return (
    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white animate-fade-in">
      <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
        <i className="bi bi-truck text-warning me-2 fs-4"></i> ¿A dónde enviamos tu pedido?
      </h5>
      <form onSubmit={(e) => { e.preventDefault(); setPaso(2); }}>
        <div className="row g-3">
          
          <div className="col-12 text-start">
            <label className="form-label-custom">Nombre completo de quien recibe</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-person"></i></span>
              <input type="text" className="form-control form-control-custom" placeholder="Ej. Juan Pérez" 
              value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
          </div>

          <div className="col-md-8 text-start">
            <label className="form-label-custom">Dirección de entrega</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-geo-alt"></i></span>
              <input type="text" className="form-control form-control-custom" placeholder="Calle 123 #45-67, Apto 101" 
              value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            </div>
          </div>

          <div className="col-md-4 text-start">
            <label className="form-label-custom">Ciudad</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-building"></i></span>
              <input type="text" className="form-control form-control-custom" placeholder="Ej. Bogotá" 
              value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
            </div>
          </div>

          <div className="col-12 text-start">
            <label className="form-label-custom">Teléfono de contacto / WhatsApp</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-telephone"></i></span>
              <input type="tel" className="form-control form-control-custom" placeholder="Ej. 300 123 4567" 
              value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
          </div>

        </div>
        <button type="submit" className="btn btn-dark w-100 mt-4 py-3 fw-bold rounded-pill shadow-sm btn-trans-custom">
          Continuar a Revisión <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </form>
    </div>
  );
}

// ==========================================
// COMPONENTE: PASO 2 - REVISIÓN Y CONFIRMACIÓN
// ==========================================
function PasoConfirmar({ carrito, direccion, ciudad, nombre, setPaso }) {
  return (
    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white animate-fade-in">
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
        <button className="btn btn-sm btn-light rounded-circle me-3 border px-2 py-1" onClick={() => setPaso(1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="fw-bold mb-0 text-dark">Revisa y confirma tu compra</h5>
      </div>
      
      <div className="bg-light-subtle border p-3 rounded-3 mb-4 text-start shadow-inner-custom">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-dark fs-6"><i className="bi bi-geo-alt-fill text-danger me-2"></i>Envío a domicilio</span>
          <button className="btn btn-sm btn-link text-warning fw-bold text-decoration-none p-0" onClick={() => setPaso(1)}>Modificar</button>
        </div>
        <p className="small text-secondary mb-1 fw-medium"><span className="text-dark">Destinatario:</span> {nombre}</p>
        <p className="small text-secondary mb-0 fw-medium"><span className="text-dark">Destino:</span> {direccion}, {ciudad}</p>
      </div>

      <div className="text-start mb-4">
        <h6 className="fw-bold text-dark mb-3">Productos en esta orden</h6>
        <div className="contenedor-productos-checkout px-1">
          {carrito.map(item => (
            <div key={item.id} className="d-flex gap-3 py-3 border-bottom border-light align-items-center item-checkout-lista">
               <div className="bg-light rounded-3 p-2 text-center border d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-box-seam text-secondary fs-4"></i>
               </div>
               <div className="flex-grow-1 min-w-0">
                  <p className="mb-0 small fw-bold text-dark text-truncate">{item.nombre}</p>
                  <p className="mb-0 text-muted extra-small-text mt-1">
                    Cantidad: <span className="text-dark fw-bold">{item.cantidad}</span> &bull; Valor Unitario: <span className="text-dark">${Number(item.precio || 0).toLocaleString("es-CO")}</span>
                  </p>
               </div>
               <div className="text-end ps-2">
                 <span className="fw-bold text-dark small">${(Number(item.precio || 0) * item.cantidad).toLocaleString("es-CO")}</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setPaso(3)} className="btn w-100 py-3 text-dark fw-bold rounded-pill shadow-sm text-uppercase font-letter-spacing" style={{background: "#FFC107"}}>
        Proceder al Pago <i className="bi bi-credit-card ms-2"></i>
      </button>
    </div>
  );
}

// ==========================================
// COMPONENTE: PASO 3 - PASARELA DE PAGO SIMULADA
// ==========================================
function PasoPago({ onPagoFinalizado, setPaso }) {
  return (
    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white animate-fade-in">
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
        <button className="btn btn-sm btn-light rounded-circle me-3 border px-2 py-1" onClick={() => onPagoFinalizado(false)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="fw-bold mb-0 text-dark">Método de pago electrónico</h5>
      </div>

      <div className="tarjeta-credito-simulada mb-4 text-white p-3 rounded-4 d-flex flex-column justify-content-between shadow">
        <div className="d-flex justify-content-between align-items-center">
          <i className="bi bi-cpu fs-3 text-warning"></i>
          <span className="small fw-bold tracking-wider italic text-white-50">CARD PLATINUM</span>
        </div>
        <div className="fs-5 tracking-widest my-2 text-start font-monospace">•••• •••• •••• ••••</div>
        <div className="d-flex justify-content-between text-start small mt-2">
          <div>
            <div className="extra-small-text text-white-50">TARJETAHABIENTE</div>
            <div className="fw-bold text-uppercase small">Titular de Cuenta</div>
          </div>
          <div>
            <div className="extra-small-text text-white-50">VENCE</div>
            <div className="fw-bold small">MM/AA</div>
          </div>
        </div>
      </div>

      <div className="alert alert-dark-subtle border-0 text-start small py-2.5 px-3 rounded-3 mb-4 text-dark d-flex align-items-center">
        <i className="bi bi-shield-check-fill text-success fs-5 me-2"></i> 
        <span>Ambiente seguro cifrado SSL de prueba de 256 bits.</span>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onPagoFinalizado(true); }}>
        <div className="text-start mb-3">
          <label className="form-label-custom">Número de la tarjeta</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-credit-card-2-front"></i></span>
            <input type="text" className="form-control form-control-custom" placeholder="0000 0000 0000 0000" maxLength="19" required />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-7 text-start">
            <label className="form-label-custom">Fecha de Expiración</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-calendar-event"></i></span>
              <input type="text" className="form-control form-control-custom" placeholder="MM/AA" maxLength="5" required />
            </div>
          </div>
          <div className="col-5 text-start">
            <label className="form-label-custom">Código (CVC)</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
              <input type="text" className="form-control form-control-custom" placeholder="123" maxLength="4" required />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm text-uppercase">
          <i className="bi bi-lock-fill me-2"></i> Pagar y Finalizar Orden
        </button>
      </form>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL: CHECKOUT PAGE
// ==========================================
function CheckoutPage({ carrito, setVista, vaciarCarrito }) {
  const [paso, setPaso] = useState(1);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");

  const subtotal = carrito.reduce((acc, item) => acc + (Number(item.precio || 0) * item.cantidad), 0);
  const envio = 15000; 
  const total = subtotal + envio;

  // ==========================================
  // FUNCIÓN CORREGIDA - USANDO BACKEND API
  // ==========================================
  const procesarTransaccionFinal = async () => {
    Swal.fire({ 
      title: 'Validando Transacción...', 
      text: 'Guardando registro seguro en el servidor',
      allowOutsideClick: false, 
      confirmButtonColor: '#212529',
      didOpen: () => Swal.showLoading() 
    });

    try {
      // 1. Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Debes iniciar sesión para realizar una compra");
      }

      // 2. Obtener el ID del usuario desde la tabla 'usuario' (no el auth UUID)
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuario')
        .select('id')
        .eq('auth_id', user.id) // Asumiendo que tienes una columna auth_id
        .single();

      if (usuarioError || !usuarioData) {
        throw new Error("Usuario no encontrado en la base de datos");
      }

      const usuarioId = usuarioData.id; // Este es un INTEGER, no un UUID

      // 3. Preparar los productos para el backend
      const productosPayload = carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio: Number(item.precio || 0)
      }));

      // 4. Llamar al backend para crear la orden
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          cliente_nombre: nombre,
          cliente_direccion: direccion,
          cliente_ciudad: ciudad,
          cliente_telefono: telefono,
          productos: productosPayload,
          total: total,
          metodo_pago: 'Tarjeta Crédito',
          costo_envio: envio
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden');
      }

      console.log("Orden creada exitosamente:", data);

      // 5. Vaciar el carrito después de la compra exitosa
      vaciarCarrito();

      Swal.close();
      setPaso(4);

    } catch (err) {
      console.error("Error crítico guardando pedido:", err);
      
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: err.message || 'No pudimos registrar tu orden en el servidor. Por favor, intenta de nuevo.',
        confirmButtonColor: '#212529'
      });
    }
  };

  const manejarCancelar = () => {
    Swal.fire({
      title: '¿Deseas cancelar la compra?',
      text: "Se perderá el progreso de tus datos de envío.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar orden',
      cancelButtonText: 'Continuar comprando',
      customClass: {
        confirmButton: "rounded-pill px-4 fw-bold",
        cancelButton: "rounded-pill px-4 fw-bold"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setVista("productos");
      }
    });
  };

  // PANTALLA DE ÉXITO
  if (paso === 4) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center py-5 bootstrap-styles-fix text-center animate-fade-in">
        <div className="container">
          <div className="card border-0 shadow-sm p-5 rounded-4 bg-white mx-auto" style={{ maxWidth: '600px' }}>
            <div className="circulo-exito-animado mx-auto mb-4">
              <i className="bi bi-check2-all text-white fs-1"></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">¡Pedido Procesado con Éxito!</h2>
            <p className="text-secondary mb-4 fs-6">
              Tu solicitud para <strong>A&L Compresores</strong> ha sido enviada al departamento de despacho. Un asesor comercial te contactará vía WhatsApp.
            </p>
            <div className="bg-light p-3 rounded-3 text-start mb-4 small border">
              <div className="mb-1 text-muted"><span className="fw-bold text-dark">Destinatario:</span> {nombre}</div>
              <div className="mb-1 text-muted"><span className="fw-bold text-dark">Lugar de Despacho:</span> {direccion}, {ciudad}</div>
              <div className="text-muted"><span className="fw-bold text-dark">Total Pagado:</span> ${total.toLocaleString("es-CO")} COP</div>
            </div>
            <button className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow-sm text-dark" onClick={() => { setVista("productos"); }}>
              <i className="bi bi-house-door me-2"></i> Volver a la Tienda Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-3 py-md-5 font-checkout-global">
      <div className="container" style={{ paddingTop: '20px' }}>
        
        <div className="row justify-content-center mb-4 mb-md-5">
          <div className="col-md-8 col-lg-6">
            <div className="stepper-contenedor d-flex justify-content-between position-relative">
              <div className="stepper-linea-progreso" style={{ width: paso === 1 ? '0%' : paso === 2 ? '50%' : '100%' }}></div>
              
              <div className="step-item d-flex flex-column align-items-center position-relative">
                <div className={`step-bubble ${paso === 1 ? 'active' : 'completed'}`}>
                  {paso > 1 ? <i className="bi bi-check-lg text-white"></i> : "1"}
                </div>
                <span className={`step-text mt-2 small fw-bold ${paso >= 1 ? 'text-dark' : 'text-muted'}`}>Despacho</span>
              </div>

              <div className="step-item d-flex flex-column align-items-center position-relative">
                <div className={`step-bubble ${paso === 2 ? 'active' : paso > 2 ? 'completed' : ''}`}>
                  {paso > 2 ? <i className="bi bi-check-lg text-white"></i> : "2"}
                </div>
                <span className={`step-text mt-2 small fw-bold ${paso >= 2 ? 'text-dark' : 'text-muted'}`}>Revisión</span>
              </div>

              <div className="step-item d-flex flex-column align-items-center position-relative">
                <div className={`step-bubble ${paso === 3 ? 'active' : ''}`}>3</div>
                <span className={`step-text mt-2 small fw-bold ${paso >= 3 ? 'text-dark' : 'text-muted'}`}>Pago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 justify-content-center align-items-start">
          
          <div className="col-lg-7">
            {paso === 1 && (
              <PasoDatos
                nombre={nombre} setNombre={setNombre}
                direccion={direccion} setDireccion={setDireccion}
                ciudad={ciudad} setCiudad={setCiudad}
                telefono={telefono} setTelefono={setTelefono}
                setPaso={setPaso}
              />
            )}
            {paso === 2 && (
              <PasoConfirmar
                carrito={carrito} direccion={direccion}
                ciudad={ciudad} nombre={nombre} setPaso={setPaso}
              />
            )}
            {paso === 3 && (
              <PasoPago
                setPaso={setPaso}
                onPagoFinalizado={(finalizado) => {
                  if (finalizado) {
                    procesarTransaccionFinal();
                  } else {
                    setPaso(2);
                  }
                }}
              />
            )}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-md-top" style={{ top: '110px', zIndex: '10' }}>
              <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom d-flex justify-content-between align-items-center">
                <span>Resumen de compra</span>
                <span className="badge bg-dark rounded-pill fw-medium px-2.5 py-1" style={{ fontSize: '0.75rem' }}>{carrito.length} Ítems</span>
              </h6>
              
              <div className="d-flex justify-content-between mb-2.5 small text-secondary fw-medium">
                 <span>Subtotal productos</span>
                 <span className="text-dark fw-bold">${subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-secondary fw-medium">
                 <span>Costo de flete/envío</span>
                 <span className="text-success fw-bold">${envio.toLocaleString("es-CO")}</span>
              </div>
              <hr className="my-3 text-muted opacity-25" />
              <div className="d-flex justify-content-between fs-5 fw-bold mb-4 text-dark align-items-center">
                 <span>Total final</span>
                 <span className="fs-4 fw-black text-dark">${total.toLocaleString("es-CO")} <span className="small text-muted fw-normal" style={{ fontSize: '0.75rem' }}>COP</span></span>
              </div>

              <div className="pt-2 d-flex flex-column gap-2">
                <button 
                  onClick={() => setVista("productos")} 
                  className="btn btn-outline-dark w-100 rounded-pill py-2.5 small fw-bold d-flex align-items-center justify-content-center transition-all"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-chevron-left me-2"></i> Seguir Comprando
                </button>
                
                <button 
                  onClick={manejarCancelar} 
                  className="btn btn-link text-danger w-100 text-decoration-none small py-1 mt-1 fw-bold opacity-75 custom-hover-red-text"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-x-circle me-1.5"></i> Cancelar la orden completa
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .font-checkout-global {
          letter-spacing: -0.1px;
        }
        .form-label-custom {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #6C757D;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          display: block;
        }
        .form-control-custom {
          border-left: none !important;
          border-radius: 0 12px 12px 0 !important;
          font-size: 0.95rem;
          padding: 11px 14px;
          border-color: #dee2e6 !important;
        }
        .form-control-custom:focus {
          box-shadow: none !important;
          border-color: #FFC107 !important;
        }
        .form-control-custom:focus + .input-group-text,
        .input-group:focus-within .input-group-text {
          border-color: #FFC107 !important;
        }
        .input-group-text {
          border-radius: 12px 0 0 12px !important;
          border-color: #dee2e6 !important;
          padding-left: 15px;
          padding-right: 5px;
        }
        
        .stepper-contenedor {
          padding-bottom: 10px;
        }
        .stepper-contenedor::before {
          content: "";
          position: absolute;
          top: 18px;
          left: 0;
          right: 0;
          height: 3px;
          background-color: #E2E8F0;
          z-index: 1;
        }
        .stepper-linea-progreso {
          position: absolute;
          top: 18px;
          left: 0;
          height: 3px;
          background-color: #212529;
          z-index: 2;
          transition: width 0.4s ease;
        }
        .step-item {
          z-index: 3;
        }
        .step-bubble {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #FFF;
          border: 3px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #64748B;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .step-bubble.active {
          border-color: #FFC107;
          background-color: #FFF;
          color: #212529;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.15);
          transform: scale(1.08);
        }
        .step-bubble.completed {
          border-color: #212529;
          background-color: #212529;
          color: #FFF;
        }
        .step-text {
          font-size: 0.78rem;
          letter-spacing: 0.2px;
        }

        .contenedor-productos-checkout {
          max-height: 280px;
          overflow-y: auto;
        }
        .extra-small-text {
          font-size: 0.78rem;
        }
        .font-letter-spacing {
          letter-spacing: 0.5px;
        }
        .shadow-inner-custom {
          background-color: #F8F9FA;
          border-color: #E9ECEF !important;
        }
        .item-checkout-lista:last-child {
          border-bottom: none !important;
        }

        .tarjeta-credito-simulada {
          background: linear-gradient(135deg, #10142D 0%, #293064 100%);
          min-height: 165px;
        }
        .tracking-wider { letter-spacing: 1.5px; }
        .tracking-widest { letter-spacing: 4px; }
        .extra-small-text { font-size: 0.65rem; }

        .circulo-exito-animado {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(40, 167, 69, 0.25);
        }

        .animate-fade-in {
          animation: fadeInFrame 0.35s ease-out forwards;
        }
        @keyframes fadeInFrame {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-trans-custom:hover {
          transform: translateY(-1px);
        }
        .custom-hover-red-text:hover {
          color: #bd2130 !important;
        }
      `}</style>
    </div>
  );
}

export default CheckoutPage;