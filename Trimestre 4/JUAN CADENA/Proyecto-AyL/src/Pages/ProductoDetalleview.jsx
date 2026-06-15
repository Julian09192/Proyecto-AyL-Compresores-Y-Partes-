import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Swal from "sweetalert2";

import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import LoginModal from "../components/Login/LoginModal";

import ProductGallery from "../components/ProductDetail/ProductGallery";
import ProductInfo from "../components/ProductDetail/ProductInfo";
import TechnicalSheet from "../components/ProductDetail/TechnicalSheet";
import ActionButtons from "../components/ProductDetail/ActionButtons";

import SkeletonLoader from "../components/UI/SkeletonLoader";

// ==========================================
// Optimización Cloudinary
// ==========================================
const optimizarUrlCloudinary = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  if (url.includes("f_auto,q_auto")) return url;

  const partes = url.split("/upload/");
  if (partes.length !== 2) return url;

  return `${partes[0]}/upload/f_auto,q_auto/${partes[1]}`;
};

function ProductoDetalleview({ productoId, setVista, login }) {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!productoId) return;

    async function obtenerDatosProducto() {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("productos")
          .select(`
            id,
            nombre,
            marca,
            descripcion,
            referencia_interna,
            precio,
            imagen_url,
            suspendido,
            producto_imagenes (
              id,
              imagen_url,
              es_principal,
              orden
            )
          `)
          .eq("id", productoId)
          .eq("suspendido", false)
          .single();

        if (error) throw error;

        setProducto(data);
      } catch (err) {
        console.error(err);

        Swal.fire({
          icon: "error",
          title: "Producto no encontrado",
          text: "El artículo solicitado no está disponible."
        });

        setVista("productos");
      } finally {
        setLoading(false);
      }
    }

    obtenerDatosProducto();
  }, [productoId]);

  useEffect(() => {
    if (!producto) return;

    document.title = `${producto.nombre} | A&P Lubricantes y Filtros`;

    let metaDesc = document.querySelector(
      'meta[name="description"]'
    );

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
      <div className="text-center py-5">
        Producto no disponible.
      </div>
    );
  }

  const imagenesAdaptadas =
    producto.producto_imagenes?.length > 0
      ? producto.producto_imagenes.map((img) => ({
        id: img.id,
        imagen_url: optimizarUrlCloudinary(img.imagen_url),
        es_principal: img.es_principal
      }))
      : [
        {
          imagen_url: optimizarUrlCloudinary(
            producto.imagen_url ||
            "https://res.cloudinary.com/ddyrgkdxq/image/upload/v1777133787/placeholder-industrial.png"
          )
        }
      ];

  const especificacionesAdaptadas = [
    {
      clave: "Marca",
      valor: producto.marca || "N/A"
    },
    {
      clave: "Referencia",
      valor: producto.referencia_interna || "N/A"
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #f8f9fa, #eef2f5)"
      }}
    >
      {/* Navbar */}
      <Navbar
        vistaActual="producto-detalle"
        setVista={setVista}
        forceSolid={true}
      />

      {/* Contenido */}
      <main
        className="container"
        style={{
          paddingTop: "120px",
          paddingBottom: "60px"
        }}
      >
        {/* Botón volver */}
        <div className="mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setVista("productos")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver al catálogo
          </button>
        </div>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <span
                onClick={() => setVista("productos")}
                style={{
                  cursor: "pointer"
                }}
              >
                Catálogo
              </span>
            </li>

            <li className="breadcrumb-item">
              {producto.marca}
            </li>

            <li
              className="breadcrumb-item active"
              aria-current="page"
            >
              {producto.nombre}
            </li>
          </ol>
        </nav>

        {/* Encabezado */}
        <section className="mb-5">
          <span
            className="badge px-3 py-2"
            style={{
              backgroundColor: "#FFC107",
              color: "#212529",
              fontSize: ".8rem"
            }}
          >
            {producto.marca}
          </span>

          <h1
            className="fw-bold mt-3 mb-2"
            style={{
              fontSize: "2.3rem"
            }}
          >
            {producto.nombre}
          </h1>

          <p
            className="text-secondary mb-0"
            style={{
              maxWidth: "700px"
            }}
          >
            Consulta la información técnica,
            especificaciones y características
            del producto.
          </p>
        </section>

        {/* Tarjeta principal */}
        <section
          className="bg-white"
          style={{
            borderRadius: "24px",
            border: "1px solid #ECECEC",
            boxShadow:
              "0 20px 50px rgba(0,0,0,.05)",
            padding: "2rem"
          }}
        >
          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <ProductGallery
                imagenes={imagenesAdaptadas}
                nombre={producto.nombre}
              />
            </div>

            <div className="col-lg-6">
              <ProductInfo producto={producto} />

              <div className="mt-4">
                <ActionButtons
                  producto={producto}
                />
              </div>
            </div>
          </div>

          {/* Información inferior */}
          <div className="row mt-5 pt-5 border-top">
            <div className="col-lg-7 mb-4">
              <div
                className="d-flex align-items-center mb-3"
              >
                <i className="bi bi-file-earmark-text fs-5 me-2 text-warning"></i>

                <h5 className="fw-bold mb-0">
                  Descripción del Producto
                </h5>
              </div>

              <p
                className="text-secondary lh-lg"
                style={{
                  whiteSpace: "pre-line"
                }}
              >
                {producto.descripcion}
              </p>
            </div>

            <div className="col-lg-5">
              <div
                className="d-flex align-items-center mb-3"
              >
                <i className="bi bi-gear fs-5 me-2 text-warning"></i>

                <h5 className="fw-bold mb-0">
                  Especificaciones Técnicas
                </h5>
              </div>

              <TechnicalSheet
                especificaciones={
                  especificacionesAdaptadas
                }
              />
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="mt-5">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                <i className="bi bi-patch-check fs-3 text-success"></i>

                <h6 className="fw-bold mt-3">
                  Productos de Calidad
                </h6>

                <p className="text-secondary small mb-0">
                  Trabajamos con marcas
                  reconocidas del sector
                  automotriz.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                <i className="bi bi-truck fs-3 text-primary"></i>

                <h6 className="fw-bold mt-3">
                  Amplio Catálogo
                </h6>

                <p className="text-secondary small mb-0">
                  Lubricantes, filtros y
                  productos especializados.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                <i className="bi bi-chat-dots fs-3 text-warning"></i>

                <h6 className="fw-bold mt-3">
                  Asesoría
                </h6>

                <p className="text-secondary small mb-0">
                  Atención personalizada para
                  resolver tus dudas.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                <i className="bi bi-shield-check fs-3 text-success"></i>

                <h6 className="fw-bold mt-3">
                  Confianza
                </h6>

                <p className="text-secondary small mb-0">
                  Información clara y soporte
                  especializado.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        setVista={setVista}
        onAdminLogin={() =>
          setShowModal(true)
        }
      />

      {showModal && (
        <LoginModal
          login={login}
          onClose={() =>
            setShowModal(false)
          }
        />
      )}
    </div>
  );
}

export default ProductoDetalleview;