import { useEffect, useState } from "react";
import { supabase } from "../../lib/client";
import { optimizarUrlCloudinary } from "../../lib/utils";

function SimilarProducts({ categoria, marca, idActual, setVista, setProductoSeleccionadoId }) {
  const [productosSimilares, setProductosSimilares] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarSimilares() {
      setCargando(true);
      try {
        // Hacemos una consulta base
        let query = supabase.from("productos").select("*").eq("suspendido", 0);

        // Si tu tabla maneja categorías, filtramos por ella. Si no, usamos la marca.
        if (categoria) {
          query = query.eq("categoria", categoria);
        } else if (marca) {
          query = query.eq("marca", marca);
        }

        // Traemos un límite de 5 para armar una fila estética
        const { data, error } = await query.limit(5);

        if (error) throw error;

        // Filtramos en memoria para descartar el producto que se está detallando actualmente
        const filtrados = (data || []).filter((p) => p.id !== idActual);
        setProductosSimilares(filtrados);
      } catch (error) {
        console.error("Error al cargar productos similares:", error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarSimilares();
  }, [categoria, marca, idActual]);

  // Manejador para saltar suavemente a otro producto y actualizar localStorage
  const handleVerProducto = (id) => {
    localStorage.setItem("al_producto_seleccionado_id", id);
    if (setProductoSeleccionadoId) {
      setProductoSeleccionadoId(id);
    }
    // Forzamos un pequeño scroll al inicio de la página para que el usuario vea el nuevo detalle desde arriba
    window.scrollTo({ top: 0, behavior: "smooth" });
    setVista("producto-detalle");
  };

  if (cargando) {
    return (
      <div className="text-center py-4 bg-white rounded-4 border border-light-subtle">
        <div className="spinner-border text-warning spinner-border-sm" role="status"></div>
        <span className="ms-2 small text-secondary">Buscando artículos relacionados...</span>
      </div>
    );
  }

  if (productosSimilares.length === 0) {
    return (
      <div className="bg-white p-4 rounded-4 border border-light-subtle text-center text-muted">
        <p className="mb-0 small">No encontramos otros artículos disponibles en esta misma categoría por el momento.</p>
      </div>
    );
  }

  return (
    <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
      {productosSimilares.map((prod) => {
        const urlImagen = optimizarUrlCloudinary(prod.imagen_url || "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777133787/placeholder-industrial.png");
        
        return (
          <div className="col" key={prod.id}>
            <div 
              className="card h-100 border border-light-subtle rounded-4 shadow-2xs card-similar-custom"
              style={{ cursor: "pointer", transition: ".2s" }}
              onClick={() => handleVerProducto(prod.id)}
            >
              {/* Contenedor Imagen */}
              <div className="d-flex align-items-center justify-content-center p-3 bg-white rounded-top-4" style={{ height: "160px" }}>
                <img 
                  src={urlImagen} 
                  alt={prod.nombre} 
                  className="img-fluid h-100 object-fit-contain"
                  loading="lazy"
                />
              </div>

              {/* Cuerpo de la Tarjeta */}
              <div className="card-body d-flex flex-column justify-content-between p-3 bg-light-subtle rounded-bottom-4">
                <div>
                  <span className="badge bg-secondary-subtle text-secondary px-2 py-1 rounded-pill mb-2" style={{ fontSize: "0.7rem" }}>
                    {prod.marca || "Industrial"}
                  </span>
                  <h6 className="card-title text-dark text-truncate-2l small fw-bold mb-2" style={{ height: "38px", overflow: "hidden" }}>
                    {prod.nombre}
                  </h6>
                </div>
                
                <div className="mt-2 pt-2 border-top border-light">
                  <span className="fw-black text-dark small">
                    {prod.precio ? `$${Number(prod.precio).toLocaleString()}` : "Consultar precio"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .text-truncate-2l {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .card-similar-custom:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.06) !important;
          border-color: #ffc107 !important;
        }
      `}</style>
    </div>
  );
}

export default SimilarProducts;