import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import Notificaciones from "./Notificaciones";

const API_URL = "http://localhost:3001/productos"; 
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/duvoqozcl/image/upload";
const UPLOAD_PRESET = "AYL_Compresores";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [orden, setOrden] = useState("reciente");

    useEffect(() => {
        leíLosProductos();
    }, []);

    const leíLosProductos = async () => {
        setCargando(true);
        try {
            const res = await fetch(`${API_URL}?t=${Date.now()}`);
            const data = await res.json();
            setProductos(Array.isArray(data) ? [...data] : []);
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            setProductos([]);
        } finally {
            setCargando(false);
        }
    };

    const subirACloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        try {
            const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
            const data = await res.json();
            if (data.secure_url) {
                return { url: data.secure_url, publicId: data.public_id };
            }
            return null;
        } catch (err) {
            console.error("Error Cloudinary:", err);
            return null;
        }
    };

    const alternarEstadoProducto = async (id, estaSuspendido) => {
        const res = await Swal.fire({
            title: estaSuspendido ? "¿Reactivar?" : "¿Suspender?",
            text: estaSuspendido ? "El producto volverá a ser visible." : "El producto se ocultará del catálogo.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#121212",
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar"
        });

        if (res.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ suspendido: !estaSuspendido ? 1 : 0 })
                });

                if (!response.ok) throw new Error("Error en servidor");
                
                await leíLosProductos();
                Swal.fire({ title: "Actualizado", icon: "success", timer: 1000, showConfirmButton: false });
            } catch (err) {
                Swal.fire("Error", "No se pudo actualizar el estado", "error");
            }
        }
    };

    const abrirModal = async (p = null) => {
        let archivoSeleccionado = null;

        const { value: formValues } = await Swal.fire({
            title: p ? "Editar Producto" : "Nuevo Ingreso",
            width: 600,
            showCancelButton: true,
            confirmButtonColor: "#121212",
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            html: `
            <style>
                .swal-form-row { display: flex; align-items: center; margin-bottom: 10px; text-align: left; }
                .swal-form-row label { width: 140px; font-weight: bold; font-size: 14px; color: #444; }
                .swal-form-row .swal2-input, .swal-form-row .swal2-select { flex: 1; margin: 0; height: 38px; font-size: 14px; }
                #preview { max-width: 150px; border-radius: 8px; margin-top: 10px; border: 1px solid #ddd; }
            </style>
            <div id="modal-container">
                <div class="swal-form-row">
                    <label>Tipo:</label>
                    <select id="tipo" class="swal2-select">
                        <option value="">Seleccione...</option>
                        <option value="separador" ${p?.tipo === "separador" ? "selected" : ""}>Filtros Separadores</option>
                        <option value="aceite" ${p?.tipo === "aceite" ? "selected" : ""}>Filtro de Aceite</option>
                        <option value="aire" ${p?.tipo === "aire" ? "selected" : ""}>Filtro de Aire</option>
                        <option value="aceite_motor" ${p?.tipo === "aceite_motor" ? "selected" : ""}>Aceites</option>
                        <option value="valvulina" ${p?.tipo === "valvulina" ? "selected" : ""}>Valvulinas</option>
                    </select>
                </div>
                <div id="drop-zone" style="border: 2px dashed #ccc; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; margin-bottom: 15px;">
                    <p id="label-foto" style="margin:0; font-size:12px; color: #666;">
                        ${p?.imagen_url ? "Imagen actual (Click para cambiar)" : "Click para subir imagen"}
                    </p>
                    <img id="preview" src="${p?.imagen_url || ""}" style="display:${p?.imagen_url ? "inline-block" : "none"}; width: 100px; height: 100px; object-fit: cover;" />
                </div>
                <div id="campos-dinamicos"></div>
            </div>
            `,
            didOpen: () => {
                const tipoSelect = document.getElementById("tipo");
                const contenedor = document.getElementById("campos-dinamicos");
                const preview = document.getElementById("preview");

                const renderCampos = (t) => {
                    if (!t) { contenedor.innerHTML = ""; return; }
                    let html = `
                        <div class="swal-form-row"><label>Nombre:</label><input id="nombre" class="swal2-input" value="${p?.nombre || ""}"></div>
                        <div class="swal-form-row"><label>Características:</label><input id="caracteristicas" class="swal2-input" value="${p?.caracteristicas || ""}"></div>
                        <div class="swal-form-row"><label>Precio ($):</label><input id="precio" type="number" class="swal2-input" value="${p?.precio || ""}"></div>
                    `;
                    if (["aceite_motor", "valvulina"].includes(t)) {
                        html += `
                            <div class="swal-form-row"><label>Marca:</label><input id="marca" class="swal2-input" value="${p?.marca || ""}"></div>
                            <div class="swal-form-row"><label>Categoría Veh.:</label><input id="categoria_vehiculo" class="swal2-input" value="${p?.categoria_vehiculo || ""}"></div>
                            <div class="swal-form-row"><label>Stock:</label><input id="stock" type="number" class="swal2-input" value="${p?.stock || ""}"></div>
                        `;
                    } else {
                        html += `
                            <div class="swal-form-row"><label>Código Int.:</label><input id="codigo_interno" class="swal2-input" value="${p?.codigo_interno || ""}"></div>
                            <div class="swal-form-row"><label>Marca:</label><input id="marca" class="swal2-input" value="${p?.marca || ""}"></div>
                            <div class="swal-form-row"><label>Stock:</label><input id="stock" type="number" class="swal2-input" value="${p?.stock || ""}"></div>
                        `;
                    }
                    contenedor.innerHTML = html;
                };

                if (p?.tipo) renderCampos(p.tipo);
                tipoSelect.onchange = (e) => renderCampos(e.target.value);

                document.getElementById("drop-zone").onclick = () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            archivoSeleccionado = file;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                preview.src = event.target.result;
                                preview.style.display = "inline-block";
                                document.getElementById("label-foto").innerText = "Nueva imagen seleccionada";
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    input.click();
                };
            },
            preConfirm: () => {
                const tipo = document.getElementById("tipo").value;
                if (!tipo) return Swal.showValidationMessage("Seleccione un tipo");
                
                const get = (id) => document.getElementById(id)?.value || "";
                
                return {
                    tipo,
                    nombre: get("nombre"),
                    caracteristicas: get("caracteristicas"),
                    precio: get("precio"),
                    marca: get("marca"),
                    categoria_vehiculo: get("categoria_vehiculo"),
                    codigo_interno: get("codigo_interno"),
                    stock: get("stock"),
                    ImagenFile: archivoSeleccionado 
                };
            }
        });

        if (formValues) {
            Swal.fire({ 
                title: 'Procesando...', 
                text: 'Subiendo datos e imágenes',
                allowOutsideClick: false, 
                didOpen: () => Swal.showLoading() 
            });

            try {
                // 1. Manejo de imagen con Cloudinary
                let urlFinal = p?.imagen_url || null;
                let publicIdFinal = p?.imagen_public_id || null;

                if (formValues.ImagenFile) {
                    const subida = await subirACloudinary(formValues.ImagenFile);
                    if (subida) {
                        urlFinal = subida.url;
                        publicIdFinal = subida.publicId;
                    }
                }

                // 2. Construcción del objeto para el Backend
                const dataFinal = {
                    tipo: formValues.tipo,
                    nombre: formValues.nombre,
                    caracteristicas: formValues.caracteristicas,
                    precio: Number(formValues.precio) || 0,
                    marca: formValues.marca,
                    categoria_vehiculo: formValues.categoria_vehiculo,
                    codigo_interno: formValues.codigo_interno,
                    stock: Number(formValues.stock) || 0,
                    imagen_url: urlFinal,
                    imagen_public_id: publicIdFinal,
                    id_bodega: 1, 
                    ultimo_usuario_id: 1
                };

                // 3. Petición Fetch (POST o PUT)
                const response = await fetch(p ? `${API_URL}/${p.id}` : API_URL, {
                    method: p ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataFinal)
                });

                if (!response.ok) throw new Error("Error en la respuesta de la API");

                await leíLosProductos();
                Swal.fire("Éxito", p ? "Producto actualizado" : "Producto creado", "success");
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo guardar la información", "error");
            }
        }
    };

    const filtrados = useMemo(() => {
        return productos
            .filter((p) => {
                const search = busqueda.toLowerCase();
                const match = p.nombre?.toLowerCase().includes(search) || p.marca?.toLowerCase().includes(search);
                if (orden === "deshabilitados") return match && p.suspendido === 1;
                if (orden === "todos") return match;
                return match && p.suspendido === 0;
            })
            .sort((a, b) => {
                if (orden === "reciente") return (b.id) - (a.id);
                if (orden === "precio_asc") return Number(a.precio) - Number(b.precio);
                if (orden === "precio_desc") return Number(b.precio) - Number(a.precio);
                return 0;
            });
    }, [productos, busqueda, orden]);

    return (
        <div className="p-4 bg-white min-vh-100">
            <style>{`
                .img-producto-uniforme { width: 100%; height: 180px; object-fit: contain; padding: 15px; background-color: #f8f9fa; border-top-left-radius: 15px; border-top-right-radius: 15px; }
                .producto-suspendido { opacity: 0.5; filter: grayscale(1); }
                .filtro-btn { border: 1.5px solid #e0e0e0; background: #fff; border-radius: 20px; padding: 6px 16px; font-size: 13px; cursor: pointer; transition: 0.3s; }
                .filtro-btn.activo { background: #121212; color: #fff; border-color: #121212; }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h3 className="fw-bold mb-0">Gestión de Inventario</h3>
                    <p className="text-muted small mb-0">Conexión: API Local (MySQL) & Cloudinary</p>
                </div>

                <div className="d-flex align-items-stretch gap-2" style={{ height: "45px" }}>
                    <input
                        type="text"
                        className="form-control border-0 bg-light h-100 ps-3"
                        placeholder="Buscar por nombre o marca..."
                        style={{ borderRadius: "12px", minWidth: "250px" }}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button className="btn btn-warning fw-bold px-4" style={{ borderRadius: "12px" }} onClick={() => abrirModal()}>
                        + Nuevo
                    </button>
                </div>
            </div>

            <Notificaciones productos={productos} />

            <div className="d-flex gap-2 mb-4 flex-wrap">
                {["todos", "reciente", "precio_asc", "precio_desc", "deshabilitados"].map(o => (
                    <button key={o} className={`filtro-btn ${orden === o ? 'activo' : ''}`} onClick={() => setOrden(o)}>
                        {o.replace('_', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="row g-4">
                {filtrados.length > 0 ? (
                    filtrados.map((p) => (
                        <div className="col-md-4 col-xl-3" key={p.id}>
                            <div className={`card h-100 border-0 shadow-sm rounded-4 ${p.suspendido === 1 ? 'producto-suspendido' : ''}`}>
                                <img src={p.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"} className="img-producto-uniforme" alt={p.nombre} />
                                <div className="card-body p-3">
                                    <span className="badge bg-light text-dark border mb-2">{p.marca || p.tipo}</span>
                                    <h6 className="fw-bold text-truncate mb-1">{p.nombre}</h6>
                                    <p className="text-muted small mb-3">{p.codigo_interno || "REF-" + p.id}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-success fs-5">${Number(p.precio)?.toLocaleString()}</span>
                                        <span className="badge bg-secondary">{p.stock || 0} und.</span>
                                    </div>
                                    <div className="mt-3 d-flex gap-2">
                                        <button onClick={() => abrirModal(p)} className="btn btn-sm btn-dark w-100">Editar</button>
                                        <button onClick={() => alternarEstadoProducto(p.id, p.suspendido === 1)} className="btn btn-sm btn-outline-secondary">Estado</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5 text-muted">No se encontraron productos con esos filtros.</div>
                )}
            </div>
        </div>
    );
}

export default Productos;