import Notificaciones from "./Notificaciones";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// 👇 IMPORTA IMÁGENES
import compresor from "../../../assets/compresor.jpg";
import motor from "../../../assets/motor.jpg";
import herramienta from "../../../assets/herramienta.jpg";
import industrial from "../../../assets/industrial.jpg";
// URL MockAPI
const API_URL = "https://69cdf09333a09f831b7caeb6.mockapi.io/productos/productos";

// 👇 FUNCIÓN PARA MAPEAR IMÁGENES
const obtenerImagen = (tipo) => {
  switch (tipo) {
    case "compresor": return compresor;
    case "motor": return motor;
    case "herramienta": return herramienta;
    case "industrial": return industrial;
    default: return herramienta;
  }
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = () => {
    setCargando(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la conexión con MockAPI");
        return res.json();
      })
      .then((data) => {
        setProductos(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Fallo al obtener productos:", error);
        setProductos([]);
        setCargando(false);
      });
  };

  const eliminarProducto = async (id) => {
    const res = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción borrará el registro permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#121212",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar"
    });

    if (res.isConfirmed) {
      fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => {
          setProductos(productos.filter((p) => p.id !== id));
          Swal.fire("Eliminado", "El producto ha sido quitado del inventario", "success");
        })
        .catch(() => Swal.fire("Error", "No se pudo eliminar", "error"));
    }
  };

  const abrirModal = async (p = null) => {
    const { value: v } = await Swal.fire({
      title: p ? "Editar Producto" : "Nuevo Ingreso",
      html: `
        <input id="n" class="swal2-input" placeholder="Nombre" value="${p ? p.Nombre : ""}">
        <input id="m" class="swal2-input" placeholder="Marca" value="${p ? p.Marca : ""}">
        <input id="p" type="number" class="swal2-input" placeholder="Precio" value="${p ? p.Precio : ""}">
        <input id="cat" class="swal2-input" placeholder="Categoría" value="${p ? p.Categoria : ""}">
        <input id="can" type="number" class="swal2-input" placeholder="Stock" value="${p ? p.Cantidad : ""}">
        <textarea id="des" class="swal2-textarea" placeholder="Descripción">${p ? p.Descripcion : ""}</textarea>

        <select id="img" class="swal2-input">
          <option value="compresor" ${p?.imagen === "compresor" ? "selected" : ""}>Compresor</option>
          <option value="motor" ${p?.imagen === "motor" ? "selected" : ""}>Motor</option>
          <option value="herramienta" ${p?.imagen === "herramienta" ? "selected" : ""}>Herramienta</option>
          <option value="industrial" ${p?.imagen === "industrial" ? "selected" : ""}>Industrial</option>
        </select>
      `,
      confirmButtonColor: "#121212",
      preConfirm: () => ({
        Nombre: document.getElementById("n").value,
        Marca: document.getElementById("m").value,
        Precio: Number(document.getElementById("p").value),
        Categoria: document.getElementById("cat").value,
        Cantidad: Number(document.getElementById("can").value),
        Descripcion: document.getElementById("des").value,
        imagen: document.getElementById("img").value
      }),
    });

    if (v) {
      const metodo = p ? "PUT" : "POST";
      const url = p ? `${API_URL}/${p.id}` : API_URL;
      
      fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      })
      .then(res => res.json())
      .then(() => {
        obtenerProductos();
        Swal.fire("Éxito", "Inventario actualizado", "success");
      })
      .catch(() => Swal.fire("Error", "No se pudo guardar", "error"));
    }
  };

  const filtrados = (Array.isArray(productos) ? productos : []).filter((p) =>
    p.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.Marca?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4 bg-white min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">📦 Gestión de Productos</h3>
          <p className="text-muted small">Panel administrativo de A&L Compresores</p>
        </div>
        <div className="d-flex gap-2">
          <input 
            type="text" 
            className="form-control border-0 bg-light px-3" 
            placeholder="Buscar por nombre o marca..." 
            style={{ borderRadius: '10px', width: '280px' }}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-warning fw-bold px-4 shadow-sm" onClick={() => abrirModal()}>
            + Nuevo Producto
          </button>
        </div>
      </div>

      <Notificaciones productos={productos} obtenerImagen={obtenerImagen} />

      <hr className="opacity-10" />

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning"></div>
          <p className="mt-2 text-muted">Obteniendo datos...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-5">
          <h1 className="display-1 opacity-25">📂</h1>
          <p className="text-muted">No hay productos.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filtrados.map((p) => (
            <div className="col-md-4 col-xl-3" key={p.id}>
              <div className="card h-100 border-0 bg-light rounded-4 shadow-hover">
                
                {/* 👇 IMAGEN */}
                <img 
                  src={obtenerImagen(p.imagen)} 
                  className="card-img-top rounded-top-4"
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <div className="card-body p-3">
                  <div className="d-flex justify-content-between">
                    <span className="badge bg-white text-dark border">{p.Marca}</span>
                    <small>#{p.id}</small>
                  </div>

                  <h6 className="fw-bold">{p.Nombre}</h6>
                  <p className="text-muted small">{p.Descripcion}</p>

                  <div className="d-flex justify-content-between">
                    <span>${p.Precio}</span>
                    <span>{p.Cantidad} und.</span>
                  </div>

                  <div className="mt-2 d-flex gap-2">
                    <button onClick={() => abrirModal(p)} className="btn btn-sm btn-dark w-100">
                      Editar
                    </button>
                    <button onClick={() => eliminarProducto(p.id)} className="btn btn-sm btn-danger">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .shadow-hover:hover {
          transform: translateY(-5px);
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
}

export default Productos;