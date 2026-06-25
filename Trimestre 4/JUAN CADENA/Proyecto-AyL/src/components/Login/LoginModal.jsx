// src/components/Login/LoginModal.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../lib/client";
import RecoverPasswordModal from "./RecoverPasswordModal";

function LoginModal({ onClose, login }) {
  const [isLogin, setIsLogin] = useState(true);
  const [usuarioName, setUsuarioName] = useState(""); // Ajustado para reflejar el cambio de esquema
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_AUTH_URL = "http://localhost:3001/usuario";

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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        
        if (error) throw error;

        try {
          const syncRes = await fetch(`${API_AUTH_URL}/sync-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              usuario: data.user.user_metadata?.usuario || email.split("@")[0], // Sincroniza con 'usuario'
            }),
          });

          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.success && syncData.usuario) {
              localStorage.setItem("usuario", JSON.stringify(syncData.usuario));
              if (login) login(syncData.usuario);
            } else {
              const usuarioFallback = {
                id: data.user.id,
                email: data.user.email,
                usuario: data.user.user_metadata?.usuario || email.split("@")[0],
                rol: "cliente"
              };
              localStorage.setItem("usuario", JSON.stringify(usuarioFallback));
              if (login) login(usuarioFallback);
            }
          } else {
            throw new Error("El servidor no pudo procesar el perfil.");
          }
        } catch (syncErr) {
          console.warn("No se pudo sincronizar el perfil con Express, aplicando perfil local...", syncErr);
          const usuarioFallback = {
            id: data.user.id,
            email: data.user.email,
            usuario: data.user.user_metadata?.usuario || email.split("@")[0],
            rol: "cliente"
          };
          localStorage.setItem("usuario", JSON.stringify(usuarioFallback));
          if (login) login(usuarioFallback);
        }

        onClose();
      } else {
        if (password !== confirmar) {
          Swal.fire({ icon: "error", title: "Las contraseñas no coinciden", confirmButtonColor: "#FFC107" });
          setLoading(false);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              usuario: usuarioName.trim() // Cambiado de 'nombre' a 'usuario'
            }
          }
        });

        if (authError) throw authError;

        const usuarioIdReal = authData.user?.id;
        if (!usuarioIdReal) {
          throw new Error("No se pudo obtener el ID de autenticación de Supabase.");
        }

        const registroRes = await fetch(`${API_AUTH_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: usuarioIdReal,
            email: email.trim(),
            usuario: usuarioName.trim() // Enviamos 'usuario' de acuerdo al cambio de la tabla pública
          })
        });

        const contentType = registroRes.headers.get("content-type");
        let registroData = {};
        if (contentType && contentType.includes("application/json")) {
          registroData = await registroRes.json();
        } else {
          const textError = await registroRes.text();
          throw new Error(`Error del servidor (${registroRes.status}): ${textError || "Respuesta inválida."}`);
        }

        if (!registroRes.ok || !registroData.success) {
          throw new Error(registroData.error || "No se pudo completar el registro en el servidor.");
        }

        Swal.fire({
          icon: "success",
          title: "Cuenta creada",
          text: "Registro completado con éxito. Ya puedes iniciar sesión.",
          confirmButtonColor: "#FFC107"
        }).then(() => {
          setIsLogin(true);
          setPassword("");
          setConfirmar("");
          setUsuarioName("");
        });
      }
    } catch (error) {
      console.error("Error completo atrapado:", error);
      const mensajeError = error.message || error.error_description || "Error inesperado en el servidor.";
      Swal.fire({ icon: "error", title: "Error de operación", text: mensajeError, confirmButtonColor: "#FFC107" });
    } finally {
      loading && setLoading(false);
    }
  };

  const alternarPestana = (modoLogin) => {
    setIsLogin(modoLogin);
    // Limpieza saludable de campos al cambiar de pestaña
    setPassword("");
    setConfirmar("");
    setUsuarioName("");
  };

  const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
  const EyeOffIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(16, 20, 45, 0.7)", backdropFilter: "blur(8px)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="bg-white shadow-lg border-0" style={{ width: "92%", maxWidth: 420, borderRadius: 28, overflow: "hidden" }}>
          <div style={{ height: "6px", background: "linear-gradient(90deg, #FFC107 0%, #10142D 100%)" }} />
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
              <button type="button" className={`flex-fill border-0 rounded-pill py-2 fw-bold ${isLogin ? "bg-white shadow-sm text-warning" : "bg-transparent text-secondary"}`} style={{ fontSize: "0.8rem" }} onClick={() => alternarPestana(true)}>INGRESAR</button>
              <button type="button" className={`flex-fill border-0 rounded-pill py-2 fw-bold ${!isLogin ? "bg-white shadow-sm text-warning" : "bg-transparent text-secondary"}`} style={{ fontSize: "0.8rem" }} onClick={() => alternarPestana(false)}>REGISTRARSE</button>
            </div>

            <form onSubmit={manejarEnvio}>
              {!isLogin && (
                <div className="form-floating mb-3">
                  <input type="text" className="form-control border-0 bg-light shadow-none" placeholder="Usuario" value={usuarioName} onChange={(e) => setUsuarioName(e.target.value)} required />
                  <label className="text-muted small">Nombre de Usuario</label>
                </div>
              )}
              <div className="form-floating mb-3">
                <input type="email" className="form-control border-0 bg-light shadow-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label className="text-muted small">Correo Electrónico</label>
              </div>
              <div className="form-floating mb-3 position-relative">
                <input type={showPassword ? "text" : "password"} minLength="6" className="form-control border-0 bg-light shadow-none" style={{ paddingRight: "45px" }} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <label className="text-muted small">Contraseña</label>
                <button type="button" className="position-absolute end-0 top-50 translate-middle-y btn btn-link text-muted text-decoration-none" onClick={() => setShowPassword(!showPassword)} style={{ zIndex: 10, background: 'transparent', border: 'none', padding: '8px', marginRight: '8px' }}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
              </div>
              {isLogin && <div className="text-end mb-3"><button type="button" className="btn btn-link text-decoration-none p-0 small" style={{ color: "#FFC107" }} onClick={() => setShowRecoverPassword(true)}>¿Olvidaste tu contraseña?</button></div>}
              {!isLogin && (
                <div className="form-floating mb-3 position-relative">
                  <input type={showConfirmPassword ? "text" : "password"} minLength="6" className="form-control border-0 bg-light shadow-none" style={{ paddingRight: "45px" }} placeholder="Repetir" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
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