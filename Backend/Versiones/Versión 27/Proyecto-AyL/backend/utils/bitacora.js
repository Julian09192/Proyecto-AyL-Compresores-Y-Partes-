import { supabase } from '../config/supabase.js';

const normalizarEmail = (usuario = {}) => (
  usuario.email || usuario.correo || usuario.usuario_email || 'Sistema'
);

export const registrarBitacora = async ({
  accion,
  modulo,
  detalles,
  usuario,
  usuario_email
}) => {
  try {
    const { error } = await supabase
      .from('bitacora')
      .insert({
        accion,
        modulo,
        detalles,
        usuario_email: usuario_email || normalizarEmail(usuario),
        created_at: new Date().toISOString()
      });

    if (error) {
      console.warn('No se pudo registrar la bitacora:', error.message);
    }
  } catch (error) {
    console.warn('No se pudo registrar la bitacora:', error.message);
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