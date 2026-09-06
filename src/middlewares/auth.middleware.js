import { verifyToken } from "../helpers/jwt.helper.js";
// Lo necesitamos porque después vamos a buscar en la base de datos el usuario que corresponde al token.
import user from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Acá buscamos el JWT dentro de las cookies, el ?. significa: Si req.cookies existe, buscá token; si no existe, no tires un error.
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message:
          "No autenticado. Debe iniciar sesión para acceder a este recurso.",
      });
    }

    // Si el token es válido, decoded contiene los datos que habíamos puesto en el payload.
    const decoded = verifyToken(token);

    // Buscamos en MySQL al usuario cuyo ID está dentro del token.
    const foundUser = await user.findByPk(decoded);
    if (!foundUser) {
      return res.status(401).json({
        message: "El usuario asociado al token ya no existe.",
      });
    }

    // Estamos agregando información a la petición:
    req.user = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
    };

    // Todo está bien, dejá pasar la petición al siguiente paso.
    next();
  } catch (error) {
    return res.satus(401).json({
      message: "token invalido o expirado",
    });
  }
};
