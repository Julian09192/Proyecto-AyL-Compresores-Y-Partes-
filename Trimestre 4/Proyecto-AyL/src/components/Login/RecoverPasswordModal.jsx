// src/components/Login/RecoverPasswordModal.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../lib/client";

function RecoverPasswordModal({ onClose, email: emailProp }) {
  const [email, setEmail] = useState(emailProp || "");
  const [loading, setLoading] = useState(false);

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Correo requerido",
        text: "Por favor, ingresa tu correo electrónico",
        confirmButtonColor: "#FFC107"
      });
      return;
    }

    setLoading(true);

    try {
      // Enviar correo de recuperación con Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // ✅ ÉXITO - Mostrar notificación
      Swal.fire({
        icon: "success",
        title: "¡Correo enviado!",
        html: `
          <p>Hemos enviado un enlace de recuperación a <strong>${email}</strong></p>
          <p class="text-muted small mt-2">Revisa tu bandeja de entrada y la carpeta de spam.</p>
        `,
        confirmButtonColor: "#FFC107",
        confirmButtonText: "Entendido"
      }).then(() => {
        onClose();
      });

    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      
      let mensajeError = "No pudimos enviar el correo. Intenta nuevamente.";
      
      // Mensajes específicos para errores comunes
      if (error.message.includes("User not found")) {
        mensajeError = "No encontramos una cuenta con ese correo electrónico.";
      } else if (error.message.includes("rate limit")) {
        mensajeError = "Has superado el límite de intentos. Espera unos minutos e intenta de nuevo.";
      }

      Swal.fire({
        icon: "error",
        title: "Error al enviar correo",
        text: mensajeError,
        confirmButtonColor: "#212529"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(16, 20, 45, 0.7)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="bg-white shadow-lg border-0" style={{ width: "92%", maxWidth: 400, borderRadius: 24, overflow: "hidden" }}>
        <div style={{ height: "4px", background: "linear-gradient(90deg, #FFC107 0%, #10142D 100%)" }} />
        <div className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold fs-5 mb-0" style={{ color: "#10142D" }}>Recuperar Contraseña</h3>
              <p className="text-muted small mb-0">Te enviaremos un enlace para restablecerla</p>
            </div>
            <button className="btn-close shadow-none" onClick={onClose} />
          </div>

          <form onSubmit={handleRecoverPassword}>
            <div className="form-floating mb-4">
              <input 
                type="email" 
                className="form-control border-0 bg-light shadow-none" 
                id="recoverEmail"
                placeholder="Correo Electrónico" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <label htmlFor="recoverEmail" className="text-muted small">Correo Electrónico</label>
            </div>

            <div className="d-flex gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary flex-fill py-2 fw-bold" 
                style={{ borderRadius: "10px" }} 
                onClick={onClose}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-warning flex-fill py-2 fw-bold" 
                style={{ borderRadius: "10px" }} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enviando...
                  </>
                ) : (
                  "Enviar enlace"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted small mb-0">
              <i className="bi bi-shield-check me-1 text-success"></i>
              Revisa la carpeta de spam si no recibes el correo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoverPasswordModal;