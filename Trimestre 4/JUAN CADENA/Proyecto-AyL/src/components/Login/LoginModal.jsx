import { useState } from "react";
import Swal from "sweetalert2";

function LoginModal({ onClose, login }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // ÚNICO CAMBIO: Apuntar a tu ruta de login en el backend
  const API_URL = "http://localhost:3001/login-local";

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // En lugar de traer todos los usuarios y filtrar, enviamos las credenciales al servidor
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password: password.trim() })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Guardamos el token y el objeto usuario que ya trae el ROL de MySQL
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("token", data.token);
          
          onClose();
          Swal.fire({
            icon: "success",
            title: "¡Bienvenido de nuevo!",
            text: `Hola, ${data.usuario.nombre}`,
            confirmButtonColor: "#F5A623",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => login(data.usuario)); // El login recibe el rol para los dashboards
        } else {
          Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Correo o contraseña incorrectos",
            confirmButtonColor: "#10142D"
          });
        }
      } else {
        // Tu lógica de registro se mantiene igual
        if (password !== confirmar) {
          Swal.fire({ icon: "error", title: "Las contraseñas no coinciden" });
          return;
        }
        // ... (resto de tu lógica de registro)
        Swal.fire({ icon: "info", title: "Registro", text: "Función de registro para MySQL en desarrollo" });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Asegúrate de que el servidor en el puerto 3001 esté encendido.",
        confirmButtonColor: "#10142D"
      });
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(16, 20, 45, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 9998,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg border-0"
        style={{ width: "92%", maxWidth: 420, borderRadius: 28, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: "6px", background: "linear-gradient(90deg, #F5A623 0%, #10142D 100%)" }} />

        <div className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold fs-4 mb-0" style={{ color: "#10142D" }}>
                {isLogin ? "¡Hola de nuevo!" : "Únete a nosotros"}
              </h2>
              <p className="text-muted small mb-0">Gestiona tus pedidos industriales</p>
            </div>
            <button className="btn-close shadow-none" onClick={onClose} />
          </div>

          <button
            className="btn btn-outline-light border w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
            style={{ borderRadius: "12px", color: "#444", transition: "0.3s" }}
            onClick={() => {
              onClose();
              setTimeout(() => {
                Swal.fire({
                  title: "Función en desarrollo",
                  text: "La integración con Google estará lista pronto.",
                  icon: "info",
                  confirmButtonColor: "#F5A623"
                });
              }, 100);
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="google" />
            <span className="fw-bold" style={{ fontSize: "0.9rem" }}>Continuar con Google</span>
          </button>

          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1 text-muted opacity-25" />
            <span className="px-3 text-muted small fw-bold">O CON TU CORREO</span>
            <hr className="flex-grow-1 text-muted opacity-25" />
          </div>

          <div className="bg-light rounded-pill p-1 d-flex mb-4" style={{ border: "1px solid #eee" }}>
            <button
              className={`flex-fill border-0 rounded-pill py-2 fw-bold transition-all ${isLogin ? "bg-white shadow-sm text-warning" : "bg-transparent text-secondary"}`}
              style={{ fontSize: "0.8rem" }}
              onClick={() => setIsLogin(true)}
            >
              INGRESAR
            </button>
            <button
              className={`flex-fill border-0 rounded-pill py-2 fw-bold transition-all ${!isLogin ? "bg-white shadow-sm text-warning" : "bg-transparent text-secondary"}`}
              style={{ fontSize: "0.8rem" }}
              onClick={() => setIsLogin(false)}
            >
              REGISTRARSE
            </button>
          </div>

          <form onSubmit={manejarEnvio}>
            {!isLogin && (
              <div className="form-floating mb-3">
                <input type="text" className="form-control border-0 bg-light shadow-none" 
                  placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                <label className="text-muted small">Nombre Completo</label>
              </div>
            )}

            <div className="form-floating mb-3">
              <input type="email" className="form-control border-0 bg-light shadow-none" 
                placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label className="text-muted small">Correo Electrónico</label>
            </div>

            <div className="form-floating mb-3">
              <input type="password" className="form-control border-0 bg-light shadow-none" 
                placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label className="text-muted small">Contraseña</label>
            </div>

            {!isLogin && (
              <div className="form-floating mb-3">
                <input type="password" className="form-control border-0 bg-light shadow-none" 
                  placeholder="Repetir" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
                <label className="text-muted small">Confirmar Contraseña</label>
              </div>
            )}

            <button type="submit" className="btn btn-warning w-100 py-3 fw-bold mt-2 shadow-sm"
              style={{ borderRadius: "14px", letterSpacing: "1px" }}>
              {isLogin ? "INICIAR SESIÓN" : "CREAR CUENTA GRATIS"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;