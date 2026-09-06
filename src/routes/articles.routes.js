import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAllArticles,
  getArticleById,
  getUserArticles,
  getUserArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articles.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ownerMiddleware } from '../middlewares/owner.middleware.js';

const router = Router();

const idValidation = [param('id').isInt().withMessage('El id debe ser un número entero.')];

const articleValidations = [
  body('title')
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres.'),
  body('content')
    .isLength({ min: 50 })
    .withMessage('El contenido debe tener al menos 50 caracteres.'),
  body('excerpt').optional().isLength({ max: 500 }),
  body('status').optional().isIn(['published', 'archived']),
];

// Todas las rutas de articles requieren estar autenticado
router.use(authMiddleware);

router.get('/', getAllArticles);
router.get('/user', getUserArticles);
router.get('/user/:id', idValidation, getUserArticleById);
router.get('/:id', idValidation, getArticleById);
router.post('/', articleValidations, createArticle);
router.put('/:id', idValidation, articleValidations, ownerMiddleware, updateArticle);
router.delete('/:id', idValidation, ownerMiddleware, deleteArticle);

export default router;