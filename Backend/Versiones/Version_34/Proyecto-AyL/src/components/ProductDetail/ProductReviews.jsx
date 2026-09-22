import { useState, useEffect } from "react";
import { supabase } from "../../lib/client";
import Swal from "sweetalert2";

function ProductReviews({ productoId, usuario }) {
  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para el formulario de nueva reseña
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  // 1. Cargar reseñas desde Supabase
  useEffect(() => {
    if (!productoId) return;

    async function cargarReseñas() {
      try {
        const { data, error } = await supabase
          .from("resenas_producto")
          .select("*")
          .eq("id_producto", productoId)
          .order("creado_el", { ascending: false });

        if (error) throw error;
        setReseñas(data || []);
      } catch (error) {
        console.error("Error al cargar opiniones:", error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarReseñas();
  }, [productoId]);

  // 2. Enviar nueva reseña
  const handleSubmitReseña = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    if (!comentario.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Comentario vacío",
        text: "Por favor, escribe una breve opinión sobre el producto.",
        confirmButtonColor: "#10142D"
      });
      return;
    }

    setEnviando(true);

    try {
      // Obtenemos la sesión actual de Auth Supabase para el id_usuario
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Sesión expirada. Por favor vuelve a iniciar sesión.");
      }

      const nuevaReseña = {
        id_producto: productoId,
        id_usuario: session.user.id,
        usuario: usuario.usuario || usuario.email?.split("@")[0] || "Comprador",
        calificacion: calificacion,
        comentario: comentario.trim()
      };

      const { data, error } = await supabase
        .from("resenas_producto")
        .insert([nuevaReseña])
        .select()
        .single();

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "¡Reseña publicada!",
        text: "Tu opinión ayuda a otros compradores de la comunidad.",
        confirmButtonColor: "#10142D"
      });

      // Actualizar la lista en pantalla inmediatamente
      setReseñas([data, ...reseñas]);
      setComentario("");
      setCalificacion(5);
    } catch (error) {
      console.error("Error al guardar reseña:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error al publicar",
        text: error.message,
        confirmButtonColor: "#10142D"
      });
    } finally {
      setEnviando(false);
    }
  };

  // Helper para renderizar estrellas fijas
  const renderEstrellas = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi ${i < count ? "bi-star-fill text-warning" : "bi-star text-muted"} me-1`}
      ></i>
    ));
  };

  // Calcular promedio de calificación
  const promedio = reseñas.length > 0 
    ? (reseñas.reduce((acc, r) => acc + r.calificacion, 0) / reseñas.length).toFixed(1) 
    : 0;

  return (
    <div className="bg-white p-4 p-md-5 rounded-4 border border-light-subtle shadow-sm">
      <div className="row g-4">
        
        {/* PANEL IZQUIERDO: Resumen de Calificaciones */}
        <div className="col-lg-4 border-end border-light-subtle pe-lg-4 text-center text-lg-start">
          <h5 className="fw-bold text-dark mb-3">Resumen de opiniones</h5>
          {reseñas.length > 0 ? (
            <div>
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3">
                <span className="display-4 fw-black text-dark">{promedio}</span>
                <div>
                  <div className="fs-5">{renderEstrellas(Math.round(promedio))}</div>
                  <small className="text-secondary">{reseñas.length} {reseñas.length === 1 ? "opinión" : "opiniones"}</small>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary small">Este artículo aún no tiene valoraciones. ¡Sé el primero en calificarlo!</p>
          )}

          {/* Formulario / Bloque de autenticación */}
          <div className="mt-4 pt-4 border-top border-light-subtle">
            {usuario ? (
              <form onSubmit={handleSubmitReseña} className="p-3 bg-light rounded-4 border">
                <h6 className="fw-bold mb-3 text-dark">Deja tu opinión</h6>
                
                {/* Selector de estrellas interactivo */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary d-block">Calificación:</label>
                  <div className="fs-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <i
                        key={num}
                        className={`bi ${num <= calificacion ? "bi-star-fill text-warning" : "bi-star text-muted"} me-2`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setCalificacion(num)}
                      ></i>
                    ))}
                  </div>
                </div>

                {/* Caja de Comentario */}
                <div className="mb-3">
                  <label htmlFor="txtComentario" className="form-label small fw-semibold text-secondary">Tu comentario técnico:</label>
                  <textarea
                    id="txtComentario"
                    className="form-control form-control-sm rounded-3"
                    rows="3"
                    placeholder="¿Qué tal te pareció el rendimiento, material o compatibilidad?..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    maxLength={500}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-warning btn-sm w-100 rounded-pill fw-bold"
                  disabled={enviando}
                >
                  {enviando ? "Publicando..." : "Enviar opinión"}
                </button>
              </form>
            ) : (
              <div className="p-3 bg-light rounded-4 text-center border">
                <i className="bi bi-lock fs-4 text-secondary mb-2 d-block"></i>
                <p className="small text-secondary mb-0">
                  Para calificar o dejar una reseña técnica sobre repuestos, debes tener una cuenta activa.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: Listado de Comentarios */}
        <div className="col-lg-8 ps-lg-4">
          <h5 className="fw-bold text-dark mb-4">Comentarios más recientes</h5>

          {cargando ? (
            <div className="text-center py-4">
              <div className="spinner-border text-warning spinner-border-sm" role="status"></div>
              <span className="ms-2 small text-secondary">Cargando opiniones...</span>
            </div>
          ) : reseñas.length === 0 ? (
            <div className="text-center py-5 border border-dashed rounded-4 bg-light-subtle">
              <i className="bi bi-chat-left-dots fs-3 text-muted mb-2 d-block"></i>
              <p className="small text-secondary mb-0">No hay comentarios escritos para este artículo.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3 dynamic-reviews-scroll" style={{ maxHeight: "450px", overflowY: "auto", paddingRight: "5px" }}>
              {reseñas.map((r) => (
                <div key={r.id} className="p-3 bg-white border border-light-subtle rounded-4 shadow-2xs">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold small text-dark text-capitalize">
                      <i className="bi bi-person-circle me-2 text-secondary"></i>{r.usuario}
                    </span>
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {new Date(r.creado_el).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                    </small>
                  </div>
                  <div className="mb-2" style={{ fontSize: "0.85rem" }}>
                    {renderEstrellas(r.calificacion)}
                  </div>
                  <p className="text-secondary small mb-0 lh-base" style={{ whiteSpace: "pre-wrap" }}>
                    {r.comentario}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductReviews;