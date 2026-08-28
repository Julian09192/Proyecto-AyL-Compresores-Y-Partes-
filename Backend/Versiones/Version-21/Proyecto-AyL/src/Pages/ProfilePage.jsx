import React, { useState } from "react";
import Swal from "sweetalert2";

function ProfilePage({ usuario, setVista, volverA }) {
  const [editando, setEditando] = useState(false);
  
  // Estado inicial extendido con más propiedades útiles
  const [datosForm, setDatosForm] = useState({
    nombre: usuario?.nombre || "Usuario Invitado",
    email: usuario?.email || "correo@ejemplo.com",
    telefono: usuario?.telefono || "",
    ciudad: usuario?.ciudad || "",
  });

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosForm((prev) => ({ ...prev, [name]: value }));
  };

  // Botón Cancelar restablece los datos originales del prop
  const handleCancelar = () => {
    setDatosForm({
      nombre: usuario?.nombre || "Usuario Invitado",
      email: usuario?.email || "correo@ejemplo.com",
      telefono: usuario?.telefono || "",
      ciudad: usuario?.ciudad || "",
    });
    setEditando(false);
  };

  // Guardado simulado con SweetAlert2 optimizado
  const handleGuardar = () => {
    if (!datosForm.nombre.trim() || !datosForm.email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Campos obligatorios",
        text: "Por favor, completa el nombre y el correo electrónico.",
        confirmButtonColor: "#212529"
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Perfil Actualizado!",
      text: "Tu información se ha modificado con éxito en el sistema.",
      confirmButtonColor: "#ffc107",
      customClass: {
        confirmButton: "text-dark fw-bold rounded-pill px-4"
      }
    });
    setEditando(false);
  };

  // Obtener iniciales para el Avatar dinámico
  const obtenerIniciales = (nombre) => {
    if (!nombre) return "U";
    return nombre
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-light min-vh-100 seccion-perfil-contenedor">
      <div className="container container-max-width">
        
        {/* Encabezado y Botón de Retorno */}
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-white shadow-sm rounded-circle me-3 boton-regresar-perfil"
              onClick={() => setVista(volverA || "inicio")}
              title="Volver"
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>
            <div>
              <h2 className="fw-bold mb-0 text-dark header-titulo-perfil">Mi Cuenta</h2>
              <p className="text-secondary small mb-0">Gestiona la información de tu perfil y preferencias</p>
            </div>
          </div>

          <span className="badge bg-dark-subtle text-dark border px-3 py-2 rounded-pill small fw-medium">
            <i className="bi bi-shield-check me-1 text-success"></i> Cuenta Activa
          </span>
        </div>

        {/* Dashboard de Perfil en Dos Columnas */}
        <div className="row g-4">
          
          {/* Columna Izquierda: Tarjeta de Identidad (Avatar) */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm text-center p-4 rounded-4 bg-white h-100 d-flex flex-column justify-content-center align-items-center">
              <div className="avatar-perfil-circulo mb-3">
                {obtenerIniciales(datosForm.nombre)}
              </div>
              <h5 className="fw-bold text-dark mb-1 text-truncate w-100 px-2">
                {datosForm.nombre}
              </h5>
              <p className="text-muted small mb-3 text-truncate w-100 px-2">
                {datosForm.email}
              </p>
              <div className="pt-2 w-100 border-top border-light">
                <div className="row g-2 text-start mt-2">
                  <div className="col-6">
                    <span className="text-muted small d-block">Rol de Cuenta</span>
                    <span className="fw-bold text-secondary small">Cliente Premium</span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small d-block">Ubicación</span>
                    <span className="fw-bold text-secondary small">{datosForm.ciudad || "No asignada"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Datos */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
              <h5 className="fw-bold text-dark mb-4 pb-2 border-bottom">
                <i className="bi bi-person-gear me-2 text-warning"></i>Información Personal
              </h5>

              <div className="row g-3">
                {/* Campo: Nombre */}
                <div className="col-md-6">
                  <label className="form-label-custom">Nombre Completo</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.nombre}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                </div>

                {/* Campo: Correo Electrónico */}
                <div className="col-md-6">
                  <label className="form-label-custom">Correo Electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.email}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                {/* Campo: Teléfono (Nuevo) */}
                <div className="col-md-6">
                  <label className="form-label-custom">Teléfono / WhatsApp</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.telefono}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ej. +57 300 123 4567"
                    />
                  </div>
                </div>

                {/* Campo: Ciudad/Ubicación (Nuevo) */}
                <div className="col-md-6">
                  <label className="form-label-custom">Ciudad / Ubicación</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                      type="text"
                      name="ciudad"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.ciudad}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ej. Bogotá, Colombia"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque de Acciones Dinámicas */}
              <div className="mt-5 pt-3 border-top d-flex justify-content-end">
                {editando ? (
                  <div className="d-flex gap-3 grupo-botones-perfil">
                    <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" onClick={handleCancelar}>
                      Cancelar
                    </button>
                    <button className="btn btn-warning rounded-pill px-4 fw-bold btn-guardar-perfil-custom" onClick={handleGuardar}>
                      <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-dark rounded-pill px-4 fw-bold btn-editar-perfil-custom" onClick={() => setEditando(true)}>
                    <i className="bi bi-pencil-square me-2"></i>Editar Datos de Perfil
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Estilos Modulares Internos */}
      <style>{`
        .seccion-perfil-contenedor {
          padding-top: 100px;
          padding-bottom: 60px;
        }
        .container-max-width {
          max-width: 960px;
        }
        .boton-regresar-perfil {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #EAEAEA;
          color: #212529;
          transition: background-color 0.2s, transform 0.2s;
        }
        .boton-regresar-perfil:hover {
          background-color: #212529;
          color: #fff;
          transform: scale(1.05);
        }
        .header-titulo-perfil {
          color: #10142D;
        }
        .avatar-perfil-circulo {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
          color: #212529;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 10px 20px rgba(255, 193, 7, 0.2);
        }
        .form-label-custom {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #6C757D;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }
        .form-control-custom {
          border-left: none !important;
          border-radius: 0 12px 12px 0 !important;
          font-size: 0.95rem;
          padding: 10px 12px;
        }
        .form-control-custom:focus {
          border-color: #dee2e6 !important;
          box-shadow: none !important;
        }
        .input-group-text {
          border-radius: 12px 0 0 12px !important;
          border-color: #dee2e6 !important;
          padding-left: 15px;
          padding-right: 5px;
        }
        .bg-light-disabled:disabled {
          background-color: #F8F9FA !important;
          color: #6C757D;
          opacity: 0.85;
          cursor: not-allowed;
          border-color: #E9ECEF !important;
        }
        .bg-light-disabled:not(:disabled) {
          background-color: #FFF !important;
          border-color: #FFC107 !important;
        }
        .bg-light-disabled:not(:disabled) + .input-group-text {
          border-color: #FFC107 !important;
        }
        .btn-editar-perfil-custom {
          transition: transform 0.2s;
        }
        .btn-editar-perfil-custom:hover {
          transform: translateY(-2px);
        }
        .btn-guardar-perfil-custom {
          background-color: #FFC107;
          border-color: #FFC107;
          color: #212529;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-guardar-perfil-custom:hover {
          background-color: #E0A800;
          border-color: #E0A800;
          color: #212529;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }
        @media (max-width: 576px) {
          .grupo-botones-perfil {
            width: 100%;
            flex-direction: column;
          }
          .grupo-botones-perfil button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;