import { Router } from "express";
import { body, param } from "express-validator";
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

const idValidation = [
  param('id').isInt().withMessage('El id debe ser un número entero.'),
];

const createUserValidations = [
  body('username').isLength({ min: 3, max: 20 }).isAlphanumeric(),
  body('email').isEmail(),
  body('password')
    .isLength({ min: 8 }),
  body('role').optional().isIn(['user', 'admin']),
];

const updateUserValidations = [
  body('username').optional().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['user', 'admin']),
];

router.use(authMiddleware, adminMiddleware);

router.get('/', getAllUsers);
router.get('/:id', idValidation, getUserById);
router.post('/', createUserValidations, createUser);
router.put('/:id', idValidation, updateUserValidations, updateUser);
router.delete('/:id', idValidation, deleteUser);

export default router;
