import { useState } from "react";
import Swal from "sweetalert2";

function LoginModal({ onClose, login }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const API_URL = "http://localhost:3001/usuarios";

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      // 1. Traemos todos los usuarios para validar
      const response = await fetch(API_URL);
      const usuarios = await response.json();

      if (isLogin) {
        // ── LÓGICA DE LOGIN (Como tu ejemplo) ──
        const usuarioEncontrado = usuarios.find(
          (u) => 
            u.email.trim().toLowerCase() === email.trim().toLowerCase() && 
            u.password.trim() === password.trim()
        );

        if (usuarioEncontrado) {
          // GUARDAR EN LOCALSTORAGE (Igual que tu referencia)
          localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
          
          // GENERAR Y GUARDAR TOKEN
          const token = `jwt-${usuarioEncontrado.rol}--${Date.now()}`;
          localStorage.setItem("token", token);

          onClose();

          Swal.fire({
            icon: "success",
            title: "Inicio exitoso",
            confirmButtonColor: "#F5A623",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => login(usuarioEncontrado));

        } else {
          Swal.fire({ 
            icon: "error", 
            title: "Error", 
            text: "Correo o contraseña incorrectos",
            confirmButtonColor: "#F5A623"
          });
        }

      } else {
        // ── LÓGICA DE REGISTRO ──
        if (password !== confirmar) {
          Swal.fire({ icon: "error", title: "Las contraseñas no coinciden" });
          return;
        }

        const yaExiste = usuarios.find((u) => u.email === email);
        if (yaExiste) {
          Swal.fire({ icon: "error", title: "El correo ya está registrado" });
          return;
        }

        const nuevoUsuario = {
          nombre,
          email: email.trim(),
          password: password.trim(),
          rol: "cliente",
          telefono: "",
          empresa: "A&L Compresores y Partes"
        };

        const postRes = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoUsuario)
        });

        if (postRes.ok) {
          Swal.fire({
            icon: "success",
            title: "¡Cuenta creada!",
            text: "Ya puedes iniciar sesión.",
            confirmButtonColor: "#F5A623",
          }).then(() => setIsLogin(true));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ 
        icon: "error", 
        title: "Error de conexión", 
        text: "No es posible conectarse al servidor",
        confirmButtonColor: "#F5A623"
      });
    }
  };

  
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9998,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div className="bg-light shadow-lg p-3" style={{ width: "92%", maxWidth: 390, borderRadius: 24 }}>

        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="fw-bold fs-5 mb-1">Acceder a tu cuenta</h2>
            <p className="text-secondary mb-0" style={{ fontSize: "0.82rem" }}>
              Inicia sesión o crea una cuenta nueva.
            </p>
          </div>
          <button className="btn-close" onClick={onClose} />
        </div>

        {/* Pestañas */}
        <div className="bg-secondary bg-opacity-10 rounded-3 p-1 d-flex mb-3">
          {["Iniciar Sesión", "Registrarse"].map((tab, i) => {
            const activo = i === 0 ? isLogin : !isLogin;
            return (
              <button
                key={tab}
                className={`flex-fill border-0 rounded-3 py-2 fw-semibold ${activo ? "bg-white shadow-sm text-dark" : "bg-transparent text-secondary"}`}
                style={{ fontSize: "0.88rem", cursor: "pointer" }}
                onClick={() => setIsLogin(i === 0)}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-4 p-3 border">
          <h3 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h3>
          <p className="text-secondary mb-3" style={{ fontSize: "0.8rem" }}>
            {isLogin ? "Ingresa tus credenciales" : "Regístrate para empezar a comprar"}
          </p>

          <form onSubmit={manejarEnvio}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label fw-semibold small">Nombre Completo</label>
                <input type="text" className="form-control form-control-sm bg-light border-0"
                  placeholder="Tu nombre completo"
                  value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold small">
                {isLogin ? "Email / Usuario" : "Email"}
              </label>
              <input type="text" className="form-control form-control-sm bg-light border-0"
                placeholder={isLogin ? "tu@email.com o admin" : "tu@email.com"}
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Contraseña</label>
              <input type="password" className="form-control form-control-sm bg-light border-0"
                placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {!isLogin && (
              <div className="mb-3">
                <label className="form-label fw-semibold small">Confirmar Contraseña</label>
                <input type="password" className="form-control form-control-sm bg-light border-0"
                  placeholder="Repite tu contraseña"
                  value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
              </div>
            )}

            <button type="submit" className="w-100 border-0 rounded-3 fw-bold py-2 mt-1 text-white"
              style={{ background: "#F5A623", fontSize: "0.92rem", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#E8941A"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F5A623"}
            >
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          </form>

          {/* Credenciales de prueba */}
          {isLogin && (
            <div className="bg-light border rounded-3 p-2 mt-3" style={{ fontSize: "0.75rem" }}>
              <p className="mb-1 fw-semibold">
                <i className="bi bi-info-circle"></i> Credenciales de acceso:
              </p>
              <p className="mb-0">
                <i className="bi bi-person-circle"></i> <strong>Admin:</strong> admin / admin123
              </p>
              <p className="mb-0">
                <i className="bi bi-person-badge"></i> <strong>Empleado:</strong> juan.perez@alcompresores.com / emp123
              </p>
              <p className="mb-0">
                <i className="bi bi-cart"></i> <strong>Cliente:</strong> regístrate arriba
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;