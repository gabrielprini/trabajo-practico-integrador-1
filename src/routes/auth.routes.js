import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// reglas que tiene que cumplir un usuario para registrarse.
const registerValidations = [
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres.")
    .isAlphanumeric()
    .withMessage("El username solo puede contener letras y números."),
  body("email").isEmail().withMessage("Debe proporcionar un email válido."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres."),
];

// Validaciones para el login
const loginValidations = [
  body("email").isEmail().withMessage("Debe proporcionar un email válido."),
  body("password").notEmpty().withMessage("La contraseña es obligatoria."),
];

// Validaciones para actualizar perfil
const updateProfileValidations = [
  body("first_name")
    .optional()
    .isLength({ min: 2, max: 50 }),
  body("last_name")
    .optional()
    .isLength({ min: 2, max: 50 }),
  body("biography").optional().isLength({ max: 500 }),
  body("avatar_url")
    .optional()
    .isURL()
    .withMessage("avatar_url debe ser una URL válida."),
];

// Rutas públicas: No necesitamos estar logueados para acceder a ellas.
router.post("/register", registerValidations, register);
router.post("/login", loginValidations, login);

// Rutas privadas (requieren estar autenticado)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfileValidations, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;
