import express from "express";
import cors from "cors";
import db from "./db.js";
import jwt from "jsonwebtoken"; 
import crypto from "crypto";

const app = express();
const JWT_SECRET = "A&L_SECRET_KEY_2024"; 

// Almacenamiento temporal de códigos de recuperación (en producción usa Redis o una tabla en DB)
const resetCodes = new Map();

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
  res.send("Servidor funcionando");
});

/*
  =========================
  NUEVOS ENDPOINTS PARA RECUPERACIÓN DE CONTRASEÑA Y SUPABASE
  =========================
*/

// 1. Verificar si un email existe en la base de datos
app.post("/auth/check-email", (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ exists: false, error: "Email requerido" });
  }
  
  const sql = "SELECT id_usuario, correo FROM usuarios WHERE correo = $1";
  
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

// 2. Sincronizar usuario de Supabase con tu sistema
app.post("/auth/sync-user", (req, res) => {
  const { email, nombre, supabase_id, avatar_url } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, error: "Email requerido" });
  }
  
  // Buscar si el usuario ya existe por email o supabase_id
  const searchSql = `
    SELECT id_usuario, usuario, correo, rol, avatar_url, supabase_id 
    FROM usuarios 
    WHERE correo = $1 OR supabase_id = $2
  `;
  
  db.query(searchSql, [email, supabase_id || null], async (err, result) => {
    if (err) {
      console.error("Error buscando usuario:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    
    const rows = result.rows || result;
    let usuario;
    
    if (rows.length === 0) {
      // Crear nuevo usuario
      const insertSql = `
        INSERT INTO usuarios (usuario, correo, supabase_id, avatar_url, rol, creado_en) 
        VALUES ($1, $2, $3, $4, $5, NOW()) 
        RETURNING id_usuario, usuario, correo, rol, avatar_url
      `;
      
      const nombreUsuario = nombre || email.split('@')[0];
      
      db.query(insertSql, [nombreUsuario, email, supabase_id || null, avatar_url || null, 'cliente'], (errInsert, resultInsert) => {
        if (errInsert) {
          console.error("Error creando usuario:", errInsert);
          return res.status(500).json({ success: false, error: errInsert.message });
        }
        
        const newUser = resultInsert.rows?.[0] || resultInsert[0];
        usuario = {
          id: newUser.id_usuario,
          nombre: newUser.usuario,
          email: newUser.correo,
          rol: newUser.rol,
          avatar_url: newUser.avatar_url
        };
        
        res.json({ success: true, usuario });
      });
    } else {
      // Usuario existe, actualizar supabase_id si es necesario
      usuario = rows[0];
      
      if (supabase_id && !usuario.supabase_id) {
        const updateSql = "UPDATE usuarios SET supabase_id = $1, avatar_url = COALESCE($2, avatar_url) WHERE id_usuario = $3";
        db.query(updateSql, [supabase_id, avatar_url, usuario.id_usuario], (errUpdate) => {
          if (errUpdate) {
            console.error("Error actualizando supabase_id:", errUpdate);
          }
        });
      }
      
      res.json({
        success: true,
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.usuario,
          email: usuario.correo,
          rol: usuario.rol,
          avatar_url: usuario.avatar_url
        }
      });
    }
  });
});

