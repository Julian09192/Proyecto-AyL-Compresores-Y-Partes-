import express from "express";
import cors from "cors";
import db from "./config/db.js";
import jwt from "jsonwebtoken"; // <--- AGREGADO

const app = express();
const JWT_SECRET = "A&L_SECRET_KEY_2024"; // <--- AGREGADO

const verificarAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.rol !== "admin") {
      return res.status(403).json({ error: "Solo el administrador puede realizar esta accion" });
    }
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido" });
  }
};

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
  USUARIOS
  =========================
*/
app.get("/usuarios", (req, res) => {

  const sql = `
    SELECT 
      id_usuario,
      num_identificacion,
      correo,
      num_celular,
      usuario,
      rol,
      suspendido,
      creado_en,
      actualizado_en
    FROM usuario
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        error: err.message
      });

    }

    res.json(result);

  });

});

app.post("/usuarios", (req, res) => {
  const { usuario, correo, password_hash, rol } = req.body;
  const sql = "INSERT INTO usuario (usuario, correo, password_hash, rol) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [usuario, correo, password_hash, rol || 'cliente'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario creado con éxito", id: result.insertId });
  });
});



app.get('/movimientos-stock', (req, res) => {
  const query = "SELECT * FROM stock_movimiento ORDER BY creado_en DESC";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error en MySQL:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.put("/usuarios/:id", verificarAdmin, (req, res) => {
  const { id } = req.params;
  const {
    usuario,
    correo,
    num_celular,
    num_identificacion,
    rol,
    password_hash,
    suspendido,
  } = req.body;

  const campos = [];
  const valores = [];

  if (usuario !== undefined) {
    campos.push("usuario = ?");
    valores.push(usuario);
  }
  if (correo !== undefined) {
    campos.push("correo = ?");
    valores.push(correo);
  }
  if (num_celular !== undefined) {
    campos.push("num_celular = ?");
    valores.push(num_celular || null);
  }
  if (num_identificacion !== undefined) {
    campos.push("num_identificacion = ?");
    valores.push(num_identificacion || null);
  }
  if (rol !== undefined) {
    campos.push("rol = ?");
    valores.push(rol);
  }
  if (password_hash) {
    campos.push("password_hash = ?");
    valores.push(password_hash);
  }
  if (suspendido !== undefined) {
    if (String(req.usuario.id) === String(id) && Number(suspendido) === 1) {
      return res.status(400).json({ error: "No puedes deshabilitar tu propio usuario" });
    }
    campos.push("suspendido = ?");
    valores.push(suspendido ? 1 : 0);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
  }

  valores.push(id);

  const sql = `
    UPDATE usuario
    SET ${campos.join(", ")}, actualizado_en = NOW()
    WHERE id_usuario = ?
  `;

  db.query(sql, valores, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      `SELECT id_usuario, num_identificacion, correo, num_celular, usuario, rol, suspendido, creado_en, actualizado_en
       FROM usuario
       WHERE id_usuario = ?`,
      [id],
      (selectErr, result) => {
        if (selectErr) return res.status(500).json({ error: selectErr.message });
        res.json(result[0]);
      }
    );
  });
});

app.delete("/usuarios/:id", verificarAdmin, (req, res) => {
  const { id } = req.params;

  if (String(req.usuario.id) === String(id)) {
    return res.status(400).json({ error: "No puedes deshabilitar tu propio usuario" });
  }

  const sql = "UPDATE usuario SET suspendido = 1, actualizado_en = NOW() WHERE id_usuario = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario deshabilitado correctamente" });
  });
});

app.put("/movimientos-stock/:id", (req, res) => {
  const { id } = req.params;
  const { tipo_movimiento, cantidad, nota, referencia } = req.body;

  const sql = `
    UPDATE stock_movimiento
    SET tipo_movimiento = ?, cantidad = ?, nota = ?, referencia = ?
    WHERE id_movimiento = ?
  `;

  db.query(sql, [tipo_movimiento, cantidad, nota, referencia, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Movimiento actualizado correctamente" });
  });
});

app.delete("/movimientos-stock/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM stock_movimiento WHERE id_movimiento = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Movimiento eliminado correctamente" });
  });
});


/*
  =========================
  OBTENER PRODUCTOS
  =========================
*/
app.get("/productos", (req, res) => {

  const sql = `
    SELECT * FROM productos
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        error: err.message
      });

    }

    res.json(result);

  });

});

