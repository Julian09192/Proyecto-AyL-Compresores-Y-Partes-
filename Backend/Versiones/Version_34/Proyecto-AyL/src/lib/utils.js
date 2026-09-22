// src/lib/utils.js
export const optimizarUrlCloudinary = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  if (url.includes("f_auto,q_auto")) return url;

  const partes = url.split("/upload/");
  if (partes.length !== 2) return url;

  return `${partes[0]}/upload/f_auto,q_auto/${partes[1]}`;
};

export const BENEFICIOS_DETALLE = [
  {
    icon: "bi bi-patch-check",
    colorClass: "text-success",
    titulo: "Productos de Calidad",
    desc: "Trabajamos con marcas reconocidas del sector industrial y automotriz."
  },
  {
    icon: "bi bi-truck",
    colorClass: "text-primary",
    titulo: "Amplio Catálogo",
    desc: "Lubricantes, filtros y productos especializados."
  },
  {
    icon: "bi bi-chat-dots",
    colorClass: "text-warning",
    titulo: "Asesoría",
    desc: "Atención personalizada para resolver tus dudas de inmediato."
  },
  {
    icon: "bi bi-shield-check",
    colorClass: "text-success",
    titulo: "Confianza",
    desc: "Información clara y soporte especializado garantizado."
  }
];