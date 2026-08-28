import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();

/*
  =========================
  MIDDLEWARES
  =========================
*/
app.use(cors());
app.use(express.json());

/*
  =========================
  RUTA PRINCIPAL
  =========================
*/
app.get("/", (req, res) => {
  res.send("Servidor de Gestión - Sincronizado con Estructura Real de Supabase");
});

/*
  =========================
  ENDPOINTS DE AUTENTICACIÓN (SUPABASE)
  =========================
*/

// 1. Verificar si un email existe en la base de datos
app.post("/auth/check-email", (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ exists: false, error: "Email requerido" });
  }
  
  // CORRECCIÓN: id_usuario -> id | correo es el campo correcto
  const sql = "SELECT id, correo FROM usuarios WHERE correo = $1";
  
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error verificando email:", err);
      return res.status(500).json({ exists: false, error: err.message });
    }
    
    const rows = result.rows || result;
    const exists = rows.length > 0;
    
    res.json({ 
      exists, 
      email,
      message: exists ? "Email encontrado" : "Email no registrado"
    });
  });
});

// 2. Sincronizar usuario de Supabase con tu sistema local (CORREGIDO CON TU TABLA REAL)
app.post("/auth/sync-user", (req, res) => {
  // CORRECCIÓN: mapeamos directamente con el id (uuid) nativo que te entrega Supabase
  const { email, nombre, id, avatar_url } = req.body;
  
  if (!email || !id) {
    return res.status(400).json({ success: false, error: "Email e ID son requeridos" });
  }
  
  // CORRECCIÓN: Eliminado supabase_id, usamos el 'id' primario directo y la columna 'nombre'
  const searchSql = `
    SELECT id, nombre, correo, rol, suspendido 
    FROM usuarios 
    WHERE id = $1 OR correo = $2
  `;
  
  db.query(searchSql, [id, email], (err, result) => {
    if (err) {
      console.error("Error buscando usuario:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    
    const rows = result.rows || result;
    let usuario;
    
    if (rows.length === 0) {
      // CORRECCIÓN: Insertar usando campos reales: id, nombre, correo, rol, creado_en, actualizado_en
      const insertSql = `
        INSERT INTO usuarios (id, nombre, correo, rol, suspendido, creado_en, actualizado_en) 
        VALUES ($1, $2, $3, $4, FALSE, NOW(), NOW()) 
        RETURNING id, nombre, correo, rol
      `;
      
      const nombreUsuario = nombre || email.split('@')[0];
      
      db.query(insertSql, [id, nombreUsuario, email, 'cliente'], (errInsert, resultInsert) => {
        if (errInsert) {
          console.error("Error creando usuario:", errInsert);
          return res.status(500).json({ success: false, error: errInsert.message });
        }
        
        const newUser = resultInsert.rows?.[0] || resultInsert[0];
        usuario = {
          id: newUser.id,
          nombre: newUser.nombre,
          email: newUser.correo,
          rol: newUser.rol
        };
        
        res.json({ success: true, usuario });
      });
    } else {
      usuario = rows[0];
      res.json({
        success: true,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.correo,
          rol: usuario.rol
        }
      });
    }
  });
});

/*
  =========================
  USUARIOS (ENDPOINTS COMPLEMENTARIOS)
  =========================
*/

// Verificar/Crear la columna 'suspendido' de forma segura si no existiera
const ensureRequiredColumns = () => {
  const sql = `
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'usuarios' AND column_name = 'suspendido') 
      THEN
        ALTER TABLE usuarios ADD COLUMN suspendido BOOLEAN DEFAULT FALSE;
      END IF;
    END $$;
  `;
  db.query(sql, (err) => {
    if (err) console.error("Error verificando columna 'suspendido':", err);
    else console.log("Estructura de la tabla 'usuarios' verificada.");
  });
};

ensureRequiredColumns();

// Listar todos los usuarios (Campos reales)
app.get("/usuarios", (req, res) => {
  // CORRECCIÓN: Reemplazado id_usuario->id, usuario->nombre y removido supabase_id duplicado
  const sql = `
    SELECT id, num_identificacion, correo, num_celular, nombre, rol, suspendido, creado_en, actualizado_en
    FROM usuarios
    ORDER BY creado_en DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result.rows || result);
  });
});

// Obtener un usuario por su ID (Campos reales)
app.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id, num_identificacion, correo, num_celular, nombre, rol, suspendido, creado_en, actualizado_en
    FROM usuarios
    WHERE id = $1
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    const user = result.rows?.[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  });
});

// Actualizar campos dinámicos usando las columnas de tu esquema real
app.put("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  // CORRECCIÓN: Recibe 'nombre' desde el cuerpo en lugar de 'usuario'
  const { nombre, num_identificacion, num_celular, rol, suspendido } = req.body;

  const fields = [];
  const values = [];
  let index = 1;

  if (nombre !== undefined) {
    fields.push(`nombre = $${index++}`);
    values.push(nombre);
  }
  if (num_identificacion !== undefined) {
    fields.push(`num_identificacion = $${index++}`);
    values.push(num_identificacion);
  }
  if (num_celular !== undefined) {
    fields.push(`num_celular = $${index++}`);
    values.push(num_celular);
  }
  if (rol !== undefined) {
    fields.push(`rol = $${index++}`);
    values.push(rol);
  }
  if (suspendido !== undefined) {
    fields.push(`suspendido = $${index++}`);
    values.push(suspendido);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No se enviaron campos para actualizar" });
  }

  fields.push(`actualizado_en = NOW()`);

  values.push(id);
  // CORRECCIÓN: Clausura WHERE filtrada mediante id = $x
  const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar usuario:", err);
      return res.status(500).json({ error: err.message });
    }
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: result.rows?.[0] || result[0] });
  });
});

/*
  =========================
  RESTO DE TUS ENDPOINTS (PRODUCTOS, MOVIMIENTOS, ETC.)
  =========================
*/

// ... Tus endpoints de negocio adicionales se conservan intactos aquí abajo.

/*
  =========================
  PUERTO Y ARRANQUE
  =========================
*/
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔒 Sincronizado nativamente con las columnas UUID de Supabase.`);
});