import { useState } from "react";
import { supabase } from "../../lib/client"; // IMPORTACIÓN LIMPIA
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
        text: "Tu contraseña ha sido cambiada correctamente.",
        confirmButtonColor: "#F5A623"
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
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4">Nueva Contraseña</h2>
        <form onSubmit={handleReset}>
          <div className="form-floating mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Nueva contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <label>Nueva contraseña</label>
          </div>
          <button type="submit" className="btn btn-warning w-100" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;