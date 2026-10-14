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
  return imgHerramienta;
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarIA, setMostrarIA] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [orden, setOrden] = useState("reciente");

  // --- CARRITO CON PERSISTENCIA ---
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito_al_compresores");
    return guardado ? JSON.parse(guardado) : {};
  });

  useEffect(() => {
    localStorage.setItem("carrito_al_compresores", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    obtenerProductos();
  }, []);

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

  // --- FUNCIONES DEL CARRITO ---
  const agregarAlCarrito = (id) => {
    setCarrito(prev => ({ ...prev, [String(id)]: 1 }));
  };

  const modificarCantidad = (id, delta) => {
    const idStr = String(id);
    setCarrito(prev => {
      const actual = prev[idStr] || 0;
      const nuevaCant = actual + delta;
      if (nuevaCant <= 0) {
        const { [idStr]: _, ...resto } = prev;
        return resto;
      }
      return { ...prev, [idStr]: nuevaCant };
    });
  };

  const quitarDelCarrito = (id) => {
    const idStr = String(id);
    setCarrito(prev => {
      const { [idStr]: _, ...resto } = prev;
      return resto;
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
    });

    if (res.isConfirmed) {
      fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => {
          setProductos(productos.filter((p) => p.id !== id));
          quitarDelCarrito(id);
          Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
        });
    }
  };

  const abrirModal = async (p = null) => {
    const { value: v } = await Swal.fire({
      title: p ? "Editar Producto" : "Nuevo Ingreso",
      width: 520,
      background: "#f9f9f9",
      showCancelButton: true,
      confirmButtonText: p ? "Guardar" : "Agregar",
      confirmButtonColor: "#121212",
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left; padding: 10px;">
          <label style="font-size: 12px; font-weight: bold;">NOMBRE</label>
          <input id="n" class="swal2-input" style="margin: 0;" value="${p ? p.Nombre : ""}">
          <label style="font-size: 12px; font-weight: bold;">PRECIO ($)</label>
          <input id="p" type="number" class="swal2-input" style="margin: 0;" value="${p ? p.Precio : ""}">
          <label style="font-size: 12px; font-weight: bold;">STOCK</label>
          <input id="can" type="number" class="swal2-input" style="margin: 0;" value="${p ? p.Cantidad : ""}">
        </div>
      `,
      preConfirm: () => {
        return {
          Nombre: document.getElementById("n").value,
          Precio: Number(document.getElementById("p").value),
          Cantidad: Number(document.getElementById("can").value),
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
      }).then(() => obtenerProductos());
    }
  };

  const filtrados = useMemo(() => {
    return productos
      .filter((p) => p.Nombre?.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => {
        if (orden === "precio_asc") return a.Precio - b.Precio;
        if (orden === "precio_desc") return b.Precio - a.Precio;
        return b.id - a.id;
      });
  }, [productos, busqueda, orden]);

  return (
    <div className="p-4 bg-white min-vh-100">
      <style>{`
        .img-producto { width: 100%; height: 160px; object-fit: contain; padding: 10px; background: #f8f9fa; }
        .card-p { transition: 0.3s; border: none !important; background: #f9f9f9 !important; border-radius: 20px !important; overflow: hidden; }
        .card-p:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .selector-cantidad { 
          background: white; border: 1px solid #eee; border-radius: 50px; 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 5px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .btn-accion { 
          width: 32px; height: 32px; border-radius: 50%; border: none; 
          display: flex; align-items: center; justify-content: center; 
          font-weight: bold; transition: 0.2s;
        }
        .btn-plus { background: #121212; color: white; }
        .btn-minus { background: #e9e9e9; color: #121212; }
      `}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Catálogo de Productos</h3>
        <div className="d-flex gap-2">
          <input 
            type="text" 
            className="form-control border-0 bg-light" 
            placeholder="Buscar..." 
            style={{borderRadius: '12px', width: '250px'}}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-warning fw-bold px-4" style={{borderRadius:'12px'}} onClick={() => abrirModal()}>+ Nuevo</button>
        </div>
      </div>

      <Notificaciones productos={productos} />

      <div className="row g-4 mt-2">
        {filtrados.map((p) => {
          const enCarrito = carrito[String(p.id)];
          
          return (
            <div className="col-md-4 col-xl-3" key={p.id}>
              <div className="card h-100 card-p">
                <img src={obtenerImagen(p.Nombre)} className="img-producto" alt={p.Nombre} style={{ cursor: 'pointer' }} 
                onClick={() => verDetalle(p)}/>
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted fw-bold">{p.Marca || 'A&L'}</small>
                    <small className="text-muted">#{p.id}</small>
                  </div>
                  <h6 className="fw-bold mb-3 text-truncate">{p.Nombre}</h6>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-5 fw-bold text-success">${p.Precio}</span>
                    <span className="badge bg-white text-dark border">Stock: {p.Cantidad}</span>
                  </div>

                  {/* LOGICA DE BOTONES DINAMICOS */}
                  {!enCarrito ? (
                    <button 
                      onClick={() => agregarAlCarrito(p.id)}
                      className="btn btn-dark w-100 fw-bold rounded-pill"
                    >
                      <i className="bi bi-cart-plus me-2"></i>Agregar al carrito
                    </button>
                  ) : (
                    <div className="selector-cantidad">
                      <div className="d-flex align-items-center">
                        <img 
                          src={obtenerImagen(p.Nombre)} 
                          style={{ width: '28px', height: '28px', objectFit: 'contain', marginRight: '10px'}} 
                          alt="min"
                        />
                        <span className="fw-bold fs-5">{enCarrito}</span>
                      </div>
                      <div className="d-flex gap-2">
                        <button onClick={() => modificarCantidad(p.id, -1)} className="btn-accion btn-minus">-</button>
                        <button onClick={() => modificarCantidad(p.id, 1)} className="btn-accion btn-plus">+</button>
                        <button onClick={() => quitarDelCarrito(p.id)} className="btn border-0 text-danger p-0 ms-1">
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BOTONES ADMIN */}
                  <div className="mt-3 pt-2 border-top d-flex justify-content-around">
                    <button onClick={() => abrirModal(p)} className="btn btn-sm text-muted fw-bold border-0">Editar</button>
                    <button onClick={() => eliminarProducto(p.id)} className="btn btn-sm text-danger fw-bold border-0">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Productos;