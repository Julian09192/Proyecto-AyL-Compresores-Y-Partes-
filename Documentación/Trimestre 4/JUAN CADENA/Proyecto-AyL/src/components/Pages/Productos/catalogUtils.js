// Sincronizado con los tipos exactos guardados en tu base de datos real
export const obtenerTipoPrincipal = (producto) => {
  const tipoDB = (producto.tipo || "").toLowerCase().trim();
  if (["separador", "aceite", "aire"].includes(tipoDB) || tipoDB.includes("filtro")) return "Filtros";
  if (["aceite_motor", "valvulina"].includes(tipoDB) || tipoDB.includes("lubricante")) return "Lubricantes";
  if (tipoDB.includes("compresor")) return "Compresores";
  if (tipoDB.includes("valvula") || tipoDB.includes("válvula")) return "Válvulas";
  if (tipoDB.includes("herramienta")) return "Herramientas";
  if (tipoDB.includes("accesorio")) return "Accesorios";
  return "Otros";
};

export const obtenerSubtipo = (producto, tipoPrincipal) => {
  const tipoDB = (producto.tipo || "").toLowerCase().trim();
  if (tipoPrincipal === "Filtros") {
    if (tipoDB === "separador") return "Separador";
    if (tipoDB === "aceite") return "Aceite";
    if (tipoDB === "aire") return "Aire";
    return "Otros";
  }
  if (tipoPrincipal === "Lubricantes") {
    const textoCompleto = `${producto.nombre || ""} ${producto.caracteristicas || ""}`.toLowerCase();
    if (textoCompleto.includes("cuarto")) return "Cuarto";
    if (textoCompleto.includes("galon") || textoCompleto.includes("galón")) return "Galon";
    if (textoCompleto.includes("garrafa")) return "Garrafa";
    return "Otros";
  }
  return "Otros";
};

export const optimizarUrlCloudinary = (url, opciones = {}) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  const {
    width = 500,
    quality = "auto",
    format = "auto",
  } = opciones;

  const partes = url.split("/upload/");
  if (partes.length !== 2) return url;

  const transformaciones = `w_${width},q_${quality},f_${format},c_limit`;
  return `${partes[0]}/upload/${transformaciones}/${partes[1]}`;
};