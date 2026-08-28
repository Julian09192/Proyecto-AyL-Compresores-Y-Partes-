// src/components/Login/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase, syncSupabaseUser } from "../../lib/client";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Obtener la sesión después del callback de Google
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          // Sincronizar con tu backend
          const usuario = await syncSupabaseUser(session.user);
          
          if (usuario) {
            localStorage.setItem("al_usuario", JSON.stringify(usuario));
            localStorage.setItem("al_token", session.access_token);
            
            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              text: `Hola, ${usuario.nombre}`,
              confirmButtonColor: "#F5A623",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          
          // Redirigir al home
          navigate('/');
          window.location.reload();
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error en callback:", error);
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: error.message || "No se pudo completar el inicio de sesión",
          confirmButtonColor: "#10142D"
        }).then(() => {
          navigate('/');
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #10142D 0%, #1a1f45 100%)"
    }}>
      <div className="text-center text-white">
        <div className="spinner-border text-warning mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h3>Iniciando sesión...</h3>
        <p className="mt-2">Por favor espera mientras verificamos tu cuenta</p>
      </div>
    </div>
  );
}

export default AuthCallback;