import React, { useState } from "react";
import Swal from "sweetalert2";

function ProfilePage({ usuario, setVista, volverA }) {
    const [editando, setEditando] = useState(false);
    const [datosForm, setDatosForm] = useState({
        nombre: usuario?.nombre || "",
        email: usuario?.email || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosForm(prev => ({ ...prev, [name]: value }));
    };

    const handleGuardar = () => {
        Swal.fire({
            icon: "success",
            title: "Datos actualizados",
            text: "Tu perfil ha sido modificado con éxito.",
            confirmButtonColor: "#000"
        });
        setEditando(false);
    };

    return (
        <div className="bg-white min-vh-100 py-5">
            <div className="container" style={{ maxWidth: "700px" }}>
                
                <div className="d-flex align-items-center mb-4">
                    <button
                        className="btn btn-outline-dark border-0 me-3"
                        onClick={() => setVista(volverA || "inicio")} // Si no le decimos a dónde, vuelve a "inicio"
                    >
                        <i className="bi bi-arrow-left fs-4"></i>
                    </button>
                    <div>
                        <h2 className="fw-bold mb-0">Mi Perfil</h2>
                        <p className="text-muted small">Gestiona tu información personal</p>
                    </div>
                </div>

                {/* Tarjeta de datos */}
                <div className="card border-0 shadow-sm p-4 rounded-4">
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="small text-muted fw-bold text-uppercase">Nombre Completo</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form-control form-control-lg"
                                value={datosForm.nombre}
                                onChange={handleChange}
                                disabled={!editando}
                            />
                        </div>
                        <div className="col-12">
                            <label className="small text-muted fw-bold text-uppercase">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg"
                                value={datosForm.email}
                                onChange={handleChange}
                                disabled={!editando}
                            />
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-top">
                        {editando ? (
                            <div className="d-flex gap-2">
                                <button className="btn btn-dark w-100 py-2 fw-bold" onClick={handleGuardar}>
                                    Guardar Cambios
                                </button>
                                <button className="btn btn-outline-secondary w-100 py-2 fw-bold" onClick={() => setEditando(false)}>
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-outline-dark w-100 py-2 fw-bold" onClick={() => setEditando(true)}>
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;