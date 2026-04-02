import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// URL corregida según tu captura de pantalla
const API_URL = "https://69cdf09333a09f831b7caeb6.mockapi.io/productos/productos";

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
        // Validamos que la data sea un array
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
      `,
      confirmButtonColor: "#121212",
      preConfirm: () => ({
        Nombre: document.getElementById("n").value,
        Marca: document.getElementById("m").value,
        Precio: Number(document.getElementById("p").value),
        Categoria: document.getElementById("cat").value,
        Cantidad: Number(document.getElementById("can").value),
        Descripcion: document.getElementById("des").value,
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

  // Filtrado ultra-seguro para evitar el error .filter
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

      <hr className="opacity-10" />

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="mt-2 text-muted">Obteniendo datos de la nube...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-5">
          <h1 className="display-1 opacity-25">📂</h1>
          <p className="text-muted">No hay productos que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filtrados.map((p) => (
            <div className="col-md-4 col-xl-3" key={p.id}>
              <div className="card h-100 border-0 bg-light rounded-4 shadow-hover">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="badge bg-white text-dark border mb-2 shadow-sm">{p.Marca}</span>
                    <small className="text-muted">#{p.id}</small>
                  </div>
                  <h6 className="fw-bold mb-1 text-truncate">{p.Nombre}</h6>
                  <p className="text-muted small mb-3 text-truncate" style={{ height: '20px' }}>
                    {p.Descripcion || "Sin descripción"}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>PRECIO</small>
                      <span className="fw-bold text-dark">${p.Precio}</span>
                    </div>
                    <div className="text-end">
                      <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>STOCK</small>
                      <span className={`badge ${p.Cantidad > 5 ? 'bg-dark' : 'bg-danger'}`}>
                        {p.Cantidad} und.
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 d-flex gap-2 border-top pt-3">
                    <button className="btn btn-white btn-sm flex-grow-1 shadow-sm border" onClick={() => abrirModal(p)}>
                      Editar
                    </button>
                    <button className="btn btn-outline-danger btn-sm border-0" onClick={() => eliminarProducto(p.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .shadow-hover { transition: all 0.3s ease; }
        .shadow-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; background: #fff !important; }
        .btn-white { background: #fff; color: #333; }
      `}</style>
    </div>
  );
}

export default Productos;