import { useState } from "react";
import { optimizarUrlCloudinary } from "./catalogUtils";

export default function MiniCarruselCatalog({ imagenes = [], nombreProducto }) {
  const [indexActual, setIndexActual] = useState(0);
  const imgUrl = optimizarUrlCloudinary(
    imagenes[indexActual]?.imagen_url || "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1780240514/IMG_Productos.webp", 
    { width: 500 }
  );

  const anteriorImagen = (e) => {
    e.stopPropagation();
    setIndexActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const gSiguienteImagen = (e) => {
    e.stopPropagation();
    setIndexActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="position-relative overflow-hidden group-carrusel" style={{ height: "180px", backgroundColor: "#fff" }}>
      <div className="p-3 text-center bg-white d-flex align-items-center justify-content-center h-100">
        <img
          src={imgUrl}
          className="img-fluid h-100 object-fit-contain"
          alt={`${nombreProducto} - vista ${indexActual + 1}`}
          loading="lazy"
          onMouseEnter={() => {
            if (imagenes.length > 1) {
              const nextIdx = (indexActual + 1) % imagenes.length;
              const img = new Image();
              img.src = optimizarUrlCloudinary(imagenes[nextIdx]?.imagen_url, { width: 500 });
            }
          }}
        />
      </div>

      {imagenes.length > 1 && (
        <>
          <button
            onClick={anteriorImagen}
            className="btn-carrusel-nav position-absolute start-0 top-50 translate-middle-y ms-2"
            type="button"
            aria-label="Imagen anterior"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            onClick={gSiguienteImagen}
            className="btn-carrusel-nav position-absolute end-0 top-50 translate-middle-y me-2"
            type="button"
            aria-label="Siguiente imagen"
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1 bg-dark bg-opacity-25 rounded-pill px-2 py-1">
            {imagenes.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => { e.stopPropagation(); setIndexActual(idx); }}
                className="rounded-circle cursor-pointer"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: idx === indexActual ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                  transition: "0.2s"
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}