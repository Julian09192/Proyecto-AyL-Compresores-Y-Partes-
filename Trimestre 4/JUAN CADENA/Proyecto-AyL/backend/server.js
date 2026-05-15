import express from "express";
import cors from "cors";
import db from "./config/db.js";

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
app.post("/productos", (req, res) => {

  const {
    tipo,
    nombre,
    caracteristicas,
    precio,
    marca,
    categoria_vehiculo,
    codigo_interno,
    stock,
    id_bodega,
    ultimo_usuario_id,
    imagen_url,
    imagen_public_id
  } = req.body;

  const sql = `
    INSERT INTO productos (
      tipo,
      nombre,
      marca,
      caracteristicas,
      stock,
      precio,
      codigo_interno,
      categoria_vehiculo,
      imagen_url,
      imagen_public_id,
      suspendido,
      id_bodega,
      ultimo_usuario_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      0,
      Number(id_bodega) || 1,
      Number(ultimo_usuario_id) || 1
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          error: err.message
        });

      }

      res.json({
        message: "Producto creado correctamente"
      });

    }
  );

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



/* 
  ===========================================================
  CONSULTAS TRANSFORMADAS A GET (Path & Query Params)
  ===========================================================
*/

/**
 * 1. OBTENER STOCK ESPECÍFICO (Path: ID)
 * Se usa Path porque solo necesitamos el identificador del producto.
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
 * Consulta simple por ID.
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
 * 3. BUSCAR CLIENTES POR CRITERIOS (Query: Datos extensos)
 * Se usa Query Params porque la consulta puede ser más compleja 
 * (ej: /clientes/buscar?telefono=123&direccion=calle)
 */
app.get("/clientes/buscar", (req, res) => {
  const { telefono, direccion } = req.query;
  
  // Construcción dinámica simple
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
 * 5. CONSULTAR PRODUCTOS POR BODEGA (Query: Filtros múltiples)
 * Ideal para cuando necesitas filtrar productos que pertenecen a una bodega 
 * específica pero quieres añadir más datos en la consulta.
 * Ejemplo: /productos/ubicacion?id_bodega=2&marca=Toyota
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
  PUERTO
  =========================
*/
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});