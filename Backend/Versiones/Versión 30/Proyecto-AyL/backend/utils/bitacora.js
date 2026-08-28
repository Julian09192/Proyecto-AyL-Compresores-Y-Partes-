import { supabase } from '../config/supabase.js';

const normalizarEmail = (usuario = {}) => (
  usuario.email || usuario.correo || usuario.usuario_email || 'Sistema'
);

export const registrarBitacora = async ({
  accion,
  modulo,
  detalles,
  usuario,
  usuario_email,
  id_producto
}) => {
  try {
    const emailFinal = usuario_email || normalizarEmail(usuario);
    const usuarioIdFinal = (usuario && usuario.id) ? usuario.id : '00000000-0000-0000-0000-000000000000';
    const productoIdFinal = id_producto !== undefined ? Number(id_producto) : 0; 

    const notaCompleta = `[ACCION: ${accion}] - [Operador: ${emailFinal}] - ${detalles}`;

    // 1. INTENTO A: 'ENTRADA' en mayúsculas sostenidas (Estándar estricto de SQL)
    const { error: errorA } = await supabase
      .from('stock_movimiento')
      .insert({
        tipo_movimiento: 'ENTRADA', 
        referencia: modulo,              
        nota: notaCompleta,                  
        usuario_id: usuarioIdFinal,      
        id_producto: productoIdFinal,    
        cantidad: 0,                     
        stock_anterior: 0,
        stock_nuevo: 0,
        creado_en: new Date().toISOString() 
      });

    if (!errorA) {
      console.log(`✅ Registro guardado con ÉXITO (Formato: ENTRADA) en stock_movimiento (${accion} - ${modulo})`);
      return;
    }

    // 2. INTENTO B: 'SALIDA' en mayúsculas sostenidas
    const { error: errorB } = await supabase
      .from('stock_movimiento')
      .insert({
        tipo_movimiento: 'SALIDA', 
        referencia: modulo,              
        nota: notaCompleta,                  
        usuario_id: usuarioIdFinal,      
        id_producto: productoIdFinal,    
        cantidad: 0,                     
        stock_anterior: 0,
        stock_nuevo: 0,
        creado_en: new Date().toISOString() 
      });

    if (!errorB) {
      console.log(`✅ Registro guardado con ÉXITO (Formato: SALIDA) en stock_movimiento (${accion} - ${modulo})`);
      return;
    }

    // 3. INTENTO C: Por si tu check usa los strings en minúsculas completas ('entrada')
    const { error: errorC } = await supabase
      .from('stock_movimiento')
      .insert({
        tipo_movimiento: 'entrada', 
        referencia: modulo,              
        nota: notaCompleta,                  
        usuario_id: usuarioIdFinal,      
        id_producto: productoIdFinal,    
        cantidad: 0,                     
        stock_anterior: 0,
        stock_nuevo: 0,
        creado_en: new Date().toISOString() 
      });

    if (!errorC) {
      console.log(`✅ Registro guardado con ÉXITO (Formato: entrada minúscula) en stock_movimiento (${accion} - ${modulo})`);
      return;
    }

    // 4. INTENTO D: Por si tu check usa los strings en minúsculas completas ('salida')
    const { error: errorD } = await supabase
      .from('stock_movimiento')
      .insert({
        tipo_movimiento: 'salida', 
        referencia: modulo,              
        nota: notaCompleta,                  
        usuario_id: usuarioIdFinal,      
        id_producto: productoIdFinal,    
        cantidad: 0,                     
        stock_anterior: 0,
        stock_nuevo: 0,
        creado_en: new Date().toISOString() 
      });

    if (!errorD) {
      console.log(`✅ Registro guardado con ÉXITO (Formato: salida minúscula) en stock_movimiento (${accion} - ${modulo})`);
      return;
    }

    // Si todo lo anterior falla estrepitosamente, imprimimos el error final para ver qué pasa
    console.error('❌ Ningún formato estándar fue aceptado por el CHECK de tipo_movimiento:', errorD?.message || errorA?.message);

  } catch (error) {
    console.error('❌ Error crítico en el try/catch de bitácora:', error.message);
  }
};

export const describirCambios = (entidad, anterior = {}, nuevo = {}, campos = []) => {
  const cambios = campos
    .filter((campo) => anterior[campo] !== nuevo[campo])
    .map((campo) => {
      const antes = anterior[campo] ?? 'vacio';
      const despues = nuevo[campo] ?? 'vacio';
      return `${campo}: ${antes} -> ${despues}`;
    });

  if (cambios.length === 0) return `${entidad} consultado sin cambios`;
  return `${entidad} se modifico: ${cambios.join(' | ')}`;
};