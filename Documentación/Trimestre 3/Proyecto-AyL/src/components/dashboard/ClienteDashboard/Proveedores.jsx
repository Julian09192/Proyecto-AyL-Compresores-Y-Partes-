import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/proveedores";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nombre: "",
        contacto: "",
        email: "",
        telefono: "",
        categoria: "Compresores"
    });

    useEffect(() => {
        obtenerProveedores();
    }, []);

    const obtenerProveedores = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setProveedores(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const abrirModalNuevo = () => {
        setEditando(false);
        setFormData({ id: null, nombre: "", contacto: "", email: "", telefono: "", categoria: "Compresores" });
        setModalAbierto(true);
    };

    const prepararEdicion = (proveedor) => {
        setEditando(true);
        setFormData(proveedor);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const guardarProveedor = async (e) => {
        e.preventDefault();
        const metodo = editando ? "PUT" : "POST";
        const url = editando ? `${API_URL}/${formData.id}` : API_URL;

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                obtenerProveedores();
                cerrarModal();
            }
        } catch (error) {
            alert("Error al guardar los datos");
        }
    };

    const eliminarProveedor = async (id) => {
        if (confirm("¿Eliminar este proveedor?")) {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            obtenerProveedores();
        }
    };

    const proveedoresFiltrados = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Proveedores</h2>
                    <p className="text-secondary small">Panel de administración de suministros</p>
                </div>
                <button
                    className="btn text-white px-4 fw-bold shadow-sm"
                    style={{ backgroundColor: "#F5A623", borderRadius: "10px" }}
                    onClick={abrirModalNuevo}
                >
                    <i className="bi bi-plus-lg me-2"></i> Nuevo Proveedor
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-0">
                    <div className="p-3 border-bottom">
                        <input
                            type="text" className="form-control bg-light border-0"
                            placeholder="Buscar proveedor..."
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ maxWidth: "300px" }}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr style={{ fontSize: "0.8rem" }}>
                                    <th className="px-4 py-3 border-0">PROVEEDOR</th>
                                    <th className="py-3 border-0">CONTACTO</th>
                                    <th className="py-3 border-0">CATEGORÍA</th>
                                    <th className="px-4 py-3 border-0 text-end">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proveedoresFiltrados.map((p) => (
                                    <tr key={p.id}>
                                        <td className="px-4 py-3">
                                            <div className="fw-bold">{p.nombre}</div>
                                            <div className="small text-secondary">{p.email}</div>
                                        </td>
                                        <td className="py-3">{p.contacto}</td>
                                        <td className="py-3">
                                            <span className="badge bg-light text-dark border">{p.categoria}</span>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <button
                                                className="btn btn-sm btn-light border me-2"
                                                onClick={() => prepararEdicion(p)}
                                            >
                                                <i className="bi bi-pencil text-primary"></i>
                                            </button>
                                            <button className="btn btn-sm btn-light border" onClick={() => eliminarProveedor(p.id)}>
                                                <i className="bi bi-trash text-danger"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {modalAbierto && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={cerrarModal}
                        style={{
                            position: "fixed",
                            top: 0, left: 0,
                            width: "100vw", height: "100vh",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 1040
                        }}
                    />
                    {/* Contenedor centrado con scroll */}
                    <div
                        style={{
                            position: "fixed",
                            top: 0, left: 0,
                            width: "100vw", height: "100vh",
                            zIndex: 1050,
                            display: "flex",
                            alignItems: "center",      // 👈 centra verticalmente
                            justifyContent: "center",  // 👈 centra horizontalmente
                            padding: "20px",
                            boxSizing: "border-box"
                        }}
                    >
                        <div style={{
                            backgroundColor: "#fff",
                            borderRadius: "16px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                            width: "100%",
                            maxWidth: "500px",         // 👈 ancho máximo del modal
                        }}>
                            <form onSubmit={guardarProveedor}>
                                {/* Header */}
                                <div style={{ padding: "20px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h5 className="fw-bold mb-0">{editando ? "Editar Proveedor" : "Nuevo Proveedor"}</h5>
                                    <button type="button" className="btn-close" onClick={cerrarModal}></button>
                                </div>

                                {/* Body */}
                                <div style={{ padding: "0 24px" }}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Nombre de la Empresa</label>
                                        <input type="text" name="nombre" className="form-control" required
                                            placeholder="Ej: Empresa S.A.S"
                                            value={formData.nombre} onChange={handleInputChange} />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Contacto</label>
                                            <input type="text" name="contacto" className="form-control" required
                                                placeholder="Nombre del contacto"
                                                value={formData.contacto} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Teléfono</label>
                                            <input type="text" name="telefono" className="form-control" required
                                                placeholder="Ej: 3001234567"
                                                value={formData.telefono} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Correo Electrónico</label>
                                        <input type="email" name="email" className="form-control" required
                                            placeholder="correo@empresa.com"
                                            value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Categoría</label>
                                        <select name="categoria" className="form-select"
                                            value={formData.categoria} onChange={handleInputChange}>
                                            <option value="Compresores">Compresores</option>
                                            <option value="Filtros">Filtros</option>
                                            <option value="Lubricantes">Lubricantes</option>
                                            <option value="Repuestos">Repuestos</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div style={{ padding: "12px 24px 20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                    <button type="button" className="btn btn-light px-4" onClick={cerrarModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn text-white px-4" style={{ backgroundColor: "#F5A623" }}>
                                        {editando ? "Actualizar" : "Guardar Proveedor"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Proveedores;