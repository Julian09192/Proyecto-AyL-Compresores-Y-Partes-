import { useState } from "react";
import Swal from "sweetalert2";
import { auth } from "../firebaseconfig"; 
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

  const API_URL = "http://localhost:3001/usuarios";

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const emailLower = email.trim().toLowerCase();
    
    try {
      if (isLogin) {
        const response = await fetch(`${API_URL}?email=${emailLower}`);
        const usuariosEncontrados = await response.json();
        const usuarioLocal = usuariosEncontrados;

        if (usuarioLocal && (usuarioLocal.rol === "admin" || usuarioLocal.rol === "empleado")) {
          if (usuarioLocal.password === password) {
            const usuarioData = {
              nombre: usuarioLocal.nombre,
              email: usuarioLocal.email,
              rol: usuarioLocal.rol,
              uid: usuarioLocal.id
            };
            finalizarYRefrescar(usuarioData);
            return;
          } else {
            Swal.fire({ icon: "error", title: "Contraseña incorrecta localmente" });
            return;
          }
        }


        const userCredential = await signInWithEmailAndPassword(auth, emailLower, password.trim());
        const firebaseUser = userCredential.user;

        const usuarioData = {
          nombre: firebaseUser.displayName || "Cliente",
          email: firebaseUser.email,
          rol: usuarioLocal ? usuarioLocal.rol : "cliente",
          uid: firebaseUser.uid
        };
        finalizarYRefrescar(usuarioData);

      } else {
        // REGISTRO
        if (password !== confirmar) {
          Swal.fire({ icon: "error", title: "Las contraseñas no coinciden" });
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password.trim());
        await updateProfile(userCredential.user, { displayName: nombre });

        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            email: emailLower,
            rol: "cliente",
            password: password,
            empresa: "A&L Compresores y Partes"
          })
        });

        Swal.fire({ icon: "success", title: "Cuenta creada" }).then(() => setIsLogin(true));
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Verifica tus credenciales" });
    }
  };

  const finalizarYRefrescar = (datos) => {
    // GUARDAR EXACTAMENTE COMO TU APP.JSX LO BUSCA
    localStorage.setItem("al_usuario", JSON.stringify(datos));
    
    let vistaDestino = "inicio";
    if (datos.rol === "admin") vistaDestino = "admin";
    else if (datos.rol === "empleado") vistaDestino = "cliente";
    
    localStorage.setItem("al_vista", vistaDestino);

    onClose();

    Swal.fire({
      icon: "success",
      title: "¡Bienvenido!",
      text: `Iniciando como ${datos.rol}`,
      timer: 1000,
      showConfirmButton: false,
    }).then(() => {
      // LLAMAR A LA FUNCIÓN DE APP.JSX
      login(datos);
      
      // FORZAR RECARGA PARA QUE EL SWITCH(VISTA) SE ACTUALICE
      window.location.reload(); 
    });
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

            <button type="submit" className="btn btn-warning w-100 py-3 fw-bold mt-2 shadow-sm"
              style={{ borderRadius: "14px", letterSpacing: "1px" }}>
              {isLogin ? "INICIAR SESIÓN" : "REGISTRARME"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;