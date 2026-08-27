import express from "express";
import cors from "cors";

import db from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.get("/test", (req, res) => {

  const sql = "SELECT * FROM productos";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }

    res.json(result);
  });
});

app.listen(3001, () => {
  console.log("Servidor en puerto 3001");
});