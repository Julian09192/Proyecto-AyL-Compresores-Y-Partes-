import { supabase } from '../config/supabase.js';
import { describirCambios, registrarBitacora } from '../utils/bitacora.js';

const columnasUsuario = 'id, nombre, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en, suspendido';

const estaUsuarioSuspendido = (usuario = {}) => {
  // Normalizar el valor de suspendido
  if (usuario.suspendido === true || usuario.suspendido === 1 || usuario.suspendido === 'true' || usuario.suspendido === '1') {
    return true;
  }
  // Si el rol es 'deshabilitado', también está suspendido
  if (usuario.rol === 'deshabilitado') {
    return true;
  }
  return false;
};

const normalizarUsuarios = (usuarios = []) => {
  return usuarios.map((usuario) => ({
    ...usuario,
    suspendido: estaUsuarioSuspendido(usuario)
  }));
};

const consultarUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select(columnasUsuario)
      .order('nombre');

    if (error) throw error;
    return normalizarUsuarios(data || []);
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    throw error;
  }
};

const consultarUsuarioPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select(columnasUsuario)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      return { ...data, suspendido: estaUsuarioSuspendido(data) };
    }
    return null;
  } catch (error) {
    console.error('Error al consultar usuario por ID:', error);
    throw error;
  }
};

