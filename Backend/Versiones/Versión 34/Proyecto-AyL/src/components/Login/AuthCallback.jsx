import { useEffect } from "react";
import Swal from "sweetalert2";
import { supabase, obtenerPerfilUsuario } from "../../lib/client";

function AuthCallback() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          // Buscamos el perfil en tu tabla 'usuario'
          const usuarioDb = await obtenerPerfilUsuario(session.user.id);
          
          if (usuarioDb) {
            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              // CORREGIDO: Ajustado al nuevo esquema usando la propiedad 'usuario'
              text: `Hola, ${usuarioDb.usuario || "Usuario"}`,
              confirmButtonColor: "#FFC107",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          
          // Redirigimos al inicio de forma nativa y forzamos el recargue
          // para que App.jsx detecte la sesión fresca de inmediato
          window.location.href = window.location.origin;
        } else {
          window.location.href = window.location.origin;
        }
      } catch (error) {
        console.error("Error en callback:", error);
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: error.message || "No se pudo completar el inicio de sesión",
          confirmButtonColor: "#10142D"
        }).then(() => {
          window.location.href = window.location.origin;
        });
      }
    };

    handleAuthCallback();
  }, []);

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