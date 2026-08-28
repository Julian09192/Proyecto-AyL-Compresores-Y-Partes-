import express from "express";
import { checkEmail, syncUser } from "../controllers/authController.js";

const router = express.Router();

// Rutas secundarias para autenticación
router.post("/check-email", checkEmail);
router.post("/sync-user", syncUser);

export default router;