export const userController = {
  // Obtener todos los usuarios
  async getAll(req, res) {
    try {
      const data = await consultarUsuarios();
      res.json(data);
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener usuario por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await consultarUsuarioPorId(id);
      if (!data) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(data);
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener rol de usuario
  async getRol(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('usuario')
        .select('nombre, rol')
        .eq('id', id)
        .single();

      if (error) throw error;
      res.json(data || { message: "Usuario no encontrado" });
    } catch (error) {
      console.error('Error en getRol:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear usuario (solo admin)
  async create(req, res) {
    try {
      const { nombre, num_identificacion, correo, num_celular, rol } = req.body;

      if (!nombre || !correo || !rol) {
        return res.status(400).json({ 
          error: 'nombre, correo y rol son requeridos' 
        });
      }

      // Verificar si el correo ya existe
      const { data: existe, error: errorExiste } = await supabase
        .from('usuario')
        .select('correo')
        .eq('correo', correo)
        .maybeSingle();

      if (existe) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: correo,
        password: 'temporal123',
        email_confirm: true,
        user_metadata: {
          nombre: nombre,
          rol: rol
        }
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      // Crear usuario en tu tabla
      const { data, error } = await supabase
        .from('usuario')
        .insert({
          id: authData.user.id,
          nombre,
          num_identificacion: num_identificacion || null,
          correo,
          num_celular: num_celular || null,
          rol: rol || 'cliente',
          suspendido: false,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        })
        .select();

      if (error) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ error: error.message });
      }

      // Registro automático al crear
      await registrarBitacora({
        accion: 'INSERT',
        modulo: 'Usuarios',
        detalles: `Usuario ${data[0].correo} creado con rol ${data[0].rol}`,
        usuario: req.usuario
      });

      res.status(201).json({ 
        message: "Usuario creado con éxito", 
        id: data[0].id,
        usuario: data[0]
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar usuario - CORREGIDO Y OPTIMIZADO
async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, num_identificacion, correo, num_celular, rol, suspendido } = req.body;

      // 1. Obtener usuario actual
      const usuarioActual = await consultarUsuarioPorId(id);
      if (!usuarioActual) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // 2. Preparar actualizaciones
      const updates = {};
      if (nombre !== undefined) updates.nombre = nombre;
      if (num_identificacion !== undefined) updates.num_identificacion = num_identificacion;
      if (correo !== undefined) updates.correo = correo;
      if (num_celular !== undefined) updates.num_celular = num_celular;
      
      if (rol !== undefined) {
        if (rol === 'deshabilitado') {
          updates.suspendido = true;
        } else {
          updates.rol = rol;
        }
      }
      
      if (suspendido !== undefined) {
        updates.suspendido = suspendido === true || suspendido === 'true' || suspendido === 1 || suspendido === '1';
        if (updates.suspendido) {
          updates.rol = 'deshabilitado';
        } else {
          updates.rol = usuarioActual.rol === 'deshabilitado' ? 'cliente' : usuarioActual.rol;
        }
      }
      
      updates.actualizado_en = new Date().toISOString();

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
      }

      // 3. Actualizar en Supabase
      const { data, error } = await supabase
        .from('usuario')
        .update(updates)
        .eq('id', id)
        .select(columnasUsuario);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const usuarioActualizado = {
        ...data[0],
        suspendido: estaUsuarioSuspendido(data[0])
      };

      // 4. 🔴 EVALUACIÓN CORRECTA DE CAMBIO DE ESTADO
      const cambioSoloEstado = usuarioActual.suspendido !== usuarioActualizado.suspendido;
      const estadoFinalSuspendido = usuarioActualizado.suspendido; // TRUE si se deshabilitó, FALSE si se habilitó

      try {
        if (cambioSoloEstado) {
          // Si el estado cambió, registramos SUSPENDIDO o REACTIVADO
          await registrarBitacora({
            accion: estadoFinalSuspendido ? 'SUSPENDIDO' : 'REACTIVADO',
            modulo: 'Usuarios',
            detalles: estadoFinalSuspendido 
              ? `Se deshabilitó el acceso al usuario "${usuarioActualizado.nombre}" (${usuarioActualizado.correo}).`
              : `Se habilitó/reactivó el acceso al usuario "${usuarioActualizado.nombre}" (${usuarioActualizado.correo}).`,
            usuario: req.usuario || 'Sistema/Admin'
          });
          console.log(`✅ Bitácora de estado registrada para: ${usuarioActualizado.correo}`);
        } else {
          // Si fue una actualización común de datos
          const detallesCambio = describirCambios('Usuario', usuarioActual, usuarioActualizado, ['nombre', 'num_celular', 'rol', 'num_identificacion']);
          if (detallesCambio && detallesCambio !== 'Sin cambios detectados.') {
            await registrarBitacora({
              accion: 'UPDATE',
              modulo: 'Usuarios',
              detalles: detallesCambio,
              usuario: req.usuario || 'Sistema/Admin'
            });
          }
        }
      } catch (bErr) {
        console.error('❌ Error no crítico en bitácora de usuario:', bErr.message);
      }

      // 5. RESPUESTA SEGURA AL FRONTEND
      return res.json({ 
        message: estadoFinalSuspendido ? 'Usuario deshabilitado con éxito' : 'Usuario habilitado con éxito', 
        usuario: usuarioActualizado 
      });

    } catch (error) {
      console.error('❌ Error crítico real en update usuario:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Eliminar usuario
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Verificar si el usuario existe
      const { data: existe, error: errorExiste } = await supabase
        .from('usuario')
        .select('id')
        .eq('id', id)
        .single();

      if (errorExiste || !existe) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Eliminar de Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      // Eliminar de tu tabla
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Registro automático al borrar
      await registrarBitacora({
        accion: 'DELETE',
        modulo: 'Usuarios',
        detalles: `Usuario ${id} eliminado`,
        usuario: req.usuario
      });
      
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Buscar usuarios
  async buscar(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
      }

      const { data, error } = await supabase
        .from('usuario')
        .select('id, nombre, num_identificacion, correo, num_celular, rol, suspendido')
        .or(`nombre.ilike.%${query}%,correo.ilike.%${query}%`)
        .order('nombre');

      if (error) throw error;
      
      const usuariosNormalizados = normalizarUsuarios(data || []);
      res.json(usuariosNormalizados);
    } catch (error) {
      console.error('Error en buscar:', error);
      res.status(500).json({ error: error.message });
    }
  }
};