// 3. Generar y enviar código de recuperación (alternativa a Supabase)
app.post("/auth/send-reset-code", (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email requerido" });
  }
  
  // Verificar que el email existe
  const checkSql = "SELECT id_usuario, correo, usuario FROM usuarios WHERE correo = $1";
  
  db.query(checkSql, [email], (err, result) => {
    if (err) {
      console.error("Error verificando email:", err);
      return res.status(500).json({ error: err.message });
    }
    
    const rows = result.rows || result;
    if (rows.length === 0) {
      return res.status(404).json({ error: "No existe una cuenta con este correo" });
    }
    
    const usuario = rows[0];
    
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos
    
    // Guardar código temporalmente
    resetCodes.set(email, {
      code,
      expiresAt,
      userId: usuario.id_usuario
    });
    
    // Aquí deberías enviar el email con el código
    // Por ahora simulamos el envío
    console.log(`Código de recuperación para ${email}: ${code}`);
    
    // En producción, descomenta y configura nodemailer:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.sendMail({
      from: '"A&L Compresores" <no-reply@alcompresores.com>',
      to: email,
      subject: 'Recuperación de contraseña - A&L Compresores',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F5A623;">Recuperación de contraseña</h2>
          <p>Hola <strong>${usuario.usuario}</strong>,</p>
          <p>Hemos recibido una solicitud para recuperar tu contraseña.</p>
          <p>Tu código de verificación es:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 28px; letter-spacing: 5px; font-weight: bold;">
            ${code}
          </div>
          <p>Este código expirará en 15 minutos.</p>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">A&L Compresores y Partes - Sistema de Gestión</p>
        </div>
      `
    });
    */
    
    res.json({ 
      success: true, 
      message: "Código enviado exitosamente",
      email: email
    });
  });
});

// 4. Verificar código de recuperación
app.post("/auth/verify-reset-code", (req, res) => {
  const { email, code } = req.body;
  
  if (!email || !code) {
    return res.status(400).json({ error: "Email y código requeridos" });
  }
  
  const stored = resetCodes.get(email);
  
  if (!stored) {
    return res.status(400).json({ error: "No hay solicitud de recuperación activa" });
  }
  
  if (stored.expiresAt < Date.now()) {
    resetCodes.delete(email);
    return res.status(400).json({ error: "El código ha expirado. Solicita uno nuevo" });
  }
  
  if (stored.code !== code) {
    return res.status(400).json({ error: "Código incorrecto" });
  }
  
  // Generar token temporal para resetear contraseña
  const resetToken = crypto.randomBytes(32).toString('hex');
  stored.resetToken = resetToken;
  stored.tokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutos
  resetCodes.set(email, stored);
  
  res.json({ 
    success: true, 
    message: "Código verificado correctamente",
    resetToken: resetToken
  });
});

// 5. Resetear contraseña con código verificado
app.post("/auth/reset-password-with-code", (req, res) => {
  const { email, code, newPassword } = req.body;
  
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Email, código y nueva contraseña requeridos" });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }
  
  const stored = resetCodes.get(email);
  
  if (!stored) {
    return res.status(400).json({ error: "No hay solicitud de recuperación activa" });
  }
  
  if (stored.expiresAt < Date.now()) {
    resetCodes.delete(email);
    return res.status(400).json({ error: "El código ha expirado" });
  }
  
  if (stored.code !== code) {
    return res.status(400).json({ error: "Código incorrecto" });
  }
  
  // Actualizar la contraseña en la base de datos
  const updateSql = "UPDATE usuarios SET password_hash = $1, actualizado_en = NOW() WHERE id_usuario = $2";
  
  db.query(updateSql, [newPassword, stored.userId], (err, result) => {
    if (err) {
      console.error("Error actualizando contraseña:", err);
      return res.status(500).json({ error: "Error al actualizar la contraseña" });
    }
    
    // Limpiar el código usado
    resetCodes.delete(email);
    
    res.json({ 
      success: true, 
      message: "Contraseña actualizada exitosamente" 
    });
  });
});

// 6. Resetear contraseña con token (alternativa más segura)
app.post("/auth/reset-password-with-token", (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  
  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({ error: "Email, token y nueva contraseña requeridos" });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }
  
  const stored = resetCodes.get(email);
  
  if (!stored || stored.resetToken !== resetToken) {
    return res.status(400).json({ error: "Token inválido" });
  }
  
  if (stored.tokenExpires < Date.now()) {
    resetCodes.delete(email);
    return res.status(400).json({ error: "El token ha expirado" });
  }
  
  // Actualizar la contraseña
  const updateSql = "UPDATE usuarios SET password_hash = $1, actualizado_en = NOW() WHERE id_usuario = $2";
  
  db.query(updateSql, [newPassword, stored.userId], (err) => {
    if (err) {
      console.error("Error actualizando contraseña:", err);
      return res.status(500).json({ error: "Error al actualizar la contraseña" });
    }
    
    resetCodes.delete(email);
    
    res.json({ 
      success: true, 
      message: "Contraseña actualizada exitosamente" 
    });
  });
});

/*
  =========================
  USUARIOS (TUS ENDPOINTS EXISTENTES MEJORADOS)
  =========================
*/

// Agregar columna supabase_id si no existe (ejecutar una vez)
const ensureSupabaseColumn = () => {
  const sql = `
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'usuarios' AND column_name = 'supabase_id') 
      THEN
        ALTER TABLE usuarios ADD COLUMN supabase_id VARCHAR(255) UNIQUE;
      END IF;
    END $$;
  `;
  db.query(sql, (err) => {
    if (err) console.error("Error agregando columna supabase_id:", err);
    else console.log("Columna supabase_id verificada/agregada");
  });
};

ensureSupabaseColumn();

// Tu endpoint de usuarios existente (mejorado)
app.get("/usuarios", (req, res) => {
  const sql = `
    SELECT 
      id_usuario,
      num_identificacion,
      correo,
      num_celular,
      usuario,
      rol,
      creado_en,
      actualizado_en,
      supabase_id
    FROM usuarios
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result.rows || result);
  });
});

app.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      id_usuario,
      num_identificacion,
      correo,
      num_celular,
      usuario,
      rol,
      creado_en,
      actualizado_en,
      supabase_id
    FROM usuarios
    WHERE id_usuario = $1
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    const user = result.rows?.[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  });
});

// Tu endpoint de registro existente
app.post("/usuarios", (req, res) => {
  const { usuario, correo, password_hash, rol } = req.body;
  const sql = "INSERT INTO usuarios (usuario, correo, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario";
  
  db.query(sql, [usuario, correo, password_hash, rol || 'cliente'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const nuevoId = result.rows ? result.rows[0].id_usuario : null;
    res.json({ message: "Usuario creado con éxito", id: nuevoId });
  });
});

// Tu endpoint de login existente
app.post("/login-local", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE correo = $1";
  
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const rows = result.rows || result;
    if (rows.length > 0) {
      const usuario = rows[0];

      if (usuario.password_hash === password) {
        const token = jwt.sign(
          { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.usuario },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({
          success: true,
          token: token,
          usuario: {
            id: usuario.id_usuario,
            nombre: usuario.usuario,
            email: usuario.correo,
            rol: usuario.rol 
          }
        });
      }
    }
    res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
  });
});

/*
  =========================
  RESTO DE TUS ENDPOINTS (PRODUCTOS, MOVIMIENTOS, ETC.)
  =========================
*/

// ... (todos tus endpoints existentes de productos, movimientos, etc. se mantienen igual)

/*
  =========================
  PUERTO
  =========================
*/
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`  POST /auth/check-email - Verificar email`);
  console.log(`  POST /auth/sync-user - Sincronizar usuario con Supabase`);
  console.log(`  POST /auth/send-reset-code - Enviar código de recuperación`);
  console.log(`  POST /auth/verify-reset-code - Verificar código`);
  console.log(`  POST /auth/reset-password-with-code - Resetear contraseña con código`);
  console.log(`  POST /auth/reset-password-with-token - Resetear contraseña con token`);
  console.log(`  POST /login-local - Login tradicional`);
});