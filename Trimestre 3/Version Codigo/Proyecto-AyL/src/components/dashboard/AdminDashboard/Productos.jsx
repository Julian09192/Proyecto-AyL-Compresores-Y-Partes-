import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import Notificaciones from "./Notificaciones";

// --- IMPORTACIÓN DE IMÁGENES ---
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

  // FUNCIÓN CORREGIDA: Alternar estado (Suspender/Activar)
  const alternarEstadoProducto = async (id, estaSuspendido) => {
    const productoActual = productos.find(p => p.id === id);
    if (!productoActual) return;

    const res = await Swal.fire({
      title: estaSuspendido ? "¿Reactivar producto?" : "¿Suspender producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#121212",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });

    if (res.isConfirmed) {
      // Enviamos el objeto completo para asegurar compatibilidad con MockAPI
      const productoActualizado = { ...productoActual, suspendido: !estaSuspendido };

      fetch(`${API_URL}/${id}`, {
        method: "PUT", 
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify(productoActualizado),
      })
      .then((response) => {
        if (!response.ok) throw new Error("Error en servidor");
        return response.json();
      })
      .then(() => {
        obtenerProductos();
        Swal.fire({ icon: "success", title: "Estado actualizado", timer: 1000, showConfirmButton: false });
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error", "No se pudo actualizar el estado", "error");
      });
    }
  };

  // Modal para agregar/editar (Reutilizando tu lógica previa)
  const abrirModal = async (p = null) => {
    const { value: v } = await Swal.fire({
      title: p ? "✏️ Editar Producto" : "📦 Nuevo Ingreso",
      width: 520,
      background: "#f9f9f9",
      showCancelButton: true,
      confirmButtonText: p ? "Guardar cambios" : "Agregar",
      confirmButtonColor: "#121212",
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left;">
          <div style="grid-column: 1/-1"><label style="font-size:11px">NOMBRE</label><input id="n" class="swal2-input" style="margin:0; width:100%" value="${p ? p.Nombre : ""}"></div>
          <div><label style="font-size:11px">MARCA</label><input id="m" class="swal2-input" style="margin:0; width:100%" value="${p ? p.Marca : ""}"></div>
          <div><label style="font-size:11px">PRECIO</label><input id="p" type="number" class="swal2-input" style="margin:0; width:100%" value="${p ? p.Precio : ""}"></div>
        </div>
      `,
      preConfirm: () => {
        return {
          Nombre: document.getElementById("n").value,
          Marca: document.getElementById("m").value,
          Precio: Number(document.getElementById("p").value),
        };
      }
    });

    if (v) {
      const metodo = p ? "PUT" : "POST";
      const url = p ? `${API_URL}/${p.id}` : API_URL;
      fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p ? { ...p, ...v } : v),
      }).then(() => obtenerProductos());
    }
  };

const filtrados = useMemo(() => {
    return productos
      .filter((p) => {
        const coincideTexto = p.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                             p.Marca?.toLowerCase().includes(busqueda.toLowerCase());
        
        const esSuspendido = p.suspendido === true;

        // Lógica de visibilidad según el filtro seleccionado
        if (orden === "todos") return coincideTexto; // Muestra todo
        if (orden === "deshabilitados") return coincideTexto && esSuspendido; // Solo suspendidos
        
        // Por defecto (reciente, precios, stock) solo muestra los NO suspendidos
        return coincideTexto && !esSuspendido;
      })
      .sort((a, b) => {
        if (orden === "reciente") return Number(b.id) - Number(a.id);
        if (orden === "precio_asc") return Number(a.Precio) - Number(b.Precio);
        if (orden === "precio_desc") return Number(b.Precio) - Number(a.Precio); // Orden descendente
        if (orden === "stock_desc") return Number(b.Cantidad) - Number(a.Cantidad);
        return 0;
      });
  }, [productos, busqueda, orden]);

const filtrosUI = [
    { value: "todos", icon: "bi-grid", label: " Todos" },
    { value: "reciente", icon: "bi-clock", label: " Más reciente" },
    { value: "precio_desc", icon: "bi-sort-down", label: " Mayor precio" },
    { value: "precio_asc", icon: "bi-sort-up", label: " Menor precio" },
    { value: "stock_desc", icon: "bi-box-seam", label: " Más stock" },
    { value: "deshabilitados", icon: "bi-eye-slash", label: " Deshabilitados" },
  ];

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .shadow-hover:hover { transform: translateY(-5px); transition: 0.3s; }
        .filtro-btn { border: 1.5px solid #e0e0e0; background: #fff; border-radius: 20px; padding: 5px 14px; font-size: 13px; cursor: pointer; }
        .filtro-btn.activo { background: #121212; color: #fff; border-color: #121212; }
        .img-producto-uniforme { width: 100%; height: 180px; object-fit: contain; padding: 12px; background-color: #f8f9fa; }
        .producto-suspendido { opacity: 0.6; filter: grayscale(0.5); }
      `}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Gestión de Productos</h3>
          <p className="text-muted small">Panel administrativo de A&L Compresores</p>
        </div>
        <div className="d-flex gap-2">
          <input type="text" className="form-control border-0 bg-light" placeholder="Buscar..." style={{ borderRadius: '10px', width: '250px' }} onChange={(e) => setBusqueda(e.target.value)} />
          <button className="btn btn-warning fw-bold" onClick={() => abrirModal()}>+ Nuevo</button>
        </div>
      </div>

      <Notificaciones productos={productos} />
      <hr className="opacity-10" />

      {/* FILTROS */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {filtrosUI.map((f) => (
          <button key={f.value} className={`filtro-btn ${orden === f.value ? "activo" : ""}`} onClick={() => setOrden(f.value)}>
            <i className={`bi ${f.icon} me-1`}></i> {f.label}
          </button>
        ))}
      </div>

      {/* LISTADO */}
      {cargando ? (
        <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
      ) : (
        <div className="row g-3">
          {filtrados.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">Sin productos en esta categoría.</div>
          ) : (
            filtrados.map((p) => (
              <div className="col-md-4 col-xl-3" key={p.id}>
                <div className={`card h-100 border-0 bg-light rounded-4 shadow-hover overflow-hidden ${p.suspendido ? 'producto-suspendido' : ''}`}>
                  <img src={obtenerImagen(p.Nombre)} className="img-producto-uniforme" alt={p.Nombre} />
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-white text-dark border">{p.Marca}</span>
                      <small className="text-muted">#{p.id}</small>
                    </div>
                    <h6 className="fw-bold text-truncate">{p.Nombre}</h6>
                    <div className="d-flex justify-content-between mt-3">
                      <span className="fw-bold text-success fs-5">${p.Precio}</span>
                      <span className="badge bg-secondary">{p.Cantidad} und.</span>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                      <button onClick={() => abrirModal(p)} className="btn btn-sm btn-dark w-100 fw-bold">Editar</button>
                      <button onClick={() => alternarEstadoProducto(p.id, p.suspendido)} className={`btn btn-sm ${p.suspendido ? 'btn-outline-success' : 'btn-outline-danger'}`}>
                        <i className={`bi ${p.suspendido ? 'bi-eye-fill' : 'bi-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Productos;