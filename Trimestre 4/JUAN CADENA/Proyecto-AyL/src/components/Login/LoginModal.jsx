// src/components/Login/LoginModal.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../lib/client"; 
import RecoverPasswordModal from "./RecoverPasswordModal"; 

function LoginModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
      onClose();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error con Google", text: error.message, confirmButtonColor: "#10142D" });
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN DIRECTO CON SUPABASE
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        
        onClose(); // App.jsx reaccionará al cambio de sesión
      } else {
        // REGISTRO CON SUPABASE
        if (password !== confirmar) {
          Swal.fire({ icon: "error", title: "Las contraseñas no coinciden" });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { nombre: nombre.trim() || email.split("@")[0] }
          }
        });

        if (error) throw error;

        Swal.fire({
          icon: "success",
          title: "Cuenta creada",
          text: "Registro completado con éxito. Ya puedes iniciar sesión.",
          confirmButtonColor: "#F5A623"
        }).then(() => {
          setIsLogin(true);
          setPassword("");
          setConfirmar("");
          setNombre("");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de operación",
        text: error.message,
        confirmButtonColor: "#10142D"
      });
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
  const EyeOffIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(16, 20, 45, 0.7)", backdropFilter: "blur(8px)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
        <div className="bg-white shadow-lg border-0" style={{ width: "92%", maxWidth: 420, borderRadius: 28, overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ height: "6px", background: "linear-gradient(90deg, #F5A623 0%, #10142D 100%)" }} />
          <div className="p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold fs-4 mb-0" style={{ color: "#10142D" }}>{isLogin ? "¡Hola de nuevo!" : "Únete a nosotros"}</h2>
                <p className="text-muted small mb-0">Gestiona tus pedidos industriales</p>
              </div>
              <button className="btn-close shadow-none" onClick={onClose} />
            </div>

            <button className="btn btn-outline-light border w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm" style={{ borderRadius: "12px", color: "#444" }} onClick={handleGoogleLogin}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="google" />
              <span className="fw-bold" style={{ fontSize: "0.9rem" }}>Continuar con Google</span>
            </button>

            <div className="bg-light rounded-pill p-1 d-flex mb-4" style={{ border: "1px solid #eee" }}>
              <button className={`flex-fill border-0 rounded-pill py-2 fw-bold ${isLogin ? "bg-white shadow-sm text-warning" : "bg-transparent text-secondary"}`} style={{ fontSize: "0.8rem" }} onClick={() => setIsLogin(true)}>INGRESAR</button>
              <button className={`flex-fill border-0 rounded-pill py-2 fw-bold ${!isLogin ? "bg-white shadow-sm text-warning" : "bg-transparent text-secondary"}`} style={{ fontSize: "0.8rem" }} onClick={() => setIsLogin(false)}>REGISTRARSE</button>
            </div>

            <form onSubmit={manejarEnvio}>
              {!isLogin && (
                <div className="form-floating mb-3">
                  <input type="text" className="form-control border-0 bg-light shadow-none" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  <label className="text-muted small">Nombre Completo</label>
                </div>
              )}
              <div className="form-floating mb-3">
                <input type="email" className="form-control border-0 bg-light shadow-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label className="text-muted small">Correo Electrónico</label>
              </div>
              <div className="form-floating mb-3 position-relative">
                <input type={showPassword ? "text" : "password"} className="form-control border-0 bg-light shadow-none" style={{ paddingRight: "45px" }} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <label className="text-muted small">Contraseña</label>
                <button type="button" className="position-absolute end-0 top-50 translate-middle-y btn btn-link text-muted text-decoration-none" onClick={() => setShowPassword(!showPassword)} style={{ zIndex: 10, background: 'transparent', border: 'none', padding: '8px', marginRight: '8px' }}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
              </div>
              {isLogin && <div className="text-end mb-3"><button type="button" className="btn btn-link text-decoration-none p-0 small" style={{ color: "#F5A623" }} onClick={() => setShowRecoverPassword(true)}>¿Olvidaste tu contraseña?</button></div>}
              {!isLogin && (
                <div className="form-floating mb-3 position-relative">
                  <input type={showConfirmPassword ? "text" : "password"} className="form-control border-0 bg-light shadow-none" style={{ paddingRight: "45px" }} placeholder="Repetir" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
                  <label className="text-muted small">Confirmar Contraseña</label>
                  <button type="button" className="position-absolute end-0 top-50 translate-middle-y btn btn-link text-muted text-decoration-none" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ zIndex: 10, background: 'transparent', border: 'none', padding: '8px', marginRight: '8px' }}>{showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                </div>
              )}
              <button type="submit" className="btn btn-warning w-100 py-3 fw-bold mt-2 shadow-sm" style={{ borderRadius: "14px", letterSpacing: "1px" }} disabled={loading}>{loading ? "PROCESANDO..." : (isLogin ? "INICIAR SESIÓN" : "CREAR CUENTA GRATIS")}</button>
            </form>
          </div>
        </div>
      </div>
      {showRecoverPassword && <RecoverPasswordModal onClose={() => setShowRecoverPassword(false)} email={email} />}
    </>
  );
}

export default LoginModal;