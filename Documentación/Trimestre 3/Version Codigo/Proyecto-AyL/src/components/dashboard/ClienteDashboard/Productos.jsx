import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import Notificaciones from "./Notificaciones";

// --- IMPORTACIÓN DE IMÁGENES (Rutas corregidas: ../../../ para llegar a assets) ---
import imgHerramienta from "../../../assets/imgProductos/herramienta.jpg";
import imgCompresor from "../../../assets/imgProductos/compresor.jpg";
import imgAceiteSin from "../../../assets/imgProductos/Aceite sintetico 5W-40.jpg";
import imgFiltroAceite from "../../../assets/imgProductos/Filtro de Aceite W962.jpg";
import imgFiltroAire from "../../../assets/imgProductos/Filtro de Aire GA-30.jpg";
import imgFiltroSep from "../../../assets/imgProductos/Filtro Separador.jpg";
import imgLlaveTorque from "../../../assets/imgProductos/Llave de Torque Neumática.jpg";
import imgManguera from "../../../assets/imgProductos/Manguera de Alta Presión 10m.jpg";
import imgManometro from "../../../assets/imgProductos/Manómetro de Glicerina.jpg";
import imgPanel from "../../../assets/imgProductos/panel.jpg";
import imgSepAceite from "../../../assets/imgProductos/separador-de-aceite.jpg";
import imgSeparador from "../../../assets/imgProductos/Separador.jpg";
import imgValvulaAdm from "../../../assets/imgProductos/Válvula de Admisión IV-20.jpg";
import imgValvulaRet from "../../../assets/imgProductos/Válvula de Retención Térmica.jpg";

// --- CONFIGURACIÓN ---
const API_URL = "https://69cdf09333a09f831b7caeb6.mockapi.io/productos/productos";

const obtenerImagen = (nombre) => {
  if (!nombre) return imgHerramienta;
  const n = nombre.toLowerCase();
  if (n.includes("aceite") && n.includes("sintético")) return imgAceiteSin;
  if (n.includes("filtro") && n.includes("aceite")) return imgFiltroAceite;
  if (n.includes("filtro") && n.includes("aire")) return imgFiltroAire;
  if (n.includes("filtro") && n.includes("separador")) return imgFiltroSep;
  if (n.includes("separador") && n.includes("aceite")) return imgSepAceite;
  if (n.includes("separador")) return imgSeparador;
  if (n.includes("válvula") && n.includes("admisión")) return imgValvulaAdm;
  if (n.includes("válvula") && n.includes("retención")) return imgValvulaRet;
  if (n.includes("llave") && n.includes("torque")) return imgLlaveTorque;
  if (n.includes("manguera")) return imgManguera;
  if (n.includes("manómetro")) return imgManometro;
  if (n.includes("panel")) return imgPanel;
  if (n.includes("compresor")) return imgCompresor;
  if (n.includes("válvula") || n.includes("valvula")) return imgValvulaAdm;
  if (n.includes("filtro")) return imgFiltroSep;
  if (n.includes("herramienta") || n.includes("llave") || n.includes("taladro")) return imgHerramienta;
  return imgHerramienta;
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarIA, setMostrarIA] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [orden, setOrden] = useState("reciente");

  useEffect(() => {
    obtenerProductos();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mostrarIA ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mostrarIA]);

  const obtenerProductos = () => {
    setCargando(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProductos(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch(() => {
        setProductos([]);
        setCargando(false);
      });
  };

  const eliminarProducto = async (id) => {
    const res = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#121212",
      cancelButtonColor: "#e0e0e0",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });

    if (res.isConfirmed) {
      fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => {
          setProductos(productos.filter((p) => p.id !== id));
          Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
        });
    }
  };

  const abrirModal = async (p = null) => {
    const { value: v } = await Swal.fire({
      title: p ? "✏️ Editar Producto" : "📦 Nuevo Ingreso",
      width: 520,
      background: "#f9f9f9",
      showCancelButton: true,
      confirmButtonText: p ? "Guardar cambios" : "Agregar producto",
      confirmButtonColor: "#121212",
      didOpen: () => {
        if (window.innerWidth > 768) Swal.getPopup().style.marginLeft = "210px";
      },
      html: `
        <style>
          .swal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
          .swal-full { grid-column: 1 / -1; }
          .swal-field { display: flex; flex-direction: column; text-align: left; }
          .swal-field label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; margin-bottom: 4px; }
          .swal-field input, .swal-field textarea { border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 10px; font-size: 14px; outline: none; }
        </style>
        <div class="swal-grid">
          <div class="swal-field swal-full"><label>Nombre del producto</label><input id="n" value="${p ? p.Nombre : ""}"></div>
          <div class="swal-field"><label>Marca</label><input id="m" value="${p ? p.Marca : ""}"></div>
          <div class="swal-field"><label>Categoría</label><input id="cat" value="${p ? p.Categoria : ""}"></div>
          <div class="swal-field"><label>Precio ($)</label><input id="p" type="number" value="${p ? p.Precio : ""}"></div>
          <div class="swal-field"><label>Stock (und.)</label><input id="can" type="number" value="${p ? p.Cantidad : ""}"></div>
          <div class="swal-field swal-full"><label>Descripción</label><textarea id="des" style="height:80px; resize:none;">${p ? p.Descripcion : ""}</textarea></div>
        </div>
      `,
      preConfirm: () => {
        const nombre = document.getElementById("n").value;
        if (!nombre) return Swal.showValidationMessage("⚠️ El nombre es obligatorio");
        return {
          Nombre: nombre,
          Marca: document.getElementById("m").value,
          Precio: Number(document.getElementById("p").value),
          Categoria: document.getElementById("cat").value,
          Cantidad: Number(document.getElementById("can").value),
          Descripcion: document.getElementById("des").value,
        };
      },
    });

    if (v) {
      const metodo = p ? "PUT" : "POST";
      const url = p ? `${API_URL}/${p.id}` : API_URL;
      fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      }).then(() => {
        obtenerProductos();
        Swal.fire({ icon: "success", title: "¡Listo!", timer: 1500, showConfirmButton: false });
      });
    }
  };

  const filtrados = useMemo(() => {
    return productos
      .filter((p) =>
        p.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.Marca?.toLowerCase().includes(busqueda.toLowerCase())
      )
      .sort((a, b) => {
        if (orden === "reciente") return Number(b.id) - Number(a.id);
        if (orden === "antiguo") return Number(a.id) - Number(b.id);
        if (orden === "precio_asc") return Number(a.Precio) - Number(b.Precio);
        if (orden === "precio_desc") return Number(b.Precio) - Number(a.Precio);
        if (orden === "stock_asc") return Number(a.Cantidad) - Number(b.Cantidad);
        if (orden === "stock_desc") return Number(b.Cantidad) - Number(a.Cantidad);
        return 0;
      });
  }, [productos, busqueda, orden]);

  const filtrosUI = [
    { value: "reciente",    icon: "bi-clock", label: " Más reciente" },
    { value: "antiguo",     icon: "bi-clock-history", label: "Más antiguo" },
    { value: "precio_asc",  icon: "bi-currency-dollar", label: "Menor precio" },
    { value: "precio_desc", icon: "bi-currency-dollar", label: "Mayor precio" },
    { value: "stock_asc",   icon: "bi-box-seam", label: "Menos stock" },
    { value: "stock_desc",  icon: "bi-box-seam", label: "Más stock" },
  ];

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .shadow-hover:hover { transform: translateY(-5px); transition: 0.3s; }
        .filtro-btn {
          border: 1.5px solid #e0e0e0; background: #fff; border-radius: 20px;
          padding: 5px 14px; font-size: 13px; font-weight: 500; color: #555;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .filtro-btn:hover { border-color: #121212; color: #121212; }
        .filtro-btn.activo { background: #121212; color: #fff; border-color: #121212; }
        
        /* Estilo uniforme para imágenes */
        .img-producto-uniforme {
          width: 100%;
          height: 180px;
          object-fit: contain;
          padding: 12px;
          background-color: #f8f9fa;
          transition: transform 0.3s;
        }
      `}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0"><i className="fas fa-box-open me-2"></i> Gestión de Productos</h3>
          <p className="text-muted small">Panel administrativo de A&L Compresores</p>
        </div>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control border-0 bg-light px-3"
            placeholder="Buscar..."
            style={{ borderRadius: '10px', width: '280px' }}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-warning fw-bold" onClick={() => abrirModal()}>+ Nuevo</button>
          <button className="btn btn-dark d-flex align-items-center gap-2" onClick={() => setMostrarIA(true)}>
            <i className="bi bi-stars"></i> Agregado inteligente
          </button>
        </div>
      </div>

      <Notificaciones productos={productos} />
      <hr className="opacity-10" />

      {/* BARRA DE FILTROS */}
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <span className="text-muted small fw-semibold me-1"><i className="bi bi-funnel me-1"></i>Ordenar:</span>
        {filtrosUI.map((f) => (
          <button
            key={f.value}
            className={`filtro-btn ${orden === f.value ? "activo" : ""}`}
            onClick={() => setOrden(f.value)}
          >
            <i className={`bi ${f.icon} me-1`}></i> {f.label}
          </button>
        ))}
      </div>

      {/* LISTADO */}
      {cargando ? (
        <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
      ) : (
        <div className="row g-3">
          {filtrados.map((p) => (
            <div className="col-md-4 col-xl-3" key={p.id}>
              <div className="card h-100 border-0 bg-light rounded-4 shadow-hover overflow-hidden">
                <img
                  src={obtenerImagen(p.Nombre)}
                  className="img-producto-uniforme"
                  alt={p.Nombre}
                />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-white text-dark border">{p.Marca}</span>
                    <small className="text-muted">#{p.id}</small>
                  </div>
                  <h6 className="fw-bold text-truncate" title={p.Nombre}>{p.Nombre}</h6>
                  <div className="d-flex justify-content-between mt-3">
                    <span className="fw-bold text-success fs-5">${p.Precio}</span>
                    <span className="badge bg-secondary">{p.Cantidad} und.</span>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button onClick={() => abrirModal(p)} className="btn btn-sm btn-dark w-100 fw-bold">Editar</button>
                    <button onClick={() => eliminarProducto(p.id)} className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CARGA INTELIGENTE */}
      {mostrarIA && (
        <>
          <div onClick={() => setMostrarIA(false)} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1050, backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>
          <div className="d-flex align-items-center justify-content-center" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1060, pointerEvents: "none" }}>
            <div className="card border-0 shadow-lg rounded-4" style={{ pointerEvents: "all", width: "90%", maxWidth: "480px", padding: "24px", backgroundColor: "#efefef" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark"><i className="bi bi-stars text-warning me-2"></i>Carga Inteligente</h5>
                <button className="btn-close" onClick={() => setMostrarIA(false)}></button>
              </div>
              <div
                className={`rounded-4 p-5 text-center ${archivo ? "bg-success-subtle border border-success" : "border border-2"}`}
                style={{ borderStyle: archivo ? "solid" : "dashed", cursor: "pointer", minHeight: "180px", backgroundColor: archivo ? undefined : "#e4e4e4" }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setArchivo(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input id="fileInput" type="file" className="d-none" onChange={(e) => setArchivo(e.target.files[0])} accept=".pdf,image/*" />
                <i className={`bi ${archivo ? "bi-file-earmark-check text-success" : "bi-arrow-up text-muted"} display-4 mb-2`}></i>
                <h6 className="fw-bold">{archivo ? "¡Archivo listo!" : "Arrastra tu factura aquí"}</h6>
                <p className="text-muted small">{archivo ? archivo.name : "O haz clic para buscar"}</p>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-light w-100 py-2 rounded-3 border" onClick={() => setMostrarIA(false)}>Cancelar</button>
                <button className={`btn fw-bold w-100 py-2 rounded-3 ${archivo ? "btn-dark" : "btn-secondary opacity-50"}`} disabled={!archivo}>Procesar Factura</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Productos;