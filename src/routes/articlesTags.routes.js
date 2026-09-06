import { Router } from 'express';
import { body, param } from 'express-validator';
import { addTagToArticle, removeTagFromArticle } from '../controllers/articlesTags.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

const addTagValidations = [
  body('article_id').isInt().withMessage('article_id debe ser un número entero.'),
  body('tag_id').isInt().withMessage('tag_id debe ser un número entero.'),
];

const removeTagValidation = [
  param('articleTagId').isInt().withMessage('El id debe ser un número entero.'),
];

router.use(authMiddleware);

router.post('/', addTagValidations, addTagToArticle);
router.delete('/:articleTagId', removeTagValidation, removeTagFromArticle);

export default router;