import { useState } from "react";
import { supabase } from "../../lib/client";
import Swal from "sweetalert2";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Tu contraseña ha sido cambiada correctamente. Ya puedes usar la plataforma.",
        confirmButtonColor: "#FFC107" // Unificado con los colores de A&L
      }).then(() => {
        // Redirige de forma nativa al inicio limpio para actualizar el estado global
        window.location.href = window.location.origin;
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#10142D"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px", borderRadius: "18px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
        <h2 className="mb-4 fw-bold fs-4 text-center" style={{ color: "#10142D" }}>Nueva Contraseña</h2>
        <form onSubmit={handleReset}>
          <div className="form-floating mb-3">
            <input 
              type="password" 
              className="form-control border-0 bg-light shadow-none" 
              placeholder="Nueva contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <label className="text-muted">Nueva contraseña</label>
          </div>
          <button 
            type="submit" 
            className="btn btn-warning w-100 py-2 fw-bold" 
            style={{ borderRadius: "10px" }}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "ACTUALIZAR CONTRASEÑA"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;