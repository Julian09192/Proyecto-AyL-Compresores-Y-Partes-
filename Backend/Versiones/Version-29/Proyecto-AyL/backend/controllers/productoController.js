import { supabase } from '../config/supabase.js';
import { registrarBitacora } from '../utils/bitacora.js';

export const productoController = {
  // Obtener todos los productos (público)
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener producto por ID (público)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener stock de un producto (público)
  async getStock(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('productos')
        .select('nombre, stock_total, marca')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Filtrar productos por bodega, marca o tipo (público)
// Filtrar productos por bodega, marca, tipo o código interno (público)
  async filterByParams(req, res) {
    try {
      // Se agrega 'codigo_interno' a la desestructuración de la query
      const { id_bodega, marca, tipo, codigo_interno } = req.query;
      let query = supabase.from('productos').select('*');
      
      if (id_bodega) query = query.eq('bodega_id', id_bodega);
      if (marca) query = query.eq('marca', marca);
      if (tipo) query = query.eq('tipo', tipo);
      
      // Condición agregada para filtrar por código interno si se envía en los parámetros
      if (codigo_interno) query = query.eq('codigo_interno', codigo_interno);
      
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear producto (solo admin)
 async crear(req, res) {
    try {
      // Extraemos las variables del body del Frontend
      const { 
        nombre, 
        descripcion, 
        precio, 
        stock, 
        id_categoria, // El Front probablemente manda esto para el tipo (ej: 'aceite', 'aire')
        id_bodega, 
        imagen_url, 
        imagen_public_id,
        marca,          // 👈 Agregamos marca
        codigo_interno  // 👈 Agregamos código interno si el Front lo envía
      } = req.body;

      if (!nombre || !precio) {
        return res.status(400).json({ error: "Nombre y precio son obligatorios" });
      }

      // 🔴 MAPEO CON LAS COLUMNAS REALES DE TU TABLA EN SUPABASE
      const nuevoProducto = {
        nombre,
        caracteristicas: descripcion || '', // En tu tabla la columna se llama 'caracteristicas'
        precio: Number(precio),
        stock_total: Number(stock || 0),
        tipo: id_categoria ? String(id_categoria) : 'Aceite', // 👈 Usamos 'tipo' en lugar de categoria_id
        bodega_id: id_bodega ? Number(id_bodega) : null,     // 👈 Usamos 'bodega_id' que sí existe en tu tabla
        marca: marca || 'Generico',                         // 👈 Mapeamos la columna 'marca'
        codigo_interno: codigo_interno || null,             // 👈 Mapeamos 'codigo_interno'
        imagen_url: imagen_url || null,
        cloudinary_imagen_public_id: imagen_public_id || null,
        suspendido: false
      };

      const { data, error } = await supabase
        .from('productos')
        .insert([nuevoProducto])
        .select();

      if (error) throw error;

      // Registramos en la bitácora usando las variables seguras
      try {
        await registrarBitacora({
          accion: 'INSERT',
          modulo: 'Productos',
          detalles: `Se creó el nuevo producto "${nombre}" con un stock inicial de ${Number(stock || 0)} unidades.`,
          usuario: req.usuario,
          id_producto: data && data[0] ? data[0].id : 0
        });
      } catch (bErr) {
        console.error('❌ Error no crítico en bitácora (crear producto):', bErr.message);
      }

      return res.status(201).json({
        message: 'Producto creado correctamente',
        producto: data[0]
      });

    } catch (error) {
      console.error("❌ Error en crear producto:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
      }

      // Mapeo dinámico para interceptar variables del Front y pasarlas como columnas de Supabase
      const dataToUpdate = { ...updates };
      
      if (updates.stock !== undefined) {
        dataToUpdate.stock_total = Number(updates.stock);
        delete dataToUpdate.stock;
      }
      if (updates.id_bodega !== undefined) {
        dataToUpdate.bodega_id = updates.id_bodega ? Number(updates.id_bodega) : null;
        delete dataToUpdate.id_bodega;
      }
      if (updates.imagen_public_id !== undefined) {
        dataToUpdate.cloudinary_imagen_public_id = updates.imagen_public_id;
        delete dataToUpdate.imagen_public_id;
      }

      const { data, error } = await supabase
        .from('productos')
        .update(dataToUpdate)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      try {
        await registrarBitacora({
          accion: 'UPDATE',
          modulo: 'Productos',
          detalles: `Se modificaron los datos del producto "${data[0].nombre}" (ID: ${id})`,
          usuario: req.usuario,
          id_producto: id
        });
      } catch (bErr) {
        console.error('Error al lanzar bitácora de producto:', bErr.message);
      }

      return res.json({ 
        message: 'Producto actualizado correctamente',
        producto: data[0]
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Eliminar producto (solo admin)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Alternar suspensión de producto (solo admin)
  async toggleSuspension(req, res) {
    try {
      const { id } = req.params;

      // 1. Conseguir el estado actual del producto
      const { data: current, error: fetchError } = await supabase
        .from('productos')
        .select('suspendido, nombre')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!current) return res.status(404).json({ message: 'Producto no encontrado' });

      // 2. Actualizar al estado inverso
      const nuevoEstado = !current.suspendido;

      const { data, error } = await supabase
        .from('productos')
        .update({ suspendido: nuevoEstado })
        .eq('id', id)
        .select();

      if (error) throw error;

      // 3. Registrar en bitácora mapeando correctamente la acción
      try {
        await registrarBitacora({
          accion: nuevoEstado ? 'SUSPENDIDO' : 'REACTIVADO', // Para que el mapeo del frontend lo entienda
          modulo: 'Productos',
          detalles: nuevoEstado 
            ? `Se suspendió el producto "${current.nombre}" (ID: #${id}) del catálogo.`
            : `Se reactivó el producto "${current.nombre}" (ID: #${id}) en el catálogo.`,
          usuario: req.usuario,
          id_producto: id
        });
      } catch (bErr) {
        console.error('❌ Error no crítico en bitácora (toggle producto):', bErr.message);
      }

      return res.json({ 
        message: nuevoEstado ? 'Producto suspendido correctamente' : 'Producto reactivado correctamente',
        producto: data[0]
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};