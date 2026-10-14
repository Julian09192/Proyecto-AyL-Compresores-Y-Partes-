import { useEffect, useState, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import Header from "./Header.productos";
import Filtros from "./Filtros.productos";
import ProductoCard from "./Tarjeta.producto";

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

    // useCallback memoriza las funciones para que ProductoCard no se re-renderice sin sentido
    const alternarEstadoProducto = useCallback(async (id, estaSuspendido) => {
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
                
                Swal.fire({
                    title: "Estado Actualizado",
                    text: estaSuspendido ? "Producto reactivado con éxito." : "Producto suspendido con éxito.",
                    icon: "success",
                    confirmButtonColor: "#121212",
                    customClass: { popup: 'rounded-4' }
                });
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
    }, []);

    const abrirModal = useCallback(async (p = null) => {
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
                .swal-minimal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: left; }
                .swal-form-group { display: flex; flex-direction: column; gap: 6px; }
                .swal-form-group.full-width { grid-column: span 2; }
                .swal-form-group label { font-size: 12px; font-weight: 600; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; }
                .swal-minimal-input, .swal-minimal-select { 
                    width: 100%; height: 42px; padding: 0 14px; font-size: 14px; color: #212529;
                    background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; box-sizing: border-box;
                }
                #drop-zone-minimal { 
                    display: flex; align-items: center; justify-content: space-between;
                    border: 1px dashed #dee2e6; border-radius: 12px; padding: 14px 20px; cursor: pointer; background-color: #fafbfc; grid-column: span 2;
                }
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
                    <p id="label-foto" style="margin:0; font-size:13px; color: #6c757d;">
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
                        <div class="swal-form-group full-width"><label>Nombre</label><input id="nombre" class="swal-minimal-input" value="${p?.nombre || ""}"></div>
                        <div class="swal-form-group full-width"><label>Características</label><input id="caracteristicas" class="swal-minimal-input" value="${p?.caracteristicas || ""}"></div>
                        <div class="swal-form-group"><label>Precio ($)</label><input id="precio" type="number" class="swal-minimal-input" value="${p?.precio !== undefined ? p.precio : ""}"></div>
                    `;
                    if (["aceite_motor", "valvulina"].includes(t)) {
                        html += `
                            <div class="swal-form-group"><label>Marca</label><input id="marca" class="swal-minimal-input" value="${p?.marca || ""}"></div>
                            <div class="swal-form-group"><label>Categoría Vehículo</label><input id="categoria_vehiculo" class="swal-minimal-input" value="${p?.categoria_vehiculo || ""}"></div>
                            <div class="swal-form-group"><label>Stock Disponible</label><input id="stock" type="number" class="swal-minimal-input" value="${p?.stock_total !== undefined ? p.stock_total : ""}"></div>
                        `;
                    } else {
                        html += `
                            <div class="swal-form-group"><label>Código Interno</label><input id="codigo_interno" class="swal-minimal-input" value="${p?.codigo_interno || ""}"></div>
                            <div class="swal-form-group"><label>Marca</label><input id="marca" class="swal-minimal-input" value="${p?.marca || ""}"></div>
                            <div class="swal-form-group"><label>Stock Disponible</label><input id="stock" type="number" class="swal-minimal-input" value="${p?.stock_total !== undefined ? p.stock_total : ""}"></div>
                        `;
                    }
                    contenedor.innerHTML = html;
                };

                if (p?.tipo) renderCampos(p.tipo);
                
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
                if (selectElement && selectElement.value) tipoSeleccionadoLocal = selectElement.value;

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
                Swal.fire({ title: "Éxito", text: "Producto guardado con éxito.", icon: "success", confirmButtonColor: "#121212", customClass: { popup: 'rounded-4' } });
            } catch (err) { 
                console.error("Error al guardar:", err);
                Swal.fire({ title: "Error", text: `No se pudo guardar: ${err.message || err}`, icon: "error", confirmButtonColor: "#121212", customClass: { popup: 'rounded-4' } }); 
            }
        }
    }, []);

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
                .product-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; transition: transform 0.22s ease, box-shadow 0.22s ease; }
                .product-card:hover { transform: translateY(-4px); border-color: #121212; box-shadow: 0 10px 20px rgba(0,0,0,0.04); }
                .brand-badge { position: absolute; top: 14px; left: 14px; background-color: #121212; color: #ffffff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 5px 12px; border-radius: 6px; z-index: 2; }
                .status-badge-suspended { position: absolute; top: 14px; right: 14px; background-color: #ffffff; color: #94a3b8; border: 1px solid #e2e8f0; font-size: 10px; font-weight: 600; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; z-index: 2; }
                .status-badge-critical { position: absolute; top: 14px; right: 14px; background-color: #121212; color: #F5A623; border: 1px solid #121212; font-size: 10px; font-weight: 600; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; z-index: 2; }
                .btn-edit-action { background-color: #121212; color: #ffffff; font-weight: 600; border: 1px solid #121212; border-radius: 8px; font-size: 13px; transition: all 0.2s ease; }
                .btn-edit-action:hover { background-color: #2a2a2a; color: #ffffff; }
            `}</style>

            <Header 
                busqueda={busqueda} 
                setBusqueda={setBusqueda} 
                onNuevoProducto={() => abrirModal()} 
            />

            <Filtros 
                filtroEstado={filtroEstado} 
                setFiltroEstado={setFiltroEstado} 
                filtroOrden={filtroOrden} 
                setFiltroOrden={setFiltroOrden} 
            />

            {filtrados.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border p-4 shadow-sm">
                    <p className="text-muted small mb-0 fw-medium">No hay productos en inventario que coincidan con los filtros aplicados.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {filtrados.map((p) => (
                        <ProductoCard 
                            key={p.id} 
                            producto={p} 
                            onEditar={abrirModal} 
                            onAlternarEstado={alternarEstadoProducto} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Productos;