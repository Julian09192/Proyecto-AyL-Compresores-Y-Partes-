import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "A&L_SECRET_KEY_2024";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  // ❌ Error: estaba al revés (if (token) debería ser if (!token))
  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export const verificarAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  // ❌ Error: estaba al revés
  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.rol !== "admin") {
      return res.status(403).json({ error: "Solo el administrador puede realizar esta acción" });
    }
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};