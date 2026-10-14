import React from "react";

// Reutilizamos la lógica de imágenes (puedes mover obtenerImagen a un archivo utils si prefieres)
import imgHerramienta from "../assets/imgProductos/herramienta.jpg";
// ... (importa todas tus imágenes igual que en Productos.jsx)

const obtenerImagen = (nombre) => {
  // ... (copia aquí la función obtenerImagen que ya tienes en Productos.jsx)
  return imgHerramienta; // placeholder simplificado
};

const DetalleProducto = ({ producto: p, setVista, agregarAlCarrito }) => {
  
  if (!p) {
    return (
      <div className="container py-5 text-center">
        <button className="btn btn-dark" onClick={() => setVista("productos")}>Volver</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <style>{`
        .img-detalle-box { background: #f8f9fa; border-radius: 20px; padding: 30px; text-align: center; }
        .precio-tag { color: #28a745; font-size: 2.5rem; font-weight: 800; }
        .btn-falabella { border-radius: 50px; padding: 12px 25px; font-weight: bold; text-transform: uppercase; }
      `}</style>

      {/* Botón Volver */}
      <button 
        className="btn btn-link text-dark text-decoration-none fw-bold mb-4" 
        onClick={() => setVista("productos")}
      >
        <i className="bi bi-arrow-left me-2"></i> VOLVER AL CATÁLOGO
      </button>

      <div className="row g-5">
        {/* Lado Izquierdo: Imagen */}
        <div className="col-md-6">
          <div className="img-detalle-box shadow-sm">
            <img 
              src={obtenerImagen(p.Nombre)} 
              alt={p.Nombre} 
              className="img-fluid" 
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Lado Derecho: Info */}
        <div className="col-md-6">
          <span className="text-muted text-uppercase small fw-bold">A&L Compresores e Industrial</span>
          <h1 className="fw-bold display-5 mb-3">{p.Nombre}</h1>
          
          <div className="d-flex align-items-center mb-3">
             <div className="text-warning me-2">
                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-half"></i>
             </div>
             <span className="text-muted small">(4.5) - 24 vendidos</span>
          </div>

          <hr />

          <div className="my-4">
            <h2 className="precio-tag mb-1">$ {p.Precio.toLocaleString()}</h2>
            <p className="text-success small fw-bold">Paga en cuotas sin interés con tarjetas bancarias</p>
          </div>

          <div className="bg-light p-3 rounded-3 mb-4">
            <p className="mb-1"><strong>Disponibilidad:</strong> {p.Cantidad > 0 ? 'En Stock' : 'Agotado'}</p>
            <p className="mb-0 text-muted small">Retiro gratis en tienda o envío express disponible.</p>
          </div>

          <div className="d-grid gap-2">
            <button 
              className="btn btn-dark btn-falabella" 
              onClick={() => agregarAlCarrito(p)}
            >
              Agregar al carrito
            </button>
            <button className="btn btn-outline-dark btn-falabella">
              Comprar ahora
            </button>
          </div>

          <div className="mt-5">
            <h5 className="fw-bold border-bottom pb-2">Descripción del Producto</h5>
            <p className="text-muted">
              Repuesto original garantizado para compresores industriales. 
              Fabricado con materiales de alta resistencia para asegurar el óptimo 
              funcionamiento de su maquinaria A&L.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;