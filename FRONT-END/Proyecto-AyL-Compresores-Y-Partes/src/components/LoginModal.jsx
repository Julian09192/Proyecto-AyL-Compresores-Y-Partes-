import { useState } from "react";
import Swal from "sweetalert2";

function LoginModal({ setVista, onClose }) {
  // Estado para saber si mostramos Login o Registro
  const [isLogin, setIsLogin] = useState(true);
  
  // Estados para los campos
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Lógica de Inicio de Sesión
      if (correo === "admin" && password === "admin123") {
        onClose();
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          timer: 1500,
          showConfirmButton: false,
          didOpen: () => { Swal.getContainer().style.zIndex = "10000"; }
        }).then(() => setVista("admin"));
      } else {
        Swal.fire({ icon: "error", title: "Credenciales incorrectas" });
      }
    } else {
      // Lógica de Registro (Simulada)
      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Ahora puedes iniciar sesión",
        confirmButtonColor: "#F5A623"
      }).then(() => setIsLogin(true)); // Volvemos al login tras registrarse
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="login-card shadow-lg">
        <div className="login-header">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="main-title">Acceder a tu cuenta</h2>
              <p className="main-subtitle">Inicia sesión como cliente o administrador.</p>
            </div>
            <button className="close-x" onClick={onClose}>&times;</button>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS DINÁMICO */}
        <div className="tab-container">
          <div 
            className={`tab ${isLogin ? "active" : ""}`} 
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </div>
          <div 
            className={`tab ${!isLogin ? "active" : ""}`} 
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </div>
        </div>

        <div className="inner-form-box">
          <h3 className="inner-title">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h3>
          <p className="inner-subtitle">
            {isLogin ? "Ingresa tus credenciales" : "Regístrate para empezar a comprar"}
          </p>

          <form onSubmit={manejarEnvio}>
            {!isLogin && (
              <div className="mb-3">
                <label className="input-label">Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-control login-input" 
                  placeholder="Tu nombre completo"
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="input-label">Email / Usuario</label>
              <input 
                type="text" 
                className="form-control login-input" 
                placeholder="tu@email.com o admin"
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="input-label">Contraseña</label>
              <div className="position-relative">
                <input 
                  type="password" 
                  className="form-control login-input" 
                  placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="input-label">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  className="form-control login-input" 
                  placeholder="Confirma tu contraseña"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-login-orange">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          </form>

          {isLogin && (
            <div className="credentials-help">
              <p>💡 Credenciales de prueba:</p>
              <p>👤 <strong>Admin:</strong> admin / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;