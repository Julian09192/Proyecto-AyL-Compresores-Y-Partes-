import { useState } from "react";

const estadisticas = [
  { value: "500+", label: "Productos disponibles" },
  { value: "15+", label: "Años de experiencia" },
  { value: "2.000+", label: "Clientes satisfechos" },
  { value: "48H", label: "Entrega garantizada" },
];

const tarjetasContacto = [
  {
    title: "Dirección",
    emoji: "📍",
    lines: ["Calle 67 # 11-50, Bogotá", "Zona Industrial", "Colombia"],
  },
  {
    title: "Teléfonos",
    emoji: "📞",
    lines: ["+57 (1) 234-5678", "+57 300 123 4567", "Línea de emergencias"],
  },
  {
    title: "Email",
    emoji: "✉️",
    lines: ["ventas@aylcompresores.com", "soporte@aylcompresores.com", "info@aylcompresores.com"],
  },
  {
    title: "Horarios",
    emoji: "🕒",
    lines: ["Lunes a Viernes: 8:00 AM - 6:00 PM", "Sábados: 8:00 AM - 2:00 PM", "Domingos: Cerrado"],
  },
];

const sedes = [
  {
    city: "Bogotá",
    address: "Calle 67 # 11-50",
    phone: "+57 (1) 234-5678",
    manager: "Liliana Vesga",
  },
  {
    city: "Medellín",
    address: "Carrera 50 # 25-30",
    phone: "+57 (4) 345-6789",
    manager: "Carlos Mendoza",
  },
  {
    city: "Cali",
    address: "Avenida 3N # 15-45",
    phone: "+57 (2) 456-7890",
    manager: "Ana Rodríguez",
  },
];

function goToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
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
    <div className="bg-white">
      <section id="inicio-publico" className="relative overflow-hidden bg-[#ffae1f]">
        <div className="absolute left-[-7rem] top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-white/8" />
        <div className="absolute right-[-5rem] top-[-1rem] h-72 w-72 rounded-full bg-white/8" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <h1 className="display-title mx-auto max-w-5xl text-5xl text-white md:text-7xl lg:text-[5.6rem]">
            A&amp;L Compresores y Partes
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-amber-50">
            Soluciones profesionales en compresores industriales y herramientas neumáticas.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => goToSection("contacto-publico")}
              className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Ir al formulario
            </button>
            <a
              href="#/proveedores"
              className="rounded-xl border border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Ver proveedores
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#1f1f20]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {estadisticas.map((item) => (
            <div
              key={item.label}
              className="border-b border-white/10 pb-6 text-center sm:border-b-0 sm:border-r sm:pb-0 last:border-r-0"
            >
              <p className="display-title text-4xl text-amber-400">{item.value}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto-publico" className="bg-[#f6f5f2] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="section-kicker">Contacto</p>
            <h2 className="display-title mt-4 text-5xl text-slate-950 md:text-6xl">Contáctanos</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-500">
              Estamos aquí para ayudarte con cotizaciones, soporte técnico o cualquier consulta sobre nuestros equipos.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
            <article className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-[1.9rem] font-semibold text-slate-950">Envíanos un mensaje</h3>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">Nombre completo *</span>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:ring-amber-300"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">Email *</span>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:ring-amber-300"
                    />
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">Teléfono</span>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567"
                      className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:ring-amber-300"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-900">Asunto</span>
                    <input
                      type="text"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      placeholder="¿En qué podemos ayudarte?"
                      className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:ring-amber-300"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-900">Mensaje *</span>
                  <textarea
                    rows="5"
                    name="mensaje"
                    required
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Describe tu consulta o requerimiento..."
                    className="resize-none rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:ring-amber-300"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 px-4 py-4 text-base font-semibold text-white transition hover:bg-amber-600"
                >
                  Enviar mensaje
                </button>

                {enviado ? (
                  <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Formulario listo. Luego puedes conectarlo con la API sin cambiar la vista.
                  </p>
                ) : null}
              </form>
            </article>

            <div className="space-y-5">
              {tarjetasContacto.map((item) => (
                <article key={item.title} className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                      {item.emoji}
                    </span>
                    <div>
                      <h3 className="text-[1.4rem] font-semibold text-slate-950">{item.title}</h3>
                      <div className="mt-3 space-y-2 text-base leading-7 text-slate-500">
                        {item.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="section-kicker">Cobertura</p>
            <h2 className="display-title mt-4 text-5xl text-slate-950 md:text-6xl">Nuestras oficinas</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Encuentra la oficina más cercana y recibe atención personalizada en tu ciudad.
            </p>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {sedes.map((office) => (
              <article key={office.city} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-[2rem] font-semibold text-slate-950">{office.city}</h3>

                <div className="mt-6 space-y-3 text-base text-slate-600">
                  <p className="flex items-center gap-3">
                    <span>📍</span>
                    {office.address}
                  </p>
                  <p className="flex items-center gap-3">
                    <span>☎</span>
                    {office.phone}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="text-base font-semibold text-slate-950">Gerente</p>
                  <p className="mt-2 text-base text-slate-500">{office.manager}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[#f6f5f2] px-6 py-10 md:px-10 md:py-12">
            <div className="text-center">
              <p className="section-kicker">Ubicación</p>
              <h2 className="display-title mt-4 text-5xl text-slate-950 md:text-6xl">Ubicación principal</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                Visítanos en nuestra oficina principal en Bogotá y conoce de cerca nuestros productos.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.95901003902!2d-74.09307402564878!3d4.601364342512018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f991193952fcb%3A0xba0a4c6f267c24fc!2sA%20%26%20L%20COMPRESORES%20Y%20PARTES!5e0!3m2!1ses-419!2sco!4v1775179856287!5m2!1ses-419!2sco"
                className="h-[340px] w-full md:h-[420px]"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa A&L Compresores y Partes"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#ffae1f] py-16">
        <div className="absolute right-6 top-6 h-32 w-32 rounded-full bg-white/10 md:h-40 md:w-40" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="display-title text-4xl text-white md:text-6xl">¿Listo para potenciar tu producción?</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-amber-50">
            Habla con nuestros asesores y encuentra la solución perfecta para tu operación.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => goToSection("contacto-publico")}
              className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Solicitar cotización
            </button>
            <button
              type="button"
              onClick={() => goToSection("contacto-publico")}
              className="rounded-xl border border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              📞 Llamar ahora
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#1f1f20] text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.9fr_1fr] lg:px-8">
          <div>
            <h3 className="display-title text-4xl text-amber-400">A&amp;L Compresores</h3>
            <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
              Especialistas en compresores industriales y herramientas neumáticas. Calidad, respaldo y experiencia al
              servicio de la industria colombiana.
            </p>

            <div className="mt-8 flex gap-3">
              {["in", "f", "✉"].map((item) => (
                <span
                  key={item}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="display-title text-2xl text-white">Accesos</p>
            <div className="mt-5 space-y-3 text-lg text-slate-400">
              <button type="button" onClick={() => goToSection("inicio-publico")} className="block hover:text-white">
                Inicio
              </button>
              <button type="button" onClick={() => goToSection("contacto-publico")} className="block hover:text-white">
                Contactos
              </button>
              <a href="#/proveedores" className="block hover:text-white">
                Proveedores
              </a>
              <a href="#/usuarios" className="block hover:text-white">
                Usuarios
              </a>
            </div>
          </div>

          <div>
            <p className="display-title text-2xl text-white">Contacto</p>
            <div className="mt-5 space-y-3 text-lg text-slate-400">
              <p>📍 Bogotá, Colombia</p>
              <p>📞 +57 (1) 234-5678</p>
              <p>✉ info@alcompresores.com</p>
              <p>🕒 Lun-Vie: 8am - 6pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
            © 2026 A&amp;L Compresores y Partes. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactoPage;
