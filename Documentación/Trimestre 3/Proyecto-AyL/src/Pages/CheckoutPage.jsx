import { useState } from "react";
import Swal from "sweetalert2";

function CheckoutPage({ carrito, setVista, vaciarCarrito }) {
  const [paso, setPaso] = useState(1); // 1: Datos, 2: Confirmar, 3: Pago, 4: Éxito

  const formatearPrecio = (str) => parseInt(str.replace(/\D/g, ""), 10);
  const subtotal = carrito.reduce((acc, item) => acc + (formatearPrecio(item.precio) * item.cantidad), 0);
  const envio = 15000; // Costo de envío simulado
  const total = subtotal + envio;

  // --- COMPONENTES DE PASOS ---

  // PASO 1: DATOS DE ENVÍO
  const PasoDatos = () => (
    <div className="card border-0 shadow-sm p-4 rounded-4">
      <h5 className="fw-bold mb-4">¿A dónde enviamos tu pedido?</h5>
      <div className="row g-3">
        <div className="col-12 text-start">
          <label className="small fw-bold text-muted text-uppercase">Nombre completo</label>
          <input type="text" className="form-control" placeholder="Juan Pérez" />
        </div>
        <div className="col-md-8 text-start">
          <label className="small fw-bold text-muted text-uppercase">Dirección</label>
          <input type="text" className="form-control" placeholder="Calle 123 #45-67" />
        </div>
        <div className="col-md-4 text-start">
          <label className="small fw-bold text-muted text-uppercase">Ciudad</label>
          <input type="text" className="form-control" placeholder="Bogotá" />
        </div>
        <div className="col-12 text-start">
          <label className="small fw-bold text-muted text-uppercase">Teléfono de contacto</label>
          <input type="tel" className="form-control" placeholder="300 123 4567" />
        </div>
      </div>
      <button onClick={() => setPaso(2)} className="btn btn-dark w-100 mt-4 py-3 fw-bold">Continuar</button>
    </div>
  );

  // PASO 2: CONFIRMAR (ESTILO MERCADO LIBRE)
  const PasoConfirmar = () => (
    <div className="card border-0 shadow-sm p-4 rounded-4">
      <h5 className="fw-bold mb-4">Revisa y confirma tu compra</h5>
      <div className="bg-light p-3 rounded-3 mb-4 text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold"><i className="bi bi-geo-alt me-2"></i>Envío a domicilio</span>
          <button className="btn btn-sm btn-link text-primary p-0" onClick={() => setPaso(1)}>Editar</button>
        </div>
        <p className="small text-muted mb-0">Calle 123 #45-67, Bogotá - Julian</p>
      </div>

      <div className="text-start mb-4">
        <h6 className="fw-bold border-bottom pb-2">Productos</h6>
        {carrito.map(item => (
          <div key={item.id} className="d-flex gap-3 py-2 border-bottom border-light">
             <div className="bg-white border rounded p-1" style={{fontSize: '1.5rem'}}>{item.emoji}</div>
             <div className="flex-grow-1">
                <p className="mb-0 small fw-bold">{item.nombre}</p>
                <p className="mb-0 small text-muted">{item.cantidad} unidad(es) x {item.precio}</p>
             </div>
          </div>
        ))}
      </div>

      <button onClick={() => setPaso(3)} className="btn w-100 py-3 text-white fw-bold" style={{background: "#F5A623"}}>Confirmar y pagar</button>
    </div>
  );

  // PASO 3: PASARELA DE PAGO
  const PasoPago = () => (
    <div className="card border-0 shadow-sm p-4 rounded-4">
      <h5 className="fw-bold mb-4">Método de pago</h5>
      <div className="alert alert-warning small py-2">
        <i className="bi bi-shield-check me-2"></i> Transacción segura encriptada
      </div>
      <input type="text" className="form-control mb-3" placeholder="0000 0000 0000 0000" />
      <div className="row g-2 mb-3">
        <div className="col-8"><input type="text" className="form-control" placeholder="MM/AA" /></div>
        <div className="col-4"><input type="text" className="form-control" placeholder="CVC" /></div>
      </div>
      <button onClick={() => {
         Swal.fire({ title: 'Validando pago...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
         setTimeout(() => { Swal.close(); setPaso(4); }, 2000);
      }} className="btn btn-dark w-100 py-3 fw-bold">Finalizar Pago</button>
    </div>
  );

  // PASO 4: ÉXITO
  if (paso === 4) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="display-1 text-success mb-3"><i className="bi bi-bag-check-fill"></i></div>
        <h2 className="fw-bold">¡Gracias por tu compra!</h2>
        <p className="text-muted">Tu pedido para <strong>A&L Compresores</strong> está en camino.</p>
        <button className="btn btn-warning mt-4 px-5 fw-bold" onClick={() => { vaciarCarrito(); setVista("productos"); }}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-5">
      <div className="container">
        {/* Barra de progreso */}
        <div className="d-flex justify-content-center gap-4 mb-5">
          <span className={`small fw-bold ${paso >= 1 ? 'text-dark' : 'text-muted'}`}>1. Datos</span>
          <span className="text-muted">→</span>
          <span className={`small fw-bold ${paso >= 2 ? 'text-dark' : 'text-muted'}`}>2. Revisión</span>
          <span className="text-muted">→</span>
          <span className={`small fw-bold ${paso >= 3 ? 'text-dark' : 'text-muted'}`}>3. Pago</span>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-lg-6">
            {paso === 1 && <PasoDatos />}
            {paso === 2 && <PasoConfirmar />}
            {paso === 3 && <PasoPago />}
          </div>

          {/* Resumen lateral fijo (estilo ML) */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-light">
              <h6 className="fw-bold mb-4">Resumen de compra</h6>
              <div className="d-flex justify-content-between mb-2 small text-muted">
                 <span>Productos ({carrito.length})</span>
                 <span>${subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-muted">
                 <span>Envío</span>
                 <span className="text-success fw-bold">${envio.toLocaleString("es-CO")}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold mb-0">
                 <span>Total</span>
                 <span>${total.toLocaleString("es-CO")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;