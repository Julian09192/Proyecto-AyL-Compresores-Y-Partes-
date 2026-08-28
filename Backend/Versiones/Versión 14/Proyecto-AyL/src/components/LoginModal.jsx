import { useState } from "react";
import Swal from "sweetalert2";
import { auth } from "../firebaseconfig.js"; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";

function LoginModal({ onClose, login }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const API_URL = "http://localhost:3002/usuarios";

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const emailLower = email.trim().toLowerCase();
    
    try {
      if (isLogin) {
        // 1. INTENTAR LOGIN LOCAL (Para Admin/Empleado en db.json)
        const response = await fetch(`${API_URL}?email=${emailLower}`);
        const usuariosEncontrados = await response.json();
        
        // JSON Server devuelve un array, tomamos el primer elemento si existe
        const usuarioLocal = usuariosEncontrados.length > 0 ? usuariosEncontrados[0] : null;

        if (usuarioLocal && usuarioLocal.password === password) {
          const usuarioData = {
            nombre: usuarioLocal.nombre,
            email: usuarioLocal.email,
            rol: usuarioLocal.rol,
            id: usuarioLocal.id
          };
          
          Swal.fire({ 
            icon: "success", 
            title: `¡Bienvenido, ${usuarioData.nombre}!`, 
            text: "Acceso concedido como administrador/empleado",
            timer: 2000, 
            showConfirmButton: false,
            confirmButtonColor: "#F5A623"
          }).then(() => {
            login(usuarioData);
            onClose();
          });
          return;
        }

        // 2. SI NO ESTÁ EN EL JSON, IR POR FIREBASE (Para Clientes)
        const userCredential = await signInWithEmailAndPassword(auth, emailLower, password.trim());
        const firebaseUser = userCredential.user;

        let rolFinal = "cliente";
        if (firebaseUser.email === "admin@ayl.com") {
          rolFinal = "admin";
        }

        const usuarioData = {
          nombre: firebaseUser.displayName || (rolFinal === "admin" ? "Administrador" : "Cliente"),
          email: firebaseUser.email,
          rol: rolFinal,
          uid: firebaseUser.uid
        };

        // Alerta de éxito para Firebase
        Swal.fire({
          icon: "success",
          title: "¡Sesión iniciada!",
          text: `Hola de nuevo, ${usuarioData.nombre}`,
          confirmButtonColor: "#F5A623",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          login(usuarioData);
          onClose();
        });

      } else {
        // REGISTRO DE NUEVOS CLIENTES
        if (password !== confirmar) {
          Swal.fire({ icon: "error", title: "Las contraseñas no coinciden", confirmButtonColor: "#10142D" });
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password.trim());
        await updateProfile(userCredential.user, { displayName: nombre });

        // Guardar en JSON Server para mantener consistencia si es necesario
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            email: emailLower,
            rol: "cliente",
            password: password, // Nota: Por seguridad, idealmente no guardarías pass en texto plano en JSON si ya usas Firebase
            empresa: "A&L Compresores y Partes"
          })
        });

        Swal.fire({ 
            icon: "success", 
            title: "¡Cuenta creada!", 
            text: "Ahora puedes ingresar con tus credenciales",
            confirmButtonColor: "#F5A623" 
        }).then(() => setIsLogin(true));
      }
    } catch (error) {
      console.error(error);
      let mensajeError = "Verifica tus credenciales";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        mensajeError = "Correo o contraseña incorrectos";
      }
      
      Swal.fire({ 
        icon: "error", 
        title: "Error de acceso", 
        text: mensajeError,
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
        style={{ 
            width: "92%", 
            maxWidth: 420, 
            borderRadius: 28, 
            overflow: "hidden",
            fontFamily: "'Montserrat', sans-serif" 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: "6px", background: "linear-gradient(90deg, #F5A623 0%, #10142D 100%)" }} />

        <div className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold fs-4 mb-0" style={{ color: "#10142D" }}>
                {isLogin ? "¡Hola de nuevo!" : "Crear cuenta"}
              </h2>
              <p className="text-muted small mb-0">Sistema A&L Compresores</p>
            </div>
            <button className="btn-close shadow-none" onClick={onClose} />
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
                <input type="text" className="form-control border-0 bg-light shadow-none" placeholder="Nombre" 
                value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                <label className="text-muted small">Nombre Completo</label>
              </div>
            )}

            <div className="form-floating mb-3">
              <input type="email" className="form-control border-0 bg-light shadow-none" placeholder="Email" 
              value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label className="text-muted small">Correo Electrónico</label>
            </div>

            <div className="form-floating mb-3">
              <input type="password" className="form-control border-0 bg-light shadow-none" placeholder="Contraseña" 
              value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label className="text-muted small">Contraseña</label>
            </div>

            {!isLogin && (
              <div className="form-floating mb-3">
                <input type="password" className="form-control border-0 bg-light shadow-none" placeholder="Repetir" 
                value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
                <label className="text-muted small">Confirmar Contraseña</label>
              </div>
            )}

            <button type="submit" className="btn btn-warning w-100 py-3 fw-bold mt-2 shadow-sm text-white"
              style={{ borderRadius: "14px", letterSpacing: "1px", backgroundColor: "#F5A623", border: "none" }}>
              {isLogin ? "INICIAR SESIÓN" : "REGISTRARME"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;