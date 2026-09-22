import { useState } from "react";

function ProductGallery({ imagenes = [], nombre }) {
  // Ordena las imágenes para que la principal aparezca primero por defecto
  const imagenesOrdenadas = [...imagenes].sort((a, b) => b.es_principal - a.es_principal);
  const [imagenActiva, setImagenActiva] = useState(imagenesOrdenadas[0]?.imagen_url || "");

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Contenedor Imagen Principal */}
      <div
        className="position-relative bg-white d-flex align-items-center justify-content-center overflow-hidden"
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "20px",
          border: "1px solid #E9ECEF",
          boxShadow: "0 10px 30px rgba(0,0,0,.04)"
        }}
      >
        <img
          src={imagenActiva}
          alt={nombre}
          fetchPriority="high" // 👈 CORREGIDO: Soluciona la advertencia de la consola de React y optimiza el SEO
          className="img-fluid h-100 object-fit-contain p-4"
        />
      </div>

      {/* Fila de Miniaturas */}
      <div className="d-flex gap-2 w-100 overflow-x-auto pb-2 mt-3 scrollbar-premium">
        {imagenesOrdenadas.map((img, index) => {
          // Generamos una key única robusta combinando id e índice por si el id falla o viene vacío
          const uniqueKey = img.id ? `${img.id}-${index}` : `img-${index}`;

          return (
            <button
              key={uniqueKey} // 👈 CORREGIDO: Soluciona el error "Each child in a list should have a unique 'key' prop"
              onClick={() => setImagenActiva(img.imagen_url)}
              className={`thumbnail-hover btn p-2 bg-white border ${imagenActiva === img.imagen_url ? "border-warning border-2" : "border-muted"}`}
              style={{
                width: "95px",
                height: "95px",
                borderRadius: "14px",
                flexShrink: 0,
                transition: ".3s"
              }}
              aria-label={`Ver miniatura ${index + 1}`}
              title={`Ver miniatura ${index + 1}`}
            >
              <img 
                src={img.imagen_url} 
                alt={`Miniatura de ${nombre}`} 
                width={80} 
                height={80} 
                loading="lazy" 
                decoding="async" 
                className="w-100 h-100 object-fit-contain" 
              />
            </button>
          );
        })}
      </div>

      <style>{`
        .transform-hover-zoom:hover {
          transform: scale(1.08);
          cursor: zoom-in;
        }
        .scrollbar-premium::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default ProductGallery;