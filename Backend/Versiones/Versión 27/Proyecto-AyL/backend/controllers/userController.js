import { supabase } from '../config/supabase.js';
import { describirCambios, registrarBitacora } from '../utils/bitacora.js';

const columnasUsuario = 'id, nombre, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en';
const columnasUsuarioConEstado = `${columnasUsuario}, suspendido`;

const estaUsuarioSuspendido = (usuario = {}) => (
  usuario.suspendido === true
  || usuario.suspendido === 1
  || usuario.suspendido === 'true'
  || usuario.rol === 'deshabilitado'
);

const normalizarUsuarios = (usuarios = []) => usuarios.map((usuario) => ({
  ...usuario,
  suspendido: estaUsuarioSuspendido(usuario)
}));

const consultarUsuarios = async () => {
  const consultaConEstado = await supabase
    .from('usuario')
    .select(columnasUsuarioConEstado)
    .order('nombre');

  if (!consultaConEstado.error) {
    return normalizarUsuarios(consultaConEstado.data || []);
  }

  const consultaBase = await supabase
    .from('usuario')
    .select(columnasUsuario)
    .order('nombre');

  if (consultaBase.error) throw consultaBase.error;
  return normalizarUsuarios((consultaBase.data || []).map((usuario) => ({ ...usuario, suspendido: usuario.rol === 'deshabilitado' })));
};

const consultarUsuarioPorId = async (id) => {
  const consultaConEstado = await supabase
    .from('usuario')
    .select(columnasUsuarioConEstado)
    .eq('id', id)
    .maybeSingle();

  if (!consultaConEstado.error) {
    return consultaConEstado.data ? { ...consultaConEstado.data, suspendido: estaUsuarioSuspendido(consultaConEstado.data) } : null;
  }

  const consultaBase = await supabase
    .from('usuario')
    .select(columnasUsuario)
    .eq('id', id)
    .maybeSingle();

  if (consultaBase.error) throw consultaBase.error;
  return consultaBase.data ? { ...consultaBase.data, suspendido: consultaBase.data.rol === 'deshabilitado' } : null;
};

export const userController = {
  // Obtener todos los usuarios
  async getAll(req, res) {
    try {
      const data = await consultarUsuarios();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener usuario por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await consultarUsuarioPorId(id);
      if (!data) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(data);
    } catch (error) {
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
      res.status(500).json({ error: error.message });
    }
  },

  // Crear usuario (solo admin) - Sin password porque usa Supabase Auth
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
        .single();

      if (existe) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      // Crear usuario en Supabase Auth (con contraseña temporal)
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
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        })
        .select();

      if (error) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ error: error.message });
      }

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
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar usuario
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, num_identificacion, correo, num_celular, rol, suspendido } = req.body;

      const anterior = await consultarUsuarioPorId(id);

      const updates = {};
      if (nombre !== undefined) updates.nombre = nombre;
      if (num_identificacion !== undefined) updates.num_identificacion = num_identificacion;
      if (correo !== undefined) updates.correo = correo;
      if (num_celular !== undefined) updates.num_celular = num_celular;
      if (rol !== undefined) updates.rol = rol;
      if (suspendido !== undefined) updates.suspendido = suspendido === true || suspendido === 'true' || suspendido === 1;
      
      updates.actualizado_en = new Date().toISOString();

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
      }

      let { data, error } = await supabase
        .from('usuario')
        .update(updates)
        .eq('id', id)
        .select(columnasUsuarioConEstado);

      if (error && suspendido !== undefined) {
        const fallbackUpdates = { ...updates };
        delete fallbackUpdates.suspendido;
        fallbackUpdates.rol = suspendido
          ? 'deshabilitado'
          : (anterior?.rol === 'deshabilitado' ? 'cliente' : anterior?.rol || 'cliente');

        const resultadoFallbackEstado = await supabase
          .from('usuario')
          .update(fallbackUpdates)
          .eq('id', id)
          .select(columnasUsuario);

        data = (resultadoFallbackEstado.data || []).map((usuario) => ({
          ...usuario,
          suspendido: usuario.rol === 'deshabilitado'
        }));
        error = resultadoFallbackEstado.error;
      }

      if (error) {
        const fallbackUpdates = { ...updates };
        delete fallbackUpdates.suspendido;

        const resultadoBase = await supabase
          .from('usuario')
          .update(fallbackUpdates)
          .eq('id', id)
          .select(columnasUsuario);

        data = normalizarUsuarios(resultadoBase.data || []);
        error = resultadoBase.error;
      }
 
      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const cambioSoloEstado = suspendido !== undefined
        && Object.keys(req.body).every((campo) => campo === 'suspendido');

      await registrarBitacora({
        accion: cambioSoloEstado ? (data[0].suspendido ? 'SUSPENDIDO' : 'REACTIVADO') : 'UPDATE',
        modulo: 'Usuarios',
        detalles: describirCambios(
          `Usuario ${anterior?.correo || data[0].correo || id}`,
          anterior || {},
          data[0],
          ['nombre', 'num_identificacion', 'num_celular', 'rol', 'correo', 'suspendido']
        ),
        usuario: req.usuario
      });

      res.json({ 
        message: "Usuario actualizado correctamente",
        usuario: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
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

      await registrarBitacora({
        accion: 'DELETE',
        modulo: 'Usuarios',
        detalles: `Usuario ${id} eliminado`,
        usuario: req.usuario
      });
      
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
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
        .select('id, nombre, num_identificacion, correo, num_celular, rol')
        .or(`nombre.ilike.%${query}%,correo.ilike.%${query}%`)
        .order('nombre');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};