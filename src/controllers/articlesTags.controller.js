import { validationResult } from 'express-validator';
import { article, tag, articleTag } from '../models/index.js';

export const addTagToArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { article_id, tag_id } = req.body;

    // Verificar que el artículo exista y sea del usuario autenticado
    const foundArticle = await article.findByPk(article_id);
    if (!foundArticle) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado.',
      });
    }

    if (foundArticle.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Solo el autor del artículo puede agregarle etiquetas.',
      });
    }

    // Verificar existencia de la etiqueta antes de asociarla
    const foundTag = await tag.findByPk(tag_id);
    if (!foundTag) {
      return res.status(404).json({
        success: false,
        message: 'Etiqueta no encontrada.',
      });
    }

    // Verificar que no exista ya esa asociación
    const existingRelation = await articleTag.findOne({ where: { article_id, tag_id } });
    if (existingRelation) {
      return res.status(400).json({
        success: false,
        message: 'Esa etiqueta ya está asociada a este artículo.',
      });
    }

    const newRelation = await articleTag.create({ article_id, tag_id });

    return res.status(201).json({
      success: true,
      message: 'Etiqueta agregada al artículo correctamente.',
      data: newRelation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al agregar la etiqueta al artículo.',
      error: error.message,
    });
  }
};

export const removeTagFromArticle = async (req, res) => {
  try {
    const { articleTagId } = req.params;

    const relation = await articleTag.findByPk(articleTagId, {
      include: { association: 'article' },
    });

    if (!relation) {
      return res.status(404).json({
        success: false,
        message: 'Relación artículo-etiqueta no encontrada.',
      });
    }

    if (relation.article.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Solo el autor del artículo puede quitarle etiquetas.',
      });
    }

    await relation.destroy();

    return res.status(200).json({
      success: true,
      message: 'Etiqueta removida del artículo correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al remover la etiqueta del artículo.',
      error: error.message,
    });
  }
};