import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3001/api/productos";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/duvoqozcl/image/upload";
const UPLOAD_PRESET = "AYL_Compresores";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    
    const [filtroEstado, setFiltroEstado] = useState("todos"); 
    const [filtroOrden, setFiltroOrden] = useState("recientes"); 

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            const data = await res.json();
            setProductos(data || []);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            setProductos([]);
        }
    };

    const subirACloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        try {
            const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
            const data = await res.json();
            return data.secure_url ? { url: data.secure_url, publicId: data.public_id } : null;
        } catch (err) { return null; }
    };

    const alternarEstadoProducto = async (id, estaSuspendido) => {
        const respuesta = await Swal.fire({
            title: estaSuspendido ? "¿Reactivar Producto?" : "¿Suspender Producto?",
            text: estaSuspendido 
                ? "El producto volverá a ser visible para todos los usuarios en el catálogo público." 
                : "El producto se ocultará o marcará como no disponible en el catálogo público.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#121212",
            cancelButtonColor: "#6c757d",
            confirmButtonText: estaSuspendido ? "Sí, reactivar" : "Sí, suspender",
            cancelButtonText: "Cancelar",
            customClass: { popup: 'rounded-4' }
        });

        if (respuesta.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/${id}/suspender`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" }
                });

                if (!res.ok) throw new Error();
                
                await cargarProductos();
                
                let swalConfig = {
                    title: "Estado Actualizado",
                    text: estaSuspendido ? "Producto reactivado con éxito." : "Producto suspendido con éxito.",
                    icon: "success",
                    confirmButtonColor: "#121212",
                    customClass: { popup: 'rounded-4' }
                };
                Swal.fire(swalConfig);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo cambiar el estado del producto",
                    icon: "error",
                    confirmButtonColor: "#121212",
                    customClass: { popup: 'rounded-4' }
                });
            }
        }
    };

    const abrirModal = async (p = null) => {
        let archivoSeleccionado = null;
        let tipoSeleccionadoLocal = p?.tipo || "";

        const { value: formValues } = await Swal.fire({
            title: p ? "Editar Producto" : "Nuevo Ingreso",
            width: 700,
            showCancelButton: true,
            confirmButtonColor: "#121212",
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            customClass: {
                popup: 'rounded-4 border-0 shadow-lg p-4',
                title: 'fw-bold text-dark fs-4 mb-3 text-start',
                confirmButton: 'btn btn-dark px-4 py-2 rounded-3 text-sm',
                cancelButton: 'btn btn-link text-muted px-4 py-2 text-decoration-none text-sm'
            },
            html: `
            <style>
                .swal-minimal-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 16px; 
                    text-align: left; 
                }
                .swal-form-group { display: flex; flex-direction: column; gap: 6px; }
                .swal-form-group.full-width { grid-column: span 2; }
                .swal-form-group label { font-size: 12px; font-weight: 600; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; }
                .swal-minimal-input, .swal-minimal-select { 
                    width: 100%;
                    height: 42px; 
                    padding: 0 14px; 
                    font-size: 14px; 
                    color: #212529;
                    background-color: #f8f9fa; 
                    border: 1px solid #e9ecef; 
                    border-radius: 8px; 
                    transition: border-color 0.2s ease, background-color 0.2s ease;
                    box-sizing: border-box;
                }
                .swal-minimal-input:focus, .swal-minimal-select:focus { 
                    outline: none; 
                    border-color: #121212; 
                    background-color: #fff; 
                }
                #drop-zone-minimal { 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between;
                    border: 1px dashed #dee2e6; 
                    border-radius: 12px; 
                    padding: 14px 20px; 
                    cursor: pointer; 
                    background-color: #fafbfc;
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                    grid-column: span 2;
                }
                #drop-zone-minimal:hover { background-color: #f1f3f5; border-color: #adb5bd; }
                #preview-minimal { max-width: 50px; max-height: 50px; border-radius: 6px; object-fit: cover; }
            </style>
            <div class="swal-minimal-grid" id="modal-container">
                <div class="swal-form-group">
                    <label>Tipo de Producto</label>
                    <select id="tipo" class="swal-minimal-select">
                        <option value="">Seleccione...</option>
                        <option value="separador" ${p?.tipo === "separador" ? "selected" : ""}>Filtros Separadores</option>
                        <option value="aceite" ${p?.tipo === "aceite" ? "selected" : ""}>Filtro de Aceite</option>
                        <option value="aire" ${p?.tipo === "aire" ? "selected" : ""}>Filtro de Aire</option>
                        <option value="aceite_motor" ${p?.tipo === "aceite_motor" ? "selected" : ""}>Aceites</option>
                        <option value="valvulina" ${p?.tipo === "valvulina" ? "selected" : ""}>Valvulinas</option>
                    </select>
                </div>
                
                <div class="swal-form-group">
                    <label>Ubicación (Bodega)</label>
                    <select id="id_bodega" class="swal-minimal-select">
                        <option value="">Seleccione bodega...</option>
                        <option value="1" ${Number(p?.bodega_id) === 1 ? "selected" : ""}>Bodega 1</option>
                        <option value="2" ${Number(p?.bodega_id) === 2 ? "selected" : ""}>Bodega 2</option>
                    </select>
                </div>

                <div id="drop-zone-minimal">
                    <p id="label-foto" style="margin:0; font-size:13px; color: #6c757d; font-weight: 400;">
                        ${p?.imagen_url ? "Imagen del producto cargada (Click para cambiar)" : "Haz click para adjuntar una imagen"}
                    </p>
                    <img id="preview-minimal" src="${p?.imagen_url || ""}" style="display:${p?.imagen_url ? "inline-block" : "none"};" />
                </div>
                
                <div class="swal-minimal-grid" style="grid-column: span 2;" id="campos-dinamicos"></div>
            </div>
            `,
            didOpen: () => {
                const tipoSelect = document.getElementById("tipo");
                const contenedor = document.getElementById("campos-dinamicos");
                const preview = document.getElementById("preview-minimal");

                const renderCampos = (t) => {
                    if (!t) { contenedor.innerHTML = ""; return; }
                    let html = `
                        <div class="swal-form-group full-width"><label>Nombre</label><input id="nombre" class="swal-minimal-input" placeholder="Ej. Aceite Mobil Cuarto 15W40" value="${p?.nombre || ""}"></div>
                        <div class="swal-form-group full-width"><label>Características</label><input id="caracteristicas" class="swal-minimal-input" placeholder="Detalles o especificaciones" value="${p?.caracteristicas || ""}"></div>
                        <div class="swal-form-group"><label>Precio ($)</label><input id="precio" type="number" class="swal-minimal-input" placeholder="Valor" value="${p?.precio !== undefined ? p.precio : ""}"></div>
                    `;
                    if (["aceite_motor", "valvulina"].includes(t)) {
                        html += `
                            <div class="swal-form-group"><label>Marca</label><input id="marca" class="swal-minimal-input" placeholder="Ej. Mobil" value="${p?.marca || ""}"></div>
                            <div class="swal-form-group"><label>Categoría Vehículo</label><input id="categoria_vehiculo" class="swal-minimal-input" placeholder="Ej. Pesado" value="${p?.categoria_vehiculo || ""}"></div>
                            <div class="swal-form-group"><label>Stock Disponible</label><input id="stock" type="number" class="swal-minimal-input" placeholder="Cantidad" value="${p?.stock_total !== undefined ? p.stock_total : ""}"></div>
                        `;
                    } else {
                        html += `
                            <div class="swal-form-group"><label>Código Interno</label><input id="codigo_interno" class="swal-minimal-input" placeholder="Ref. única" value="${p?.codigo_interno || ""}"></div>
                            <div class="swal-form-group"><label>Marca</label><input id="marca" class="swal-minimal-input" placeholder="Ej. Donaldson" value="${p?.marca || ""}"></div>
                            <div class="swal-form-group"><label>Stock Disponible</label><input id="stock" type="number" class="swal-minimal-input" placeholder="Cantidad" value="${p?.stock_total !== undefined ? p.stock_total : ""}"></div>
                        `;
                    }
                    contenedor.innerHTML = html;
                };

                if (p?.tipo) {
                    renderCampos(p.tipo);
                }
                
                tipoSelect.onchange = (e) => {
                    tipoSeleccionadoLocal = e.target.value; 
                    renderCampos(e.target.value);
                };

                document.getElementById("drop-zone-minimal").onclick = () => {
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
                const get = (id) => {
                    const el = document.getElementById(id);
                    return el && el.value.trim() !== "" ? el.value.trim() : null;
                };

                const selectElement = document.getElementById("tipo");
                if (selectElement && selectElement.value) {
                    tipoSeleccionadoLocal = selectElement.value;
                }

                if (!tipoSeleccionadoLocal) {
                    Swal.showValidationMessage("El tipo de producto es obligatorio");
                    return false;
                }

                return {
                    tipo: tipoSeleccionadoLocal, 
                    id_bodega: get("id_bodega"),
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
            Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            try {
                let urlFinal = p?.imagen_url || null;
                let publicIdFinal = p?.cloudinary_imagen_public_id || null; 

                if (formValues.ImagenFile) {
                    const subida = await subirACloudinary(formValues.ImagenFile);
                    if (subida) { urlFinal = subida.url; publicIdFinal = subida.publicId; }
                }

                const dataFinal = {
                    tipo: formValues.tipo,
                    id_bodega: formValues.id_bodega ? Number(formValues.id_bodega) : null,
                    nombre: formValues.nombre,
                    caracteristicas: formValues.caracteristicas,
                    precio: formValues.precio ? Number(formValues.precio) : 0,
                    marca: formValues.marca,
                    categoria_vehiculo: formValues.categoria_vehiculo,
                    codigo_interno: formValues.codigo_interno,
                    stock: formValues.stock ? Number(formValues.stock) : 0, 
                    imagen_url: urlFinal,
                    imagen_public_id: publicIdFinal 
                };

                const urlRequest = p ? `${API_URL}/${p.id}` : API_URL;
                const metodo = p ? "PUT" : "POST";

                const res = await fetch(urlRequest, {
                    method: metodo,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataFinal)
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Error procesando petición");
                }

                await cargarProductos();
                Swal.fire({
                    title: "Éxito",
                    text: "Producto guardado con éxito.",
                    icon: "success",
                    confirmButtonColor: "#121212",
                    customClass: { popup: 'rounded-4' }
                });
            } catch (err) { 
                console.error("Error al guardar:", err);
                Swal.fire({
                    title: "Error",
                    text: `No se pudo guardar: ${err.message || err}`,
                    icon: "error",
                    confirmButtonColor: "#121212",
                    customClass: { popup: 'rounded-4' }
                }); 
            }
        }
    };

    const filtrados = useMemo(() => {
        const search = busqueda.toLowerCase().trim();

        return productos
            .filter((p) => {
                const matchesSearch = 
                    p.nombre?.toLowerCase().includes(search) || 
                    p.marca?.toLowerCase().includes(search) ||
                    p.codigo_interno?.toLowerCase().includes(search);

                if (!matchesSearch) return false;

                if (filtroEstado === "activos") return !p.suspendido;
                if (filtroEstado === "suspendidos") return !!p.suspendido;

                return true;
            })
            .sort((a, b) => {
                if (filtroOrden === "precio_menor") return Number(a.precio) - Number(b.precio);
                if (filtroOrden === "precio_mayor") return Number(b.precio) - Number(a.precio);
                
                return Number(b.id) - Number(a.id);
            });
    }, [productos, busqueda, filtroEstado, filtroOrden]);

    return (
        <div className="p-4" style={{ backgroundColor: "#f8f9fb", minHeight: "100vh" }}>
            <style>{`
                .product-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    overflow: hidden;
                    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
                }
                .product-card:hover {
                    transform: translateY(-4px);
                    border-color: #121212;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.04);
                }
                .brand-badge {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    background-color: #121212;
                    color: #ffffff;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 6px;
                    letter-spacing: 0.5px;
                    z-index: 2;
                }
                .status-badge-suspended {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    background-color: #ffffff;
                    color: #94a3b8;
                    border: 1px solid #e2e8f0;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 6px;
                    letter-spacing: 0.5px;
                    z-index: 2;
                }
                .status-badge-critical {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    background-color: #121212;
                    color: #F5A623;
                    border: 1px solid #121212;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 6px;
                    letter-spacing: 0.5px;
                    z-index: 2;
                }
                .btn-edit-action {
                    background-color: #121212;
                    color: #ffffff;
                    font-weight: 600;
                    border: 1px solid #121212;
                    border-radius: 8px;
                    font-size: 13px;
                    transition: all 0.2s ease;
                }
                .btn-edit-action:hover {
                    background-color: #2a2a2a;
                    color: #ffffff;
                }
            `}</style>

            {/* HEADER CON BARRA DE HERRAMIENTAS INTEGRADA */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                <div>
                    <h4 className="fw-bold text-dark mb-1">Inventario General</h4>
                    <p className="text-muted small mb-0">Control y administración global de productos en catálogo</p>
                </div>
                <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
                    <div className="position-relative">
                        <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ fontSize: "0.85rem" }}></i>
                        <input 
                            type="text" 
                            className="form-control ps-5 border" 
                            placeholder="Buscar por nombre, marca o ref..." 
                            style={{ 
                                borderRadius: "8px", 
                                minWidth: "280px", 
                                height: "40px",
                                fontSize: "14px",
                                backgroundColor: "#ffffff",
                                borderColor: "#cbd5e1"
                            }} 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)} 
                        />
                    </div>
                    <button 
                        className="btn btn-dark fw-semibold px-4 d-flex align-items-center justify-content-center gap-2" 
                        style={{ 
                            borderRadius: "8px", 
                            fontSize: "14px",
                            height: "40px",
                            backgroundColor: "#121212",
                            borderColor: "#121212"
                        }} 
                        onClick={() => abrirModal()}
                    >
                        <i className="bi bi-plus-lg"></i> Nuevo producto
                    </button>
                </div>
            </div>

            {/* SECCIÓN DE FILTROS INTEGRADOS */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fw-bold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Estado:</span>
                    <div className="bg-light p-1 rounded-3 d-flex gap-1 border">
                        <button className={`btn btn-sm border-0 px-3 py-1 ${filtroEstado === 'todos' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroEstado("todos")}>Todos</button>
                        <button className={`btn btn-sm border-0 px-3 py-1 ${filtroEstado === 'activos' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroEstado("activos")}>Activos</button>
                        <button className={`btn btn-sm border-0 px-3 py-1 ${filtroEstado === 'suspendidos' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroEstado("suspendidos")}>Suspendidos</button>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fw-bold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Orden:</span>
                    <div className="bg-light p-1 rounded-3 d-flex gap-1 border">
                        <button className={`btn btn-sm border-0 px-3 py-1 ${filtroOrden === 'recientes' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroOrden("recientes")}>Recientes</button>
                        <button className={`btn btn-sm border-0 px-3 py-1 ${filtroOrden === 'precio_menor' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroOrden("precio_menor")}>Precio menor</button>
                        <button className={`btn btn-sm border-0 px-3 py-1 ${filtroOrden === 'precio_mayor' ? 'bg-white text-dark shadow-sm fw-semibold' : 'text-muted'}`} style={{ borderRadius: "6px", fontSize: "13px" }} onClick={() => setFiltroOrden("precio_mayor")}>Precio mayor</button>
                    </div>
                </div>
            </div>

            {/* GRID DE CATÁLOGO */}
            {filtrados.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border p-4 shadow-sm">
                    <p className="text-muted small mb-0 fw-medium">No hay productos en inventario que coincidan con los filtros aplicados.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {filtrados.map((p) => {
                        const esCritico = Number(p.stock_total || 0) < 10 && !p.suspendido;
                        return (
                            <div className="col-sm-6 col-md-4 col-xl-3" key={p.id}>
                                <div className="product-card h-100 position-relative d-flex flex-column">
                                    {/* Etiqueta de Marca */}
                                    <span className="brand-badge">
                                        {p.marca || p.tipo}
                                    </span>

                                    {/* Estado Contextual Avanzado */}
                                    {p.suspendido ? (
                                        <span className="status-badge-suspended">Suspendido</span>
                                    ) : esCritico ? (
                                        <span className="status-badge-critical">Stock Crítico</span>
                                    ) : null}

                                    {/* Contenedor de Imagen */}
                                    <div className="d-flex align-items-center justify-content-center bg-white border-bottom" style={{ height: "200px", padding: "20px" }}>
                                        <img 
                                            src={p.imagen_url || "https://placehold.co/400x400?text=Sin+Imagen"} 
                                            className="mw-100 mh-100" 
                                            style={{ objectFit: "contain", opacity: p.suspendido ? 0.4 : 1 }} 
                                            alt={p.nombre} 
                                        />
                                    </div>

                                    {/* Detalles del Cuerpo */}
                                    <div className="card-body p-3 d-flex flex-column justify-content-between flex-grow-1">
                                        <div className="mb-2">
                                            <h6 className="fw-bold text-dark mb-1 text-truncate-2" style={{ fontSize: "14px", lineHeight: "1.3", height: "36px" }} title={p.nombre}>
                                                {p.nombre}
                                            </h6>
                                            <div className="text-muted font-monospace mb-2" style={{ fontSize: "11px" }}>
                                                Ref: {p.codigo_interno || "REF-" + p.id}
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="fw-bold text-dark" style={{ fontSize: "16px" }}>
                                                    ${Number(p.precio || 0).toLocaleString('es-CO')} COP
                                                </div>
                                                <span className={`small fw-semibold px-2 py-0.5 rounded ${esCritico ? 'bg-danger-subtle text-danger' : 'text-muted'}`} style={{ fontSize: "11px" }}>
                                                    {p.stock_total || 0} und.
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bloque de Acciones */}
                                        <div className="d-flex flex-column gap-1.5 mt-2">
                                            <button 
                                                onClick={() => abrirModal(p)} 
                                                className="btn btn-edit-action w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                                            >
                                                Editar Producto
                                            </button>
                                            <button 
                                                onClick={() => alternarEstadoProducto(p.id, p.suspendido === true)} 
                                                className={`btn btn-link text-decoration-none btn-sm py-1 fw-semibold ${p.suspendido ? 'text-success' : 'text-secondary'}`}
                                                style={{ fontSize: "11px" }}
                                            >
                                                {p.suspendido ? "Reactivar en Catálogo" : "Suspender de Catálogo"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Productos;