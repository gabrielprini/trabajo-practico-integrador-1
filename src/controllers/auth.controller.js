import { validationResult } from "express-validator";
import { user, profile } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const register = async (req, res, next) => {
  try {
    // aca lo que hacemos es guardar los errores que encontraron las validaciones.
    const errors = validationResult(req);
    // "¿Está vacía la lista de errores?"
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // desestructuramos
    const { username, email, password, first_name, last_name } = req.body;

    // Acá estamos usando una función de bcrypt para convertir la contraseña en un hash.
    const hashedPassword = await hashPassword(password);

    const newUser = await user.create({
      username,
      email,
      password: hashedPassword,
    });

    await profile.create({
      user_id: newUser.id,
      // Si me mandaron first_name, guardalo. Si no, guardá null."
      first_name: first_name || null,
      last_name: last_name || null,
    });

    // estamos agrupando los datos del usuario que queremos devolver.
    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error al registrar el usuario",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // .scope('withPassword'): Quiero buscar el usuario incluyendo también su contraseña hasheada."
    // y tambien le pedimos que busque un email que sea igual al email que envio el usuario
    const foundUser = await user
      .scope("withPassword")
      .findOne({ where: { email } });

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      });
    }

    // aca lo que hacemos es comparar la conraseña con la contraseña haseada que teniamos en la base de datos
    const isPasswordValid = await comparePassword(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      });
    }

    // Estamos creando una especie de credencial de acceso. 
    // Entonces el servidor dice:Perfecto, ya sé quién sos. Te voy a dar una credencial para que en las próximas peticiones no tengas que volver a mandarme tu contraseña
    const token = generateToken({
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    });

    // Aca estamos diciendo Mandale al navegador una cookie llamada token que contiene nuestro JWT.
    res.cookie("token", token, {
      // Significa que JavaScript del navegador no puede acceder directamente a esa cookie. Osea como un metodo de seguridad para no entrar a los datos del usuario
      // httpOnly ayuda a proteger el token de autenticación, evitando que JavaScript del navegador pueda leer directamente esa cookie.
      httpOnly: true,
      // Si estamos en producción, la cookie solamente se manda mediante HTTPS. 
      // Pensalo como otra protección de la cookie.
      // Tenemos:http y :httpsHTTPS es la versión segura de HTTP.
      // Entonces:secure: truesignifica:"Esta cookie solamente debe viajar por una conexión HTTPS."
      secure: process.env.NODE_ENV === "production",
      // Es otra medida de seguridad relacionada con el envío de cookies entre sitios.
      // strict es una configuración bastante restrictiva.
      // En términos simples:"No mandes esta cookie en determinadas solicitudes que vienen desde otros sitios."Ayuda a proteger contra ataques como CSRF.
      sameSite: "strict",
      // Aca indicamos cuanto tiempo va a durar la cookie, el valor de maxAge se expresa en milisegundos
      maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
    });
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso.",
      // Dentro ponemos información del usuario: no devolvemos la contraseña.
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
      message: "Error al iniciar sesión.",
      error: error.message,
    });
  }
};

// cerrar la sesión del usuario.
export const logout = async (req, res) => {
  try {
    // clearCookie significa: "Eliminá la cookie llamada token del navegador."
    res.clearCookie('token', {
      // La idea es que las opciones de la cookie coincidan con las que usamos cuando la creamos, para que Express pueda identificar correctamente esa cookie. 
      // No necesitamos poner maxAge porque ahora queremos eliminarla inmediatamente, no establecer cuánto tiempo dura.
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión.',
      error: error.message,
    });
  }
};

// obtener los datos del usuario que actualmente está logueado
export const getProfile = async (req, res) => {
  try {
    // findByPk Buscame un usuario por su clave primaria.
    // req.user.id: Buscame en la base de datos al usuario que acaba de demostrar que está autenticado. 
    // Y con el include Además del usuario, traeme también su profile relacionado.
    const foundUser = await user.findByPk(req.user.id, {
      include: { association: 'profile' },
    });

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    return res.status(200).json({
      success: true,
      data: foundUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil.',
      error: error.message,
    });
  }
};

// modificar el perfil del usuario que está logueado.
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { first_name, last_name, biography, avatar_url, birth_date } = req.body;

    const userProfile = await profile.findOne({ where: { user_id: req.user.id } });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado.',
      });
    }

    // Sequelize modifica ese registro en la base de datos.
    await userProfile.update({ first_name, last_name, biography, avatar_url, birth_date });

    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente.',
      data: userProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil.',
      error: error.message,
    });
  }
};
