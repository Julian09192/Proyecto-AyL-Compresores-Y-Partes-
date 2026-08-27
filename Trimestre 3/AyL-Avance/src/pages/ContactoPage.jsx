import { useState } from "react";

const infoCards = [
  {
    key: "direccion",
    emoji: "📍",
    title: "Direccion",
    lines: ["Calle 67 # 11-50, Bogota", "Zona Industrial", "Colombia"],
  },
  {
    key: "telefonos",
    emoji: "📞",
    title: "Telefonos",
    lines: ["+57 (1) 234-5678", "+57 300 123 4567", "Linea de Emergencias"],
  },
  {
    key: "email",
    emoji: "✉️",
    title: "Email",
    lines: ["ventas@aylcompresores.com", "soporte@aylcompresores.com", "info@aylcompresores.com"],
  },
  {
    key: "horarios",
    emoji: "🕒",
    title: "Horarios",
    lines: ["Lunes a Viernes: 8:00 AM - 6:00 PM", "Sabados: 8:00 AM - 2:00 PM", "Domingos: Cerrado"],
  },
];

const offices = [
  {
    city: "Bogota",
    address: "Calle 67 # 11-50",
    phone: "+57 (1) 234-5678",
    manager: "Liliana Vesga",
  },
  {
    city: "Medellin",
    address: "Carrera 50 # 25-30",
    phone: "+57 (4) 345-6789",
    manager: "Carlos Mendoza",
  },
  {
    city: "Cali",
    address: "Avenida 3N # 15-45",
    phone: "+57 (2) 456-7890",
    manager: "Ana Rodriguez",
  },
];

function EmojiBadge({ emoji }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-base">
      {emoji}
    </span>
  );
}

function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setEnviado(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEnviado(true);
  };

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Contáctanos</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-500 md:text-base">
            Estamos aqui para ayudarte. Ponte en contacto con nosotros para cotizaciones, soporte tecnico o cualquier
            consulta que tengas.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.68fr_0.82fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <EmojiBadge emoji="💬" />
              <h2 className="text-xl font-semibold text-slate-950">Envianos un Mensaje</h2>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-950">Nombre Completo *</span>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-amber-300"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-950">Email *</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-amber-300"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-950">Telefono</span>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+57 300 123 4567"
                    className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-amber-300"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-950">Asunto</span>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    placeholder="En que podemos ayudarte?"
                    className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-amber-300"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-950">Mensaje *</span>
                <textarea
                  rows="4"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Describe tu consulta o requerimiento..."
                  className="resize-none rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-amber-300"
                />
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
              >
                📩
                Enviar Mensaje
              </button>

              {enviado ? (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.
                </p>
              ) : null}
            </form>
          </article>

          <div className="space-y-4">
            {infoCards.map((card) => (
              <article key={card.key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex gap-3">
                  <EmojiBadge emoji={card.emoji} />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{card.title}</h3>
                    <div className="mt-2 space-y-1 text-sm leading-6 text-slate-500">
                      {card.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-16">
          <div className="text-center">
            <h2 className="text-[1.9rem] font-bold tracking-tight text-slate-950 md:text-4xl">Nuestras Oficinas</h2>
            <p className="mt-3 text-[15px] text-slate-500 md:text-base">Encuentra la oficina mas cercana a ti</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {offices.map((office) => (
              <article key={office.city} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-[1.6rem] font-bold text-slate-950">{office.city}</h3>

                <div className="mt-5 space-y-3 text-sm text-slate-700">
                  <p className="flex items-center gap-3">
                    <span>📍</span>
                    {office.address}
                  </p>
                  <p className="flex items-center gap-3">
                    <span>📞</span>
                    {office.phone}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-base font-semibold text-slate-950">Gerente</p>
                  <p className="mt-2 text-sm text-slate-500">{office.manager}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-slate-50 px-6 py-10 shadow-sm md:px-8 md:py-12">
          <div className="text-center">
            <h2 className="text-[1.9rem] font-bold tracking-tight text-slate-950 md:text-4xl">Ubicacion Principal</h2>
            <p className="mt-3 text-[15px] text-slate-500 md:text-base">Visitanos en nuestra oficina principal en Bogota</p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.95901003902!2d-74.09307402564878!3d4.601364342512018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f991193952fcb%3A0xba0a4c6f267c24fc!2sA%20%26%20L%20COMPRESORES%20Y%20PARTES!5e0!3m2!1ses-419!2sco!4v1775179856287!5m2!1ses-419!2sco"
              className="h-[320px] w-full md:h-[380px]"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa A&L Compresores y Partes"
            />
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-amber-500 px-6 py-12 text-center md:px-10 md:py-14">
          <h2 className="text-[1.9rem] font-bold tracking-tight text-white md:text-4xl">Necesitas una Cotizacion?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-amber-50 md:text-lg">
            Nuestro equipo comercial esta listo para ayudarte
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Solicitar Cotizacion
            </button>
            <button className="rounded-2xl border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Llamar Ahora
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default ContactoPage;
