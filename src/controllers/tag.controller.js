import { validationResult } from "express-validator";
import { tag } from "../models/index.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await tag.findAll();

    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las etiquetas.",
      error: error.message,
    });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundTag = await tag.findByPk(id, {
      include: { association: "articles" },
    });

    if (!foundTag) {
      return res.status(404).json({
        success: false,
        message: "Etiqueta no encontrada.",
      });
    }

    return res.status(200).json({
      success: true,
      data: foundTag,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener la etiqueta.",
      error: error.message,
    });
  }
};

export const createTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name } = req.body;

    // Verificación de unicidad explícita (además del unique: true del modelo)
    const existingTag = await tag.findOne({ where: { name } });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una etiqueta con ese nombre.",
      });
    }

    const newTag = await tag.create({ name });

    return res.status(201).json({
      success: true,
      message: "Etiqueta creada correctamente.",
      data: newTag,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al crear la etiqueta.",
      error: error.message,
    });
  }
};

export const updateTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;

    const foundTag = await tag.findByPk(id);
    if (!foundTag) {
      return res.status(404).json({
        success: false,
        message: "Etiqueta no encontrada.",
      });
    }

    await foundTag.update({ name });

    return res.status(200).json({
      success: true,
      message: "Etiqueta actualizada correctamente.",
      data: foundTag,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la etiqueta.",
      error: error.message,
    });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const foundTag = await tag.findByPk(id);
    if (!foundTag) {
      return res.status(404).json({
        success: false,
        message: "Etiqueta no encontrada.",
      });
    }

    await foundTag.destroy(); // Tag no es paranoid → esto SÍ borra la fila

    return res.status(200).json({
      success: true,
      message: "Etiqueta eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la etiqueta.",
      error: error.message,
    });
  }
};