/*
  =========================
  CREAR PRODUCTO
  =========================
*/
app.post('/productos', (req, res) => {
  const p = req.body;
  
  const queryProducto = `
    INSERT INTO productos (tipo, nombre, caracteristicas, precio, marca, categoria_vehiculo, codigo_interno, stock, imagen_url, imagen_public_id, id_bodega) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const valuesProducto = [p.tipo, p.nombre, p.caracteristicas, p.precio, p.marca, p.categoria_vehiculo, p.codigo_interno, p.stock, p.imagen_url, p.imagen_public_id, p.id_bodega];

  db.query(queryProducto, valuesProducto, (err, result) => {
    if (err) return res.status(500).json(err);

    const nuevoIdProducto = result.insertId;

    const queryMovimiento = `
      INSERT INTO stock_movimiento (id_producto, tipo_movimiento, cantidad, nota, referencia) 
      VALUES (?, 'entrada', ?, 'Carga inicial desde inventario', 'SISTEMA')`;

    db.query(queryMovimiento, [nuevoIdProducto, p.stock], (errMov) => {
      if (errMov) {
        console.error("Error al crear movimiento:", errMov);
      }
      res.json({ message: "Producto y movimiento creados", id: nuevoIdProducto });
    });
  });
});
/*
  =========================
  ACTUALIZAR PRODUCTO
  =========================
*/
app.put("/productos/:id", (req, res) => {

  const { id } = req.params;

  const {
    tipo,
    nombre,
    caracteristicas,
    precio,
    marca,
    categoria_vehiculo,
    codigo_interno,
    stock,
    imagen_url,
    imagen_public_id,
    suspendido
  } = req.body;

  
  /*
    ACTUALIZAR SOLO ESTADO
  */
  if (suspendido !== undefined) {

    const sqlEstado = `
      UPDATE productos
      SET suspendido = ?
      WHERE id = ?
    `;

    db.query(sqlEstado, [suspendido, id], (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          error: err.message
        });

      }

      return res.json({
        message: "Estado actualizado"
      });

    });

    return;
  }

  /*
    ACTUALIZAR PRODUCTO COMPLETO
  */
  const sql = `
    UPDATE productos
    SET
      tipo = ?,
      nombre = ?,
      marca = ?,
      caracteristicas = ?,
      stock = ?,
      precio = ?,
      codigo_interno = ?,
      categoria_vehiculo = ?,
      imagen_url = ?,
      imagen_public_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      tipo || null,
      nombre || null,
      marca || null,
      caracteristicas || null,
      Number(stock) || 0,
      Number(precio) || 0,
      codigo_interno || null,
      categoria_vehiculo || null,
      imagen_url || null,
      imagen_public_id || null,
      id
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          error: err.message
        });

      }

      res.json({
        message: "Producto actualizado correctamente"
      });

    }
  );

});

/*
  =========================
  ELIMINAR PRODUCTO
  =========================
*/
app.delete("/productos/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    DELETE FROM productos
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        error: err.message
      });

    }

    res.json({
      message: "Producto eliminado correctamente"
    });

  });

});


