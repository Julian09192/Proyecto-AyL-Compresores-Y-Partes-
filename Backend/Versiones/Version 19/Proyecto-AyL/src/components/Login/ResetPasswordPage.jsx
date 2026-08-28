// src/components/Login/ResetPasswordPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase, syncSupabaseUser } from "../../lib/client";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar que tenemos el hash de acceso de Supabase
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (!accessToken) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "Este enlace de recuperación no es válido o ya expiró",
        confirmButtonColor: "#10142D"
      }).then(() => {
        navigate('/');
      });
    }
  }, [location, navigate]);

  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        confirmButtonColor: "#10142D"
      });
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Contraseña muy corta",
        text: "La contraseña debe tener al menos 6 caracteres",
        confirmButtonColor: "#10142D"
      });
      return;
    }

    setLoading(true);

    try {
      // Actualizar la contraseña en Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Obtener la sesión actualizada
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Sincronizar con tu backend
        const usuario = await syncSupabaseUser(session.user);
        
        if (usuario) {
          localStorage.setItem("al_usuario", JSON.stringify(usuario));
          localStorage.setItem("al_token", session.access_token);
        }
      }

      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión.",
        confirmButtonColor: "#F5A623"
      }).then(() => {
        navigate('/');
        window.location.reload();
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo actualizar la contraseña",
        confirmButtonColor: "#10142D"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #10142D 0%, #1a1f45 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        className="bg-white shadow-lg"
        style={{ width: "100%", maxWidth: 420, borderRadius: 28, overflow: "hidden" }}
      >
        <div style={{ height: "6px", background: "linear-gradient(90deg, #F5A623 0%, #10142D 100%)" }} />

        <div className="p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold fs-4 mb-2" style={{ color: "#10142D" }}>
              Crear nueva contraseña
            </h2>
            <p className="text-muted small">
              Ingresa tu nueva contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="form-floating mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control border-0 bg-light shadow-none"
                style={{ paddingRight: "45px" }}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
              <label className="text-muted small">Nueva contraseña</label>
              <button
                type="button"
                className="position-absolute end-0 top-50 translate-middle-y btn btn-link text-muted text-decoration-none"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  zIndex: 10,
                  background: 'transparent',
                  border: 'none',
                  padding: '8px',
                  marginRight: '8px'
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="form-floating mb-4">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control border-0 bg-light shadow-none"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label className="text-muted small">Confirmar contraseña</label>
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 py-3 fw-bold"
              style={{ borderRadius: "14px", letterSpacing: "1px" }}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "ACTUALIZAR CONTRASEÑA"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;