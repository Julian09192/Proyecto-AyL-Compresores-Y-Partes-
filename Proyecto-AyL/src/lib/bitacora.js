export const mapearMovimientoABitacora = (movimiento) => {
  const tipo = String(movimiento.tipo_movimiento || "movimiento").toUpperCase();
  const referencia = movimiento.referencia ? ` Ref: ${movimiento.referencia}.` : "";
  const nota = movimiento.nota ? ` ${movimiento.nota}.` : "";
  const productoId = movimiento.id_producto || movimiento.producto_id || "N/D";

  return {
    id: movimiento.id_movimiento || movimiento.id,
    accion: "INSERT",
    modulo: "Stock",
    detalles: `${tipo} de ${movimiento.cantidad || 0} unidades para producto ${productoId}.${referencia}${nota} Stock: ${movimiento.stock_anterior ?? 0} -> ${movimiento.stock_nuevo ?? 0}`,
    usuario_email: movimiento.usuario_id || "Sistema",
    created_at: movimiento.creado_en || movimiento.fecha || movimiento.created_at
  };
};