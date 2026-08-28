// src/Pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiFetch } from "../lib/api";

function ProfilePage({ usuario, setVista, volverA, onUsuarioUpdate }) {
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  const [datosForm, setDatosForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    usuario: "",
    rol: "cliente"
  });

  useEffect(() => {
    if (usuario) {
      console.log("ID del usuario en ProfilePage:", usuario.id);
      console.log("Usuario completo:", usuario);
      
      setDatosForm({
        nombre: usuario.nombre || usuario.usuario || "Usuario",
        email: usuario.email || "correo@ejemplo.com",
        telefono: usuario.telefono || "",
        ciudad: usuario.ciudad || "",
        usuario: usuario.usuario || "",
        rol: usuario.rol || "cliente"
      });
      setCargandoPerfil(false);
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelar = () => {
    if (usuario) {
      setDatosForm({
        nombre: usuario.nombre || usuario.usuario || "Usuario",
        email: usuario.email || "correo@ejemplo.com",
        telefono: usuario.telefono || "",
        ciudad: usuario.ciudad || "",
        usuario: usuario.usuario || "",
        rol: usuario.rol || "cliente"
      });
    }
    setEditando(false);
  };

  const handleGuardar = async () => {
    if (!datosForm.nombre.trim()) {
      Swal.fire({
        icon: "error",
        title: "Campo obligatorio",
        text: "Por favor, completa tu nombre.",
        confirmButtonColor: "#212529"
      });
      return;
    }

    setLoading(true);

    try {
      if (!usuario?.id) {
        throw new Error("ID de usuario no valido");
      }

      const usuarioId = usuario.id.trim();
      console.log("Enviando peticion a:", `/usuario/${usuarioId}`);

      const response = await apiFetch(`/usuario/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: datosForm.nombre,
          telefono: datosForm.telefono,
          ciudad: datosForm.ciudad,
          usuario: datosForm.usuario
        })
      });

      console.log("Respuesta del servidor:", response);

      Swal.fire({
        icon: "success",
        title: "Perfil Actualizado",
        text: "Tu informacion se ha modificado con exito.",
        confirmButtonColor: "#ffc107",
        timer: 2000,
        showConfirmButton: true
      });

      const usuarioActualizado = {
        ...usuario,
        nombre: datosForm.nombre,
        telefono: datosForm.telefono,
        ciudad: datosForm.ciudad
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      if (onUsuarioUpdate) {
        onUsuarioUpdate(usuarioActualizado);
      }

      setEditando(false);

    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message || "No se pudo actualizar el perfil",
        confirmButtonColor: "#212529"
      });
    } finally {
      setLoading(false);
    }
  };

  const obtenerIniciales = (nombre) => {
    if (!nombre) return "U";
    return nombre
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const mostrarBotonDashboard = usuario?.rol && ["admin", "empleado"].includes(usuario.rol);
  const vistaDashboard = usuario?.rol === "admin" ? "admin" : "empleado";

  if (cargandoPerfil) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (!usuario || !usuario.id) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
          <h3 className="mt-3">Usuario no encontrado</h3>
          <p className="text-muted">Por favor, cierra sesion y vuelve a iniciar.</p>
          <button 
            className="btn btn-warning mt-3"
            onClick={() => {
              localStorage.removeItem("usuario");
              window.location.reload();
            }}
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 seccion-perfil-contenedor">
      <div className="container container-max-width">

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
              <p className="text-secondary small mb-0">Gestiona la informacion de tu perfil y preferencias</p>
            </div>
          </div>

          <span className="badge bg-dark-subtle text-dark border px-3 py-2 rounded-pill small fw-medium">
            <i className="bi bi-shield-check me-1 text-success"></i> Cuenta Activa
          </span>
        </div>

        <div className="row g-4">

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm text-center p-4 rounded-4 bg-white h-100 d-flex flex-column justify-content-center align-items-center">
              <div className="avatar-perfil-circulo mb-3">
                {obtenerIniciales(datosForm.nombre)}
              </div>
              <h5 className="fw-bold text-dark mb-1 text-truncate w-100 px-2">
                {datosForm.nombre || datosForm.usuario || "Usuario"}
              </h5>
              <p className="text-muted small mb-3 text-truncate w-100 px-2">
                {datosForm.email}
              </p>
              <div className="pt-2 w-100 border-top border-light">
                <div className="row g-2 text-start mt-2">
                  <div className="col-6">
                    <span className="text-muted small d-block">Rol de Cuenta</span>
                    <span className="fw-bold text-secondary small text-capitalize">
                      {datosForm.rol || "cliente"}
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small d-block">Ubicacion</span>
                    <span className="fw-bold text-secondary small">
                      {datosForm.ciudad || "No asignada"}
                    </span>
                  </div>
                </div>
              </div>

              {mostrarBotonDashboard && (
                <button
                  className="btn btn-warning w-100 py-2 mt-4 fw-bold shadow-sm"
                  style={{ borderRadius: "10px", fontSize: "0.85rem", transition: "0.2s" }}
                  onClick={() => setVista(vistaDashboard)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E0A800"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFC107"; }}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Ir a mi Dashboard
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
              <h5 className="fw-bold text-dark mb-4 pb-2 border-bottom">
                <i className="bi bi-person-gear me-2 text-warning"></i>Informacion Personal
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Nombre de Usuario</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      name="usuario"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.usuario || ""}
                      onChange={handleChange}
                      disabled={true}
                      style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                    />
                  </div>
                  <small className="text-muted">El nombre de usuario no se puede modificar</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label-custom">Nombre Completo</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-person-badge"></i>
                    </span>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.nombre || ""}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ej. Juan Perez"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label-custom">Correo Electronico</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.email || ""}
                      onChange={handleChange}
                      disabled={true}
                      style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                    />
                  </div>
                  <small className="text-muted">El correo no se puede modificar</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label-custom">Telefono / WhatsApp</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.telefono || ""}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ej. +57 300 123 4567"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label-custom">Ciudad / Ubicacion</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                      type="text"
                      name="ciudad"
                      className="form-control form-control-custom bg-light-disabled"
                      value={datosForm.ciudad || ""}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ej. Bogota, Colombia"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-top d-flex justify-content-end">
                {editando ? (
                  <div className="d-flex gap-3 grupo-botones-perfil">
                    <button
                      className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                      onClick={handleCancelar}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-warning rounded-pill px-4 fw-bold btn-guardar-perfil-custom"
                      onClick={handleGuardar}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                        </>
                      )}
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
        .btn-guardar-perfil-custom:hover:not(:disabled) {
          background-color: #E0A800;
          border-color: #E0A800;
          color: #212529;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }
        .btn-guardar-perfil-custom:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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