/* 1. Obtener stock por Bodega (Agrupado) */
app.get("/queries/stock-bodegas", (req, res) => {
  const sql = `
    SELECT b.nombre AS bodega, p.nombre AS producto, p.stock, p.marca 
    FROM productos p 
    JOIN bodega b ON p.id_bodega = b.id_bodega 
    WHERE p.suspendido = FALSE
    ORDER BY b.nombre, p.nombre;
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

/* 2. Ver historial de movimientos de un producto específico */
app.get("/queries/movimientos/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  const sql = `
    SELECT m.id_movimiento, m.cantidad, m.tipo_movimiento, m.creado_en, m.nota, u.usuario 
    FROM stock_movimiento m 
    LEFT JOIN usuario u ON m.id_usuario = u.id_usuario 
    WHERE m.id_producto = ? 
    ORDER BY m.creado_en DESC;
  `;
  db.query(sql, [id_producto], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

/* 3. Buscar productos con stock crítico (Menos de 10 unidades) */
app.get("/queries/stock-critico", (req, res) => {
  // Ajustado: suspendido es BOOLEAN (0 o 1)
  const sql = "SELECT id, nombre, stock, marca FROM productos WHERE stock < 10 AND suspendido = FALSE";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

/* 4. Listar auditoría de cambios reciente */
app.get("/queries/auditoria", (req, res) => {
  const sql = "SELECT * FROM auditoria_cambios ORDER BY fecha_cambio DESC LIMIT 50";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

/* 5. Obtener resumen de pedidos de un cliente por su ID de usuario */
app.get("/queries/pedidos-cliente/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;
  const sql = `
    SELECT o.numero_orden, o.fecha, o.total, o.estado 
    FROM orden o 
    WHERE o.id_usuario = ? 
    ORDER BY o.fecha DESC;
  `;
  db.query(sql, [id_usuario], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/movimientos-stock", (req, res) => {
  const { id_producto, cantidad, tipo_movimiento, id_usuario, nota } = req.body;

  const sql = `
    INSERT INTO stock_movimiento (id_producto, cantidad, tipo_movimiento, id_usuario, nota, creado_en)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [id_producto, cantidad, tipo_movimiento, id_usuario, nota], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Movimiento registrado en el historial" });
  });
});

/* ===========================================================
  CONSULTAS TRANSFORMADAS A GET (Path & Query Params)
  ===========================================================
*/

/**
 * 1. OBTENER STOCK ESPECÍFICO (Path: ID)
 */
app.get("/productos/:id/stock", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT nombre, stock, marca FROM productos WHERE id = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(result[0]);
  });
});

/**
 * 2. CONSULTAR ROL DE USUARIO (Path: ID)
 */
app.get("/usuarios/:id/rol", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT usuario, rol FROM usuario WHERE id_usuario = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || { message: "Usuario no encontrado" });
  });
});

/**
 * 3. BUSCAR CLIENTES POR CRITERIOS (Query)
 */
app.get("/clientes/buscar", (req, res) => {
  const { telefono, direccion } = req.query;
  
  let sql = "SELECT * FROM cliente WHERE 1=1";
  const params = [];

  if (telefono) {
    sql += " AND telefono = ?";
    params.push(telefono);
  }
  if (direccion) {
    sql += " AND direccion LIKE ?";
    params.push(`%${direccion}%`);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

/**
 * 4. CONSULTAR ESTADO DE ORDEN (Path: ID)
 */
app.get("/ordenes/:id/estado", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT numero_orden, estado, fecha FROM orden WHERE id_orden = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || { message: "Orden no encontrada" });
  });
});

/**
 * 5. CONSULTAR PRODUCTOS POR BODEGA (Query)
 */
app.get("/productos/filtro-ubicacion", (req, res) => {
  const { id_bodega, marca, tipo } = req.query;
  
  let sql = "SELECT * FROM productos WHERE 1=1";
  const params = [];

  if (id_bodega) {
    sql += " AND id_bodega = ?";
    params.push(id_bodega);
  }
  if (marca) {
    sql += " AND marca = ?";
    params.push(marca);
  }
  if (tipo) {
    sql += " AND tipo = ?";
    params.push(tipo);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

/*
  =========================
  RUTA DE LOGIN (NUEVA AGREGADA)
  =========================
*/
app.post("/login-local", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuario WHERE correo = ?";
  
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (result.length > 0) {
      const usuario = result[0];

      if (Number(usuario.suspendido) === 1) {
        return res.status(403).json({ success: false, message: "Usuario deshabilitado" });
      }

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
  PUERTO
  =========================
*/
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
