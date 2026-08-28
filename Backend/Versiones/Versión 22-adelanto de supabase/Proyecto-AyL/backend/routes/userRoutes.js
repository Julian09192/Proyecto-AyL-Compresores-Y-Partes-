import express from "express";
import { checkEmail, syncUser, signUpUser } from "../controllers/authController.js";
import { getAllUsers, getUserById, updateUser } from "../controllers/userController.js";

const router = express.Router();

// Rutas para autenticación y registro
router.post("/check-email", checkEmail);
router.post("/sync-user", syncUser);
router.post("/register", signUpUser);
router.post("/v1/signup", signUpUser);

// Rutas para gestión de usuarios (Admin dashboard)
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.patch("/:id", updateUser);

export default router;