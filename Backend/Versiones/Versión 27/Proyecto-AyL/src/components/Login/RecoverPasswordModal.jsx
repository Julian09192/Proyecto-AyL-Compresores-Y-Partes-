import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../lib/client";

function RecoverPasswordModal({ onClose, email: initialEmail = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar si el email existe en tu backend primero
      const checkResponse = await fetch("http://localhost:3001/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      
      const checkData = await checkResponse.json();
      
      if (!checkResponse.ok || !checkData.exists) {
        Swal.fire({
          icon: "error",
          title: "Email no encontrado",
          text: "No existe una cuenta con este correo electrónico",
          confirmButtonColor: "#10142D"
        });
        return;
      }

      // Usar Supabase para enviar el email de recuperación
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        html: `Hemos enviado un enlace de recuperación a:<br/><strong>${email}</strong><br/><br/>Revisa tu bandeja de entrada y sigue las instrucciones.`,
        confirmButtonColor: "#FFC107" // Unificado con la paleta de colores de la app
      }).then(() => {
        onClose();
      });
      
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo enviar el correo de recuperación",
        confirmButtonColor: "#10142D"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(16, 20, 45, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg border-0"
        style={{ width: "92%", maxWidth: 420, borderRadius: 28, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: "6px", background: "linear-gradient(90deg, #FFC107 0%, #10142D 100%)" }} />

        <div className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold fs-4 mb-0" style={{ color: "#10142D" }}>
                Recuperar Contraseña
              </h2>
              <p className="text-muted small mb-0">
                Te enviaremos un enlace a tu correo
              </p>
            </div>
            <button className="btn-close shadow-none" onClick={onClose} />
          </div>

          <form onSubmit={handleSendResetEmail}>
            <div className="form-floating mb-4">
              <input
                type="email"
                className="form-control border-0 bg-light shadow-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="text-muted small">Correo Electrónico</label>
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 py-3 fw-bold"
              style={{ borderRadius: "14px", letterSpacing: "1px" }}
              disabled={loading}
            >
              {loading ? "Enviando..." : "ENVIAR ENLACE DE RECUPERACIÓN"}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none small"
              onClick={onClose}
              style={{ color: "#10142D" }}
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoverPasswordModal;