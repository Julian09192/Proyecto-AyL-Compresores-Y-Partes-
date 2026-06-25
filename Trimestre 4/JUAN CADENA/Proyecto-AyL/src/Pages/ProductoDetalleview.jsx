import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../lib/client";

// Componentes Layout Globales
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/Login/LoginModal";
import SkeletonLoader from "../components/UI/SkeletonLoader";

// Componentes del Módulo ProductDetail
import ProductGallery from "../components/ProductDetail/ProductGallery";
import ProductInfo from "../components/ProductDetail/ProductInfo";
import TechnicalSheet from "../components/ProductDetail/TechnicalSheet";
import ActionButtons from "../components/ProductDetail/ActionButtons";
import ProductReviews from "../components/ProductDetail/ProductReviews";
import SimilarProducts from "../components/ProductDetail/SimilarProducts";


// Helpers y Datos Estáticos
import { optimizarUrlCloudinary, BENEFICIOS_DETALLE } from "../lib/utils";

function ProductoDetalleview({
  productoId,
  setVista,
  login,
  usuario,
  totalItems,
  setCartOpen,
  onOpenLogin,
  agregarAlCarrito,
  setProductoSeleccionadoId
}) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Intentar recuperar el ID del almacenamiento si llega nulo por un F5
  const idActivo = productoId || localStorage.getItem("al_producto_seleccionado_id");

  useEffect(() => {
    if (!idActivo) {
      setLoading(false);
      return;
    }

    async function obtenerDatosProducto() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("id", idActivo)
          .single();

        if (error) throw error;

        if (data.suspendido === 1 || data.suspendido === true) {
          throw new Error("Producto suspendido");
        }

        setProducto(data);
      } catch (err) {
        console.error("Error al cargar el detalle desde Supabase:", err.message);
        Swal.fire({
          icon: "error",
          title: "Producto no disponible",
          text: "El artículo solicitado no existe o ha sido retirado del catálogo.",
          confirmButtonColor: "#10142D"
        });
        setVista("productos");
      } finally {
        setLoading(false);
      }
    }

    obtenerDatosProducto();
  }, [idActivo, setVista]);

  useEffect(() => {
    if (!producto) return;

    document.title = `${producto.nombre} | A&L Compresores Y Partes`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `Consulta información técnica del producto ${producto.nombre} de la marca ${producto.marca}.`;
  }, [producto]);

  if (loading) return <SkeletonLoader />;

  if (!producto) {
    return (
      <>
        <Navbar
          vistaActual="producto-detalle"
          setVista={setVista}
          forceSolid={true}
          usuario={usuario}
          totalItems={totalItems}
          setCartOpen={setCartOpen}
          onOpenLogin={onOpenLogin || (() => setShowModal(true))}
        />
        <div className="text-center py-5 fw-bold text-muted" style={{ paddingTop: "140px" }}>
          Producto no disponible o ID inválido.
          <br />
          <button className="btn btn-warning mt-3 rounded-pill" onClick={() => setVista("productos")}>
            Volver al catálogo
          </button>
        </div>
        <Footer setVista={setVista} onAdminLogin={() => setShowModal(true)} />
      </>
    );
  }

  // Adaptación de imágenes
  const imagenesAdaptadas = producto.producto_imagenes?.length > 0
    ? producto.producto_imagenes.map((img) => ({
      id: img.id,
      imagen_url: optimizarUrlCloudinary(img.imagen_url),
      es_principal: img.es_principal
    }))
    : [{ imagen_url: optimizarUrlCloudinary(producto.imagen_url || "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777133787/placeholder-industrial.png") }];

  // Especificaciones técnicas formateadas
  const especificacionesAdaptadas = [
    { clave: "Marca", valor: producto.marca || "N/A" },
    { clave: "Referencia", valor: producto.referencia_interna || producto.codigo_interno || "N/A" },
    { clave: "Stock", valor: producto.stock_total !== undefined ? Number(producto.stock_total).toLocaleString() : "N/A" },
    { clave: "Precio", valor: producto.precio ? `$${Number(producto.precio).toLocaleString()}` : "N/A" }
  ];

  return (
    <>
      {/* CORREGIDO: Se inyectan todas las props de control de estado del Carrito y Login al Navbar */}
      <Navbar
        vistaActual="producto-detalle"
        setVista={setVista}
        forceSolid={true}
        usuario={usuario}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
        onOpenLogin={onOpenLogin || (() => setShowModal(true))}
      />

      <main className="container container-detalle-producto">

        {/* Botón volver */}
        <div className="mb-4">
          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setVista("productos")}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver al catálogo
          </button>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <span className="breadcrumb-link-custom" onClick={() => setVista("productos")}>
                Catálogo
              </span>
            </li>
            <li className="breadcrumb-item text-capitalize">
              {producto.marca?.toLowerCase() || "Industrial"}
            </li>
            <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: "250px" }}>
              {producto.nombre}
            </li>
          </ol>
        </nav>

        {/* Encabezado del Producto */}
        <section className="mb-5">
          <span className="badge badge-marca-detalle">
            {producto.marca || "Industrial"}
          </span>
          <h1 className="fw-bold mt-3 mb-2 titulo-producto-detalle">
            {producto.nombre}
          </h1>
          <p className="text-secondary mb-0 descripcion-corta-header">
            Consulta la información técnica, especificaciones y características del producto.
          </p>
        </section>

        {/* Tarjeta de Contenido Principal */}
        <section className="tarjeta-principal-detalle">
          <div className="row g-5 align-items-start">

            {/* Galería Izquierda */}
            <div className="col-lg-6">
              <ProductGallery imagenes={imagenesAdaptadas} nombre={producto.nombre} />
            </div>

            {/* Información de Compra Derecha */}
            <div className="col-lg-6">
              <ProductInfo producto={producto} />

              <div className="mt-4 d-flex flex-column gap-3">
                <button
                  className="btn btn-warning btn-lg rounded-pill fw-bold py-3 btn-agregar-carrito-detalle"
                  onClick={() => agregarAlCarrito && agregarAlCarrito({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: Number(producto.precio || 0),
                    cantidad: 1,
                  })}
                >
                  Agregar al carrito
                </button>

                <ActionButtons producto={producto} />
              </div>
            </div>
          </div>

          {/* Información Técnica Inferior */}
          <div className="row mt-5 pt-5 border-top border-light-subtle">

            {/* Descripción */}
            <div className="col-lg-7 mb-4 mb-lg-0">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-file-earmark-text fs-5 me-2 text-warning"></i>
                <h5 className="fw-bold mb-0">Descripción del Producto</h5>
              </div>
              <p className="text-secondary lh-lg bloque-descripcion-texto">
                {producto.descripcion || producto.caracteristicas || "No hay una descripción extendida disponible."}
              </p>
            </div>

            {/* Ficha Técnica */}
            <div className="col-lg-5">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-gear fs-5 me-2 text-warning"></i>
                <h5 className="fw-bold mb-0">Especificaciones Técnicas</h5>
              </div>
              <TechnicalSheetBirdie especificaciones={especificacionesAdaptadas} />
            </div>

          </div>
        </section>

        {/* Sección de Beneficios Modularizada */}
        <section className="mt-5">
          <div className="row g-4">
            {BENEFICIOS_DETALLE.map((b, index) => (
              <div className="col-md-3" key={index}>
                <div className="bg-white rounded-4 p-4 h-100 shadow-sm border border-light-subtle card-beneficio-hover">
                  <i className={`${b.icon} fs-3 ${b.colorClass}`}></i>
                  <h6 className="fw-bold mt-3 text-dark">{b.titulo}</h6>
                  <p className="text-secondary small mb-0 lh-base">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* FASE 2: ESPACIO PARA PRODUCTOS SIMILARES Y RESEÑAS PREMIUM       */}
        {/* ================================================================= */}

        {/* Contenedor de Productos Similares (Tipo MercadoLibre) */}
        <section className="mt-5 pt-4">
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-boxes fs-4 me-2 text-warning"></i>
            <h4 className="fw-bold mb-0 text-dark">Productos similares que te pueden interesar</h4>
          </div>


          <SimilarProducts
            categoria={producto.categoria}
            marca={producto.marca}
            idActual={producto.id}
            setVista={setVista}
            setProductoSeleccionadoId={setProductoSeleccionadoId}
          />
        </section>

        {/* Contenedor de Reseñas y Calificaciones (Tipo Falabella / MercadoLibre) */}
        <section className="mt-5 pt-3 mb-4">
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-chat-square-heart fs-4 me-2 text-warning"></i>
            <h4 className="fw-bold mb-0 text-dark">Opiniones de los compradores</h4>
          </div>


          <ProductReviews productoId={producto.id} usuario={usuario} />
        </section>

      </main>

      <Footer setVista={setVista} onAdminLogin={() => setShowModal(true)} />

      {showModal && (
        <LoginModal login={login} onClose={() => setShowModal(false)} />
      )}

      {/* Hoja de Estilos Limpia */}
      <style>{`
        .container-detalle-producto {
          padding-top: 120px;
          padding-bottom: 60px;
        }
        .breadcrumb-link-custom {
          cursor: pointer;
          color: #6c757d;
          transition: color 0.2s;
        }
        .breadcrumb-link-custom:hover {
          color: #ffc107;
          text-decoration: underline;
        }
        .badge-marca-detalle {
          background-color: #FFC107;
          color: #212529;
          font-size: .8rem;
          padding: 6px 16px;
          border-radius: 50px;
        }
        .titulo-producto-detalle {
          font-size: 2.3rem;
          color: #10142D;
        }
        .descripcion-corta-header {
          max-width: 700px;
          font-size: 0.95rem;
        }
        .tarjeta-principal-detalle {
          background-color: #fff;
          border-radius: 24px;
          border: 1px solid #ECECEC;
          box-shadow: 0 20px 50px rgba(0,0,0,.04);
          padding: 2.5rem;
        }
        .btn-agregar-carrito-detalle {
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.25);
          transition: transform 0.2s, background-color 0.2s;
        }
        .btn-agregar-carrito-detalle:hover {
          transform: translateY(-2px);
        }
        .btn-agregar-carrito-detalle:active {
          transform: translateY(0);
        }
        .bloque-descripcion-texto {
          white-space: pre-line;
          font-size: 0.95rem;
        }
        .card-beneficio-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-beneficio-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,.06) !important;
        }
      `}</style>
    </>
  );
}

// Pequeño wrapper para evitar rupturas por nombre de componente interno
const TechnicalSheetBirdie = TechnicalSheet || (() => null);

export default ProductoDetalleview;