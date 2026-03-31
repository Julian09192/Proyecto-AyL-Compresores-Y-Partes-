// Datos simulados del admin 
const PERFIL = {
  nombre:   "Administrador",
  email:    "admin@alcompresores.com",
  rol:      "Administrador",
  telefono: "+57 300 000 0000",
  empresa:  "A&L Compresores y Partes",
  desde:    "Enero 2023",
};

function MiPerfil() {
  return (
    <div className="perfil-wrapper">

      <div className="dash-home__header">
        <h1 className="dash-home__title">Mi Perfil</h1>
        <p className="dash-home__subtitle">Información de tu cuenta de administrador.</p>
      </div>

      <div className="perfil-card">
        <div className="perfil-avatar">👤</div>
        <h2 className="perfil-nombre">{PERFIL.nombre}</h2>
        <span className="adm-sidebar__role">{PERFIL.rol}</span>

        <div className="perfil-datos">
          {[
            { label: "Email",    valor: PERFIL.email    },
            { label: "Teléfono", valor: PERFIL.telefono },
            { label: "Empresa",  valor: PERFIL.empresa  },
            { label: "Miembro desde", valor: PERFIL.desde },
          ].map((dato) => (
            <div key={dato.label} className="perfil-dato-row">
              <span className="perfil-dato-label">{dato.label}</span>
              <span className="perfil-dato-valor">{dato.valor}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default MiPerfil;