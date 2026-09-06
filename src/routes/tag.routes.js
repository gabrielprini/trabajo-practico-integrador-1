import { Router } from 'express';
import { body, param } from 'express-validator';
import { getAllTags, getTagById, createTag, updateTag, deleteTag } from '../controllers/tags.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

const idValidation = [param('id').isInt().withMessage('El id debe ser un número entero.')];

const tagValidations = [
  body('name')
    .isLength({ min: 2, max: 30 })
    .withMessage('El nombre debe tener entre 2 y 30 caracteres.')
];

// Todas las rutas de tags requieren estar autenticado
router.use(authMiddleware);

router.get('/', getAllTags); // cualquier usuario autenticado
router.get('/:id', adminMiddleware, idValidation, getTagById); // solo admin
router.post('/', adminMiddleware, tagValidations, createTag); // solo admin
router.put('/:id', adminMiddleware, idValidation, tagValidations, updateTag); // solo admin
router.delete('/:id', adminMiddleware, idValidation, deleteTag); // solo admin

export default router;