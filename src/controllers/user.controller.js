import { validationResult } from "express-validator";
import { user, profile, article } from "../models/index.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

export const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password, role, first_name, last_name } = req.body;

    const hashePassword = await hashPassword(password);

    const newUser = await user.create({
      username,
      email,
      password: hashePassword,
      // si no se elije el rol que por determinado se elija user
      role: role || "user",
    });

    await profile.create({
      user_id: newUser.id,
      first_name: first_name || null,
      last_name: last_name || null,
    });

    return res.status(200).json({
      message: "usuario creado correctamente ",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el usuario.",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    // queremos incluir el id de profile y article tambien 
    const foundUser = await user.findByPk(id, {
      include: [{ association: "profile" }, { association: "articles" }],
    });

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      data: foundUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el usuario.",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      include: { association: 'profile' },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios.',
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { username, email, role } = req.body;

    const foundUser = await user.findByPk(id);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    await foundUser.update({ username, email, role });

    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente.',
      data: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario.',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const foundUser = await user.findByPk(id);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    // Como el modelo User tiene paranoid: true, esto NO borra la fila:
    // solo completa la columna deleted_at con la fecha actual.
    await foundUser.destroy();

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario.',
      error: error.message,
    });
  }
};