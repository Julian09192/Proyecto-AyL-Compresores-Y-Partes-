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

/*
  =========================
  PUERTO
  =========================
*/
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});